import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/progress-logs/progress-logs').then(m => m.ProgressLogsComponent) }
];
