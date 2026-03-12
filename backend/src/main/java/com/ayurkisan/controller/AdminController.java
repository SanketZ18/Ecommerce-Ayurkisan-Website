package com.ayurkisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ayurkisan.model.Admin;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.dto.AdminUpdateRequest;
import com.ayurkisan.service.AdminService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ================= VIEW ALL CUSTOMERS =================
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return adminService.getAllCustomers();
    }

    // ================= VIEW ALL RETAILERS =================
    @GetMapping("/retailers")
    public List<Retailer> getAllRetailers() {
        return adminService.getAllRetailers();
    }

  // ================= RECOVER CUSTOMER =================
@PutMapping("/recover/customer/{id}")
public String recoverCustomer(@PathVariable String id) {
    return adminService.recoverCustomer(id);
}

// ================= RECOVER RETAILER =================
@PutMapping("/recover/retailer/{id}")
public String recoverRetailer(@PathVariable String id) {
    return adminService.recoverRetailer(id);
}

// ================= UPDATE ADMIN =================
@PutMapping("/update/{id}")
public String updateAdmin(@PathVariable String id, @Valid @RequestBody AdminUpdateRequest request) {
    return adminService.updateAdmin(id, request);
}

// ================= DELETE ADMIN =================
@DeleteMapping("/delete/{id}")
public String deleteAdmin(@PathVariable String id) {
    return adminService.deleteAdmin(id);
}
// ================= VIEW ALL ADMINS =================
@GetMapping("/admins")
public List<Admin> getAllAdmins() {
    return adminService.getAllAdmins();
}

// ================= DASHBOARD STATS =================
@GetMapping("/dashboard-stats")
public com.ayurkisan.dto.DashboardStats getDashboardStats() {
    return adminService.getDashboardStats();
}
}
