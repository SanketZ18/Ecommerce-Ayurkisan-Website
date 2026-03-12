package com.ayurkisan.Modules.Returns;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnRepository extends MongoRepository<ReturnRequest, String> {
    Optional<ReturnRequest> findByOrderId(String orderId);
    List<ReturnRequest> findByUserId(String userId);
}
