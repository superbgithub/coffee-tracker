// ============================================
// TYPE DEFINITIONS - Data Models Layer
// ============================================

export interface CoffeeConsumption {
  id?: number;
  coffeeType: string;
  size: 'Small' | 'Medium' | 'Large';
  caffeineMg: number;
  consumedAt: string;
  createdAt?: string;
}

export interface CoffeeStats {
  totalConsumptions: number;
  totalCaffeineMg: number;
  averageCaffeinePerConsumption: number;
  todayCount: number;
  todayCaffeineMg: number;
  countByType: Record<string, number>;
  countBySize: Record<string, number>;
}

export interface CoffeeFormData {
  coffeeType: string;
  size: 'Small' | 'Medium' | 'Large';
  caffeineMg: number;
}

export const COFFEE_TYPES = [
  'Espresso',
  'Americano',
  'Latte',
  'Cappuccino',
  'Mocha',
  'Macchiato',
  'Flat White',
  'Cold Brew'
] as const;

export const COFFEE_SIZES = ['Small', 'Medium', 'Large'] as const;

export const CAFFEINE_PRESETS: Record<string, number> = {
  'Espresso': 80,
  'Americano': 95,
  'Latte': 75,
  'Cappuccino': 75,
  'Mocha': 95,
  'Macchiato': 85,
  'Flat White': 130,
  'Cold Brew': 200
};
