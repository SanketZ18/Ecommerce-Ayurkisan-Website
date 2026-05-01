package com.ayurkisan.Modules.Contact;

import com.ayurkisan.Modules.Orders.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    // Save a new contact message
    @PostMapping("/submit")
    public ResponseEntity<?> submitContactForm(@RequestBody Contact contact) {
        Contact savedContact = contactRepository.save(contact);
        return ResponseEntity.ok(Map.of("message", "Contact form submitted successfully", "contact", savedContact));
    }

    // Get all contact messages for admin
    @GetMapping("/all")
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactRepository.findAllByOrderByCreatedAtDesc());
    }

    // Reply to a message
    @PostMapping("/reply/{id}")
    public ResponseEntity<?> replyToContact(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<Contact> optionalContact = contactRepository.findById(id);
        if (optionalContact.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Contact not found"));
        }

        String replyMessage = payload.get("replyMessage");
        if (replyMessage == null || replyMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reply message cannot be empty"));
        }

        Contact contact = optionalContact.get();

        // Send email
        emailService.sendContactReply(contact.getEmail(), contact.getSubject(), replyMessage);

        // Update status
        contact.setStatus("REPLIED");
        contactRepository.save(contact);

        return ResponseEntity.ok(Map.of("message", "Reply sent successfully", "contact", contact));
    }

    // Delete a message
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable String id) {
        if (!contactRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Contact not found"));
        }
        contactRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
    }
}
