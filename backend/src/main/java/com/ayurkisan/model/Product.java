package com.ayurkisan.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Document(collection = "Products")
public class Product {

    @Id
    private String id;

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Brand is required")
    private String brand;

    @Positive(message = "Price must be greater than 0")
    private double price;

    @Min(value = 0, message = "Discount cannot be negative")
    @Max(value = 100, message = "Discount cannot exceed 100")
    private double discount;

    private double finalPrice;

    @PositiveOrZero(message = "Stock cannot be negative")
    private int stockQuantity;

    @NotBlank(message = "Product image URL 1 is required")
    private String productImage1;

    private String productImage2;

    private String productImage3;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    private LocalDateTime createdAt;

    // ===== NEW BUSINESS FIELDS =====

    private int piecesPerBox; // e.g., 10 pieces per box

    private double customerDiscount;   // e.g., 10%
    private double retailerDiscount;   // e.g., 30%

    private boolean discountEnabled;   // Admin decides

    // ===== Herbal Specific =====
    private String ingredients;
    private String usageInstructions;
    private String dosage;
    private String sideEffects;
    private LocalDate expiryDate;
    private LocalDate manufacturingDate;
    private String weight;
    private boolean isPrescriptionRequired;

    // ===== GETTERS AND SETTERS =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getProductImage1() { return productImage1; }
    public void setProductImage1(String productImage1) { this.productImage1 = productImage1; }

    public String getProductImage2() { return productImage2; }
    public void setProductImage2(String productImage2) { this.productImage2 = productImage2; }

    public String getProductImage3() { return productImage3; }
    public void setProductImage3(String productImage3) { this.productImage3 = productImage3; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getPiecesPerBox() { return piecesPerBox; }
    public void setPiecesPerBox(int piecesPerBox) { this.piecesPerBox = piecesPerBox; }

    public double getCustomerDiscount() { return customerDiscount; }
    public void setCustomerDiscount(double customerDiscount) { this.customerDiscount = customerDiscount; }

    public double getRetailerDiscount() { return retailerDiscount; }
    public void setRetailerDiscount(double retailerDiscount) { this.retailerDiscount = retailerDiscount; }

    public boolean isDiscountEnabled() { return discountEnabled; }
    public void setDiscountEnabled(boolean discountEnabled) { this.discountEnabled = discountEnabled; }

    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }

    public String getUsageInstructions() { return usageInstructions; }
    public void setUsageInstructions(String usageInstructions) { this.usageInstructions = usageInstructions; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public LocalDate getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(LocalDate manufacturingDate) { this.manufacturingDate = manufacturingDate; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public boolean isPrescriptionRequired() { return isPrescriptionRequired; }
    public void setPrescriptionRequired(boolean prescriptionRequired) {
        isPrescriptionRequired = prescriptionRequired;
    }
}