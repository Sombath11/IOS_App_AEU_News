import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { setAuthToken, removeAuthToken, getAuthToken } from '../interceptors/api.interceptor';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  student_id?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  student_id?: string;
  avatar?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  access_token?: string;
}

/**
 * Authentication service for Laravel Sanctum
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', credentials);
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', userData);
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return this.api.post<void>('auth/logout', {});
  }

  /**
   * Get current authenticated user
   */
  me(): Observable<User> {
    return this.api.get<User>('user');
  }

  /**
   * Store token after successful login
   */
  setToken(token: string): void {
    setAuthToken(token);
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return getAuthToken();
  }

  /**
   * Clear token on logout
   */
  clearToken(): void {
    removeAuthToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  }

  /**
   * Get current user data (cached)
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;
    
    // Try to get user from localStorage if cached
    const cachedUser = localStorage.getItem('current_user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Update user profile (name and avatar)
   */
  updateProfile(formData: FormData): Observable<{ user: User; avatar_url?: string }> {
    return this.api.post<{ user: User; avatar_url?: string }>('user/update', formData, true);
  }

  /**
   * Cache current user data
   */
  cacheCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Clear cached user data
   */
  clearCachedUser(): void {
    localStorage.removeItem('current_user');
  }
}
