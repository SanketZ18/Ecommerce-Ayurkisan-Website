package com.ayurkisan.Modules.Feedback;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {

    List<Feedback> findByProductId(String productId);

    List<Feedback> findByUserId(String userId);

    List<Feedback> findByRole(String role);
}
