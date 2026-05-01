package com.ayurkisan.Modules.Category;

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

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService service;

    // ================= ADMIN CRUD =================

    @PostMapping("/admin/add")
    public Map<String, String> addCategory(@Valid @RequestBody Category category) {

        Category saved = service.addCategory(category);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Category added successfully");
        response.put("categoryId", saved.getId());

        return response;
    }

    @PutMapping("/admin/update/{categoryName}")
    public Map<String, String> updateCategory(
            @PathVariable String categoryName,
            @Valid @RequestBody Category category) {

        service.updateCategory(categoryName, category);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Category updated successfully");

        return response;
    }

    @DeleteMapping("/admin/delete/{categoryName}")
    public Map<String, String> deleteCategory(@PathVariable String categoryName) {

        service.deleteCategory(categoryName);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");

        return response;
    }

    // ================= CUSTOMER / RETAILER =================

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return service.getAllActiveCategories();
    }

    @GetMapping("/view/{categoryName}")
    public Category getCategory(@PathVariable String categoryName) {
        return service.getCategoryByName(categoryName);
    }
}