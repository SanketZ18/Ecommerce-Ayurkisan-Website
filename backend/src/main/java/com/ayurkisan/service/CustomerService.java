package com.ayurkisan.service;

import com.ayurkisan.dto.ChangePasswordRequest;
import com.ayurkisan.dto.UpdateCustomerRequest;
import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Customer;
import com.ayurkisan.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<Customer> getAllCustomers() {
        return customerRepository.findByIsDeleteFalse();
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new CustomException("Customer not found"));
    }

    public Customer updateCustomer(String id, UpdateCustomerRequest request) {

        Customer customer = getCustomerById(id);

        customer.setName(request.getName());
        customer.setAddress(request.getAddress());
        customer.setPhoneNumber(request.getPhoneNumber());

        return customerRepository.save(customer);
    }

    public String deleteCustomer(String id) {

        Customer customer = getCustomerById(id);
        customer.setDelete(true);   // ✅ FIXED
        customerRepository.save(customer);

        return "Customer soft deleted successfully";
    }

    public String changePassword(String id, ChangePasswordRequest request) {

        Customer customer = getCustomerById(id);

        if (!passwordEncoder.matches(request.getOldPassword(), customer.getPassword()))
            throw new CustomException("Old password incorrect");

        customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        customerRepository.save(customer);

        return "Password changed successfully";
    }
}
