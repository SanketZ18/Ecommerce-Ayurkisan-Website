package com.ayurkisan.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ayurkisan.dto.AdminSignupRequest;
import com.ayurkisan.dto.AuthResponse;
import com.ayurkisan.dto.CustomerSignupRequest;
import com.ayurkisan.dto.LoginRequest;
import com.ayurkisan.dto.RetailerSignupRequest;
import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Admin;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Login;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.repository.AdminRepository;
import com.ayurkisan.repository.CustomerRepository;
import com.ayurkisan.repository.LoginRepository;
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

    // ================= CUSTOMER REGISTER =================
    public String registerCustomer(CustomerSignupRequest request) {

        if (loginRepository.existsByEmail(request.getEmail()))
            throw new CustomException("Email already registered");

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setAddress(request.getAddress());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setRole("CUSTOMER");
        customer.setDelete(false);   // ✅ FIXED

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
        retailer.setAddress(request.getAddress());
        retailer.setPhoneNumber(request.getPhoneNumber());
        retailer.setEmail(request.getEmail());
        retailer.setPassword(passwordEncoder.encode(request.getPassword()));
        retailer.setRole("RETAILER");
        retailer.setDelete(false);   // ✅ FIXED

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

        if (loginOptional.isEmpty())
            throw new CustomException("Invalid email or role");

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
