package com.ayurkisan.Modules.Shipment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.Modules.Orders.Order;
import com.ayurkisan.Modules.Orders.OrderService;

import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    @Lazy // Prevent circular dependency with OrderService
    private OrderService orderService;

    public Shipment createShipment(Order order) {
        // Prevent duplicate creation
        Optional<Shipment> existing = shipmentRepository.findByOrderId(order.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        Shipment shipment = new Shipment();
        shipment.setOrderId(order.getId());
        shipment.setUserId(order.getUserId());
        shipment.setRole(order.getRole());
        shipment.setShippingAddress(order.getShippingAddress());
        shipment.setContactPhone(order.getContactPhone());
        // Statuses: PLACED, CONFIRMED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
        shipment.setStatus(order.getOrderStatus() != null ? order.getOrderStatus() : "PLACED");
        shipment.setCustomerName(order.getUserName());

        // Add initial tracking history event
        String initialLabel = order.getOrderStatus() != null ? order.getOrderStatus() : "PLACED";
        shipment.getTrackingHistory().add(new ShipmentUpdate(initialLabel, "Order record created for logistics tracking."));

        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        // First, ensure all orders have a shipment record (Sync logic)
        List<Order> allOrders = orderService.getAllOrders();
        for (Order order : allOrders) {
            createShipment(order);
        }

        List<Shipment> shipments = shipmentRepository.findAll();
        for (Shipment shipment : shipments) {
            // Fix persisted name if missing/Unknown
            if (shipment.getCustomerName() == null || "Unknown".equals(shipment.getCustomerName())) {
                try {
                    Order order = orderService.getOrderById(shipment.getOrderId());
                    shipment.setCustomerName(order.getUserName());
                    shipmentRepository.save(shipment); // Persist it now that @Transient is gone
                } catch (Exception e) {
                    shipment.setCustomerName("Unknown");
                }
            }
        }
        return shipments;
    }

    public Shipment getShipmentByOrderId(String orderId) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found for order ID: " + orderId));
        populateCustomerName(shipment);
        return shipment;
    }

    private void populateCustomerName(Shipment shipment) {
        // This is now redundant but kept for safety in single-fetch APIs if needed
        if (shipment.getCustomerName() == null || "Unknown".equals(shipment.getCustomerName())) {
            try {
                Order order = orderService.getOrderById(shipment.getOrderId());
                shipment.setCustomerName(order.getUserName());
            } catch (Exception e) {
                shipment.setCustomerName("Unknown");
            }
        }
    }

    public Shipment updateShipmentStatus(String orderId, String newStatus, String remarks) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found for order ID: " + orderId));

        shipment.setStatus(newStatus);
        
        if (remarks == null || remarks.isEmpty()) {
            remarks = "Shipment status updated to " + newStatus;
        }
        shipment.getTrackingHistory().add(new ShipmentUpdate(newStatus, remarks));

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Synchronize the status back to the Order module which handles emails and dates
        try {
            orderService.updateOrderStatus(orderId, newStatus);
        } catch (Exception e) {
            System.err.println("Note: Order might already have the status or sync failed: " + e.getMessage());
        }

        return savedShipment;
    }
}
