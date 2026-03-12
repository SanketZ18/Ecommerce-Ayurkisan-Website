package com.ayurkisan.service;

import com.ayurkisan.dto.ChangePasswordRequest;
import com.ayurkisan.dto.UpdateRetailerRequest;
import com.ayurkisan.exception.CustomException;
import com.ayurkisan.model.Retailer;
import com.ayurkisan.repository.RetailerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RetailerService {

    @Autowired private RetailerRepository retailerRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<Retailer> getAllRetailers() {
        return retailerRepository.findByIsDeleteFalse();
    }

    public Retailer getRetailerById(String id) {
        return retailerRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new CustomException("Retailer not found"));
    }

    public Retailer updateRetailer(String id, UpdateRetailerRequest request) {

        Retailer retailer = getRetailerById(id);

        retailer.setRetailerName(request.getRetailerName());
        retailer.setFirmName(request.getFirmName());
        retailer.setAddress(request.getAddress());
        retailer.setPhoneNumber(request.getPhoneNumber());

        return retailerRepository.save(retailer);
    }

    public String deleteRetailer(String id) {

        Retailer retailer = getRetailerById(id);
        retailer.setDelete(true);   // ✅ FIXED
        retailerRepository.save(retailer);

        return "Retailer soft deleted successfully";
    }

    public String changePassword(String id, ChangePasswordRequest request) {

        Retailer retailer = getRetailerById(id);

        if (!passwordEncoder.matches(request.getOldPassword(), retailer.getPassword()))
            throw new CustomException("Old password incorrect");

        retailer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        retailerRepository.save(retailer);

        return "Password changed successfully";
    }
}
