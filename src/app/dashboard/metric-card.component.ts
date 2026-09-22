import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type MetricAccent = 'green' | 'amber' | 'red' | 'sky' | 'violet';

const ACCENT_MAP: Record<MetricAccent, string> = {
  green: 'text-emerald-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
  sky: 'text-sky-500',
  violet: 'text-violet-500',
};

/** Recreation of pulseview's MetricCard, adapted to this app's light theme. */
@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium uppercase tracking-wider text-slate-500">{{ label }}</span>
        @if (icon) {
          <span class="flex h-4 w-4" [class]="accentClass" [innerHTML]="iconHtml"></span>
        }
      </div>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-2xl font-semibold text-slate-900">{{ value }}</span>
        @if (unit) {
          <span class="text-sm text-slate-500">{{ unit }}</span>
        }
      </div>
      @if (sub) {
        <div class="mt-1 text-xs text-slate-400">{{ sub }}</div>
      }
    </div>
  `,
})
export class MetricCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() unit?: string;
  @Input() sub?: string;
  @Input() accent: MetricAccent = 'sky';
  /** Inline SVG markup for the icon (trusted, app-defined constants only). */
  @Input() set icon(value: string | undefined) {
    this.iconHtml = value ? this.sanitizer.bypassSecurityTrustHtml(value) : undefined;
  }
  get icon(): string | undefined {
    return this.iconHtml ? String(this.iconHtml) : undefined;
  }
  iconHtml?: SafeHtml;

  private sanitizer = inject(DomSanitizer);

  get accentClass(): string {
    return ACCENT_MAP[this.accent] ?? 'text-slate-400';
  }
}
