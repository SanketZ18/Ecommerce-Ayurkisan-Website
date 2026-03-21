package com.ayurkisan.Modules.Orders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.util.JwtUtil;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper to extract JWT details
    private Map<String, String> extractUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        String userId = jwtUtil.extractUserId(token);
        String role = jwtUtil.extractRole(token);

        Map<String, String> userDetails = new HashMap<>();
        userDetails.put("userId", userId);
        userDetails.put("role", role);
        return userDetails;
    }

    // ================= CUSTOMER / RETAILER APIs =================

    @PostMapping("/place-order")
    public ResponseEntity<Map<String, Object>> placeOrder(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "COD") String paymentMethod,
            @RequestParam(required = false) String customName,
            @RequestParam(required = false) String customPhone,
            @RequestParam(required = false) String customAddress,
            @RequestParam(required = false) String promoCode) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");
        String role = userDetails.get("role");
        
        Order placedOrder = orderService.placeOrder(userId, role, paymentMethod, customName, customPhone, customAddress, promoCode);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order placed successfully!");
        response.put("orderId", placedOrder.getId());
        response.put("paymentMethod", paymentMethod);
        response.put("totalAmount", placedOrder.getTotalDiscountedPrice());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");

        List<Order> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<Map<String, String>> cancelOrder(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");
        String role = userDetails.get("role");

        // Allow Admin to cancel any, otherwise user must own it. Handled in Service loosely.
        String callerId = "Admin".equalsIgnoreCase(role) ? "Admin" : userId;

        orderService.cancelOrder(orderId, callerId, null);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Order cancelled successfully. Stock refunded.");
        return ResponseEntity.ok(response);
    }

    // ================= ADMIN APIs =================

    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/status/{orderId}")
    public ResponseEntity<Map<String, String>> updateOrderStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId,
            @RequestParam String newStatus,
            @RequestParam(required = false) String reason) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        orderService.updateOrderStatus(orderId, newStatus, reason);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Order status updated to " + newStatus);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/order/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
}
