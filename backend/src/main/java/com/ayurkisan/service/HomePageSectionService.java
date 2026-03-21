package com.ayurkisan.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayurkisan.model.HomePageSection;
import com.ayurkisan.repository.HomePageSectionRepository;

@Service
public class HomePageSectionService {

    @Autowired
    private HomePageSectionRepository repository;

    public List<HomePageSection> getAllSections() {
        return repository.findAllByOrderByOrderIndexAsc();
    }

    public HomePageSection createSection(HomePageSection section) {
        return repository.save(section);
    }

    public HomePageSection updateSection(String id, HomePageSection newSectionData) {
        Optional<HomePageSection> existing = repository.findById(id);
        if (existing.isPresent()) {
            HomePageSection section = existing.get();
            section.setType(newSectionData.getType());
            section.setTitle(newSectionData.getTitle());
            section.setSubtitle(newSectionData.getSubtitle());
            section.setImageUrl(newSectionData.getImageUrl());
            section.setCtaText(newSectionData.getCtaText());
            section.setCtaLink(newSectionData.getCtaLink());
            section.setAlignment(newSectionData.getAlignment());
            section.setNew(newSectionData.isNew());
            section.setOrderIndex(newSectionData.getOrderIndex());
            // New fields
            section.setProductIds(newSectionData.getProductIds());
            section.setItems(newSectionData.getItems());
            section.setPromoCode(newSectionData.getPromoCode());
            section.setShowPromoCode(newSectionData.isShowPromoCode());
            return repository.save(section);
        }
        return null;
    }

    public void deleteSection(String id) {
        repository.deleteById(id);
    }

    public HomePageSection getSectionByType(String type) {
        return repository.findByType(type);
    }
}
