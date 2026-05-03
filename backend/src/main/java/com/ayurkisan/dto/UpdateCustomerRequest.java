package com.ayurkisan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateCustomerRequest {

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only alphabets")
    private String name;

    private String addressLine1;
    private String taluka;
    private String district;
    private String state;

    @Pattern(regexp = "^[789][0-9]{9}$", message = "Phone number must contain 10 digits and start with 7, 8, or 9")
    private String phoneNumber;

    // Getters and Setters

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getAddressLine1() {
        return addressLine1;
    }
    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }
    public String getTaluka() {
        return taluka;
    }
    public void setTaluka(String taluka) {
        this.taluka = taluka;
    }
    public String getDistrict() {
        return district;
    }
    public void setDistrict(String district) {
        this.district = district;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
