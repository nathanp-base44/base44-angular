import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AnalyticsService, Order } from '../data/analytics.service';

type SortKey = keyof Order;

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent {
  private readonly api = inject(AnalyticsService);

  readonly columns: { key: SortKey; label: string; align?: 'right' }[] = [
    { key: 'id', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount', align: 'right' },
  ];

  readonly pageSize = 10;
  readonly query = signal('');
  readonly sortKey = signal<SortKey>('date');
  readonly sortDir = signal<'asc' | 'desc'>('desc');
  readonly page = signal(1);
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const rows = q
      ? this.orders().filter((o) => Object.values(o).some((v) => String(v).toLowerCase().includes(q)))
      : [...this.orders()];
    return rows.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * dir);
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  search(value: string) {
    this.query.set(value);
    this.page.set(1);
  }

  sortBy(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.page.set(1);
  }

  goTo(page: number) {
    this.page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  statusClass(status: Order['status']): string {
    return {
      Paid: 'bg-emerald-50 text-emerald-700',
      Pending: 'bg-amber-50 text-amber-700',
      Refunded: 'bg-rose-50 text-rose-700',
    }[status];
  }
}
