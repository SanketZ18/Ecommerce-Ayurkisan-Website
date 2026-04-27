package com.ayurkisan.Modules.Packages;

import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Document(collection = "ProductPackages")
public class ProductPackage {

    @Id
    private String id;

    @NotBlank(message = "Package name is required")
    private String name;

    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    private List<PackageItem> items;

    @NotNull(message = "Package price is required")
    @Positive(message = "Package price must be positive")
    private Double packagePrice;

    @NotNull(message = "Total price is required")
    @Positive(message = "Total price must be positive")
    private Double totalPrice;

    private String imageURL;

    @NotNull(message = "Active status is required")
    private Boolean active = true;

    private int stockQuantity = 0; // New field for stock management

    // 🔥 Generate ID automatically
    public void generateId() {
        this.id = "pkg-" + UUID.randomUUID().toString().substring(0, 8);
    }

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<PackageItem> getItems() { return items; }
    public void setItems(List<PackageItem> items) { this.items = items; }

    public Double getPackagePrice() { return packagePrice; }
    public void setPackagePrice(Double packagePrice) { this.packagePrice = packagePrice; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
}