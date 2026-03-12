package com.ayurkisan.Modules.Category;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    // ADD
    public Category addCategory(Category category) {

        if (repository.existsByCategoryNameIgnoreCase(category.getCategoryName())) {
            throw new RuntimeException("Category already exists");
        }

        return repository.save(category);
    }

    // UPDATE BY NAME
    public Category updateCategory(String categoryName, Category updatedCategory) {

        Category existing = repository.findByCategoryNameIgnoreCase(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategoryName(updatedCategory.getCategoryName());
        existing.setDescription(updatedCategory.getDescription());
        existing.setActive(updatedCategory.isActive());

        return repository.save(existing);
    }

    // DELETE BY NAME
    public void deleteCategory(String categoryName) {

        Category existing = repository.findByCategoryNameIgnoreCase(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        repository.delete(existing);
    }

    // GET ALL ACTIVE
    public List<Category> getAllActiveCategories() {
        return repository.findByActiveTrue();
    }

    // GET BY NAME
    public Category getCategoryByName(String categoryName) {
        return repository.findByCategoryNameIgnoreCase(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}