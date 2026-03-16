package com.ayurkisan.dto.reports;

public class DashboardStatsDTO {
    private double salesToday;
    private double salesThisWeek;
    private double salesThisMonth;
    private String bestSellingProduct;
    private String bestSellingPackage;
    private long totalOrders;

    // Getters and Setters
    public double getSalesToday() { return salesToday; }
    public void setSalesToday(double salesToday) { this.salesToday = salesToday; }
    public double getSalesThisWeek() { return salesThisWeek; }
    public void setSalesThisWeek(double salesThisWeek) { this.salesThisWeek = salesThisWeek; }
    public double getSalesThisMonth() { return salesThisMonth; }
    public void setSalesThisMonth(double salesThisMonth) { this.salesThisMonth = salesThisMonth; }
    public String getBestSellingProduct() { return bestSellingProduct; }
    public void setBestSellingProduct(String bestSellingProduct) { this.bestSellingProduct = bestSellingProduct; }
    public String getBestSellingPackage() { return bestSellingPackage; }
    public void setBestSellingPackage(String bestSellingPackage) { this.bestSellingPackage = bestSellingPackage; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
}
