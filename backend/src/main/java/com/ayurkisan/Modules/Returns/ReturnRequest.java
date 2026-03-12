package com.ayurkisan.Modules.Returns;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Returns")
public class ReturnRequest {

    @Id
    private String id;
    
    private String orderId;
    private String userId;
    private String role; // Customer or Retailer
    
    private String reason;
    private String comments;
    
    // Statuses: PENDING, ACCEPTED, REJECTED, PICKED_UP, REFUNDED
    private String status;
    
    @org.springframework.data.annotation.Transient
    private String customerName;

    private List<ReturnUpdate> trackingHistory = new ArrayList<>();
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ReturnUpdate> getTrackingHistory() { return trackingHistory; }
    public void setTrackingHistory(List<ReturnUpdate> trackingHistory) { this.trackingHistory = trackingHistory; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
