package com.ayurkisan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.Retailer;

@Repository
public interface RetailerRepository extends MongoRepository<Retailer, String> {

    // Find active retailer by email
    Optional<Retailer> findByEmailAndIsDeleteFalse(String email);

    // Find by ID only if not deleted
    Optional<Retailer> findByIdAndIsDeleteFalse(String id);

    // Get all active retailers
    List<Retailer> findByIsDeleteFalse();

    // Get all deleted retailers (Admin recovery use)
    List<Retailer> findByIsDeleteTrue();

    // Check if email exists
    boolean existsByEmail(String email);

    // Check if registration ID exists
    boolean existsByRegistrationId(String registrationId);
}
