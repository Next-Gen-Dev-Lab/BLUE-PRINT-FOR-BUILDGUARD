import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/notifications/notifications').then(m => m.NotificationsCenterComponent) }
];
