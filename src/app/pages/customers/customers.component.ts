import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AnalyticsService, Order } from '../../data/analytics.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { CustomersTableComponent } from '../../customers/customers-table.component';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CurrencyPipe, StatCardComponent, CustomersTableComponent],
  templateUrl: './customers.component.html',
})
export class CustomersComponent {
  private readonly api = inject(AnalyticsService);
  private readonly orders = signal<Order[]>([]);

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  readonly totalCustomers = computed(() => new Set(this.orders().map((o) => o.customer)).size);
  readonly totalRevenue = computed(() => this.orders().reduce((sum, o) => sum + o.amount, 0));
  readonly avgRevenuePerCustomer = computed(() => {
    const count = this.totalCustomers();
    return count ? Math.round(this.totalRevenue() / count) : 0;
  });
}
