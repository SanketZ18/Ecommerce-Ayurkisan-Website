package com.ayurkisan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateRetailerRequest {

    @NotBlank(message = "Retailer name is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Retailer name must contain only alphabets")
    private String retailerName;

    @NotBlank(message = "Firm name is required")
    private String firmName;

    private String addressLine1;
    private String taluka;
    private String district;
    private String state;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain 10 digits")
    private String phoneNumber;

    // Getters and Setters

    public String getRetailerName() {
        return retailerName;
    }
    public void setRetailerName(String retailerName) {
        this.retailerName = retailerName;
    }
    public String getFirmName() {
        return firmName;
    }
    public void setFirmName(String firmName) {
        this.firmName = firmName;
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
