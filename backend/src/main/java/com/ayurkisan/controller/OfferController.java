package com.ayurkisan.controller;

import com.ayurkisan.model.Offer;
import com.ayurkisan.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin("*")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @GetMapping
    public List<Offer> getAllOffers() {
        return offerService.getAllOffers();
    }

    @PostMapping
    public Offer createOffer(@RequestBody Offer offer) {
        offer.setActive(true);
        return offerService.saveOffer(offer);
    }

    @PutMapping("/{id}")
    public Offer updateOffer(@PathVariable String id, @RequestBody Offer offer) {
        offer.setId(id);
        return offerService.saveOffer(offer);
    }

    @DeleteMapping("/{id}")
    public void deleteOffer(@PathVariable String id) {
        offerService.deleteOffer(id);
    }

    @PostMapping("/validate")
    public Offer validateOffer(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        Double amount = Double.valueOf(request.get("amount").toString());
        return offerService.validateOffer(code, amount);
    }
}
