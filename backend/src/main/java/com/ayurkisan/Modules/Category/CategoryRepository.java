package com.ayurkisan.Modules.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {

    boolean existsByCategoryNameIgnoreCase(String categoryName);

    List<Category> findByActiveTrue();

    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);

    void deleteByCategoryNameIgnoreCase(String categoryName);
}