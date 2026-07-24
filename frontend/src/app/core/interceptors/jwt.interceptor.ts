import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor to attach a Mock JWT Authorization header
 * to all outgoing requests to simulate REST API integrations.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Try retrieving cached JWT token
  const token = localStorage.getItem('bg_jwt_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
