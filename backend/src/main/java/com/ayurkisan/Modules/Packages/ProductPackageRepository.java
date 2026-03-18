package com.ayurkisan.Modules.Packages;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPackageRepository 
        extends MongoRepository<ProductPackage, String> {
    Optional<ProductPackage> findByNameIgnoreCase(String name);
    java.util.List<ProductPackage> findByNameContainingIgnoreCase(String name);
}