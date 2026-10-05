import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p class="text-xs font-medium text-slate-500">{{ label }}</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">{{ value }}</p>
      @if (hint) {
        <p class="mt-1 text-xs text-slate-400">{{ hint }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() hint = '';
}
