import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AnalyticsService, Order } from '../data/analytics.service';

export interface CustomerSummary {
  customer: string;
  orders: number;
  totalSpent: number;
  avgOrder: number;
  lastOrder: string;
}

type SortKey = keyof CustomerSummary;

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './customers-table.component.html',
})
export class CustomersTableComponent {
  private readonly api = inject(AnalyticsService);

  readonly columns: { key: SortKey; label: string; align?: 'right' }[] = [
    { key: 'customer', label: 'Customer' },
    { key: 'orders', label: 'Orders', align: 'right' },
    { key: 'totalSpent', label: 'Total spent', align: 'right' },
    { key: 'avgOrder', label: 'Avg. order', align: 'right' },
    { key: 'lastOrder', label: 'Last order' },
  ];

  readonly pageSize = 10;
  readonly query = signal('');
  readonly sortKey = signal<SortKey>('totalSpent');
  readonly sortDir = signal<'asc' | 'desc'>('desc');
  readonly page = signal(1);
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  readonly customers = computed<CustomerSummary[]>(() => {
    const byCustomer = new Map<string, Order[]>();
    for (const order of this.orders()) {
      const list = byCustomer.get(order.customer) ?? [];
      list.push(order);
      byCustomer.set(order.customer, list);
    }
    return Array.from(byCustomer.entries()).map(([customer, rows]) => {
      const totalSpent = rows.reduce((sum, o) => sum + o.amount, 0);
      const lastOrder = rows.reduce((latest, o) => (o.date > latest ? o.date : latest), rows[0].date);
      return {
        customer,
        orders: rows.length,
        totalSpent,
        avgOrder: Math.round(totalSpent / rows.length),
        lastOrder,
      };
    });
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const rows = q ? this.customers().filter((c) => c.customer.toLowerCase().includes(q)) : [...this.customers()];
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
}
