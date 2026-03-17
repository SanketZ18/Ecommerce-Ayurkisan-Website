package com.ayurkisan.dto.reports;

import java.util.List;

public class ProductSalesHistoryDTO {
    private String productId;
    private String productName;
    private List<DailySales> history;

    public static class DailySales {
        private String date;
        private int quantity;
        private double revenue;

        public DailySales() {}
        public DailySales(String date, int quantity, double revenue) {
            this.date = date;
            this.quantity = quantity;
            this.revenue = revenue;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public List<DailySales> getHistory() { return history; }
    public void setHistory(List<DailySales> history) { this.history = history; }
}
