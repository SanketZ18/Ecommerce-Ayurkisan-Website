package com.ayurkisan;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AyurkisanApplication {

    public static void main(String[] args) {
        // Load .env variables into System properties for Spring Boot to pick them up
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();
        
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        SpringApplication.run(AyurkisanApplication.class, args);
        System.out.println("✅ MongoDB connected | Ayurkisan backend running");
    }
}
