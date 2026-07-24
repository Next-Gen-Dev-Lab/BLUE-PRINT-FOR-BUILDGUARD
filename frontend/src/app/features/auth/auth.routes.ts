import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'pending-approval', loadComponent: () => import('./pages/pending-approval/pending-approval').then(m => m.PendingApprovalComponent) }
];
