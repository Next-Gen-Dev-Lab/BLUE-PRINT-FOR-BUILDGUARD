import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        // Double check session in localStorage just in case service is not fully initialized
        const savedUser = localStorage.getItem('bg_current_user');
        if (savedUser) {
          return true;
        }
        return router.createUrlTree(['/auth/login']);
      }
    })
  );
};
