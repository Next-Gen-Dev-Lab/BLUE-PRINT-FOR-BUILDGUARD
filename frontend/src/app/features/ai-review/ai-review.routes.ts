import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/ai-review/ai-review').then(m => m.AiReviewComponent) }
];
