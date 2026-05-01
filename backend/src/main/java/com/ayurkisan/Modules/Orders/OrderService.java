package com.ayurkisan.Modules.Orders;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.Modules.Cart.Cart;
import com.ayurkisan.Modules.Cart.CartService;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Product;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.repository.CustomerRepository;
import com.ayurkisan.repository.RetailerRepository;
import com.ayurkisan.service.ProductService;
import com.ayurkisan.Modules.Packages.ProductPackageService;
import com.ayurkisan.Modules.Shipment.ShipmentService;
import com.ayurkisan.util.FinanceCalculator;
import org.springframework.context.annotation.Lazy;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductPackageService packageService;

    @Autowired
    private com.ayurkisan.service.OfferService offerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    @Lazy
    private ShipmentService shipmentService;

    @Transactional
    public Order placeOrder(String userId, String role, String paymentMethod, String customName, String customPhone, String customAddressLine1, String customTaluka, String customDistrict, String customState, String promoCode) {

        // 1. Fetch Cart
        Cart cart = cartService.getCart(userId, role);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot place order: Cart is empty");
        }

        // 2. Auto-fetch User Details based on role
        Order order = new Order();
        String userName = "";
        String email = "";
        String phone = "";

        if ("Customer".equalsIgnoreCase(role)) {
            Customer customer = customerRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
            userName = (customName != null && !customName.isBlank()) ? customName : customer.getName();
            email = customer.getEmail();
            phone = (customPhone != null && !customPhone.isBlank()) ? customPhone : customer.getPhoneNumber();
            
            String line1 = (customAddressLine1 != null && !customAddressLine1.isBlank()) ? customAddressLine1 : customer.getAddressLine1();
            String tlk = (customTaluka != null && !customTaluka.isBlank()) ? customTaluka : customer.getTaluka();
            String dst = (customDistrict != null && !customDistrict.isBlank()) ? customDistrict : customer.getDistrict();
            String st = (customState != null && !customState.isBlank()) ? customState : customer.getState();

            order.setShippingAddressLine1(line1);
            order.setShippingTaluka(tlk);
            order.setShippingDistrict(dst);
            order.setShippingState(st);
            order.setShippingAddress(String.format("%s, %s, %s, %s", line1, tlk, dst, st));
        } else if ("Retailer".equalsIgnoreCase(role)) {
            Retailer retailer = retailerRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Retailer not found"));
            userName = (customName != null && !customName.isBlank()) ? customName : retailer.getRetailerName();
            email = retailer.getEmail();
            phone = (customPhone != null && !customPhone.isBlank()) ? customPhone : retailer.getPhoneNumber();

            String line1 = (customAddressLine1 != null && !customAddressLine1.isBlank()) ? customAddressLine1 : retailer.getAddressLine1();
            String tlk = (customTaluka != null && !customTaluka.isBlank()) ? customTaluka : retailer.getTaluka();
            String dst = (customDistrict != null && !customDistrict.isBlank()) ? customDistrict : retailer.getDistrict();
            String st = (customState != null && !customState.isBlank()) ? customState : retailer.getState();

            order.setShippingAddressLine1(line1);
            order.setShippingTaluka(tlk);
            order.setShippingDistrict(dst);
            order.setShippingState(st);
            order.setShippingAddress(String.format("%s, %s, %s, %s", line1, tlk, dst, st));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + role);
        }

        // 3. Setup Order Object
        order.setUserId(userId);
        order.setRole(role);
        order.setUserName(userName);
        order.setContactEmail(email);
        order.setContactPhone(phone);
        // address is already set inside the role check above

        double deliveryFee = FinanceCalculator.FLAT_DELIVERY_CHARGE;
        double subtotal = cart.getTotalDiscountedPrice();
        double promoDiscount = 0.0;

        if (promoCode != null && !promoCode.isBlank()) {
            try {
                com.ayurkisan.model.Offer offer = offerService.validateOffer(promoCode, subtotal);
                if (offer.getDiscountType().equals("PERCENTAGE")) {
                    promoDiscount = subtotal * (offer.getDiscountValue() / 100.0);
                } else {
                    promoDiscount = offer.getDiscountValue();
                }
                order.setPromoCode(promoCode);
                order.setPromoDiscount(FinanceCalculator.round(promoDiscount));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            }
        }

        // Apply industry-standard calculation logic
        FinanceCalculator.FinanceSummary summary = FinanceCalculator.calculateFullOrder(subtotal, promoDiscount, deliveryFee);
        
        order.setPromoCode(promoCode);
        order.setPromoDiscount(summary.promoDiscount);
        order.setDeliveryCharge(summary.deliveryCharge);
        order.setBaseSubtotal(summary.baseSubtotal);
        // Reinforced calculation safety
        if (summary.gstAmount <= 0 && subtotal > 0) {
            summary.gstAmount = FinanceCalculator.round(subtotal * 0.18);
            summary.totalPayable = FinanceCalculator.round(subtotal + summary.gstAmount + summary.deliveryCharge);
        }
        
        order.setGstAmount(summary.gstAmount);
        
        // Industry Standard: Taxable is (Subtotal - Promo). Total is (Taxable + GST + Delivery).
        order.setTotalDiscountedPrice(summary.totalPayable);
        
        // Original price is mostly for comparison "You Saved"
        double originalGst = FinanceCalculator.calculateGst(cart.getTotalOriginalPrice());
        order.setTotalOriginalPrice(FinanceCalculator.round(cart.getTotalOriginalPrice() + deliveryFee + originalGst));

        order.setPaymentMethod(paymentMethod);
        if ("COD".equalsIgnoreCase(paymentMethod)) {
            order.setPaymentStatus("PENDING");
        } else {
            order.setPaymentStatus("PENDING"); // Online logic to be handled via gateway later
        }

        order.setOrderStatus("PLACED");

        // Convert CartItems to OrderItems
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem oi = new OrderItem();
            oi.setProductId(cartItem.getProductId());
            oi.setProductName(cartItem.getProductName());
            oi.setProductImage(cartItem.getProductImage());
            oi.setItemType(cartItem.getItemType());
            oi.setQuantity(cartItem.getQuantity());
            oi.setPrice(cartItem.getPrice());
            oi.setDiscountedPrice(cartItem.getDiscountedPrice());
            oi.setTotalItemPrice(cartItem.getTotalItemPrice());
            oi.setWeight(cartItem.getWeight());
            return oi;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // 4. Reduce Stock Atomically (Throws exception if stock unavailable)
        for (OrderItem item : orderItems) {
            if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PRODUCT")) {
                Product product = productService.getProductById(item.getProductId());
                boolean success = productService.reduceStockAtomically(product.getId(), item.getQuantity());
                if (!success) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + item.getProductName());
                }
            } else if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PACKAGE")) {
                packageService.reduceStockAtomically(item.getProductId(), item.getQuantity());
            }
        }

        // 5. Save Order
        Order savedOrder = orderRepository.save(order);

        // 6. Create Shipment Record immediately for the Admin Dashboard
        shipmentService.createShipment(savedOrder);

        // 7. Clear Cart
        cartService.clearCart(userId);

        // 8. Send Email asynchronously
        emailService.sendOrderConfirmation(email, savedOrder);

        return savedOrder;
    }

    public List<Order> getUserOrders(String userId) {
        List<Order> orders = orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        orders.forEach(order -> {
            if (order.getContactEmail() == null || order.getContactEmail().isEmpty()) {
                resolveContactEmail(order);
            }
        });
        return orders;
    }

    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        orders.forEach(order -> {
            if (order.getContactEmail() == null || order.getContactEmail().isEmpty()) {
                resolveContactEmail(order);
            }
        });
        return orders;
    }

    public Order getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        
        if (order.getContactEmail() == null || order.getContactEmail().isEmpty()) {
            resolveContactEmail(order);
        }
        
        return order;
    }

    @Transactional
    public Order cancelOrder(String orderId, String userId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getUserId().equals(userId) && !"Admin".equalsIgnoreCase(userId)) { // Simple auth check
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to cancel this order");
        }

        String status = order.getOrderStatus();
        if ("SHIPPED".equalsIgnoreCase(status) || "OUT_FOR_DELIVERY".equalsIgnoreCase(status) || 
            "DELIVERED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be cancelled in status: " + status);
        }

        // Add back physical stock
        for (OrderItem item : order.getItems()) {
            if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PRODUCT")) {
                productService.increaseStock(item.getProductId(), item.getQuantity());
            } else if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PACKAGE")) {
                packageService.increaseStock(item.getProductId(), item.getQuantity());
            }
        }

        order.setOrderStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);

        emailService.sendOrderCancellation(order.getContactEmail(), savedOrder, reason);

        return savedOrder;
    }

    public Order updateOrderStatus(String orderId, String newStatus, String reason) {
        if (newStatus == null) return null;
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        boolean orderStatusChanged = !newStatus.equalsIgnoreCase(order.getOrderStatus());
        
        if (orderStatusChanged) {
            order.setOrderStatus(newStatus);
        }

        // Synchronize the status with ShipmentService for all relevant logistics statuses
        try {
            // Determine comments/remarks based on status
            String remarks = (reason != null && !reason.isEmpty()) ? reason : "Order status updated to " + newStatus;
            if ("CONFIRMED".equalsIgnoreCase(newStatus) && (reason == null || reason.isEmpty())) {
                remarks = "Order has been confirmed by admin.";
            }
            shipmentService.updateShipmentStatus(orderId, newStatus, remarks);
        } catch (Exception e) {
            // If it fails, or it's just PLACED (where shipment might not need manual update yet)
            System.err.println("Note: Shipment sync skipped or already handled: " + e.getMessage());
        }

        if (!orderStatusChanged) {
            return order; // If status didn't change, we just did the sync and can return
        }
        
        // Ensure contactEmail is populated (fallback for older orders)
        if (order.getContactEmail() == null || order.getContactEmail().isEmpty()) {
            resolveContactEmail(order);
        }
        
        if ("CONFIRMED".equalsIgnoreCase(newStatus)) {
            emailService.sendOrderConfirmation(order.getContactEmail(), order);
        } else if ("SHIPPED".equalsIgnoreCase(newStatus)) {
            order.setShippedAt(java.time.LocalDateTime.now());
        } else if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            order.setDeliveredAt(java.time.LocalDateTime.now());
            order.setReturnDeadline(java.time.LocalDateTime.now().plusDays(5));
            order.setPaymentStatus("COMPLETED");
            emailService.sendOrderDelivered(order.getContactEmail(), order);
        } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
            emailService.sendOrderCancellation(order.getContactEmail(), order, reason);
        } else if ("RETURNED".equalsIgnoreCase(newStatus)) {
            // Add back physical stock when return is complete
            for (OrderItem item : order.getItems()) {
                if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PRODUCT")) {
                    productService.increaseStock(item.getProductId(), item.getQuantity());
                } else if (item.getItemType() != null && item.getItemType().equalsIgnoreCase("PACKAGE")) {
                    packageService.increaseStock(item.getProductId(), item.getQuantity());
                }
            }
        }

        return orderRepository.save(order);
    }

    private void resolveContactEmail(Order order) {
        try {
            if ("Customer".equalsIgnoreCase(order.getRole())) {
                customerRepository.findById(order.getUserId()).ifPresent(c -> order.setContactEmail(c.getEmail()));
            } else if ("Retailer".equalsIgnoreCase(order.getRole())) {
                retailerRepository.findById(order.getUserId()).ifPresent(r -> order.setContactEmail(r.getEmail()));
            }
        } catch (Exception e) {
            System.err.println("Failed to resolve contact email for order " + order.getId() + ": " + e.getMessage());
        }
    }
}
