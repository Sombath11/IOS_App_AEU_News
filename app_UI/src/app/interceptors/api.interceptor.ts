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

    // Prepare headers
    let newHeaders = req.headers;
    newHeaders = newHeaders.set('Accept', 'application/json');
    newHeaders = newHeaders.set('Content-Type', 'application/json');

    // Add Authorization header if token exists
    if (token) {
      newHeaders = newHeaders.set('Authorization', `Bearer ${token}`);
    }

    // Clone request with new headers
    const authReq = req.clone({ headers: newHeaders });

    // Handle response
    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
          // Successful response
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized: Token invalid or expired
        }
        if (error.status === 0) {
          // Network error: Server not reachable
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
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
