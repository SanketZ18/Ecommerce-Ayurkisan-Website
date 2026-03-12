package com.ayurkisan.Modules.Cart;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Carts")
public class Cart {

    @Id
    private String id;

    private String userId;

    private String role; // Customer or Retailer

    private List<CartItem> items = new ArrayList<>();

    private double totalOriginalPrice;
    
    private double totalDiscountedPrice;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    // ===== GETTERS & SETTERS =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getTotalOriginalPrice() { return totalOriginalPrice; }
    public void setTotalOriginalPrice(double totalOriginalPrice) { this.totalOriginalPrice = totalOriginalPrice; }

    public double getTotalDiscountedPrice() { return totalDiscountedPrice; }
    public void setTotalDiscountedPrice(double totalDiscountedPrice) { this.totalDiscountedPrice = totalDiscountedPrice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
