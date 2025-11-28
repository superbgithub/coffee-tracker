// ============================================
// PAGE LAYER - Dashboard Page (Orchestrator)
// ============================================

import React from 'react';
import { useCoffeeData } from '../hooks/useCoffeeData';
import { CoffeeForm } from '../components/CoffeeForm';
import { CoffeeTable } from '../components/CoffeeTable';
import { StatsCards } from '../components/StatsCards';
import { CoffeeChart } from '../components/CoffeeChart';

export const DashboardPage: React.FC = () => {
  const { coffeeList, stats, loading, error, logCoffee, deleteCoffee } = useCoffeeData();

  return (
    <div className="dashboard">
      <header className="header">
        <h1>☕ Coffee Tracker Dashboard</h1>
        <p>Track your daily coffee consumption and caffeine intake</p>
      </header>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="form-section">
          <CoffeeForm onSubmit={logCoffee} loading={loading} />
        </div>

        <div className="stats-section">
          <StatsCards stats={stats} />
        </div>
      </div>

      <CoffeeChart stats={stats} />

      <CoffeeTable 
        data={coffeeList} 
        loading={loading} 
        onDelete={deleteCoffee}
      />
    </div>
  );
};
