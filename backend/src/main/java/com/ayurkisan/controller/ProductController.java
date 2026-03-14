package com.ayurkisan.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ayurkisan.model.Product;
import com.ayurkisan.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("*")
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ================= ADMIN APIs =================

    @PostMapping("/admin/add")
    public Map<String, Object> addProduct(@Valid @RequestBody Product product) {

        Product savedProduct = productService.addProduct(product);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product added successfully");
        response.put("productId", savedProduct.getId());

        return response;
    }

    @PutMapping("/admin/update/{id}")
public Map<String, Object> updateProduct(@PathVariable String id,
                                         @Valid @RequestBody Product product) {

    Product updated = productService.updateProduct(id, product);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Product updated successfully");
    response.put("productId", updated.getId());

    return response;
}

@DeleteMapping("/admin/delete/{id}")
public Map<String, String> deleteProduct(@PathVariable String id) {

    productService.deleteProduct(id);

    Map<String, String> response = new HashMap<>();
    response.put("message", "Product deleted successfully");

    return response;
}

    @GetMapping("/admin/out-of-stock")
    public List<Product> getOutOfStockProducts() {
        return productService.getOutOfStockProducts();
    }
    // ================= CUSTOMER & RETAILER APIs =================

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/id/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

}