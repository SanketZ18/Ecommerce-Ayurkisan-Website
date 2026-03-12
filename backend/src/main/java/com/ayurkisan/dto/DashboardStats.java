package com.ayurkisan.dto;

public class DashboardStats {
    private double totalSales;
    private long totalOrders;
    
    private double customerRevenue;
    private double retailerRevenue;
    private long customerOrdersCount;
    private long retailerOrdersCount;

    private long productsCount;
    private long customersCount;
    private long retailersCount;
    private long categoriesCount;

    // Default constructor
    public DashboardStats() {}

    // Getters
    public double getTotalSales() { return totalSales; }
    public long getTotalOrders() { return totalOrders; }
    public double getCustomerRevenue() { return customerRevenue; }
    public double getRetailerRevenue() { return retailerRevenue; }
    public long getCustomerOrdersCount() { return customerOrdersCount; }
    public long getRetailerOrdersCount() { return retailerOrdersCount; }
    public long getProductsCount() { return productsCount; }
    public long getCustomersCount() { return customersCount; }
    public long getRetailersCount() { return retailersCount; }
    public long getCategoriesCount() { return categoriesCount; }

    // Setters
    public void setTotalSales(double totalSales) { this.totalSales = totalSales; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public void setCustomerRevenue(double customerRevenue) { this.customerRevenue = customerRevenue; }
    public void setRetailerRevenue(double retailerRevenue) { this.retailerRevenue = retailerRevenue; }
    public void setCustomerOrdersCount(long customerOrdersCount) { this.customerOrdersCount = customerOrdersCount; }
    public void setRetailerOrdersCount(long retailerOrdersCount) { this.retailerOrdersCount = retailerOrdersCount; }
    public void setProductsCount(long productsCount) { this.productsCount = productsCount; }
    public void setCustomersCount(long customersCount) { this.customersCount = customersCount; }
    public void setRetailersCount(long retailersCount) { this.retailersCount = retailersCount; }
    public void setCategoriesCount(long categoriesCount) { this.categoriesCount = categoriesCount; }
}
