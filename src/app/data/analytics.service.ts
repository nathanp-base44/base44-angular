import { Injectable } from '@angular/core';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategoryShare {
  category: string;
  value: number;
}

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Order {
  id: string;
  customer: string;
  product: string;
  category: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

/**
 * Sample analytics data source. Swap the method bodies for HTTP calls
 * to plug in a real backend without touching the components.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getMonthlyRevenue(): MonthlyRevenue[] {
    return [
      { month: 'Jan', revenue: 18400, orders: 210 },
      { month: 'Feb', revenue: 21200, orders: 245 },
      { month: 'Mar', revenue: 19800, orders: 228 },
      { month: 'Apr', revenue: 25600, orders: 290 },
      { month: 'May', revenue: 28900, orders: 322 },
      { month: 'Jun', revenue: 27300, orders: 305 },
      { month: 'Jul', revenue: 31800, orders: 351 },
      { month: 'Aug', revenue: 34500, orders: 384 },
      { month: 'Sep', revenue: 33100, orders: 366 },
    ];
  }

  getCategoryShare(): CategoryShare[] {
    return [
      { category: 'Software', value: 42 },
      { category: 'Hardware', value: 23 },
      { category: 'Services', value: 20 },
      { category: 'Training', value: 15 },
    ];
  }

  getOrders(): Order[] {
    const customers = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Co', 'Stark Industries', 'Wayne Enterprises', 'Hooli', 'Vandelay Imports'];
    const products: { name: string; category: string; price: number }[] = [
      { name: 'Pro License', category: 'Software', price: 299 },
      { name: 'Team Seat', category: 'Software', price: 49 },
      { name: 'Edge Gateway', category: 'Hardware', price: 1249 },
      { name: 'Sensor Kit', category: 'Hardware', price: 389 },
      { name: 'Onboarding', category: 'Services', price: 1500 },
      { name: 'Support Plan', category: 'Services', price: 199 },
      { name: 'Workshop', category: 'Training', price: 850 },
    ];
    const statuses: OrderStatus[] = ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded'];

    return Array.from({ length: 48 }, (_, i) => {
      const product = products[(i * 3) % products.length];
      const qty = (i % 4) + 1;
      const date = new Date(2026, 8, 22 - i);
      return {
        id: `ORD-${(1048 - i).toString().padStart(4, '0')}`,
        customer: customers[(i * 5) % customers.length],
        product: product.name,
        category: product.category,
        amount: product.price * qty,
        status: statuses[(i * 7) % statuses.length],
        date: date.toISOString().slice(0, 10),
      };
    });
  }
}
