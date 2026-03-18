package com.ayurkisan.Modules.Feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/feedbacks")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // ================= CUSTOMER & RETAILER APIs =================

    @PostMapping("/add")
    public Map<String, Object> addFeedback(@Valid @RequestBody Feedback feedback) {

        Feedback savedFeedback = feedbackService.addFeedback(feedback);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Feedback added successfully");
        response.put("feedbackId", savedFeedback.getId());

        return response;
    }

    @GetMapping("/product/{productId}")
    public List<Feedback> getFeedbacksByProduct(@PathVariable String productId) {
        return feedbackService.getFeedbacksByProductId(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbacksByUser(@PathVariable String userId) {
        return feedbackService.getFeedbacksByUserId(userId);
    }

    // ================= ADMIN APIs =================

    @GetMapping("/admin/all")
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/role/{role}")
    public List<Feedback> getFeedbacksByRole(@PathVariable String role) {
        return feedbackService.getFeedbacksByRole(role);
    }

    @DeleteMapping("/admin/delete/{id}")
    public Map<String, String> deleteFeedback(@PathVariable String id) {

        feedbackService.deleteFeedback(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Feedback deleted successfully");

        return response;
    }
}
