import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then((m) => m.CustomersComponent),
  },
  { path: '**', redirectTo: '' },
];
