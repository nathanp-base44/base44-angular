import { Component, inject } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { AnalyticsService } from '../data/analytics.service';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  host: { style: 'display: block; height: 100%' },
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full flex flex-col">
      <div class="mb-4">
        <h2 class="text-sm font-semibold text-slate-900">Sales by category</h2>
        <p class="text-xs text-slate-500">Share of revenue, year to date</p>
      </div>
      <apx-chart
        [series]="options.series!"
        [chart]="options.chart!"
        [labels]="options.labels!"
        [colors]="options.colors!"
        [dataLabels]="options.dataLabels!"
        [legend]="options.legend!"
        [plotOptions]="options.plotOptions!"
        [stroke]="options.stroke!"
      />
    </div>
  `,
})
export class CategoryChartComponent {
  private data = inject(AnalyticsService).getCategoryShare();

  options: ApexOptions = {
    series: this.data.map((d) => d.value),
    labels: this.data.map((d) => d.category),
    chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
    colors: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: { show: true, label: 'Total', formatter: () => '100%' },
          },
        },
      },
    },
  };
}
