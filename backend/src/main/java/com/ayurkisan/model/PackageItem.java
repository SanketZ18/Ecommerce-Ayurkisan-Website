package com.ayurkisan.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class PackageItem {

    @NotBlank(message = "Product ID required")
    private String productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    public PackageItem() {}

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}