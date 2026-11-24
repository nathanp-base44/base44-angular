import { Routes } from '@angular/router';
import { authGuard } from './data/auth.guard';

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
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then((m) => m.CustomersComponent),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];
