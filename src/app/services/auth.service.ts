import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly USER_KEY = 'current-user';

  constructor() {
    this.loadUserFromStorage();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call with delay
    return of(credentials).pipe(
      delay(1000),
      map((creds) => {
        // Mock authentication logic
        if (creds.username === 'admin' && creds.password === 'password') {
          const user: User = {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'Administrator',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff'
          };
          this.setCurrentUser(user);
          return { success: true, user };
        } else if (creds.username === 'user' && creds.password === 'password') {
          const user: User = {
            id: '2',
            username: 'user',
            email: 'user@example.com',
            firstName: 'Regular',
            lastName: 'User',
            role: 'User',
            avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=10b981&color=fff'
          };
          this.setCurrentUser(user);
          return { success: true, user };
        } else {
          return { success: false, error: 'Invalid username or password' };
        }
      })
    );
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasPermission(permission: string): boolean {
    // Mock permission checking
    const userRole = this.currentUser?.role;
    if (userRole === 'Administrator') {
      return true;
    }
    return false;
  }
}