package com.ayurkisan.Modules.Chatbot;

import com.ayurkisan.model.Product;
import java.util.List;
import java.util.Map;

public class ChatbotResponse {
    private String type; // TEXT, PRODUCTS, OPTIONS, RETAILER_INFO
    private String content;
    private List<Product> products;
    private List<String> options;
    private Map<String, Object> metadata;

    public ChatbotResponse() {}

    public ChatbotResponse(String type, String content) {
        this.type = type;
        this.content = content;
    }

    public static ChatbotResponse text(String content) {
        return new ChatbotResponse("TEXT", content);
    }

    public static ChatbotResponse products(String content, List<Product> products) {
        ChatbotResponse res = new ChatbotResponse("PRODUCTS", content);
        res.setProducts(products);
        return res;
    }

    public static ChatbotResponse options(String content, List<String> options) {
        ChatbotResponse res = new ChatbotResponse("OPTIONS", content);
        res.setOptions(options);
        return res;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
