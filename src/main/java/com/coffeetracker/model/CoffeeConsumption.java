package com.coffeetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * JPA Entity representing a coffee consumption event
 */
@Entity
@Table(name = "coffee_consumptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoffeeConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Coffee type is required")
    @Size(max = 50, message = "Coffee type must be less than 50 characters")
    @Column(name = "coffee_type", nullable = false, length = 50)
    private String coffeeType;

    @NotBlank(message = "Size is required")
    @Pattern(regexp = "Small|Medium|Large", message = "Size must be Small, Medium, or Large")
    @Column(name = "size", nullable = false, length = 20)
    private String size;

    @NotNull(message = "Caffeine content is required")
    @Min(value = 0, message = "Caffeine must be non-negative")
    @Max(value = 500, message = "Caffeine content seems too high")
    @Column(name = "caffeine_mg", nullable = false)
    private Integer caffeineMg;

    @NotNull(message = "Consumption time is required")
    @Column(name = "consumed_at", nullable = false)
    private LocalDateTime consumedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (consumedAt == null) {
            consumedAt = LocalDateTime.now();
        }
    }
}
