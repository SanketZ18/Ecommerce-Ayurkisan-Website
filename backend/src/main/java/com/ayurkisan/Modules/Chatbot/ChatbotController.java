package com.ayurkisan.Modules.Chatbot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin("*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @Autowired
    private FAQRepository faqRepository;

    @PostMapping("/message")
    public ChatbotResponse handleMessage(@RequestBody ChatbotRequest request) {
        return chatbotService.processMessage(request);
    }

    // FAQ Management (Admin)
    @GetMapping("/faq")
    public List<FAQ> getAllFAQs() {
        return faqRepository.findAll();
    }

    @PostMapping("/faq")
    public FAQ addFAQ(@RequestBody FAQ faq) {
        FAQ saved = faqRepository.save(faq);
        if (saved == null) throw new RuntimeException("Failed to save FAQ");
        return saved;
    }

    @DeleteMapping("/faq/{id}")
    public ResponseEntity<Void> deleteFAQ(@PathVariable String id) {
        if (faqRepository.existsById(id)) {
            faqRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
