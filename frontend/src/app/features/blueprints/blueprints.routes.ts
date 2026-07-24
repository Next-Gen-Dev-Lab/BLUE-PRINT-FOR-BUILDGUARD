import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/blueprints/blueprints').then(m => m.BlueprintCenterComponent) }
];
