import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AnalyticsService, Order } from '../../data/analytics.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { OrdersTableComponent } from '../../dashboard/orders-table.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe, StatCardComponent, OrdersTableComponent],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private readonly api = inject(AnalyticsService);
  private readonly orders = signal<Order[]>([]);

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  readonly totalRevenue = computed(() => this.orders().reduce((sum, o) => sum + o.amount, 0));
  readonly totalOrders = computed(() => this.orders().length);
  readonly pendingCount = computed(() => this.orders().filter((o) => o.status === 'Pending').length);
  readonly refundedCount = computed(() => this.orders().filter((o) => o.status === 'Refunded').length);
}
