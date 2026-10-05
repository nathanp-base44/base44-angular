import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AnalyticsService, Order } from '../../data/analytics.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { RevenueChartComponent } from '../../dashboard/revenue-chart.component';
import { CategoryChartComponent } from '../../dashboard/category-chart.component';
import { StatusChartComponent } from '../../dashboard/status-chart.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CurrencyPipe, StatCardComponent, RevenueChartComponent, CategoryChartComponent, StatusChartComponent],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  private readonly api = inject(AnalyticsService);
  private readonly orders = signal<Order[]>([]);
  private readonly monthly = this.api.getMonthlyRevenue();

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  readonly ytdRevenue = computed(() => this.monthly.reduce((sum, m) => sum + m.revenue, 0));
  readonly ytdOrders = computed(() => this.monthly.reduce((sum, m) => sum + m.orders, 0));
  readonly avgOrderValue = computed(() => {
    const orders = this.orders();
    if (!orders.length) return 0;
    return Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length);
  });

  readonly topCustomers = computed(() => {
    const byCustomer = new Map<string, number>();
    for (const o of this.orders()) {
      byCustomer.set(o.customer, (byCustomer.get(o.customer) ?? 0) + o.amount);
    }
    return Array.from(byCustomer.entries())
      .map(([customer, total]) => ({ customer, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  });
}
