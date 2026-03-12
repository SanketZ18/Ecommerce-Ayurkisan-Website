package com.ayurkisan.dto;

public class AuthResponse {
private final String token;
private final String role;
private final String userId;

    public AuthResponse(String token, String role, String userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    // Getters

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getUserId() {
        return userId;
    }
}
