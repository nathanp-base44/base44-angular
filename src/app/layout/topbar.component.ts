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
        <span class="hidden text-sm text-slate-600 sm:inline">Alex Morgan</span>
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">AM</span>
      </div>
    </header>
  `,
})
export class TopbarComponent {}
