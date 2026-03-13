package com.ayurkisan.Modules.Returns;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.Modules.Orders.Order;
import com.ayurkisan.Modules.Orders.OrderService;
import com.ayurkisan.Modules.Orders.EmailService;

@Service
public class ReturnService {

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    @Lazy
    private OrderService orderService;

    @Autowired
    private EmailService emailService;

    // Customer or Retailer initiates a return request
    public ReturnRequest initiateReturn(String orderId, String userId, String reason, String comments) {
        
        // 1. Check if order exists and belongs to user
        List<Order> userOrders = orderService.getUserOrders(userId);
        Order order = userOrders.stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found or does not belong to you"));

        // 2. Validate Order is DELIVERED
        if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only delivered orders can be returned");
        }

        // 3. Validate 5-day window
        if (order.getReturnDeadline() == null || LocalDateTime.now().isAfter(order.getReturnDeadline())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 5-day return window for this order has expired");
        }

        // 4. Check if a return already exists
        Optional<ReturnRequest> existingReturn = returnRepository.findByOrderId(orderId);
        if (existingReturn.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A return request for this order already exists");
        }

        // 5. Create Return Request
        ReturnRequest rt = new ReturnRequest();
        rt.setOrderId(order.getId());
        rt.setUserId(order.getUserId());
        rt.setRole(order.getRole());
        rt.setReason(reason);
        rt.setComments(comments);
        rt.setStatus("PENDING");
        
        rt.getTrackingHistory().add(new ReturnUpdate("PENDING", "Return request initiated by user. Waiting for admin approval."));

        ReturnRequest saved = returnRepository.save(rt);

        // Notify user
        emailService.sendReturnRequested(order.getContactEmail(), order);

        // Update overall order status to RETURN_REQUESTED (Optional, but good for tracking)
        try {
            orderService.updateOrderStatus(orderId, "RETURN_REQUESTED");
        } catch(Exception e) {
            // Log but don't fail return process
        }

        return saved;
    }

    public List<ReturnRequest> getAllReturns() {
        List<ReturnRequest> returns = returnRepository.findAll();
        returns.forEach(this::populateCustomerName);
        return returns;
    }

    public List<ReturnRequest> getUserReturns(String userId) {
        List<ReturnRequest> returns = returnRepository.findByUserId(userId);
        returns.forEach(this::populateCustomerName);
        return returns;
    }
    
    public ReturnRequest getReturnByOrderId(String orderId) {
        ReturnRequest rt = returnRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Return request not found for order: " + orderId));
        populateCustomerName(rt);
        return rt;
    }

    private void populateCustomerName(ReturnRequest rt) {
        try {
            Order order = orderService.getOrderById(rt.getOrderId());
            rt.setCustomerName(order.getUserName());
        } catch (Exception e) {
            rt.setCustomerName("Unknown");
        }
    }

    // Admin updates the return status
    public ReturnRequest updateReturnStatus(String orderId, String newStatus, String remarks) {
        ReturnRequest rt = returnRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Return request not found for order: " + orderId));
        
        rt.setStatus(newStatus);
        
        if (remarks == null || remarks.isEmpty()) {
            remarks = "Return status updated to " + newStatus;
        }
        rt.getTrackingHistory().add(new ReturnUpdate(newStatus, remarks));

        ReturnRequest saved = returnRepository.save(rt);

        try {
            Order order = orderService.getOrderById(orderId);
            
            if ("ACCEPTED".equalsIgnoreCase(newStatus)) {
                emailService.sendReturnAccepted(order.getContactEmail(), order);
                orderService.updateOrderStatus(orderId, "RETURN_ACCEPTED");
            } else if ("REJECTED".equalsIgnoreCase(newStatus)) {
                emailService.sendReturnRejected(order.getContactEmail(), order);
                orderService.updateOrderStatus(orderId, "DELIVERED"); // Revert main status if rejected
            } else if ("PICKED_UP".equalsIgnoreCase(newStatus)) {
                orderService.updateOrderStatus(orderId, "RETURN_PICKUP");
            } else if ("REFUNDED".equalsIgnoreCase(newStatus)) {
                emailService.sendReturnRefunded(order.getContactEmail(), order);
                orderService.updateOrderStatus(orderId, "RETURNED"); // This handles stock restitution
            }

        } catch (Exception e) {
            System.err.println("Failed to sync order status or send email on return update: " + e.getMessage());
        }

        return saved;
    }
}
