package com.ayurkisan.dto.reports;

import java.util.Map;

public class SalesReportDTO {
    private long totalOrders;
    private double totalSalesAmount;
    private long totalProductsSold;
    
    private RoleStats customerStats;
    private RoleStats retailerStats;
    
    private Map<String, Long> statusBreakdown; // DELIVERED, PENDING, etc.
    private Map<String, Double> regionBreakdown; // Pune, Mumbai, etc.

    public static class RoleStats {
        private long orderCount;
        private double salesAmount;

        public long getOrderCount() { return orderCount; }
        public void setOrderCount(long orderCount) { this.orderCount = orderCount; }
        public double getSalesAmount() { return salesAmount; }
        public void setSalesAmount(double salesAmount) { this.salesAmount = salesAmount; }
    }

    // Getters and Setters
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public double getTotalSalesAmount() { return totalSalesAmount; }
    public void setTotalSalesAmount(double totalSalesAmount) { this.totalSalesAmount = totalSalesAmount; }
    public long getTotalProductsSold() { return totalProductsSold; }
    public void setTotalProductsSold(long totalProductsSold) { this.totalProductsSold = totalProductsSold; }
    public RoleStats getCustomerStats() { return customerStats; }
    public void setCustomerStats(RoleStats customerStats) { this.customerStats = customerStats; }
    public RoleStats getRetailerStats() { return retailerStats; }
    public void setRetailerStats(RoleStats retailerStats) { this.retailerStats = retailerStats; }
    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }
    public Map<String, Double> getRegionBreakdown() { return regionBreakdown; }
    public void setRegionBreakdown(Map<String, Double> regionBreakdown) { this.regionBreakdown = regionBreakdown; }
}
