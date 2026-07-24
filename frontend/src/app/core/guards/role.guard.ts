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
      const activeUser = user || JSON.parse(localStorage.getItem('bg_current_user') || 'null');
      
      if (activeUser && expectedRoles.includes(activeUser.role)) {
        return true;
      }
      
      // Redirect to professional forbidden error view page
      return router.createUrlTree(['/403']);
    })
  );
};
