import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { AnalyticsService, CustomerNote, Order } from '../../data/analytics.service';

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
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
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
              <th class="px-4 py-3">Latest note</th>
            </tr>
          </thead>
          <tbody>
            @for (c of customers$ | async; track c.name) {
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-4 py-3 font-medium text-slate-900">{{ c.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.orders }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.totalSpent | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ c.lastOrder }}</td>
                <td class="px-4 py-3 text-slate-600">
                  @if (notes()[c.name]; as note) {
                    <div class="text-slate-900">{{ note.body }}</div>
                    <div class="text-xs text-slate-400">{{ note.created_at | date: 'MMM d, y, h:mm a' }}</div>
                  } @else {
                    <div class="text-slate-400">No notes yet</div>
                  }
                  <form class="mt-2 flex gap-2" (submit)="addNote($event, c.name, noteInput)">
                    <input
                      #noteInput
                      type="text"
                      maxlength="280"
                      placeholder="Add a note…"
                      [attr.aria-label]="'Note for ' + c.name"
                      class="w-full min-w-40 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      [disabled]="saving() === c.name"
                      class="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-6 text-center text-slate-400">No customers yet.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CustomersComponent {
  private readonly analytics = inject(AnalyticsService);

  customers$ = this.analytics.getOrders().pipe(map(summarize));
  notes = signal<Record<string, CustomerNote>>({});
  saving = signal<string | null>(null);

  constructor() {
    this.analytics.getLatestCustomerNotes().subscribe((list) => {
      this.notes.set(Object.fromEntries(list.map((n) => [n.customer, n])));
    });
  }

  addNote(event: Event, customer: string, input: HTMLInputElement): void {
    event.preventDefault();
    const body = input.value.trim();
    if (!body) return;
    this.saving.set(customer);
    this.analytics.addCustomerNote(customer, body).subscribe({
      next: (note) => {
        this.notes.update((n) => ({ ...n, [customer]: note }));
        input.value = '';
        this.saving.set(null);
      },
      error: () => this.saving.set(null),
    });
  }
}
