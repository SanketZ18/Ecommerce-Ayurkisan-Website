package com.ayurkisan.Modules.Shipment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Shipments")
public class Shipment {

    @Id
    private String id;
    
    private String orderId;
    private String userId;
    private String role; // Customer or Retailer
    private String shippingAddress;
    private String contactPhone;
    
    // Statuses: CONFIRMED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED
    private String status;
    
    @org.springframework.data.annotation.Transient
    private String customerName;

    // Array of status changes
    private List<ShipmentUpdate> trackingHistory = new ArrayList<>();
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ShipmentUpdate> getTrackingHistory() { return trackingHistory; }
    public void setTrackingHistory(List<ShipmentUpdate> trackingHistory) { this.trackingHistory = trackingHistory; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
