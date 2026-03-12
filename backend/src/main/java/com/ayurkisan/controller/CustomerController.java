package com.ayurkisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ayurkisan.dto.ChangePasswordRequest;
import com.ayurkisan.dto.UpdateCustomerRequest;
import com.ayurkisan.model.Customer;
import com.ayurkisan.service.CustomerService;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // ================= GET ALL CUSTOMERS =================
    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable String id) {
        return customerService.getCustomerById(id);
    }

    // ================= UPDATE =================
    @PutMapping("/update/{id}")
    public Customer updateCustomer(
            @PathVariable String id,
            @RequestBody UpdateCustomerRequest request) {

        return customerService.updateCustomer(id, request);
    }

    // ================= SOFT DELETE =================
    @DeleteMapping("/delete/{id}")
    public String deleteCustomer(@PathVariable String id) {
        return customerService.deleteCustomer(id);
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password/{id}")
    public String changePassword(
            @PathVariable String id,
            @RequestBody ChangePasswordRequest request) {

        return customerService.changePassword(id, request);
    }
}
