import { Component, Input } from '@angular/core';

export type AlertIconName = 'alertCircle' | 'alertTriangle' | 'info' | 'chevronRight' | 'x' | 'check' | 'checkCheck';

/** Tiny inline SVG icon; sized/colored via the host `class` attribute. */
@Component({
  selector: 'app-alert-icon',
  standalone: true,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      @switch (name) {
        @case ('alertCircle') {
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        }
        @case ('alertTriangle') {
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        }
        @case ('info') {
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        }
        @case ('chevronRight') {
          <path d="m9 18 6-6-6-6" />
        }
        @case ('x') {
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('checkCheck') {
          <path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" />
        }
      }
    </svg>
  `,
})
export class AlertIconComponent {
  @Input({ required: true }) name!: AlertIconName;
}
