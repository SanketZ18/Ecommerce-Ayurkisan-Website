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
import com.ayurkisan.dto.UpdateRetailerRequest;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.service.RetailerService;

@RestController
@RequestMapping("/api/retailer")
@CrossOrigin("*")
public class RetailerController {

    @Autowired
    private RetailerService retailerService;

    // ================= GET ALL RETAILERS =================
    @GetMapping("/all")
    public List<Retailer> getAllRetailers() {
        return retailerService.getAllRetailers();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Retailer getRetailer(@PathVariable String id) {
        return retailerService.getRetailerById(id);
    }

    // ================= UPDATE =================
    @PutMapping("/update/{id}")
    public Retailer updateRetailer(
            @PathVariable String id,
            @RequestBody UpdateRetailerRequest request) {

        return retailerService.updateRetailer(id, request);
    }

    // ================= SOFT DELETE =================
    @DeleteMapping("/delete/{id}")
    public String deleteRetailer(@PathVariable String id) {
        return retailerService.deleteRetailer(id);
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password/{id}")
    public String changePassword(
            @PathVariable String id,
            @RequestBody ChangePasswordRequest request) {

        return retailerService.changePassword(id, request);
    }
}
