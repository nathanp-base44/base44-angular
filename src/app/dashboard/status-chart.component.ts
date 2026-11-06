import { Component, computed, inject, signal } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { AnalyticsService, Order, OrderStatus } from '../data/analytics.service';

const STATUSES: OrderStatus[] = ['Paid', 'Pending', 'Refunded'];

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4">
        <h2 class="text-sm font-semibold text-slate-900">Orders by payment status</h2>
        <p class="text-xs text-slate-600">Share of orders: paid, pending and refunded</p>
      </div>
      @if (loading()) {
        <p class="py-10 text-center text-sm text-slate-600" role="status">Loading…</p>
      } @else {
        <div class="grid items-center gap-6 md:grid-cols-2">
          <apx-chart
            [series]="options().series!"
            [chart]="options().chart!"
            [labels]="options().labels!"
            [colors]="options().colors!"
            [dataLabels]="options().dataLabels!"
            [legend]="options().legend!"
            [plotOptions]="options().plotOptions!"
            [stroke]="options().stroke!"
          />
          <ul class="divide-y divide-slate-100 text-sm">
            @for (row of breakdown(); track row.status) {
              <li class="flex items-center justify-between py-3">
                <span class="flex items-center gap-2 text-slate-900">
                  <span class="h-3 w-3 rounded-full" [style.background]="row.color"></span>{{ row.status }}
                </span>
                <span class="text-slate-700">{{ row.count }} orders · {{ row.percent }}%</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class StatusChartComponent {
  readonly loading = signal(true);
  private readonly orders = signal<Order[]>([]);

  private readonly colors = ['#10b981', '#f59e0b', '#e11d48'];

  readonly breakdown = computed(() => {
    const total = this.orders().length || 1;
    return STATUSES.map((status, i) => {
      const count = this.orders().filter((o) => o.status === status).length;
      return { status, count, percent: Math.round((count / total) * 100), color: this.colors[i] };
    });
  });

  readonly options = computed<ApexOptions>(() => {
    const orders = this.orders();
    return {
      series: STATUSES.map((s) => orders.filter((o) => o.status === s).length),
      labels: STATUSES,
      chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
      colors: ['#10b981', '#f59e0b', '#e11d48'],
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      legend: { position: 'bottom' },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: { show: true, total: { show: true, label: 'Orders', formatter: () => String(orders.length) } },
          },
        },
      },
    };
  });

  constructor() {
    inject(AnalyticsService)
      .getOrders()
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
