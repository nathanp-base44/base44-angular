import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 class="text-base font-semibold text-slate-900">Analytics Dashboard</h1>
        <p class="text-xs text-slate-500">Last updated just now</p>
      </div>
      <div class="flex items-center gap-4">
        <button type="button" (click)="toggle()" class="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600" [attr.aria-label]="'Toggle dark mode'">{{ dark ? '☀️ Light' : '🌙 Dark' }}</button>
        <span class="hidden text-sm text-slate-600 sm:inline">Alex Morgan</span>
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">AM</span>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  dark = localStorage.getItem('theme') === 'dark';

  constructor() {
    this.apply();
  }

  toggle() {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.apply();
  }

  private apply() {
    document.documentElement.classList.toggle('dark', this.dark);
  }
}
