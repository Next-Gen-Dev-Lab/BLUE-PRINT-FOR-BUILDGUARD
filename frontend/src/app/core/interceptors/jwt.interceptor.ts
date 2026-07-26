import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor to attach a Mock JWT Authorization header
 * to all outgoing requests to simulate REST API integrations.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Try retrieving cached JWT token
  const token = localStorage.getItem('bg_jwt_token');

  if (token) {
    // Only attach if it is a valid compact JWT format (3 parts separated by periods)
    // to prevent stale mock tokens from crashing the real backend filter chain
    if (token.split('.').length === 3) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    } else {
      // Clear invalid stale token from storage
      localStorage.removeItem('bg_jwt_token');
      localStorage.removeItem('bg_current_user');
    }
  }

  return next(req);
};
