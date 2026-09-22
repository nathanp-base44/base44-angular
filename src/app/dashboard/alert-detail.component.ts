import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert, AlertStatus } from '../data/monitoring.service';
import { AlertIconComponent } from './alert-icon.component';

/** Port of pulseview's AlertDetail slide-over. Render only when an alert is selected. */
@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [AlertIconComponent],
  template: `
    <div class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/50" (click)="close.emit()" data-testid="alert-detail-backdrop"></div>
      <div class="relative h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-900 shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 class="text-sm font-semibold text-slate-200">Alert Details</h2>
          <button type="button" (click)="close.emit()" class="text-slate-400 hover:text-slate-200" aria-label="Close">
            <app-alert-icon name="x" class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-5 px-5 py-5">
          <div>
            <div class="text-xs uppercase tracking-wider text-slate-500">Title</div>
            <div class="mt-1 text-base font-medium text-slate-100">{{ alert.title }}</div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            @for (f of fields; track f.label) {
              <div>
                <div class="text-xs uppercase tracking-wider text-slate-500">{{ f.label }}</div>
                <div class="mt-1 text-sm capitalize text-slate-200">{{ f.value || '—' }}</div>
              </div>
            }
          </div>

          <div>
            <div class="text-xs uppercase tracking-wider text-slate-500">Message</div>
            <div class="mt-1 rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
              {{ alert.message }}
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            @if (alert.status === 'active') {
              <button
                type="button"
                (click)="update.emit({ id: alert.id, status: 'acknowledged' })"
                class="flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
              >
                <app-alert-icon name="check" class="h-4 w-4" /> Acknowledge
              </button>
            }
            @if (alert.status !== 'resolved') {
              <button
                type="button"
                (click)="update.emit({ id: alert.id, status: 'resolved' })"
                class="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <app-alert-icon name="checkCheck" class="h-4 w-4" /> Resolve
              </button>
            } @else {
              <div class="flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-400">
                <app-alert-icon name="checkCheck" class="h-4 w-4" /> Resolved
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AlertDetailComponent {
  @Input({ required: true }) alert!: Alert;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ id: string; status: AlertStatus }>();

  get fields(): { label: string; value: string }[] {
    return [
      { label: 'Severity', value: this.alert.severity },
      { label: 'Status', value: this.alert.status },
      { label: 'Server', value: this.alert.server_name },
      { label: 'Source', value: this.alert.source },
    ];
  }
}
