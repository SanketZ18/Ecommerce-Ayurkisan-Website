package com.ayurkisan.Modules.Shipment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.util.JwtUtil;

@RestController
@RequestMapping("/shipments")
@CrossOrigin("*")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    @Autowired
    private JwtUtil jwtUtil;

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

    @GetMapping("/track/{orderId}")
    public ResponseEntity<Shipment> trackShipment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");
        String role = userDetails.get("role");

        Shipment shipment = shipmentService.getShipmentByOrderId(orderId);

        // Security check: Only Admin or Owner can view
        if (!"Admin".equalsIgnoreCase(role) && !shipment.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to view tracking info for this order");
        }

        return ResponseEntity.ok(shipment);
    }

    // ================= ADMIN APIs =================

    @GetMapping("/admin/all")
    public ResponseEntity<List<Shipment>> getAllShipments(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @PutMapping("/admin/status/{orderId}")
    public ResponseEntity<Map<String, String>> updateShipmentStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId,
            @RequestParam String newStatus,
            @RequestParam(required = false) String remarks) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        shipmentService.updateShipmentStatus(orderId, newStatus, remarks);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Shipment status updated to " + newStatus);
        return ResponseEntity.ok(response);
    }
}
