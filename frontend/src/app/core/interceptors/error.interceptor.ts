import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

/**
 * Public auth endpoints that handle their own errors locally in the component.
 * The interceptor must NOT globally redirect for these routes.
 */
const AUTH_PASSTHROUGH_PATHS = ['/auth/login', '/auth/register', '/auth/me'];

function isAuthPassthrough(url: string): boolean {
  return AUTH_PASSTHROUGH_PATHS.some(path => url.includes(path));
}

/**
 * Functional HTTP Interceptor to catch global HTTP errors (401, 403, 404, 500)
 * and trigger proper routing transitions to the dedicated error viewport views.
 * Auth endpoints (login, register) are excluded so they can handle errors locally.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Let auth-route components handle their own HTTP errors (400, 403, etc.)
        if (isAuthPassthrough(req.url)) {
          return throwError(() => err);
        }

        switch (err.status) {
          case 401:
            toast.error('Session expired. Redirecting to login.');
            localStorage.removeItem('bg_current_user');
            localStorage.removeItem('bg_jwt_token');
            router.navigate(['/auth/login']);
            break;
          case 403:
            toast.error('Access Denied: Insufficient permissions.');
            router.navigate(['/403']);
            break;
          case 404:
            toast.error('Resource not found.');
            router.navigate(['/404']);
            break;
          case 500:
            toast.error('Server side database error.');
            router.navigate(['/500']);
            break;
          default:
            toast.error(err.message || 'An unexpected connection error occurred.');
            break;
        }
      }
      return throwError(() => err);
    })
  );
};
