import { Component, Input } from '@angular/core';
import { Server, ServerStatus } from '../data/monitoring.service';

const STATUS_STYLE: Record<ServerStatus, string> = {
  healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

/** Port of pulseview's UsageBar helper. */
@Component({
  selector: 'app-usage-bar',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      <div class="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700">
        <div class="h-full rounded-full" [class]="barColor" [style.width.%]="Math.min(100, value)"></div>
      </div>
      <span class="w-9 text-xs text-slate-400">{{ Math.round(value) }}%</span>
    </div>
  `,
})
export class UsageBarComponent {
  @Input({ required: true }) value = 0;
  readonly Math = Math;

  get barColor(): string {
    return this.value > 85 ? 'bg-red-500' : this.value > 65 ? 'bg-amber-500' : 'bg-emerald-500';
  }
}

/** Port of pulseview's ServerTable. */
@Component({
  selector: 'app-server-table',
  standalone: true,
  imports: [UsageBarComponent],
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-900/60">
      <div class="border-b border-slate-800 px-4 py-3 text-sm font-medium text-slate-300">Servers</div>
      <div class="overflow-x-auto">
        <table class="w-full whitespace-nowrap text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wider text-slate-500">
              <th class="px-4 py-2 font-medium">Name</th>
              <th class="px-4 py-2 font-medium">Region</th>
              <th class="px-4 py-2 font-medium">Status</th>
              <th class="px-4 py-2 font-medium">CPU</th>
              <th class="px-4 py-2 font-medium">Mem</th>
              <th class="px-4 py-2 font-medium">Disk</th>
              <th class="px-4 py-2 font-medium">Uptime</th>
            </tr>
          </thead>
          <tbody>
            @for (s of servers; track s.id) {
              <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                <td class="px-4 py-2 font-medium text-slate-200">{{ s.name }}</td>
                <td class="px-4 py-2 text-slate-400">{{ s.region }}</td>
                <td class="px-4 py-2">
                  <span class="inline-block rounded border px-2 py-0.5 text-xs font-medium" [class]="statusClass(s.status)">
                    {{ s.status }}
                  </span>
                </td>
                <td class="px-4 py-2"><app-usage-bar [value]="s.cpu" /></td>
                <td class="px-4 py-2"><app-usage-bar [value]="s.memory" /></td>
                <td class="px-4 py-2"><app-usage-bar [value]="s.disk" /></td>
                <td class="px-4 py-2 text-slate-400">{{ Math.round(s.uptime_hours) }}h</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ServerTableComponent {
  @Input({ required: true }) servers: Server[] = [];
  readonly Math = Math;

  statusClass(status: ServerStatus): string {
    return STATUS_STYLE[status];
  }
}
