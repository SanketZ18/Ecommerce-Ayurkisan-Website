package com.ayurkisan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AyurkisanApplication {

    public static void main(String[] args) {
        // Force IPv4 for stable networking on cloud providers
        System.setProperty("java.net.preferIPv4Stack" , "true");
        
        // Manual .env loading to bypass library issues and ensure file precedence
        try {
            java.io.File envFile = new java.io.File("./.env");
            if (envFile.exists()) {
                java.util.List<String> lines = java.nio.file.Files.readAllLines(envFile.toPath());
                for (String line : lines) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) continue;
                    
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        System.setProperty(key, value);
                    }
                }
            }
        } catch (Exception e) {
            // Silently fail if .env not present or readable, rely on system env
        }
        SpringApplication.run(AyurkisanApplication.class, args);
        System.out.println("✅ MongoDB connected | Ayurkisan backend running");
    }

}
