package com.ayurkisan.Modules.Chatbot;

import com.ayurkisan.Modules.Packages.ProductPackage;
import com.ayurkisan.Modules.Packages.ProductPackageRepository;
import com.ayurkisan.model.Product;
import com.ayurkisan.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private FAQRepository faqRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPackageRepository packageRepository;

    private static final Map<String, List<String>> ADVISOR_STEPS = new HashMap<>();

    static {
        ADVISOR_STEPS.put("HAIR_FALL", Arrays.asList("Mild", "Moderate", "Severe"));
        ADVISOR_STEPS.put("ACNE", Arrays.asList("Occasional", "Frequent", "Chronic"));
        ADVISOR_STEPS.put("SKIN_TYPE", Arrays.asList("Oily", "Dry", "Combination"));
    }
    
    private ChatProductDTO mapToDTO(Product p) {
        return new ChatProductDTO(
            p.getId(),
            p.getProductName(),
            p.getProductImage1(),
            p.getPrice(),
            p.getDiscount(),
            p.getFinalPrice(),
            "PRODUCT"
        );
    }

    private ChatProductDTO mapToDTO(ProductPackage pkg) {
        return new ChatProductDTO(
            pkg.getId(),
            pkg.getName(),
            pkg.getImageURL(),
            pkg.getPackagePrice(),
            0.0, // Packages usually have a fixed packagePrice which is already discounted or special
            pkg.getPackagePrice(),
            "PACKAGE"
        );
    }

    public ChatbotResponse processMessage(ChatbotRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String context = request.getContext();
        String userName = request.getUserName() != null ? request.getUserName() : "there";

        // 1. Company Information Detection (About/Contact)
        if (containsAny(message, "who are you", "what is ayurkisan", "about", "founder", "owner", "location", "office", "contact", "phone", "email", "support", "mission", "vision")) {
            return handleCompanyQuery(message, userName);
        }

        // 2. Retailer Detection
        if (isRetailerIntent(message)) {
            return ChatbotResponse.text("🚀 **Retailer Order Detected!**\n\nFor bulk purchases (10+ units), we offer exclusive wholesale pricing and GST invoicing. \n\n**Total Price for your query:** (Fetching wholesale rates...)\nWould you like to speak with our business team?");
        }

        // 2. FAQ Check
        List<FAQ> faqs = faqRepository.findAll();
        for (FAQ faq : faqs) {
            String q = faq.getQuestion().toLowerCase();
            if (message.contains(q) || q.contains(message)) {
                return ChatbotResponse.text("💡 " + faq.getAnswer());
            }
        }

        // 3. Advisor Flow (Contextual)
        if (context != null && !context.isEmpty() && !context.equals("null")) {
            return handleAdvisorContext(message, context);
        }

        // 4. Intent Detection - Price Queries
        if (containsAny(message, "price", "how much", "cost", "rate", "mrp")) {
            return handlePriceQuery(message);
        }

        // 5. Intent Detection - Recommendations
        if (containsAny(message, "suggest", "recommend", "best for", "good for", "problem", "remedy", "cure")) {
            return handleRecommendation(message);
        }

        // 6. Intent Detection - Symptom/Common Concern (Trigger Advisor)
        if (containsAny(message, "hair fall", "dandruff", "baldness", "thinning", "acne", "pimple", "dark spot", "glow", "oily skin", "dry skin", "aging", "wrinkle", "detox")) {
            return startAdvisorFlow(message);
        }

        // 7. General Product/Package Search (Specific name matching)
        List<ChatProductDTO> searchResults = new ArrayList<>();
        
        List<Product> products = productRepository.findByProductNameContainingIgnoreCase(message);
        searchResults.addAll(products.stream().map(this::mapToDTO).collect(Collectors.toList()));
        
        List<ProductPackage> packages = packageRepository.findByNameContainingIgnoreCase(message);
        searchResults.addAll(packages.stream().map(this::mapToDTO).collect(Collectors.toList()));

        if (!searchResults.isEmpty() && message.length() > 3) {
            String countMsg = searchResults.size() == 1 ? "1 item" : searchResults.size() + " items";
            return ChatbotResponse.products("I found " + countMsg + " matching your query:", searchResults);
        }

        // 8. Fallback / Smart Browse
        List<ChatProductDTO> topPicks = productRepository.findAll().stream()
                .limit(5)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ChatbotResponse.products("I couldn't find a direct match for that. 🌿 Why not explore our **Top Herbal Picks** instead?", topPicks);
    }

    private boolean isRetailerIntent(String message) {
        if (containsAny(message, "bulk", "wholesale", "business", "gst", "large quantity", "wholesale price")) {
            return true;
        }
        Pattern pattern = Pattern.compile(".*(\\d{2,}).*");
        if (pattern.matcher(message).find()) {
            int qty = extractQuantity(message);
            return qty >= 10;
        }
        return false;
    }

    private int extractQuantity(String message) {
        try {
            String[] parts = message.replaceAll("[^0-9]", " ").trim().split("\\s+");
            for (String part : parts) {
                if (!part.isEmpty()) {
                    int val = Integer.parseInt(part);
                    if (val > 0) return val;
                }
            }
        } catch (Exception e) {}
        return 0;
    }

    private ChatbotResponse handlePriceQuery(String message) {
        String cleanQuery = message.replaceAll("(?i)price|how|much|cost|of|is|rate|mrp|the", "").trim();
        
        List<Product> products = productRepository.findByProductNameContainingIgnoreCase(cleanQuery);
        if (!products.isEmpty() && cleanQuery.length() >= 3) {
            Product p = products.get(0);
            double discPrice = p.getFinalPrice() > 0 ? p.getFinalPrice() : p.getPrice();
            return ChatbotResponse.text("💰 The price for **" + p.getProductName() + "** is **₹" + discPrice + "**. " + 
                (p.getDiscount() > 0 ? "\n\n*(You save ₹" + (p.getPrice() - discPrice) + " with a " + p.getDiscount() + "% discount!)*" : ""));
        }
        
        List<ProductPackage> packages = packageRepository.findByNameContainingIgnoreCase(cleanQuery);
        if (!packages.isEmpty() && cleanQuery.length() >= 3) {
            ProductPackage pkg = packages.get(0);
            return ChatbotResponse.text("🎁 The price for the **" + pkg.getName() + "** package is **₹" + pkg.getPackagePrice() + "**. \n\nThis package includes multiple items for a better value!");
        }

        return ChatbotResponse.text("Which product or package's price are you looking for? (e.g., 'Price of Rosemary Oil' or 'Price of Immunity Kit')");
    }

    private ChatbotResponse handleRecommendation(String message) {
        String query = message.replaceAll("(?i)suggest|recommend|best|for|good|problem|remedy|cure", "").trim();
        
        final String finalQuery = query;
        List<ChatProductDTO> recommendations = new ArrayList<>();
        
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> p.getDescription().toLowerCase().contains(finalQuery) || 
                             p.getProductName().toLowerCase().contains(finalQuery) ||
                             p.getIngredients().toLowerCase().contains(finalQuery))
                .limit(3)
                .collect(Collectors.toList());
        recommendations.addAll(products.stream().map(this::mapToDTO).collect(Collectors.toList()));
        
        List<ProductPackage> packages = packageRepository.findAll().stream()
                .filter(pkg -> pkg.getName().toLowerCase().contains(finalQuery))
                .limit(1)
                .collect(Collectors.toList());
        recommendations.addAll(packages.stream().map(this::mapToDTO).collect(Collectors.toList()));

        if (recommendations.isEmpty()) {
            return ChatbotResponse.text("I'm here to help! Could you tell me more about your concern? (e.g., hair growth, acne, oily skin)");
        }
        return ChatbotResponse.products("Based on your concern, here are our highly recommended herbal solutions:", recommendations);
    }

    private ChatbotResponse startAdvisorFlow(String message) {
        if (containsAny(message, "hair", "bald", "thinning", "dandruff")) {
            return ChatbotResponse.options("🌿 **Ayurkisan Hair Advisor**\n\nI see you're looking for hair care solutions. How would you describe your main concern?", 
                Arrays.asList("Severe Hair Fall", "Anti-Dandruff", "Scalp Nourishment", "Hair Growth"));
        } else if (containsAny(message, "acne", "pimple", "spot", "glow", "oily", "dry", "skin")) {
            return ChatbotResponse.options("✨ **Ayurkisan Skin Advisor**\n\nLet's get you that natural glow! What is your primary skin goal or issue?", 
                Arrays.asList("Acne & Pimples", "Skin Brightening", "Hydration (Dry Skin)", "Oil Control"));
        }
        return ChatbotResponse.text("Sure! Please tell me more about your health or skin concern so I can guide you better.");
    }
    private ChatbotResponse handleCompanyQuery(String message, String userName) {
        if (containsAny(message, "founder", "owner", "who started", "surendra")) {
            return ChatbotResponse.text("👨‍💼 **Ayurkisan Naturals** was founded by **Mr. Surendra Kakade**. \n\nWith a deep grassroot foundation in agriculture, he started this journey to empower farmers and provide pure herbal products to customers worldwide.");
        }
        
        if (containsAny(message, "location", "office", "where", "pune", "address")) {
            return ChatbotResponse.text("📍 Our Head Office is located at:\n\n**Ayurkisan Naturals**\n123 Heritage Road, Wellness District,\nPune - 411038, Maharashtra, India.");
        }

        if (containsAny(message, "contact", "phone", "email", "support", "whatsapp", "call", "mail")) {
            return ChatbotResponse.text("📞 You can reach us via:\n\n- **Phone**: +91 98765 43210\n- **Email**: support@ayurkisan.com\n- **WhatsApp**: [Chat Now](https://wa.me/1234567890)\n\nOur business hours are **Mon-Sat, 10 AM - 6 PM**.");
        }

        if (containsAny(message, "mission", "vision", "goal")) {
            return ChatbotResponse.text("🎯 **Our Mission**: To empower farmers and delight buyers by building a dependable, transparent end-to-end natural produce ecosystem.\n\n🌟 **Our Vision**: To be recognized as a trusted global brand for Indian fresh produce known for quality, consistency, and integrity.");
        }

        return ChatbotResponse.text("🌿 **Ayurkisan Naturals** is a farm-to-customer herbal ecosystem. We bridge the gap between farmers and buyers with transparent pricing and exceptional quality products. \n\nIs there something specific about our company you'd like to know, **" + userName + "**?");
    }


    private ChatbotResponse handleAdvisorContext(String message, String context) {
        String msg = message.toLowerCase();
        
        // Final Recommendations based on specific advisor choices
        if (context.contains("Hair") || context.contains("hair")) {
            if (msg.contains("severe")) {
                return ChatbotResponse.products("For **Severe Hair Fall**, we recommend this intensive strengthening routine:", 
                    filterProducts("Rosemary", "Bhringraj", "Onion Seed"));
            } else if (msg.contains("dandruff")) {
                return ChatbotResponse.products("For **Anti-Dandruff**, nothing beats these neem and ginger extracts:", 
                    filterProducts("Neem", "Ginger", "Tea Tree"));
            } else if (msg.contains("nourish")) {
                return ChatbotResponse.products("To **Nourish your Scalp**, these cold-pressed oils are perfect:", 
                    filterProducts("Amla", "Coconut", "Castor"));
            } else {
                return ChatbotResponse.products("For **Hair Growth**, let's start with these essentials:", 
                    filterProducts("Rosemary", "Jaborandi", "Brahmi"));
            }
        } else if (context.contains("Skin") || context.contains("skin")) {
            if (msg.contains("acne")) {
                return ChatbotResponse.products("For **Acne-prone skin**, these calming tea-tree and tulsi products work wonders:", 
                    filterProducts("Tulsi", "Tea Tree", "Neem"));
            } else if (msg.contains("bright")) {
                return ChatbotResponse.products("To **Brighten your Skin**, vitamins from hibiscus and saffron are best:", 
                    filterProducts("Saffron", "Ubtan", "Hibiscus"));
            } else if (msg.contains("dry") || msg.contains("hydrat")) {
                return ChatbotResponse.products("For **Intense Hydration**, choose these aloe-rich solutions:", 
                    filterProducts("Aloe", "Almond", "Sandalwood"));
            } else if (msg.contains("oil")) {
                return ChatbotResponse.products("For **Oil Control**, these clay-based and clarifying herbal washes are ideal:", 
                    filterProducts("Multani Mitti", "Charcoal", "Lemon"));
            }
        }

        List<ChatProductDTO> productsDTO = productRepository.findAll().stream()
                .limit(2)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ChatbotResponse.products("I understand. Here are some of our most loved herbal products for overall wellness:", productsDTO);
    }

    private List<ChatProductDTO> filterProducts(String... keywords) {
        return productRepository.findAll().stream()
                .filter(p -> Arrays.stream(keywords).anyMatch(k -> 
                    p.getProductName().toLowerCase().contains(k.toLowerCase()) || 
                    p.getDescription().toLowerCase().contains(k.toLowerCase())))
                .limit(3)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private boolean containsAny(String message, String... keywords) {
        return Arrays.stream(keywords).anyMatch(message::contains);
    }
}
