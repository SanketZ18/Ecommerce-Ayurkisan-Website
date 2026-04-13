package com.ayurkisan.repository;

import com.ayurkisan.model.OtpToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OtpTokenRepository extends MongoRepository<OtpToken, String> {
    Optional<OtpToken> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}
