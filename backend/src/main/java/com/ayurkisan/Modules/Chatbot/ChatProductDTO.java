package com.ayurkisan.Modules.Chatbot;

public class ChatProductDTO {
    private String id;
    private String productName;
    private String productImage1;
    private double price;
    private double discount;
    private double finalPrice;
    private String type; // "PRODUCT" or "PACKAGE"

    public ChatProductDTO() {}

    public ChatProductDTO(String id, String productName, String productImage1, double price, double discount, double finalPrice, String type) {
        this.id = id;
        this.productName = productName;
        this.productImage1 = productImage1;
        this.price = price;
        this.discount = discount;
        this.finalPrice = finalPrice;
        this.type = type;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductImage1() { return productImage1; }
    public void setProductImage1(String productImage1) { this.productImage1 = productImage1; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }
    public double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
