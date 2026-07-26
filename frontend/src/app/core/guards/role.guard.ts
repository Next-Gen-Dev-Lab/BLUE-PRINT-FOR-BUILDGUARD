import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Functional CanActivateFn guard to verify if the currently authenticated user
 * has one of the roles declared on the activated route configuration object.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const expectedRoles: string[] = route.data?.['roles'] || [];

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Defensive session checkout from localStorage if service state is lagging
      const storedUser = localStorage.getItem('bg_current_user');
      let activeUser = user;

      if (!activeUser && storedUser) {
        try {
          activeUser = JSON.parse(storedUser);
        } catch {
          // invalid JSON - clear stale data
          localStorage.removeItem('bg_current_user');
          localStorage.removeItem('bg_jwt_token');
          return router.createUrlTree(['/auth/login']);
        }
      }

      if (!activeUser) {
        // Not authenticated at all — send to login
        return router.createUrlTree(['/auth/login']);
      }

      if (expectedRoles.includes(activeUser.role)) {
        return true;
      }

      // Authenticated but wrong role — redirect to forbidden
      return router.createUrlTree(['/403']);
    })
  );
};
