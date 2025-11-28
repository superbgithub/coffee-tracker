package com.coffeetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Coffee Tracker Application
 * Enterprise PoC with Blue/Green Deployment on AWS
 */
@SpringBootApplication
@EnableJpaRepositories
public class CoffeeTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoffeeTrackerApplication.class, args);
    }
}
