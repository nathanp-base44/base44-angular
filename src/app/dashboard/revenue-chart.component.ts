import { Component, inject } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { AnalyticsService } from '../data/analytics.service';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  host: { style: 'display: block; height: 100%' },
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full flex flex-col">
      <div class="mb-4">
        <h2 class="text-sm font-semibold text-slate-900">Revenue over time</h2>
        <p class="text-xs text-slate-500">Monthly revenue and order volume, 2026</p>
      </div>
      <apx-chart
        [series]="options.series!"
        [chart]="options.chart!"
        [xaxis]="options.xaxis!"
        [yaxis]="options.yaxis!"
        [stroke]="options.stroke!"
        [colors]="options.colors!"
        [dataLabels]="options.dataLabels!"
        [grid]="options.grid!"
        [legend]="options.legend!"
        [tooltip]="options.tooltip!"
      />
    </div>
  `,
})
export class RevenueChartComponent {
  private data = inject(AnalyticsService).getMonthlyRevenue();

  options: ApexOptions = {
    series: [
      { name: 'Revenue', type: 'area', data: this.data.map((d) => d.revenue) },
      { name: 'Orders', type: 'line', data: this.data.map((d) => d.orders) },
    ],
    chart: { type: 'line', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
    xaxis: { categories: this.data.map((d) => d.month), axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: [
      { labels: { formatter: (v: number) => '$' + (v / 1000).toFixed(0) + 'k' } },
      { opposite: true, labels: { formatter: (v: number) => v.toFixed(0) } },
    ],
    stroke: { curve: 'smooth', width: [2, 3] },
    colors: ['#4f46e5', '#0ea5e9'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right' },
    tooltip: { shared: true },
  };
}
