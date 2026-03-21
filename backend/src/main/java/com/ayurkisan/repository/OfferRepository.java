package com.ayurkisan.repository;

import com.ayurkisan.model.Offer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OfferRepository extends MongoRepository<Offer, String> {
    Optional<Offer> findByCode(String code);
}
