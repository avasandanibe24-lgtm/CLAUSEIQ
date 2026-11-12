package com.clauseiq.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    @GetMapping
    public String test() {
        return "ClauseIQ backend is running";
    }
}
