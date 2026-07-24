import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/project-list/project-list').then(m => m.ProjectsComponent) },
  { path: ':id', loadComponent: () => import('./pages/project-detail/project-detail').then(m => m.ProjectDetailComponent) }
];
