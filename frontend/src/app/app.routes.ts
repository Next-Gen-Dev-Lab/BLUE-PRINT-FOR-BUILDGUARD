import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // Authentication Routes (via Auth Feature routes)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  
  // Redirection fallbacks for auth shortcuts
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'forgot-password', redirectTo: 'auth/forgot-password', pathMatch: 'full' },
  { path: 'pending-approval', redirectTo: 'auth/pending-approval', pathMatch: 'full' },

  // Professional Fullscreen Error Views
  {
    path: '401',
    loadComponent: () => import('./features/errors/pages/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  {
    path: '403',
    loadComponent: () => import('./features/errors/pages/forbidden/forbidden').then(m => m.ForbiddenComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./features/errors/pages/not-found/not-found').then(m => m.NotFoundComponent)
  },
  {
    path: '500',
    loadComponent: () => import('./features/errors/pages/server-error/server-error').then(m => m.ServerErrorComponent)
  },
  
  // Protected Core App Workspace Viewports (using Layout Component wrapper shell)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.routes),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.routes)
      },
      {
        path: 'progress-logs',
        loadChildren: () => import('./features/progress-logs/progress-logs.routes').then(m => m.routes)
      },
      {
        path: 'daily-logs',
        redirectTo: 'progress-logs',
        pathMatch: 'full'
      },
      {
        path: 'blueprints',
        loadChildren: () => import('./features/blueprints/blueprints.routes').then(m => m.routes)
      },
      {
        path: 'inspections',
        loadChildren: () => import('./features/inspections/inspections.routes').then(m => m.routes)
      },
      {
        path: 'safety',
        loadChildren: () => import('./features/safety/safety.routes').then(m => m.routes)
      },
      {
        path: 'schedules',
        loadChildren: () => import('./features/schedules/schedules.routes').then(m => m.routes),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'engineer', 'foreman', 'inspector'] }
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.routes)
      },
      {
        path: 'ai-review',
        loadChildren: () => import('./features/ai-review/ai-review.routes').then(m => m.routes),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'engineer', 'inspector'] }
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.routes),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'engineer', 'inspector'] }
      },
      {
        path: 'email',
        loadChildren: () => import('./features/email/email.routes').then(m => m.routes),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'engineer', 'inspector'] }
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.routes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Fallbacks
  {
    path: '**',
    redirectTo: '404'
  }
];
