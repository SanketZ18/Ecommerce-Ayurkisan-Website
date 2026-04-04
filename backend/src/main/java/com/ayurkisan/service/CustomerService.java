package com.ayurkisan.service;

import com.ayurkisan.dto.ChangePasswordRequest;
import com.ayurkisan.dto.UpdateCustomerRequest;
import com.ayurkisan.dto.CustomerDashboardSummary;
import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Customer;
import com.ayurkisan.Modules.Orders.OrderRepository;
import com.ayurkisan.repository.ProductRepository;
import com.ayurkisan.Modules.Packages.ProductPackageRepository;
import com.ayurkisan.Modules.Category.CategoryService;
import com.ayurkisan.repository.HomePageSectionRepository;
import com.ayurkisan.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductPackageRepository productPackageRepository;
    @Autowired private CategoryService categoryService;
    @Autowired private HomePageSectionRepository homePageSectionRepository;

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

    public CustomerDashboardSummary getDashboardSummary(String userId) {
        CustomerDashboardSummary summary = new CustomerDashboardSummary();

        // 1. Profile
        summary.setProfile(getCustomerById(userId));

        // 2. Recent 5 Orders (Sorted by date descending)
        summary.setRecentOrders(orderRepository.findByUserId(userId, 
            PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))));

        // 3. Featured Products (Limit to 8 for fast load)
        summary.setFeaturedProducts(productRepository.findAll(PageRequest.of(0, 8)).getContent());

        // 4. Featured Packages (Limit to 4)
        summary.setFeaturedPackages(productPackageRepository.findAll(PageRequest.of(0, 4)).getContent());

        // 5. Categories
        summary.setCategories(categoryService.getAllActiveCategories());

        // 6. Homepage Sections (Filtered for offers)
        summary.setHomepageSections(homePageSectionRepository.findAll().stream()
            .filter(s -> "special_offers".equals(s.getType()))
            .collect(Collectors.toList()));

        // 7. Stats
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalOrders", (long) orderRepository.countByUserId(userId));
        // Note: Wishlist and Returns could be added here if needed
        summary.setStats(stats);

        return summary;
    }
}
