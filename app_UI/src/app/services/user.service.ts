import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService, User } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authService: AuthService) {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      const cachedUser = this.authService.getCurrentUser();
      if (cachedUser) {
        this.currentUserSubject.next(cachedUser);
      } else {
        // Fetch user from API
        this.authService.me().subscribe({
          next: (user) => {
            this.currentUserSubject.next(user);
            this.authService.cacheCurrentUser(user);
          },
          error: () => {
            this.logout();
          },
        });
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  login(email: string, password: string) {
    return this.authService.login({ email, password });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.clearUser();
      },
      error: () => {
        // Even if logout API fails, clear local data
        this.clearUser();
      },
    });
  }

  private clearUser() {
    this.authService.clearToken();
    this.authService.clearCachedUser();
    this.currentUserSubject.next(null);
  }
}
