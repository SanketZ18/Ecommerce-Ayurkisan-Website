package com.ayurkisan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.Product;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Search product by name (case insensitive)
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // NEW METHOD FOR EXACT MATCH (Used for Update/Delete/Get)
    Optional<Product> findByProductNameIgnoreCase(String productName);

    List<Product> findByStockQuantity(int stockQuantity);
}