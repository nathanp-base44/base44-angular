import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AnalyticsService, Order } from '../../data/analytics.service';

interface CustomerSummary {
  name: string;
  orders: number;
  totalSpent: number;
  amount: number;
  lastOrder: string;
}

function summarize(orders: Order[]): CustomerSummary[] {
  const byName = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const c = byName.get(o.customer) ?? { name: o.customer, orders: 0, totalSpent: 0, amount: 0, lastOrder: o.date };
    c.orders++;
    c.amount += o.amount;
    if (o.status !== 'Refunded') c.totalSpent += o.amount;
    if (o.date > c.lastOrder) c.lastOrder = o.date;
    byName.set(o.customer, c);
  }
  return [...byName.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="p-6">
      <h1 class="mb-4 text-xl font-semibold text-slate-900">Customers</h1>
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <input type="search" placeholder="Search customers…" [value]="search()" (input)="search.set($any($event.target).value)"
          class="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        <select (change)="minOrders.set(+$any($event.target).value)" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="0">Any orders</option><option value="2">2+ orders</option><option value="5">5+ orders</option>
        </select>
        <select (change)="minSpent.set(+$any($event.target).value)" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="0">Any spend</option><option value="500">$500+</option><option value="1000">$1,000+</option><option value="5000">$5,000+</option>
        </select>
        <span class="text-sm text-slate-500">{{ filtered().length }} of {{ customers().length }}</span>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Orders</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Total spent</th>
              <th class="px-4 py-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered(); track c.name) {
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-4 py-3 font-medium text-slate-900">{{ c.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.orders }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.amount | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.totalSpent | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.lastOrder }}</td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-6 text-center text-slate-400">{{ customers().length ? 'No customers match your filters.' : 'No customers yet.' }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CustomersComponent {
  customers = toSignal(inject(AnalyticsService).getOrders().pipe(map(summarize)), { initialValue: [] });
  search = signal('');
  minOrders = signal(0);
  minSpent = signal(0);
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.customers().filter(
      (c) => c.name.toLowerCase().includes(q) && c.orders >= this.minOrders() && c.totalSpent >= this.minSpent(),
    );
  });
}
