// ============================================
// BUSINESS LOGIC LAYER - Custom Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { CoffeeApi } from '../services/coffeeApi';
import { CoffeeConsumption, CoffeeStats, CoffeeFormData } from '../types/coffee.types';

/**
 * Custom Hook for Coffee Data Management
 * Encapsulates all business logic and state management
 */
export const useCoffeeData = () => {
  const [coffeeList, setCoffeeList] = useState<CoffeeConsumption[]>([]);
  const [stats, setStats] = useState<CoffeeStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all coffee consumptions
   */
  const fetchCoffeeList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CoffeeApi.getAllCoffee();
      setCoffeeList(data);
    } catch (err) {
      setError('Failed to fetch coffee list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await CoffeeApi.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  /**
   * Log new coffee consumption
   */
  const logCoffee = async (formData: CoffeeFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const consumption: Omit<CoffeeConsumption, 'id'> = {
        ...formData,
        consumedAt: new Date().toISOString()
      };
      
      const savedCoffee = await CoffeeApi.logCoffee(consumption);
      
      // Update local state optimistically
      setCoffeeList(prev => [savedCoffee, ...prev]);
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError('Failed to log coffee');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete coffee consumption
   */
  const deleteCoffee = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await CoffeeApi.deleteCoffee(id);
      
      // Update local state
      setCoffeeList(prev => prev.filter(coffee => coffee.id !== id));
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError('Failed to delete coffee');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    await Promise.all([fetchCoffeeList(), fetchStats()]);
  }, [fetchCoffeeList, fetchStats]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    coffeeList,
    stats,
    loading,
    error,
    logCoffee,
    deleteCoffee,
    refreshData
  };
};
