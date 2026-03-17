package com.ayurkisan.Modules.Chatbot;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FAQRepository extends MongoRepository<FAQ, String> {
    List<FAQ> findByQuestionContainingIgnoreCase(String question);
}
