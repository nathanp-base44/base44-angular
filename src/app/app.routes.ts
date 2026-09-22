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
    path: 'player',
    loadComponent: () => import('./pages/player/player.component').then((m) => m.PlayerComponent),
  },
  { path: '**', redirectTo: '' },
];
