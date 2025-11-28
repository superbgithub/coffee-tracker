package com.coffeetracker.service;

import com.coffeetracker.model.CoffeeConsumption;
import com.coffeetracker.repository.CoffeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CoffeeServiceTest {

    @Mock
    private CoffeeRepository coffeeRepository;

    @InjectMocks
    private CoffeeService coffeeService;

    private CoffeeConsumption testConsumption;

    @BeforeEach
    void setUp() {
        testConsumption = CoffeeConsumption.builder()
                .id(1L)
                .coffeeType("Espresso")
                .size("Small")
                .caffeineMg(80)
                .consumedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testLogCoffee() {
        when(coffeeRepository.save(any(CoffeeConsumption.class))).thenReturn(testConsumption);

        CoffeeConsumption result = coffeeService.logCoffee(testConsumption);

        assertThat(result).isNotNull();
        assertThat(result.getCoffeeType()).isEqualTo("Espresso");
        verify(coffeeRepository, times(1)).save(any(CoffeeConsumption.class));
    }

    @Test
    void testGetAllConsumptions() {
        List<CoffeeConsumption> consumptions = Arrays.asList(testConsumption);
        when(coffeeRepository.findAllByOrderByConsumedAtDesc()).thenReturn(consumptions);

        List<CoffeeConsumption> result = coffeeService.getAllConsumptions();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCoffeeType()).isEqualTo("Espresso");
    }

    @Test
    void testGetStatistics() {
        when(coffeeRepository.countBy()).thenReturn(10L);
        when(coffeeRepository.getTotalCaffeineConsumed()).thenReturn(800L);
        when(coffeeRepository.findTodaysConsumptions()).thenReturn(Arrays.asList(testConsumption));
        when(coffeeRepository.findAll()).thenReturn(Arrays.asList(testConsumption));

        Map<String, Object> stats = coffeeService.getStatistics();

        assertThat(stats).containsKey("totalConsumptions");
        assertThat(stats).containsKey("totalCaffeineMg");
        assertThat(stats).containsKey("todayCount");
    }
}
