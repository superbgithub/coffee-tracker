// ============================================
// PRESENTATION LAYER - Statistics Cards Component
// ============================================

import React from 'react';
import { CoffeeStats } from '../types/coffee.types';
import { formatNumber } from '../utils/formatters';
import '../App.css';

interface StatsCardsProps {
  stats: CoffeeStats | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) {
    return <div className="loading">Loading statistics...</div>;
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📈</div>
        <div className="stat-value">{formatNumber(stats.totalConsumptions)}</div>
        <div className="stat-label">Total Coffees</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-value">{formatNumber(stats.totalCaffeineMg)}</div>
        <div className="stat-label">Total Caffeine (mg)</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">☕</div>
        <div className="stat-value">{formatNumber(stats.todayCount)}</div>
        <div className="stat-label">Today's Count</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔥</div>
        <div className="stat-value">{formatNumber(stats.todayCaffeineMg)}</div>
        <div className="stat-label">Today's Caffeine (mg)</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{formatNumber(stats.averageCaffeinePerConsumption)}</div>
        <div className="stat-label">Avg Caffeine/Cup (mg)</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-value">
          {Object.entries(stats.countByType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
        </div>
        <div className="stat-label">Favorite Type</div>
      </div>
    </div>
  );
};
