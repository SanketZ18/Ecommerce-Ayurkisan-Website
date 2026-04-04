package com.ayurkisan.controller;

import com.ayurkisan.dto.UserStatsDTO;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.Modules.Orders.OrderRepository;
import com.ayurkisan.repository.CustomerRepository;
import com.ayurkisan.repository.RetailerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class UserManagementController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/users/stats")
    public ResponseEntity<Map<String, List<UserStatsDTO>>> getUserStats() {
        List<UserStatsDTO> customers = new ArrayList<>();
        List<UserStatsDTO> retailers = new ArrayList<>();

        // Fetch active customers
        List<Customer> activeCustomers = customerRepository.findByIsDeleteFalse();
        for (Customer c : activeCustomers) {
            long count = orderRepository.countByUserId(c.getId());
            customers.add(new UserStatsDTO(c.getId(), c.getName(), c.getEmail(), c.getPhoneNumber(), "CUSTOMER", count));
        }

        // Fetch active retailers
        List<Retailer> activeRetailers = retailerRepository.findByIsDeleteFalse();
        for (Retailer r : activeRetailers) {
            long count = orderRepository.countByUserId(r.getId());
            retailers.add(new UserStatsDTO(r.getId(), r.getRetailerName(), r.getEmail(), r.getPhoneNumber(), "RETAILER", count));
        }

        Map<String, List<UserStatsDTO>> response = new HashMap<>();
        response.put("customers", customers);
        response.put("retailers", retailers);

        return ResponseEntity.ok(response);
    }
}
