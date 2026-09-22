import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../data/analytics.service';
import { MetricAccent, MetricCardComponent } from './metric-card.component';

interface Metric {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent: MetricAccent;
  icon: string;
}

const svg = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">${paths}</svg>`;

const ICONS = {
  dollar: svg('<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  cart: svg('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>'),
  receipt: svg('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>'),
  tag: svg('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'),
};

@Component({
  selector: 'app-metrics-header',
  standalone: true,
  imports: [MetricCardComponent],
  template: `
    <div class="grid gap-6 grid-cols-2 lg:grid-cols-4">
      @for (m of metrics; track m.label) {
        <app-metric-card
          [label]="m.label"
          [value]="m.value"
          [unit]="m.unit"
          [sub]="m.sub"
          [accent]="m.accent"
          [icon]="m.icon"
        />
      }
    </div>
  `,
})
export class MetricsHeaderComponent {
  private analytics = inject(AnalyticsService);

  metrics: Metric[] = this.buildMetrics();

  private buildMetrics(): Metric[] {
    const monthly = this.analytics.getMonthlyRevenue();
    const categories = this.analytics.getCategoryShare();

    const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
    const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);
    const avgOrder = totalRevenue / totalOrders;
    const top = [...categories].sort((a, b) => b.value - a.value)[0];
    const last = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    const momChange = ((last.revenue - prev.revenue) / prev.revenue) * 100;

    return [
      {
        label: 'Total Revenue',
        value: '$' + (totalRevenue / 1000).toFixed(1) + 'k',
        unit: 'YTD',
        sub: `${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}% vs last month`,
        accent: momChange >= 0 ? 'green' : 'red',
        icon: ICONS.dollar,
      },
      {
        label: 'Total Orders',
        value: totalOrders.toLocaleString('en-US'),
        unit: 'orders',
        sub: `${last.orders} in ${last.month}`,
        accent: 'sky',
        icon: ICONS.cart,
      },
      {
        label: 'Avg Order Value',
        value: '$' + avgOrder.toFixed(0),
        unit: 'per order',
        sub: 'Across all categories',
        accent: 'violet',
        icon: ICONS.receipt,
      },
      {
        label: 'Top Category',
        value: top.category,
        sub: `${top.value}% share of revenue`,
        accent: 'amber',
        icon: ICONS.tag,
      },
    ];
  }
}
