import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Interceptor: Request URL:', req.url);
  console.log('Interceptor: Token exists:', !!token);

  // Clone request and add authorization header if token exists
  if (token && !req.url.includes('/auth/login')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor: Added auth header');
    return next(clonedRequest);
  }

  console.log('Interceptor: No token, sending request as-is');
  return next(req);
};