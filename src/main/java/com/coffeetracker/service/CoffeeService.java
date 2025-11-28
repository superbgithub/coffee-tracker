package com.coffeetracker.service;

import com.coffeetracker.model.CoffeeConsumption;
import com.coffeetracker.repository.CoffeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service layer for Coffee Consumption business logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CoffeeService {

    private final CoffeeRepository coffeeRepository;

    /**
     * Log a new coffee consumption
     */
    @Transactional
    public CoffeeConsumption logCoffee(CoffeeConsumption consumption) {
        log.info("Logging coffee consumption: {} {} at {}", 
                 consumption.getSize(), consumption.getCoffeeType(), consumption.getConsumedAt());
        return coffeeRepository.save(consumption);
    }

    /**
     * Get all coffee consumptions (sorted by most recent)
     */
    @Transactional(readOnly = true)
    public List<CoffeeConsumption> getAllConsumptions() {
        return coffeeRepository.findAllByOrderByConsumedAtDesc();
    }

    /**
     * Get consumption by ID
     */
    @Transactional(readOnly = true)
    public CoffeeConsumption getConsumptionById(Long id) {
        return coffeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coffee consumption not found with id: " + id));
    }

    /**
     * Get today's consumptions
     */
    @Transactional(readOnly = true)
    public List<CoffeeConsumption> getTodaysConsumptions() {
        return coffeeRepository.findTodaysConsumptions();
    }

    /**
     * Get consumptions within date range
     */
    @Transactional(readOnly = true)
    public List<CoffeeConsumption> getConsumptionsByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return coffeeRepository.findByConsumedAtBetween(start, end);
    }

    /**
     * Get consumption statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total consumptions
        Long totalCount = coffeeRepository.countBy();
        stats.put("totalConsumptions", totalCount);
        
        // Total caffeine
        Long totalCaffeine = coffeeRepository.getTotalCaffeineConsumed();
        stats.put("totalCaffeineMg", totalCaffeine);
        
        // Average caffeine per consumption
        if (totalCount > 0) {
            stats.put("averageCaffeinePerConsumption", totalCaffeine / totalCount);
        } else {
            stats.put("averageCaffeinePerConsumption", 0);
        }
        
        // Today's count
        List<CoffeeConsumption> todayList = getTodaysConsumptions();
        stats.put("todayCount", todayList.size());
        
        // Today's caffeine
        int todayCaffeine = todayList.stream()
                .mapToInt(CoffeeConsumption::getCaffeineMg)
                .sum();
        stats.put("todayCaffeineMg", todayCaffeine);
        
        // Group by type
        Map<String, Long> byType = coffeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        CoffeeConsumption::getCoffeeType,
                        Collectors.counting()
                ));
        stats.put("countByType", byType);
        
        // Group by size
        Map<String, Long> bySize = coffeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        CoffeeConsumption::getSize,
                        Collectors.counting()
                ));
        stats.put("countBySize", bySize);
        
        log.debug("Generated statistics: {}", stats);
        return stats;
    }

    /**
     * Delete a consumption record
     */
    @Transactional
    public void deleteConsumption(Long id) {
        log.info("Deleting coffee consumption with id: {}", id);
        coffeeRepository.deleteById(id);
    }
}
