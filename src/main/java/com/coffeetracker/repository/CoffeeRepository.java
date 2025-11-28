package com.coffeetracker.repository;

import com.coffeetracker.model.CoffeeConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Spring Data JPA Repository for CoffeeConsumption
 * Provides automatic CRUD operations and custom queries
 */
@Repository
public interface CoffeeRepository extends JpaRepository<CoffeeConsumption, Long> {

    /**
     * Find all consumptions ordered by consumption time (most recent first)
     */
    List<CoffeeConsumption> findAllByOrderByConsumedAtDesc();

    /**
     * Find consumptions within a date range
     */
    List<CoffeeConsumption> findByConsumedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find consumptions by coffee type
     */
    List<CoffeeConsumption> findByCoffeeType(String coffeeType);

    /**
     * Count total consumptions
     */
    Long countBy();

    /**
     * Count consumptions by type
     */
    Long countByCoffeeType(String coffeeType);

    /**
     * Get statistics grouped by coffee type
     */
    @Query("SELECT c.coffeeType as type, COUNT(c) as count, SUM(c.caffeineMg) as totalCaffeine " +
           "FROM CoffeeConsumption c GROUP BY c.coffeeType")
    List<Map<String, Object>> getStatisticsByType();

    /**
     * Get total caffeine consumed
     */
    @Query("SELECT COALESCE(SUM(c.caffeineMg), 0) FROM CoffeeConsumption c")
    Long getTotalCaffeineConsumed();

    /**
     * Get today's consumptions
     */
    @Query("SELECT c FROM CoffeeConsumption c WHERE FUNCTION('DATE', c.consumedAt) = CURRENT_DATE ORDER BY c.consumedAt DESC")
    List<CoffeeConsumption> findTodaysConsumptions();
}
