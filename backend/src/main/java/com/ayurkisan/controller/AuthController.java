package com.ayurkisan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ayurkisan.dto.AdminSignupRequest;
import com.ayurkisan.dto.AuthResponse;
import com.ayurkisan.dto.CustomerSignupRequest;
import com.ayurkisan.dto.ForgotPasswordRequest;
import com.ayurkisan.dto.LoginRequest;
import com.ayurkisan.dto.ResetPasswordRequest;
import com.ayurkisan.dto.RetailerSignupRequest;
import com.ayurkisan.dto.VerifyOtpRequest;
import com.ayurkisan.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ================= CUSTOMER SIGNUP =================
    @PostMapping("/customer/signup")
    public String registerCustomer(@RequestBody CustomerSignupRequest request) {
        return authService.registerCustomer(request);
    }

    // ================= RETAILER SIGNUP =================
    @PostMapping("/retailer/signup")
    public String registerRetailer(@RequestBody RetailerSignupRequest request) {
        return authService.registerRetailer(request);
    }
// ================= ADMIN REGISTER =================
@PostMapping("/admin/register")
public ResponseEntity<String> registerAdmin(
        @Valid @RequestBody AdminSignupRequest request) {

    return ResponseEntity.ok(authService.registerAdmin(request));
}

    // ================= LOGIN =================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.processForgotPassword(request.getEmail(), request.getRole()));
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.getEmail(), request.getNewPassword(), request.getRole()));
    }
}
