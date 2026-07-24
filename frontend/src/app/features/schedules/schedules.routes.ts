import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/schedules/schedules').then(m => m.SchedulesComponent) }
];
