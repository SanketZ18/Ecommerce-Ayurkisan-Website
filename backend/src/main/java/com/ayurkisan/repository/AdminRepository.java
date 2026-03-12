package com.ayurkisan.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {

    // Find admin by email
    Optional<Admin> findByEmail(String email);

    // Check if admin email exists
    boolean existsByEmail(String email);
}
