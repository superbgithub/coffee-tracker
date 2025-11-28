// ============================================
// DATA ACCESS LAYER - API Service
// ============================================

import axios from 'axios';
import { CoffeeConsumption, CoffeeStats } from '../types/coffee.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Coffee API Service
 * Handles all HTTP communication with Spring Boot backend
 */
export const CoffeeApi = {
  /**
   * Log a new coffee consumption
   */
  logCoffee: async (consumption: Omit<CoffeeConsumption, 'id'>): Promise<CoffeeConsumption> => {
    const response = await api.post<CoffeeConsumption>('/coffee', consumption);
    return response.data;
  },

  /**
   * Get all coffee consumptions (sorted by most recent)
   */
  getAllCoffee: async (): Promise<CoffeeConsumption[]> => {
    const response = await api.get<CoffeeConsumption[]>('/coffee');
    return response.data;
  },

  /**
   * Get coffee consumption by ID
   */
  getCoffeeById: async (id: number): Promise<CoffeeConsumption> => {
    const response = await api.get<CoffeeConsumption>(`/coffee/${id}`);
    return response.data;
  },

  /**
   * Get today's consumptions
   */
  getTodaysCoffee: async (): Promise<CoffeeConsumption[]> => {
    const response = await api.get<CoffeeConsumption[]>('/coffee/today');
    return response.data;
  },

  /**
   * Get consumption statistics
   */
  getStatistics: async (): Promise<CoffeeStats> => {
    const response = await api.get<CoffeeStats>('/coffee/stats');
    return response.data;
  },

  /**
   * Get consumptions within date range
   */
  getCoffeeByDateRange: async (startDate: string, endDate: string): Promise<CoffeeConsumption[]> => {
    const response = await api.get<CoffeeConsumption[]>('/coffee/range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  /**
   * Delete a consumption record
   */
  deleteCoffee: async (id: number): Promise<void> => {
    await api.delete(`/coffee/${id}`);
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get<{ status: string }>('/health');
    return response.data;
  }
};
