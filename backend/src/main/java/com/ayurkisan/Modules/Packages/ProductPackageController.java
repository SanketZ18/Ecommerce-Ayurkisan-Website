package com.ayurkisan.Modules.Packages;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

@CrossOrigin("*")
@RestController
@RequestMapping("/packages")
public class ProductPackageController {

    @Autowired
    private ProductPackageService service;

    // 🔒 ADMIN ADD
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add")
    public ResponseEntity<?> addPackage(@Valid @RequestBody ProductPackage pkg) {

        try {
            ProductPackage saved = service.createPackage(pkg);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Product Package added successfully",
                            "data", saved
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 🔒 ADMIN UPDATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updatePackage(@PathVariable @org.springframework.lang.NonNull String id,
                                           @Valid @RequestBody ProductPackage pkg) {

        try {
            ProductPackage updated = service.updateById(id, pkg);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Product Package updated successfully",
                            "data", updated
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Package not found"));
        }
    }

    // 🔒 ADMIN DELETE
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable @org.springframework.lang.NonNull String id) {

        try {
            service.deleteById(id);

            return ResponseEntity.ok(
                    Map.of("message", "Product Package deleted successfully")
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Package not found"));
        }
    }


    // 🔓 VIEW SINGLE (All roles) - BY ID
    @GetMapping("/view/id/{id}")
    public ResponseEntity<?> getById(@PathVariable @org.springframework.lang.NonNull String id) {
        try {
            ProductPackage pkg = service.getPackageById(id);
            return ResponseEntity.ok(pkg);

        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Package not found"));
        }
    }

    // 🔓 VIEW ALL
    @GetMapping("/all")
    public ResponseEntity<?> getAllPackages() {

        try {
            List<ProductPackage> list = service.getAllPackages();
            return ResponseEntity.ok(list);

        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Package not found"));
        }
    }
}