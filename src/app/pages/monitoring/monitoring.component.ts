import { Component, computed, inject, signal } from '@angular/core';
import { Alert, AlertStatus, MonitoringService } from '../../data/monitoring.service';
import { MetricCardComponent } from '../../dashboard/metric-card.component';
import { CpuChartComponent } from '../../dashboard/cpu-chart.component';
import { ServerTableComponent } from '../../dashboard/server-table.component';
import { AlertFeedComponent } from '../../dashboard/alert-feed.component';
import { AlertDetailComponent } from '../../dashboard/alert-detail.component';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [MetricCardComponent, CpuChartComponent, ServerTableComponent, AlertFeedComponent, AlertDetailComponent],
  templateUrl: './monitoring.component.html',
})
export class MonitoringComponent {
  private monitoring = inject(MonitoringService);

  readonly servers = this.monitoring.getServers();
  readonly cpuSamples = this.monitoring.getCpuSamples();
  readonly memorySamples = this.monitoring.getMemorySamples();
  readonly alerts = this.monitoring.alerts;

  readonly selectedId = signal<string | null>(null);
  readonly selectedAlert = computed(() => this.alerts().find((a) => a.id === this.selectedId()) ?? null);

  readonly kpis = computed(() => {
    const alerts = this.alerts();
    const healthy = this.servers.filter((s) => s.status === 'healthy').length;
    const avgCpu = this.servers.reduce((s, x) => s + x.cpu, 0) / this.servers.length;
    const active = alerts.filter((a) => a.status === 'active').length;
    const critical = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;
    return [
      { label: 'Servers Online', value: `${healthy}/${this.servers.length}`, sub: 'Healthy nodes', accent: 'green' as const },
      { label: 'Avg CPU', value: avgCpu.toFixed(0), unit: '%', sub: 'Fleet average', accent: avgCpu > 65 ? ('amber' as const) : ('sky' as const) },
      { label: 'Active Alerts', value: String(active), sub: 'Awaiting acknowledgement', accent: active > 0 ? ('red' as const) : ('green' as const) },
      { label: 'Critical Open', value: String(critical), sub: 'Unresolved critical', accent: 'violet' as const },
    ];
  });

  onSelect(alert: Alert): void {
    this.selectedId.set(alert.id);
  }

  onClose(): void {
    this.selectedId.set(null);
  }

  onUpdate(e: { id: string; status: AlertStatus }): void {
    this.monitoring.updateAlertStatus(e.id, e.status);
  }
}
