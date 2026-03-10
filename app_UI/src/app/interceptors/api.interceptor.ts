import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'auth_token';

/**
 * Http Interceptor for Laravel API
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept requests to the Laravel API
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    
    console.log('🔐 INTERCEPTOR CALLED');
    console.log('  Request URL:', req.url);
    console.log('  Token exists:', !!token);
    console.log('  Token value:', token ? token.substring(0, 30) + '...' : 'NONE');
    console.log('  Request headers before:', req.headers.keys().join(', '));

    // Prepare headers
    let newHeaders = req.headers;
    newHeaders = newHeaders.set('Accept', 'application/json');
    newHeaders = newHeaders.set('Content-Type', 'application/json');
    
    // CRITICAL: Add Authorization header if token exists
    if (token) {
      newHeaders = newHeaders.set('Authorization', `Bearer ${token}`);
      console.log('  ✅ Authorization header ADDED');
    } else {
      console.log('  ⚠️ NO TOKEN - not adding Authorization');
    }

    // Clone request with new headers
    const authReq = req.clone({ headers: newHeaders });
    
    console.log('  Request headers after:', authReq.headers.keys().join(', '));
    console.log('  Authorization in cloned request:', authReq.headers.get('Authorization') ? 'PRESENT' : 'MISSING');

    // Handle response
    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log('✅ Response success:', event.status, event.url);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ INTERCEPTOR ERROR');
        console.error('  Status:', error.status);
        console.error('  URL:', error.url);
        console.error('  Error:', error.error);
        
        if (error.status === 401) {
          console.error('  → Unauthorized: Token invalid or expired');
          console.error('  → Token in localStorage:', localStorage.getItem(TOKEN_KEY) ? 'EXISTS' : 'MISSING');
        }
        if (error.status === 0) {
          console.error('  → Network error: Server not reachable');
        }

        return throwError(() => error);
      })
    );
  }
}

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  console.log('💾 Token stored in localStorage:', token.substring(0, 20) + '...');
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('📥 Token retrieved from localStorage:', token ? token.substring(0, 20) + '...' : 'NONE');
  return token;
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  console.log('🗑️ Token removed from localStorage');
}
