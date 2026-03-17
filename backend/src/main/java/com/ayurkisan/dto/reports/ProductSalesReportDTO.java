package com.ayurkisan.dto.reports;

public class ProductSalesReportDTO {
    private String productId;
    private String productName;
    private int totalQuantitySold;
    private double totalRevenueGenerated;
    private int orderCount;
    private int currentStockLevel;

    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getTotalQuantitySold() { return totalQuantitySold; }
    public void setTotalQuantitySold(int totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; }
    public double getTotalRevenueGenerated() { return totalRevenueGenerated; }
    public void setTotalRevenueGenerated(double totalRevenueGenerated) { this.totalRevenueGenerated = totalRevenueGenerated; }
    public int getOrderCount() { return orderCount; }
    public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
    public int getCurrentStockLevel() { return currentStockLevel; }
    public void setCurrentStockLevel(int currentStockLevel) { this.currentStockLevel = currentStockLevel; }
}
