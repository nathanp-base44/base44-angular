import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert, AlertSeverity, AlertStatus } from '../data/monitoring.service';
import { AlertIconComponent, AlertIconName } from './alert-icon.component';

interface SeverityConfig {
  icon: AlertIconName;
  color: string;
  border: string;
  label: string;
}

const SEVERITY: Record<AlertSeverity, SeverityConfig> = {
  critical: { icon: 'alertCircle', color: 'text-red-400', border: 'border-l-red-500', label: 'Critical' },
  warning: { icon: 'alertTriangle', color: 'text-amber-400', border: 'border-l-amber-500', label: 'Warning' },
  info: { icon: 'info', color: 'text-sky-400', border: 'border-l-sky-500', label: 'Info' },
};

const STATUS_BADGE: Record<AlertStatus, string> = {
  active: 'bg-red-500/15 text-red-400',
  acknowledged: 'bg-amber-500/15 text-amber-400',
  resolved: 'bg-slate-600/30 text-slate-400',
};

/** Port of pulseview's AlertFeed. */
@Component({
  selector: 'app-alert-feed',
  standalone: true,
  imports: [AlertIconComponent],
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-900/60">
      <div class="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span class="text-sm font-medium text-slate-300">Active Alerts &amp; Incidents</span>
        <span class="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{{ alerts.length }}</span>
      </div>
      <div class="max-h-[460px] overflow-y-auto">
        @if (alerts.length === 0) {
          <div class="px-4 py-8 text-center text-sm text-slate-500">No alerts</div>
        }
        @for (a of alerts; track a.id) {
          <button
            type="button"
            (click)="select.emit(a)"
            class="flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition hover:bg-slate-800/40"
            [class]="rowClass(a)"
          >
            <app-alert-icon [name]="severity(a).icon" class="mt-0.5 h-4 w-4" [class]="severity(a).color" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <span class="truncate text-sm font-medium text-slate-200">{{ a.title }}</span>
                <app-alert-icon name="chevronRight" class="h-3.5 w-3.5 text-slate-600" />
              </div>
              <div class="mt-0.5 truncate text-xs text-slate-500">{{ a.server_name }} · {{ a.source }}</div>
              <div class="mt-1.5 flex items-center gap-2">
                <span class="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase" [class]="statusBadge(a.status)">
                  {{ a.status }}
                </span>
                <span class="text-[10px] font-medium uppercase" [class]="severity(a).color">{{ severity(a).label }}</span>
              </div>
            </div>
          </button>
        }
      </div>
    </div>
  `,
})
export class AlertFeedComponent {
  @Input({ required: true }) alerts: Alert[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<Alert>();

  severity(a: Alert): SeverityConfig {
    return SEVERITY[a.severity] ?? SEVERITY.info;
  }

  rowClass(a: Alert): string {
    return this.severity(a).border + (this.selectedId === a.id ? ' bg-slate-800/60' : '');
  }

  statusBadge(status: AlertStatus): string {
    return STATUS_BADGE[status];
  }
}
