package com.ayurkisan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Public API - No Auth Required";
    }

    @GetMapping("/private/hello")
    public String privateHello() {
        return "Private API - Auth Required";
    }
}
