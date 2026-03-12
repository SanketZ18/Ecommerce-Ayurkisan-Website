package com.ayurkisan.Modules.Returns;

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
@RequestMapping("/returns")
@CrossOrigin("*")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

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

    @PostMapping("/request/{orderId}")
    public ResponseEntity<ReturnRequest> initiateReturn(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId,
            @RequestParam String reason,
            @RequestParam(required = false) String comments) {
            
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");

        ReturnRequest rt = returnService.initiateReturn(orderId, userId, reason, comments);
        return ResponseEntity.ok(rt);
    }

    @GetMapping("/my-returns")
    public ResponseEntity<List<ReturnRequest>> getMyReturns(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");
        return ResponseEntity.ok(returnService.getUserReturns(userId));
    }

    @GetMapping("/track/{orderId}")
    public ResponseEntity<ReturnRequest> trackReturn(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        String userId = userDetails.get("userId");
        String role = userDetails.get("role");

        ReturnRequest rt = returnService.getReturnByOrderId(orderId);

        if (!"Admin".equalsIgnoreCase(role) && !rt.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to view tracking info for this return");
        }

        return ResponseEntity.ok(rt);
    }

    // ================= ADMIN APIs =================

    @GetMapping("/admin/all")
    public ResponseEntity<List<ReturnRequest>> getAllReturns(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
        return ResponseEntity.ok(returnService.getAllReturns());
    }

    @PutMapping("/admin/status/{orderId}")
    public ResponseEntity<Map<String, String>> updateReturnStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId,
            @RequestParam String newStatus,
            @RequestParam(required = false) String remarks) {

        Map<String, String> userDetails = extractUserFromToken(authHeader);
        if (!"Admin".equalsIgnoreCase(userDetails.get("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        returnService.updateReturnStatus(orderId, newStatus, remarks);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Return status updated to " + newStatus);
        return ResponseEntity.ok(response);
    }
}
