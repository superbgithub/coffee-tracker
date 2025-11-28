// ============================================
// PRESENTATION LAYER - Coffee Chart Component
// ============================================

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CoffeeStats } from '../types/coffee.types';
import '../App.css';

interface CoffeeChartProps {
  stats: CoffeeStats | null;
}

export const CoffeeChart: React.FC<CoffeeChartProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  // Prepare data for chart
  const typeData = Object.entries(stats.countByType).map(([type, count]) => ({
    name: type,
    count: count
  }));

  const sizeData = Object.entries(stats.countBySize).map(([size, count]) => ({
    name: size,
    count: count
  }));

  if (typeData.length === 0) {
    return null;
  }

  return (
    <div className="charts-container">
      <div className="card">
        <h2>📊 Coffee Types Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>📏 Size Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sizeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
