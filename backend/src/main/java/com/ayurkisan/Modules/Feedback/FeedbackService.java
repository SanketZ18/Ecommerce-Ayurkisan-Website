package com.ayurkisan.Modules.Feedback;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbacksByProductId(String productId) {
        return feedbackRepository.findByProductId(productId);
    }

    public List<Feedback> getFeedbacksByUserId(String userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public Feedback getFeedbackById(String id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Feedback not found with id: " + id));
    }

    public List<Feedback> getFeedbacksByRole(String role) {
        return feedbackRepository.findByRole(role);
    }

    public void deleteFeedback(String id) {
        Feedback existingFeedback = getFeedbackById(id);
        feedbackRepository.delete(existingFeedback);
    }
}
