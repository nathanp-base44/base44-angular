import { Component, computed, inject, signal } from '@angular/core';
import { AnalyticsService, Order } from '../../data/analytics.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  template: `
    <div class="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Customers</h1>
        <p class="mt-1 text-sm text-slate-600">Customers from your order history.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        @if (loading()) {
          <p class="p-5 text-sm text-slate-600" role="status">Loading customers…</p>
        } @else if (error()) {
          <p class="p-5 text-sm text-rose-700" role="alert">Unable to load customers. Please reload to try again.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" class="px-5 py-3 font-medium">Customer</th>
                  <th scope="col" class="px-5 py-3 text-right font-medium">Orders</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (customer of customers(); track customer.name) {
                  <tr class="hover:bg-slate-50">
                    <td class="px-5 py-3 font-medium text-slate-900">{{ customer.name }}</td>
                    <td class="px-5 py-3 text-right text-slate-700">{{ customer.orders }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="2" class="px-5 py-10 text-center text-slate-600">No customers in your order history yet.</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class CustomersComponent {
  readonly loading = signal(true);
  readonly error = signal(false);
  private readonly orders = signal<Order[]>([]);
  readonly customers = computed(() => {
    const counts = new Map<string, number>();
    for (const order of this.orders()) {
      counts.set(order.customer, (counts.get(order.customer) ?? 0) + 1);
    }
    return Array.from(counts, ([name, orders]) => ({ name, orders }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  constructor() {
    inject(AnalyticsService).getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
