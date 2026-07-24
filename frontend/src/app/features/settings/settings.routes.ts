import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent) }
];
