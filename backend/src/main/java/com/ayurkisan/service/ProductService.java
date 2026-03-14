package com.ayurkisan.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.model.Product;
import com.ayurkisan.repository.ProductRepository;
import com.mongodb.client.result.UpdateResult;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    // ================= ADMIN ADD PRODUCT =================
    public Product addProduct(Product product) {

        product.setCreatedAt(LocalDateTime.now());

        double finalPrice = product.getPrice()
                - (product.getPrice() * product.getDiscount() / 100);

        product.setFinalPrice(finalPrice);

        return productRepository.save(product);
    }

    // ================= ADMIN UPDATE PRODUCT =================
public Product updateProduct(String id, Product updatedProduct) {

    Product existing = productRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product not found with ID: " + id));

    existing.setProductName(updatedProduct.getProductName());
    existing.setDescription(updatedProduct.getDescription());
    existing.setBrand(updatedProduct.getBrand());
    existing.setPrice(updatedProduct.getPrice());
    existing.setDiscount(updatedProduct.getDiscount());
    existing.setStockQuantity(updatedProduct.getStockQuantity());
    existing.setProductImage1(updatedProduct.getProductImage1());
    existing.setProductImage2(updatedProduct.getProductImage2());
    existing.setProductImage3(updatedProduct.getProductImage3());
    existing.setCategoryId(updatedProduct.getCategoryId());
    existing.setIngredients(updatedProduct.getIngredients());
    existing.setUsageInstructions(updatedProduct.getUsageInstructions());
    existing.setDosage(updatedProduct.getDosage());
    existing.setSideEffects(updatedProduct.getSideEffects());
    existing.setExpiryDate(updatedProduct.getExpiryDate());
    existing.setManufacturingDate(updatedProduct.getManufacturingDate());
    existing.setWeight(updatedProduct.getWeight());
    existing.setPrescriptionRequired(updatedProduct.isPrescriptionRequired());

    existing.setPiecesPerBox(updatedProduct.getPiecesPerBox());
    existing.setCustomerDiscount(updatedProduct.getCustomerDiscount());
    existing.setRetailerDiscount(updatedProduct.getRetailerDiscount());
    existing.setDiscountEnabled(updatedProduct.isDiscountEnabled());

    double finalPrice = existing.getPrice()
            - (existing.getPrice() * existing.getDiscount() / 100);

    existing.setFinalPrice(finalPrice);

    return productRepository.save(existing);
}

    // ================= DELETE PRODUCT =================
public void deleteProduct(String id) {

    Product existing = productRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product not found with ID: " + id));

    productRepository.delete(existing);
}

    // ================= GET ALL PRODUCTS =================
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getOutOfStockProducts() {
        return productRepository.findByStockQuantity(0);
    }

    // ================= GET PRODUCT BY NAME =================

    // ================= GET PRODUCT BY ID (REAL DB ID) =================
    public Product getProductById(String id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with ID: " + id));

        return product;
    }

    // =========================================================
    //  ATOMIC STOCK REDUCTION WITH PROPER ERROR HANDLING
    // =========================================================
    public boolean reduceStockAtomically(String productId, int quantity) {

        if (quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than 0");
        }

        // First check if product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found"));

        if (product.getStockQuantity() == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Product is out of stock");
        }

        Query query = new Query(
                Criteria.where("_id").is(productId)
                        .and("stockQuantity").gte(quantity)
        );

        Update update = new Update()
                .inc("stockQuantity", -quantity);

        UpdateResult result = mongoTemplate.updateFirst(query, update, Product.class);

        if (result.getModifiedCount() == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock available");
        }

        return true;
    }

    // =========================================================
    //  STOCK INCREASE (Cancel / Return)
    // =========================================================
    public void increaseStock(String productId, int quantity) {

        if (quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than 0");
        }

        Query query = new Query(
                Criteria.where("_id").is(productId)
        );

        Update update = new Update()
                .inc("stockQuantity", quantity);

        mongoTemplate.updateFirst(query, update, Product.class);
    }
}