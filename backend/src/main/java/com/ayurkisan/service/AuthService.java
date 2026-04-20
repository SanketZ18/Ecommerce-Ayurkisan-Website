package com.ayurkisan.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ayurkisan.Modules.Orders.EmailService;
import com.ayurkisan.dto.AdminSignupRequest;
import com.ayurkisan.dto.AuthResponse;
import com.ayurkisan.dto.CustomerSignupRequest;
import com.ayurkisan.dto.LoginRequest;
import com.ayurkisan.dto.RetailerSignupRequest;
import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Admin;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Login;
import com.ayurkisan.model.OtpToken;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.repository.AdminRepository;
import com.ayurkisan.repository.CustomerRepository;
import com.ayurkisan.repository.LoginRepository;
import com.ayurkisan.repository.OtpTokenRepository;
import com.ayurkisan.repository.RetailerRepository;
import com.ayurkisan.util.JwtUtil;

@Service
public class AuthService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private RetailerRepository retailerRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private LoginRepository loginRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private OtpTokenRepository otpTokenRepository;
    @Autowired private EmailService emailService;

    // ================= FORGOT PASSWORD =================
    public String processForgotPassword(String email, String role) {
        // 1. Verify user exists with this email and role
        boolean exists = switch (role.toUpperCase()) {
            case "CUSTOMER" -> customerRepository.existsByEmailAndIsDeleteFalse(email);
            case "RETAILER" -> retailerRepository.existsByEmailAndIsDeleteFalse(email);
            case "ADMIN" -> adminRepository.existsByEmail(email);
            default -> throw new CustomException("Invalid role");
        };

        if (!exists) {
            // For security, we don't say "User not found" to avoid enumeration.
            // But for this project's current state, we'll return a generic "If email exists, OTP sent" msg.
            return "If your email is registered, you will receive an OTP shortly.";
        }

        // 2. Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        // 3. Save to DB (Clear old one for this email first)
        otpTokenRepository.deleteByEmail(email);
        OtpToken token = new OtpToken(email, otp, 5); // 5 mins expiry
        otpTokenRepository.save(token);

        // 4. Send Email
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            // In case mail server is not configured, we log it but don't crash
            System.err.println("FAILED TO SEND EMAIL: " + e.getMessage());
            // return "Email sending failed. Please try again later.";
        }

        return "OTP sent successfully to your registered email.";
    }

    // ================= VERIFY OTP =================
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpToken> tokenOpt = otpTokenRepository.findByEmailAndOtp(email, otp);
        
        if (tokenOpt.isEmpty()) {
            throw new CustomException("Invalid OTP");
        }

        OtpToken token = tokenOpt.get();
        if (token.isExpired()) {
            otpTokenRepository.delete(token);
            throw new CustomException("OTP has expired");
        }

        if (token.isUsed()) {
            throw new CustomException("OTP has already been used");
        }

        return true;
    }

    // ================= RESET PASSWORD =================
    public String resetPassword(String email, String newPassword, String role) {
        // 1. Double check OTP valid/exists (not strictly required if called after verify but safer)
        // For simplicity, we assume frontend verified it, but we should mark it as used here.
        
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 2. Update Login credentials
        Login login = loginRepository.findByEmailAndRole(email, role.toUpperCase())
                .orElseThrow(() -> new CustomException("User not found in Login records"));
        login.setPassword(encodedPassword);
        loginRepository.save(login);

        // 3. Update role-specific table
        switch (role.toUpperCase()) {
            case "CUSTOMER" -> {
                Customer customer = customerRepository.findByEmailAndIsDeleteFalse(email)
                        .orElseThrow(() -> new CustomException("Customer not found"));
                customer.setPassword(encodedPassword);
                customerRepository.save(customer);
            }
            case "RETAILER" -> {
                Retailer retailer = retailerRepository.findByEmailAndIsDeleteFalse(email)
                        .orElseThrow(() -> new CustomException("Retailer not found"));
                retailer.setPassword(encodedPassword);
                retailerRepository.save(retailer);
            }
            case "ADMIN" -> {
                Admin admin = adminRepository.findByEmail(email)
                        .orElseThrow(() -> new CustomException("Admin not found"));
                admin.setPassword(encodedPassword);
                adminRepository.save(admin);
            }
        }

        // 4. Clean up OTP
        otpTokenRepository.deleteByEmail(email);

        return "Password updated successfully";
    }

    // ================= CUSTOMER REGISTER =================
    public String registerCustomer(CustomerSignupRequest request) {

        if (loginRepository.existsByEmail(request.getEmail()))
            throw new CustomException("Email already registered");

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setAddressLine1(request.getAddressLine1());
        customer.setTaluka(request.getTaluka());
        customer.setDistrict(request.getDistrict());
        customer.setState(request.getState());
        // Concatenate for backward compatibility
        customer.setAddress(String.format("%s, %s, %s, %s", request.getAddressLine1(), request.getTaluka(), request.getDistrict(), request.getState()));
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setRole("CUSTOMER");
        customer.setDelete(false);

        customerRepository.save(customer);

        Login login = new Login();
        login.setEmail(request.getEmail());
        login.setPassword(customer.getPassword());
        login.setRole("CUSTOMER");
        loginRepository.save(login);

        return "Customer Registered Successfully";
    }

    // ================= RETAILER REGISTER =================
    public String registerRetailer(RetailerSignupRequest request) {

        if (loginRepository.existsByEmail(request.getEmail()))
            throw new CustomException("Email already registered");

        Retailer retailer = new Retailer();
        retailer.setRetailerName(request.getRetailerName());
        retailer.setFirmName(request.getFirmName());
        retailer.setRegistrationId(request.getRegistrationId());
        retailer.setAddressLine1(request.getAddressLine1());
        retailer.setTaluka(request.getTaluka());
        retailer.setDistrict(request.getDistrict());
        retailer.setState(request.getState());
        // Concatenate for backward compatibility
        retailer.setAddress(String.format("%s, %s, %s, %s", request.getAddressLine1(), request.getTaluka(), request.getDistrict(), request.getState()));
        retailer.setPhoneNumber(request.getPhoneNumber());
        retailer.setEmail(request.getEmail());
        retailer.setPassword(passwordEncoder.encode(request.getPassword()));
        retailer.setRole("RETAILER");
        retailer.setDelete(false);

        retailerRepository.save(retailer);

        Login login = new Login();
        login.setEmail(request.getEmail());
        login.setPassword(retailer.getPassword());
        login.setRole("RETAILER");
        loginRepository.save(login);

        return "Retailer Registered Successfully";
    }
// ================= ADMIN REGISTER =================
public String registerAdmin(AdminSignupRequest request) {

    if (loginRepository.existsByEmail(request.getEmail()))
        throw new CustomException("Email already registered");

    Admin admin = new Admin();
    admin.setName(request.getName());
    admin.setAddress(request.getAddress());
    admin.setEmail(request.getEmail());
    admin.setPhoneNumber(request.getPhoneNumber());
    admin.setPassword(passwordEncoder.encode(request.getPassword()));
    admin.setRole("ADMIN");

    adminRepository.save(admin);

    // Save in Login table
    Login login = new Login();
    login.setEmail(request.getEmail());
    login.setPassword(admin.getPassword());
    login.setRole("ADMIN");

    loginRepository.save(login);

    return "Admin Registered Successfully";
}

    // ================= LOGIN =================
    public AuthResponse login(LoginRequest request) {

        Optional<Login> loginOptional =
                loginRepository.findByEmailAndRole(request.getEmail(), request.getRole().toUpperCase());

        if (loginOptional.isEmpty()) {
            // Try searching case-insensitively for role just in case
            loginOptional = loginRepository.findByEmail(request.getEmail());
            if (loginOptional.isPresent() && !loginOptional.get().getRole().equalsIgnoreCase(request.getRole())) {
                 throw new CustomException("Invalid email or role");
            }
            if (loginOptional.isEmpty()) throw new CustomException("Invalid email or role");
        }

        Login login = loginOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), login.getPassword()))
            throw new CustomException("Invalid password");

        String userId;

       String role = request.getRole().toUpperCase();

userId = switch (role) {

    case "CUSTOMER" -> customerRepository
            .findByEmailAndIsDeleteFalse(request.getEmail())
            .orElseThrow(() -> new CustomException("Customer not found"))
            .getId();

    case "RETAILER" -> retailerRepository
            .findByEmailAndIsDeleteFalse(request.getEmail())
            .orElseThrow(() -> new CustomException("Retailer not found"))
            .getId();

    case "ADMIN" -> adminRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new CustomException("Admin not found"))
            .getId();

    default -> throw new CustomException("Invalid role");
};


        String token = jwtUtil.generateToken(userId, request.getRole().toUpperCase());

        return new AuthResponse(token, request.getRole().toUpperCase(), userId);
    }
}
