import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '401', loadComponent: () => import('./pages/unauthorized/unauthorized').then(m => m.UnauthorizedComponent) },
  { path: '403', loadComponent: () => import('./pages/forbidden/forbidden').then(m => m.ForbiddenComponent) },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent) },
  { path: '500', loadComponent: () => import('./pages/server-error/server-error').then(m => m.ServerErrorComponent) }
];
