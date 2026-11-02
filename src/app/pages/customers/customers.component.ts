import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { map } from 'rxjs';
import { AnalyticsService, Order } from '../../data/analytics.service';

interface CustomerSummary {
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

function summarize(orders: Order[]): CustomerSummary[] {
  const byName = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const c = byName.get(o.customer) ?? { name: o.customer, orders: 0, totalSpent: 0, lastOrder: o.date };
    c.orders++;
    if (o.status !== 'Refunded') c.totalSpent += o.amount;
    if (o.date > c.lastOrder) c.lastOrder = o.date;
    byName.set(o.customer, c);
  }
  return [...byName.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <div class="p-6">
      <h1 class="mb-4 text-xl font-semibold text-slate-900">Customers</h1>
      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Orders</th>
              <th class="px-4 py-3">Total spent</th>
              <th class="px-4 py-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            @for (c of customers$ | async; track c.name) {
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-4 py-3 font-medium text-slate-900">{{ c.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.orders }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.totalSpent | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.lastOrder }}</td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="px-4 py-6 text-center text-slate-400">No customers yet.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CustomersComponent {
  customers$ = inject(AnalyticsService).getOrders().pipe(map(summarize));
}
