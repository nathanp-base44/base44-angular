import { Injectable, signal } from '@angular/core';

export type ServerStatus = 'healthy' | 'warning' | 'critical';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Server {
  id: string;
  name: string;
  region: string;
  status: ServerStatus;
  cpu: number;
  memory: number;
  disk: number;
  uptime_hours: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  server_name: string;
  source: string;
}

/**
 * Sample infrastructure monitoring data source. Swap the method bodies for
 * HTTP calls to plug in a real backend without touching the components.
 */
@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly alertsState = signal<Alert[]>([
    {
      id: 'alr-1',
      title: 'CPU usage above 90%',
      message: 'api-prod-03 has sustained CPU usage above 90% for the last 15 minutes. Autoscaling did not trigger.',
      severity: 'critical',
      status: 'active',
      server_name: 'api-prod-03',
      source: 'Prometheus',
    },
    {
      id: 'alr-2',
      title: 'Disk nearly full',
      message: 'Root volume on db-primary is at 88% capacity. Consider expanding the volume or pruning old WAL segments.',
      severity: 'warning',
      status: 'active',
      server_name: 'db-primary',
      source: 'Node Exporter',
    },
    {
      id: 'alr-3',
      title: 'Elevated 5xx error rate',
      message: 'The edge gateway is returning 5xx responses on 2.3% of requests, above the 1% SLO threshold.',
      severity: 'critical',
      status: 'acknowledged',
      server_name: 'edge-gw-01',
      source: 'Datadog',
    },
    {
      id: 'alr-4',
      title: 'Memory pressure detected',
      message: 'worker-02 memory usage crossed 75%. GC pause times have increased by 40%.',
      severity: 'warning',
      status: 'acknowledged',
      server_name: 'worker-02',
      source: 'Prometheus',
    },
    {
      id: 'alr-5',
      title: 'Certificate expires in 14 days',
      message: 'TLS certificate for api.lumina.io will expire on Oct 6, 2026. Renewal is scheduled via cert-manager.',
      severity: 'info',
      status: 'active',
      server_name: 'edge-gw-01',
      source: 'cert-manager',
    },
    {
      id: 'alr-6',
      title: 'Deployment completed',
      message: 'Release v2.14.0 rolled out successfully to all api-prod nodes.',
      severity: 'info',
      status: 'resolved',
      server_name: 'api-prod-01',
      source: 'ArgoCD',
    },
    {
      id: 'alr-7',
      title: 'Replication lag recovered',
      message: 'db-replica replication lag dropped back below 500ms after a brief spike to 6s.',
      severity: 'warning',
      status: 'resolved',
      server_name: 'db-replica',
      source: 'pg_stat',
    },
  ]);

  /** Read-only view of alerts; updates propagate to all consumers. */
  readonly alerts = this.alertsState.asReadonly();

  getServers(): Server[] {
    return [
      { id: 'srv-1', name: 'api-prod-01', region: 'us-east-1', status: 'healthy', cpu: 42, memory: 58, disk: 51, uptime_hours: 1842 },
      { id: 'srv-2', name: 'api-prod-02', region: 'us-east-1', status: 'healthy', cpu: 38, memory: 61, disk: 49, uptime_hours: 1842 },
      { id: 'srv-3', name: 'api-prod-03', region: 'us-east-1', status: 'critical', cpu: 93, memory: 79, disk: 55, uptime_hours: 312 },
      { id: 'srv-4', name: 'db-primary', region: 'us-east-1', status: 'warning', cpu: 61, memory: 72, disk: 88, uptime_hours: 4210 },
      { id: 'srv-5', name: 'db-replica', region: 'us-west-2', status: 'healthy', cpu: 27, memory: 54, disk: 63, uptime_hours: 4208 },
      { id: 'srv-6', name: 'worker-01', region: 'eu-west-1', status: 'healthy', cpu: 55, memory: 47, disk: 32, uptime_hours: 960 },
      { id: 'srv-7', name: 'worker-02', region: 'eu-west-1', status: 'warning', cpu: 68, memory: 76, disk: 34, uptime_hours: 958 },
      { id: 'srv-8', name: 'edge-gw-01', region: 'global', status: 'warning', cpu: 71, memory: 44, disk: 22, uptime_hours: 2701 },
    ];
  }

  /** Last 40 CPU samples (percent) for the fleet average. */
  getCpuSamples(): number[] {
    return Array.from({ length: 40 }, (_, i) => {
      const base = 45 + Math.sin(i / 4) * 12 + Math.sin(i / 1.7) * 5;
      const spike = i > 30 ? (i - 30) * 3 : 0;
      return Math.round(Math.min(100, Math.max(0, base + spike)));
    });
  }

  /** Last 40 memory samples (percent) for the fleet average. */
  getMemorySamples(): number[] {
    return Array.from({ length: 40 }, (_, i) => Math.round(58 + Math.sin(i / 6) * 6 + (i % 5) * 0.8));
  }

  updateAlertStatus(id: string, status: AlertStatus): void {
    this.alertsState.update((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
  }
}
