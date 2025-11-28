// ============================================
// PRESENTATION LAYER - Coffee Form Component
// ============================================

import React, { useState } from 'react';
import { CoffeeFormData, COFFEE_TYPES, COFFEE_SIZES, CAFFEINE_PRESETS } from '../types/coffee.types';
import '../App.css';

interface CoffeeFormProps {
  onSubmit: (data: CoffeeFormData) => Promise<boolean>;
  loading: boolean;
}

export const CoffeeForm: React.FC<CoffeeFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CoffeeFormData>({
    coffeeType: 'Espresso',
    size: 'Medium',
    caffeineMg: CAFFEINE_PRESETS['Espresso']
  });

  const handleTypeChange = (coffeeType: string) => {
    setFormData({
      ...formData,
      coffeeType,
      caffeineMg: CAFFEINE_PRESETS[coffeeType] || 80
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      // Reset form after successful submission
      setFormData({
        coffeeType: 'Espresso',
        size: 'Medium',
        caffeineMg: CAFFEINE_PRESETS['Espresso']
      });
    }
  };

  return (
    <div className="card">
      <h2>☕ Log Coffee Consumption</h2>
      <form onSubmit={handleSubmit} className="coffee-form">
        <div className="form-group">
          <label htmlFor="coffeeType">Coffee Type</label>
          <select
            id="coffeeType"
            value={formData.coffeeType}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={loading}
          >
            {COFFEE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="size">Size</label>
          <select
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
            disabled={loading}
          >
            {COFFEE_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="caffeine">Caffeine (mg)</label>
          <input
            id="caffeine"
            type="number"
            min="0"
            max="500"
            value={formData.caffeineMg}
            onChange={(e) => setFormData({ ...formData, caffeineMg: parseInt(e.target.value) || 0 })}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Logging...' : '➕ Log Coffee'}
        </button>
      </form>
    </div>
  );
};
