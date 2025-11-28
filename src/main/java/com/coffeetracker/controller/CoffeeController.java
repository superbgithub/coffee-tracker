package com.coffeetracker.controller;

import com.coffeetracker.model.CoffeeConsumption;
import com.coffeetracker.service.CoffeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST API Controller for Coffee Consumption operations
 */
@RestController
@RequestMapping("/api/v1/coffee")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Allow frontend access (configure properly in production)
public class CoffeeController {

    private final CoffeeService coffeeService;

    /**
     * POST /api/v1/coffee - Log a new coffee consumption
     */
    @PostMapping
    public ResponseEntity<CoffeeConsumption> logCoffee(@Valid @RequestBody CoffeeConsumption consumption) {
        log.info("Received request to log coffee: {}", consumption.getCoffeeType());
        CoffeeConsumption saved = coffeeService.logCoffee(consumption);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * GET /api/v1/coffee - Get all coffee consumptions
     */
    @GetMapping
    public ResponseEntity<List<CoffeeConsumption>> getAllConsumptions() {
        log.info("Received request to get all consumptions");
        List<CoffeeConsumption> consumptions = coffeeService.getAllConsumptions();
        return ResponseEntity.ok(consumptions);
    }

    /**
     * GET /api/v1/coffee/{id} - Get consumption by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CoffeeConsumption> getConsumptionById(@PathVariable Long id) {
        log.info("Received request to get consumption by id: {}", id);
        CoffeeConsumption consumption = coffeeService.getConsumptionById(id);
        return ResponseEntity.ok(consumption);
    }

    /**
     * GET /api/v1/coffee/today - Get today's consumptions
     */
    @GetMapping("/today")
    public ResponseEntity<List<CoffeeConsumption>> getTodaysConsumptions() {
        log.info("Received request for today's consumptions");
        List<CoffeeConsumption> consumptions = coffeeService.getTodaysConsumptions();
        return ResponseEntity.ok(consumptions);
    }

    /**
     * GET /api/v1/coffee/range - Get consumptions within date range
     */
    @GetMapping("/range")
    public ResponseEntity<List<CoffeeConsumption>> getConsumptionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Received request for consumptions between {} and {}", startDate, endDate);
        List<CoffeeConsumption> consumptions = coffeeService.getConsumptionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(consumptions);
    }

    /**
     * GET /api/v1/coffee/stats - Get consumption statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        log.info("Received request for statistics");
        Map<String, Object> stats = coffeeService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * DELETE /api/v1/coffee/{id} - Delete a consumption record
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsumption(@PathVariable Long id) {
        log.info("Received request to delete consumption: {}", id);
        coffeeService.deleteConsumption(id);
        return ResponseEntity.noContent().build();
    }
}
