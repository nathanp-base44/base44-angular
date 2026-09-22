import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

/** Port of pulseview's CpuChart: compact dark area chart with 0–100% y-axis. */
@Component({
  selector: 'app-cpu-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div class="mb-2 text-sm font-medium text-slate-300">{{ title }}</div>
      <apx-chart
        [series]="options.series!"
        [chart]="options.chart!"
        [xaxis]="options.xaxis!"
        [yaxis]="options.yaxis!"
        [stroke]="options.stroke!"
        [colors]="options.colors!"
        [fill]="options.fill!"
        [dataLabels]="options.dataLabels!"
        [grid]="options.grid!"
        [tooltip]="options.tooltip!"
      />
    </div>
  `,
})
export class CpuChartComponent implements OnChanges {
  @Input({ required: true }) data: number[] = [];
  @Input() title = 'CPU Usage (%)';
  @Input() color = '#38bdf8';
  @Input() seriesName = 'CPU';

  options: ApexOptions = this.build();

  ngOnChanges(): void {
    this.options = this.build();
  }

  private build(): ApexOptions {
    return {
      series: [{ name: this.seriesName, data: this.data }],
      chart: {
        type: 'area',
        height: 180,
        toolbar: { show: false },
        sparkline: { enabled: false },
        fontFamily: 'inherit',
        background: 'transparent',
        animations: { enabled: false },
      },
      colors: [this.color],
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
      },
      dataLabels: { enabled: false },
      xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: { style: { colors: '#64748b', fontSize: '10px' } },
      },
      grid: { borderColor: '#1e293b', strokeDashArray: 3, padding: { left: 0, right: 0 } },
      tooltip: {
        theme: 'dark',
        x: { show: false },
        y: { formatter: (v: number) => `${v}%` },
      },
    };
  }
}
