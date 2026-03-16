package com.ayurkisan.Modules.Orders;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Orders")
public class Order {

    @Id
    private String id; // Order ID

    private String userId;

    private String role; // Customer or Retailer

    // Auto-fetched details
    private String userName;
    private String contactEmail;
    private String contactPhone;
    private String shippingAddress;

    private List<OrderItem> items;

    private double totalOriginalPrice;
    private double totalDiscountedPrice;
    private double deliveryCharge = 50.0;

    // Payment details
    private String paymentMethod; // COD or ONLINE
    private String paymentStatus; // PENDING, SUCCESS, FAILED

    // Order tracking
    private String orderStatus; // PLACED, SHIPPED, DELIVERED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime returnDeadline;

    // ===== GETTERS & SETTERS =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getTotalOriginalPrice() { return totalOriginalPrice; }
    public void setTotalOriginalPrice(double totalOriginalPrice) { this.totalOriginalPrice = totalOriginalPrice; }

    public double getTotalDiscountedPrice() { return totalDiscountedPrice; }
    public void setTotalDiscountedPrice(double totalDiscountedPrice) { this.totalDiscountedPrice = totalDiscountedPrice; }

    public double getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(double deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getShippedAt() { return shippedAt; }
    public void setShippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getReturnDeadline() { return returnDeadline; }
    public void setReturnDeadline(LocalDateTime returnDeadline) { this.returnDeadline = returnDeadline; }
}
