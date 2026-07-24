import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/inspections/inspections').then(m => m.InspectionsComponent) }
];
