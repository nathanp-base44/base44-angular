import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <a routerLink="/" class="flex items-center gap-2 px-5 py-5">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold">L</span>
        <span class="text-lg font-semibold text-slate-900">Lumina</span>
      </a>
      <nav class="flex-1 space-y-1 px-3">
        @for (item of items; track item.label) {
          <a
            [routerLink]="item.link"
            routerLinkActive="bg-brand-light text-brand"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <span class="text-base">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>
      <div class="border-t border-slate-200 px-5 py-4 text-xs text-slate-400">© 2026 Lumina, Inc.</div>
    </aside>
  `,
})
export class SidebarComponent {
  items = [
    { label: 'Dashboard', icon: '📊', link: '/' },
    { label: 'Orders', icon: '🧾', link: '/orders' },
    { label: 'Customers', icon: '👥', link: '/customers' },
    { label: 'Reports', icon: '📈', link: '/reports' },
    { label: 'About', icon: 'ℹ️', link: '/about' },
  ];
}
