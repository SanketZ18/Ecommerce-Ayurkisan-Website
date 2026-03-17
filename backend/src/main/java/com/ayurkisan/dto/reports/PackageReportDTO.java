package com.ayurkisan.dto.reports;

import java.util.List;

public class PackageReportDTO {
    private String packageId;
    private String packageName;
    private int totalPackagesSold;
    private double totalRevenueGenerated;
    private List<String> productsIncluded;
    private int popularityRanking;

    // Getters and Setters
    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    public int getTotalPackagesSold() { return totalPackagesSold; }
    public void setTotalPackagesSold(int totalPackagesSold) { this.totalPackagesSold = totalPackagesSold; }
    public double getTotalRevenueGenerated() { return totalRevenueGenerated; }
    public void setTotalRevenueGenerated(double totalRevenueGenerated) { this.totalRevenueGenerated = totalRevenueGenerated; }
    public List<String> getProductsIncluded() { return productsIncluded; }
    public void setProductsIncluded(List<String> productsIncluded) { this.productsIncluded = productsIncluded; }
    public int getPopularityRanking() { return popularityRanking; }
    public void setPopularityRanking(int popularityRanking) { this.popularityRanking = popularityRanking; }
}
