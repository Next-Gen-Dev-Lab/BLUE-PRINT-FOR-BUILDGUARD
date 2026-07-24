import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Angular Runtime Exception:', error);
    
    // Check if error banner already exists to avoid duplication
    if (document.getElementById('ng-runtime-error-banner')) return;

    const div = document.createElement('div');
    div.id = 'ng-runtime-error-banner';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.backgroundColor = '#ef4444';
    div.style.color = '#ffffff';
    div.style.padding = '16px';
    div.style.zIndex = '999999';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '14px';
    div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    div.style.overflowY = 'auto';
    div.style.maxHeight = '50vh';
    
    const message = error?.message || error?.toString() || 'Unknown Error';
    const stack = error?.stack || '';
    div.innerHTML = `<strong>[Angular Runtime Error]:</strong> ${message} <br><pre style="margin-top: 8px; white-space: pre-wrap; font-size: 11px;">${stack}</pre>`;
    document.body.appendChild(div);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
};
