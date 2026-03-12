package com.ayurkisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ayurkisan.model.HomePageSection;
import com.ayurkisan.service.HomePageSectionService;

@RestController
@RequestMapping("/api/homepage/sections")
@CrossOrigin("*")
public class HomePageSectionController {

    @Autowired
    private HomePageSectionService service;

    @GetMapping
    public List<HomePageSection> getAllSections() {
        return service.getAllSections();
    }

    @GetMapping("/type/{type}")
    public HomePageSection getSectionByType(@PathVariable String type) {
        return service.getSectionByType(type);
    }

    @PostMapping
    public HomePageSection createSection(@RequestBody HomePageSection section) {
        return service.createSection(section);
    }

    @PutMapping("/{id}")
    public HomePageSection updateSection(@PathVariable String id, @RequestBody HomePageSection section) {
        return service.updateSection(id, section);
    }

    @DeleteMapping("/{id}")
    public void deleteSection(@PathVariable String id) {
        service.deleteSection(id);
    }
}
