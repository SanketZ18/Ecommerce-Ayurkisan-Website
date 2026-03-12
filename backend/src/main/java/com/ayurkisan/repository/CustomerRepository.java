package com.ayurkisan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.Customer;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {

    // Find active customer by email
    Optional<Customer> findByEmailAndIsDeleteFalse(String email);

    // Find by ID only if not deleted
    Optional<Customer> findByIdAndIsDeleteFalse(String id);

    // Get all active customers
    List<Customer> findByIsDeleteFalse();

    // Get all deleted customers (Admin recovery use)
    List<Customer> findByIsDeleteTrue();

    // Check if email exists
    boolean existsByEmail(String email);
}
