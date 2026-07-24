import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/safety/safety').then(m => m.SafetyCenterComponent) }
];
