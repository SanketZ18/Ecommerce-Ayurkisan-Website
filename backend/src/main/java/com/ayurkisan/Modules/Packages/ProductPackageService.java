package com.ayurkisan.Modules.Packages;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductPackageService {

    @Autowired
    private ProductPackageRepository repository;

    @Autowired
    private com.ayurkisan.service.ProductService productService;

    // CREATE
    public ProductPackage createPackage(ProductPackage productPackage) {

        productPackage.generateId();
        return repository.save(productPackage);
    }

    private void calculateStock(ProductPackage pkg) {
        int minStock = Integer.MAX_VALUE;
        if (pkg.getItems() == null || pkg.getItems().isEmpty()) {
            pkg.setStockQuantity(0);
            return;
        }

        for (PackageItem item : pkg.getItems()) {
            try {
                // Try to find by Name first, then fallback to ID
                com.ayurkisan.model.Product p;
                try {
                    p = productService.getProductByName(item.getProductId());
                } catch (Exception e) {
                    p = productService.getProductById(item.getProductId());
                }

                int possiblePackages = p.getStockQuantity() / item.getQuantity();
                if (possiblePackages < minStock) {
                    minStock = possiblePackages;
                }
            } catch (Exception e) {
                minStock = 0;
            }
        }
        pkg.setStockQuantity(minStock == Integer.MAX_VALUE ? 0 : minStock);
    }

    // GET ALL
    public List<ProductPackage> getAllPackages() {
        List<ProductPackage> list = repository.findAll();
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No packages found");
        }
        list.forEach(this::calculateStock);
        return list;
    }

    // GET BY ID
    public ProductPackage getPackageById(@NonNull String id) {
        ProductPackage pkg = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found with ID: " + id));
        calculateStock(pkg);
        return pkg;
    }

    // UPDATE BY ID
    public ProductPackage updateById(@NonNull String id, ProductPackage updatedPackage) {
        ProductPackage existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found with ID: " + id));

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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    public void reduceStockAtomically(String packageId, int orderQuantity) {
        ProductPackage pkg = repository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found: " + packageId));
        
        for (PackageItem item : pkg.getItems()) {
            int totalToReduce = item.getQuantity() * orderQuantity;
            try {
                // Try reducing by Name first (as requested by user)
                productService.reduceStockByNameAtomically(item.getProductId(), totalToReduce);
            } catch (ResponseStatusException e) {
                if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                    // Fallback to ID if Name is not found
                    productService.reduceStockAtomically(item.getProductId(), totalToReduce);
                } else {
                    throw e;
                }
            }
        }
    }

    public void increaseStock(String packageId, int orderQuantity) {
        ProductPackage pkg = repository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found: " + packageId));
        
        for (PackageItem item : pkg.getItems()) {
            int totalToIncrease = item.getQuantity() * orderQuantity;
            try {
                productService.increaseStockByName(item.getProductId(), totalToIncrease);
            } catch (Exception e) {
                productService.increaseStock(item.getProductId(), totalToIncrease);
            }
        }
    }
}