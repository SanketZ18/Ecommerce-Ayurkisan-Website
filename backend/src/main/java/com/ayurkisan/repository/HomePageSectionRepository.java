package com.ayurkisan.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ayurkisan.model.HomePageSection;

import java.util.List;

@Repository
public interface HomePageSectionRepository extends MongoRepository<HomePageSection, String> {
    List<HomePageSection> findAllByOrderByOrderIndexAsc();
    HomePageSection findByType(String type);
}
