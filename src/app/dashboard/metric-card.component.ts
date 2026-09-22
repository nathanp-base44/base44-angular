import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type MetricAccent = 'green' | 'amber' | 'red' | 'sky' | 'violet';

const ACCENT_MAP: Record<MetricAccent, string> = {
  green: 'text-emerald-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
  sky: 'text-sky-500',
  violet: 'text-violet-500',
};

/**
 * Recreation of pulseview's MetricCard. Light theme by default (matches the
 * home dashboard); add the `dark` attribute for pulseview's original dark look.
 */
@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `
    <div
      class="p-4"
      [class]="dark ? 'rounded-lg border border-slate-800 bg-slate-900/60' : 'rounded-2xl border border-slate-200 bg-white shadow-sm'"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium uppercase tracking-wider" [class]="dark ? 'text-slate-400' : 'text-slate-500'">{{ label }}</span>
        @if (icon) {
          <span class="flex h-4 w-4" [class]="accentClass" [innerHTML]="iconHtml"></span>
        }
      </div>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-2xl font-semibold" [class]="dark ? 'text-slate-100' : 'text-slate-900'">{{ value }}</span>
        @if (unit) {
          <span class="text-sm" [class]="dark ? 'text-slate-400' : 'text-slate-500'">{{ unit }}</span>
        }
      </div>
      @if (sub) {
        <div class="mt-1 text-xs" [class]="dark ? 'text-slate-500' : 'text-slate-400'">{{ sub }}</div>
      }
    </div>
  `,
})
export class MetricCardComponent {
  /** Use pulseview's dark card styling. */
  @Input({ transform: booleanAttribute }) dark = false;
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
