import { Component, computed, inject, signal } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { AnalyticsService, Order } from '../data/analytics.service';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4">
        <h2 class="text-sm font-semibold text-slate-900">Orders by status</h2>
        <p class="text-xs text-slate-500">Share of order volume</p>
      </div>
      <apx-chart
        [series]="options().series!"
        [chart]="options().chart!"
        [labels]="options().labels!"
        [colors]="options().colors!"
        [dataLabels]="options().dataLabels!"
        [legend]="options().legend!"
        [stroke]="options().stroke!"
      />
    </div>
  `,
})
export class StatusChartComponent {
  private readonly api = inject(AnalyticsService);
  private readonly orders = signal<Order[]>([]);

  constructor() {
    this.api.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  private readonly counts = computed(() => {
    const tally: Record<string, number> = { Paid: 0, Pending: 0, Refunded: 0 };
    for (const o of this.orders()) tally[o.status] = (tally[o.status] ?? 0) + 1;
    return tally;
  });

  readonly options = computed<ApexOptions>(() => ({
    series: Object.values(this.counts()),
    labels: Object.keys(this.counts()),
    chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
    colors: ['#10b981', '#f59e0b', '#f43f5e'],
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { position: 'bottom' },
  }));
}
