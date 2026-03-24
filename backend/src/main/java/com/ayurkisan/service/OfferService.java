package com.ayurkisan.service;

import com.ayurkisan.model.Offer;
import com.ayurkisan.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private HomePageSectionService homePageSectionService;

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public Offer saveOffer(Offer offer) {
        Offer savedOffer = offerRepository.save(offer);
        
        // Automatically sync with Homepage "special_offers" section
        try {
            com.ayurkisan.model.HomePageSection section = homePageSectionService.getSectionByType("special_offers");
            if (section != null) {
                section.setPromoCode(savedOffer.getCode());
                // If the offer is active, we should probably show it
                if (savedOffer.isActive()) {
                    section.setShowPromoCode(true);
                }
                homePageSectionService.updateSection(section.getId(), section);
            }
        } catch (Exception e) {
            // Log error but don't fail the offer save
            System.err.println("Failed to sync offer with homepage: " + e.getMessage());
        }
        
        return savedOffer;
    }

    public void deleteOffer(String id) {
        offerRepository.deleteById(id);
    }

    public Offer validateOffer(String code, Double orderAmount) {
        Offer offer = offerRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid Promo Code"));

        if (!offer.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Promo code is inactive");
        }

        if (offer.getExpiryDate() != null && offer.getExpiryDate().before(new Date())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Promo code has expired");
        }

        if (offer.getMinOrderAmount() != null && orderAmount < offer.getMinOrderAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Minimum order amount for this code is ₹" + offer.getMinOrderAmount());
        }

        return offer;
    }
}
