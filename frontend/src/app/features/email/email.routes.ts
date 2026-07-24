import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/email/email').then(m => m.EmailCenterComponent) }
];
