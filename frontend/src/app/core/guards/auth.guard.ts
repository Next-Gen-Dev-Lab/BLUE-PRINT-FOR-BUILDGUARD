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
          try {
            const parsed = JSON.parse(savedUser);
            const validRoles = ['foreman', 'engineer', 'inspector', 'admin'];
            if (parsed && parsed.id && parsed.role && validRoles.includes(parsed.role)) {
              return true;
            }
          } catch {
            // invalid JSON — fall through to redirect
          }
          // Stale session: clear it
          localStorage.removeItem('bg_current_user');
          localStorage.removeItem('bg_jwt_token');
        }
        return router.createUrlTree(['/auth/login']);
      }
    })
  );
};
