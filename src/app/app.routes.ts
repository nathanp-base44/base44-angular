import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'monitoring',
    loadComponent: () => import('./pages/monitoring/monitoring.component').then((m) => m.MonitoringComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  { path: '**', redirectTo: '' },
];
