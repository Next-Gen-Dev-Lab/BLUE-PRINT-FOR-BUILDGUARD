import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/users/users').then(m => m.UsersComponent) }
];
