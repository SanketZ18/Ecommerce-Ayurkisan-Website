package com.ayurkisan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public class AdminUpdateRequest {

    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only alphabets")
    private String name;

    private String address;

    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Please provide a valid email address")
    private String email;

    @Pattern(regexp = "^[789][0-9]{9}$", message = "Phone number must contain 10 digits and start with 7, 8, or 9")
    private String phoneNumber;

    // Getters & Setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
