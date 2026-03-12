package com.ayurkisan.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Customer;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.repository.CustomerRepository;
import com.ayurkisan.repository.RetailerRepository;

import com.ayurkisan.model.Admin;
import com.ayurkisan.repository.AdminRepository;
import com.ayurkisan.dto.AdminUpdateRequest;

@Service
public class AdminService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private com.ayurkisan.repository.ProductRepository productRepository;

    @Autowired
    private com.ayurkisan.Modules.Category.CategoryRepository categoryRepository;

    @Autowired
    private com.ayurkisan.Modules.Orders.OrderRepository orderRepository;

    // ================= VIEW ALL CUSTOMERS =================
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // ================= VIEW ALL RETAILERS =================
    public List<Retailer> getAllRetailers() {
        return retailerRepository.findAll();
    }

    // ================= RECOVER CUSTOMER =================
    public String recoverCustomer(String id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomException("Customer not found"));

        customer.setDelete(false);
        customerRepository.save(customer);

        return "Customer recovered successfully";
    }

    // ================= RECOVER RETAILER =================
    public String recoverRetailer(String id) {

        Retailer retailer = retailerRepository.findById(id)
                .orElseThrow(() -> new CustomException("Retailer not found"));

        retailer.setDelete(false);
        retailerRepository.save(retailer);

        return "Retailer recovered successfully";
    }

    // ================= UPDATE ADMIN =================
    public String updateAdmin(String id, AdminUpdateRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new CustomException("Admin not found"));

        if (request.getName() != null) {
            admin.setName(request.getName());
        }
        if (request.getEmail() != null) {
            // Check if new email already exists and belongs to another admin
            if (!admin.getEmail().equals(request.getEmail()) && adminRepository.existsByEmail(request.getEmail())) {
                throw new CustomException("Email already in use");
            }
            admin.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            admin.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            admin.setAddress(request.getAddress());
        }

        adminRepository.save(admin);
        return "Admin updated successfully";
    }

    // ================= DELETE ADMIN =================
    public String deleteAdmin(String id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new CustomException("Admin not found"));

        adminRepository.delete(admin);
        return "Admin deleted successfully";
    }
    
    // ================= VIEW ALL ADMINS =================
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // ================= DASHBOARD STATS =================
    public com.ayurkisan.dto.DashboardStats getDashboardStats() {
        com.ayurkisan.dto.DashboardStats stats = new com.ayurkisan.dto.DashboardStats();
        stats.setCustomersCount(customerRepository.count());
        stats.setRetailersCount(retailerRepository.count());
        stats.setProductsCount(productRepository.count());
        stats.setCategoriesCount(categoryRepository.count());
        
        List<com.ayurkisan.Modules.Orders.Order> orders = orderRepository.findAll();
        stats.setTotalOrders(orders.size());
        
        double totalSales = 0;
        double customerRevenue = 0;
        double retailerRevenue = 0;
        long customerOrdersCount = 0;
        long retailerOrdersCount = 0;

        for (com.ayurkisan.Modules.Orders.Order order : orders) {
            String role = order.getRole() != null ? order.getRole().toLowerCase() : "";
            double amount = order.getTotalDiscountedPrice();

            if ("customer".equals(role)) {
                customerOrdersCount++;
                customerRevenue += amount;
            } else if ("retailer".equals(role)) {
                retailerOrdersCount++;
                retailerRevenue += amount;
            }
            
            totalSales += amount;
        }
        
        stats.setTotalSales(totalSales);
        stats.setCustomerRevenue(customerRevenue);
        stats.setRetailerRevenue(retailerRevenue);
        stats.setCustomerOrdersCount(customerOrdersCount);
        stats.setRetailerOrdersCount(retailerOrdersCount);
        
        return stats;
    }
}
