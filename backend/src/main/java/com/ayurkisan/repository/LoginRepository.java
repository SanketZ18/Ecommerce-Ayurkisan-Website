package com.ayurkisan.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.Login;

@Repository
public interface LoginRepository extends MongoRepository<Login, String> {

    // Find by email + role
    Optional<Login> findByEmailAndRole(String email, String role);

    // Find by email only
    Optional<Login> findByEmail(String email);

    // Check if email + role exists
    boolean existsByEmailAndRole(String email, String role);

    // Check if email exists
    boolean existsByEmail(String email);
}
