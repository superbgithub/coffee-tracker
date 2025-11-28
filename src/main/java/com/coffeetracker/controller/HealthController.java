package com.coffeetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check endpoint for AWS ALB health checks (Blue/Green deployment)
 */
@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "coffee-tracker");
        response.put("timestamp", LocalDateTime.now());
        response.put("environment", System.getenv().getOrDefault("ENVIRONMENT", "unknown"));
        return ResponseEntity.ok(response);
    }
}
