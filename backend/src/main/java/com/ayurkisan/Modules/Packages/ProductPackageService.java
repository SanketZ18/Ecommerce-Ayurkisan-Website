package com.ayurkisan.Modules.Packages;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class ProductPackageService {

    @Autowired
    private ProductPackageRepository repository;

    // CREATE
    public ProductPackage createPackage(ProductPackage productPackage) {

        productPackage.generateId();
        return repository.save(productPackage);
    }

    // GET ALL
    public List<ProductPackage> getAllPackages() {

        List<ProductPackage> list = repository.findAll();

        if (list.isEmpty()) {
            throw new RuntimeException("No packages found");
        }

        return list;
    }

    // GET BY ID
    public ProductPackage getPackageById(@NonNull String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with ID: " + id));
    }

    // UPDATE BY ID
    public ProductPackage updateById(@NonNull String id, ProductPackage updatedPackage) {
        ProductPackage existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with ID: " + id));

        existing.setName(updatedPackage.getName());
        existing.setItems(updatedPackage.getItems());
        existing.setPackagePrice(updatedPackage.getPackagePrice());
        existing.setTotalPrice(updatedPackage.getTotalPrice());
        existing.setImageURL(updatedPackage.getImageURL());
        existing.setActive(updatedPackage.getActive());

        return repository.save(existing);
    }

    // DELETE BY ID
    public void deleteById(@NonNull String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Package not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}