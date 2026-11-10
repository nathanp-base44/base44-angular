import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

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

export interface CustomerNote {
  id: number;
  customer: string;
  body: string;
  created_at: string;
}

/**
 * Analytics data source. Orders are fetched from the Postgres-backed API;
 * the chart helpers still return static sample data.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders').pipe(shareReplay(1));
  }

  getLatestCustomerNotes(): Observable<CustomerNote[]> {
    return this.http.get<CustomerNote[]>('/api/customer-notes/latest');
  }

  addCustomerNote(customer: string, body: string): Observable<CustomerNote> {
    return this.http.post<CustomerNote>('/api/customer-notes', { customer, body });
  }

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
}
