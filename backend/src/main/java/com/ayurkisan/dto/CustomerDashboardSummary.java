package com.ayurkisan.dto;

import com.ayurkisan.model.Customer;
import com.ayurkisan.Modules.Orders.Order;
import com.ayurkisan.model.Product;
import com.ayurkisan.Modules.Packages.ProductPackage;
import com.ayurkisan.Modules.Category.Category;
import com.ayurkisan.model.HomePageSection;

import java.util.List;
import java.util.Map;

public class CustomerDashboardSummary {
    private Customer profile;
    private List<Order> recentOrders;
    private List<Product> featuredProducts;
    private List<ProductPackage> featuredPackages;
    private List<Category> categories;
    private Map<String, Long> stats;
    private List<HomePageSection> homepageSections;

    // Getters and Setters
    public Customer getProfile() { return profile; }
    public void setProfile(Customer profile) { this.profile = profile; }

    public List<Order> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<Order> recentOrders) { this.recentOrders = recentOrders; }

    public List<Product> getFeaturedProducts() { return featuredProducts; }
    public void setFeaturedProducts(List<Product> featuredProducts) { this.featuredProducts = featuredProducts; }

    public List<ProductPackage> getFeaturedPackages() { return featuredPackages; }
    public void setFeaturedPackages(List<ProductPackage> featuredPackages) { this.featuredPackages = featuredPackages; }

    public List<Category> getCategories() { return categories; }
    public void setCategories(List<Category> categories) { this.categories = categories; }

    public Map<String, Long> getStats() { return stats; }
    public void setStats(Map<String, Long> stats) { this.stats = stats; }

    public List<HomePageSection> getHomepageSections() { return homepageSections; }
    public void setHomepageSections(List<HomePageSection> homepageSections) { this.homepageSections = homepageSections; }
}
