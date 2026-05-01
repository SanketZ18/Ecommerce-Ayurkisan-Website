package com.ayurkisan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AyurkisanApplication {

    public static void main(String[] args) {
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

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner testMailOnStartup(org.springframework.mail.javamail.JavaMailSender mailSender, 
                                                                       @org.springframework.beans.factory.annotation.Value("${spring.mail.username:}") String user,
                                                                       @org.springframework.beans.factory.annotation.Value("${spring.mail.password:}") String pass) {
        return args -> {
            System.out.println(">>> [Startup Diagnostics] Checking Email Configuration...");
            if (user == null || user.isEmpty()) {
                System.err.println(">>> [ERROR] MAIL_USERNAME is missing!");
            } else {
                System.out.println(">>> MAIL_USERNAME: FOUND (Length: " + user.length() + ")");
            }
            
            if (pass == null || pass.isEmpty()) {
                System.err.println(">>> [ERROR] MAIL_PASSWORD is missing!");
            } else {
                System.out.println(">>> MAIL_PASSWORD: FOUND (Length: " + pass.length() + ")");
            }

            try {
                System.out.println(">>> [Startup Diagnostics] Attempting to connect to smtp.gmail.com:587...");
                ((org.springframework.mail.javamail.JavaMailSenderImpl) mailSender).testConnection();
                System.out.println(">>> [SUCCESS] Email server connection established successfully!");
            } catch (Exception e) {
                System.err.println(">>> [FAILED] Could not connect to email server: " + e.getMessage());
            }
        };
    }
}
