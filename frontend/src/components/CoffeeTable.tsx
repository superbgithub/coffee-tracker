// ============================================
// PRESENTATION LAYER - Coffee Table Component
// ============================================

import React from 'react';
import { CoffeeConsumption } from '../types/coffee.types';
import { formatDateTime, formatRelativeTime, getSizeEmoji, getCaffeineColor } from '../utils/formatters';
import '../App.css';

interface CoffeeTableProps {
  data: CoffeeConsumption[];
  loading: boolean;
  onDelete?: (id: number) => void;
}

export const CoffeeTable: React.FC<CoffeeTableProps> = ({ data, loading, onDelete }) => {
  if (loading && data.length === 0) {
    return (
      <div className="card">
        <div className="loading">Loading coffee history...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <p className="empty-state">No coffee consumed yet. Start logging! ☕</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📊 Coffee History ({data.length} total)</h2>
      <div className="table-container">
        <table className="coffee-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Size</th>
              <th>Caffeine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coffee) => (
              <tr key={coffee.id}>
                <td>
                  <div className="time-cell">
                    <div className="time-main">{formatDateTime(coffee.consumedAt)}</div>
                    <div className="time-relative">{formatRelativeTime(coffee.consumedAt)}</div>
                  </div>
                </td>
                <td className="type-cell">{coffee.coffeeType}</td>
                <td className="size-cell">
                  {getSizeEmoji(coffee.size)} {coffee.size}
                </td>
                <td>
                  <span 
                    className="caffeine-badge"
                    style={{ backgroundColor: getCaffeineColor(coffee.caffeineMg) }}
                  >
                    {coffee.caffeineMg} mg
                  </span>
                </td>
                <td>
                  {onDelete && coffee.id && (
                    <button
                      onClick={() => onDelete(coffee.id!)}
                      className="btn-delete"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
