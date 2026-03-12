package com.ayurkisan.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionLogger {

    private final MongoTemplate mongoTemplate;

    public MongoConnectionLogger(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logMongoConnection() {
        try {
            mongoTemplate.getDb().getName();
            System.out.println("MongoDB connected successfully");
        } catch (Exception e) {
            System.out.println("MongoDB connection failed");
        }
    }
}
