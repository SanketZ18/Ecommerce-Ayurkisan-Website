package com.ayurkisan.Modules.Orders;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderItem {

    @NotBlank(message = "Product/Package ID is required")
    private String productId;

    @NotBlank(message = "Product/Package Name is required")
    private String productName;

    private String productImage;

    @NotBlank(message = "Item Type is required (PRODUCT/PACKAGE)")
    private String itemType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private double price;

    private double discountedPrice;

    private double totalItemPrice;

    // ===== GETTERS & SETTERS =====

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(double discountedPrice) { this.discountedPrice = discountedPrice; }

    public double getTotalItemPrice() { return totalItemPrice; }
    public void setTotalItemPrice(double totalItemPrice) { this.totalItemPrice = totalItemPrice; }
}
