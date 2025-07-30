import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background"></div>
      
      <div class="login-content">
        <mat-card class="login-card fade-in">
          <!-- Header -->
          <div class="login-header">
            <div class="logo-section">
              <mat-icon class="logo-icon">dashboard</mat-icon>
              <h1 class="app-title">Angular Starter Pack</h1>
            </div>
            <p class="login-subtitle">Sign in to your dashboard</p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <!-- Username Field -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Username</mat-label>
              <input 
                matInput 
                formControlName="username"
                placeholder="Enter your username"
                autocomplete="username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <!-- Password Field -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <!-- Remember Me -->
            <div class="form-options">
              <mat-checkbox formControlName="rememberMe" class="remember-checkbox">
                Remember me
              </mat-checkbox>
              <button type="button" mat-button class="forgot-password">
                Forgot password?
              </button>
            </div>

            <!-- Submit Button -->
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="login-button"
              [disabled]="loginForm.invalid || isLoading">
              <mat-spinner 
                *ngIf="isLoading" 
                diameter="20" 
                class="button-spinner">
              </mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading">Signing In...</span>
            </button>
          </form>

          <!-- Demo Credentials -->
          <div class="demo-section">
            <mat-divider class="divider"></mat-divider>
            <div class="demo-info">
              <p class="demo-title">Demo Credentials:</p>
              <div class="demo-credentials">
                <p><strong>Admin:</strong> username: admin, password: password</p>
                <p><strong>User:</strong> username: user, password: password</p>
              </div>
            </div>
          </div>

          <!-- Theme Switcher -->
          <div class="theme-switcher">
            <button 
              mat-icon-button 
              (click)="toggleTheme()"
              matTooltip="Toggle Theme"
              class="theme-button">
              <mat-icon>{{isDarkTheme ? 'light_mode' : 'dark_mode'}}</mat-icon>
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="10" cy="60" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="90" cy="40" r="1" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .login-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .logo-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #3b82f6;
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .login-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: -8px 0 8px 0;
    }

    .remember-checkbox {
      font-size: 0.875rem;
    }

    .forgot-password {
      font-size: 0.875rem;
      color: #3b82f6;
      padding: 0;
      min-width: auto;
      text-transform: none;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 8px;
      margin-top: 8px;
      position: relative;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .demo-section {
      margin-top: 32px;
    }

    .divider {
      margin-bottom: 20px;
    }

    .demo-info {
      text-align: center;
    }

    .demo-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 12px 0;
    }

    .demo-credentials {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .demo-credentials p {
      margin: 4px 0;
    }

    .theme-switcher {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .theme-button {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .theme-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }

      .login-card {
        padding: 24px;
      }

      .app-title {
        font-size: 1.25rem;
      }

      .form-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }

    /* Dark theme adjustments */
    .dark-theme .login-card {
      background-color: rgba(31, 41, 55, 0.9);
      border: 1px solid rgba(75, 85, 99, 0.3);
    }

    .dark-theme .theme-button {
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.3);
    }

    /* Animation */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  isDarkTheme = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }

    // Subscribe to theme changes
    this.themeService.currentTheme.subscribe(() => {
      this.isDarkTheme = this.themeService.isDarkMode();
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open(response.error || 'Login failed', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('An error occurred. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}