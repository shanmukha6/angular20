import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { AuthService, User } from '../../services/auth.service';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="toolbar-content">
        <!-- Menu button for mobile -->
        <button 
          *ngIf="showMenuButton" 
          mat-icon-button 
          (click)="menuToggle.emit()"
          class="menu-button"
          matTooltip="Toggle Menu">
          <mat-icon>menu</mat-icon>
        </button>

        <!-- App title -->
        <div class="app-title">
          <h1 class="title-text">
            <mat-icon class="title-icon">dashboard</mat-icon>
            Angular Starter Pack
          </h1>
        </div>

        <div class="spacer"></div>

        <!-- Header actions -->
        <div class="header-actions">
          <!-- Theme switcher -->
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="themeMenu"
            matTooltip="Change Theme"
            class="theme-button">
            <mat-icon>{{ getThemeIcon() }}</mat-icon>
          </button>
          
          <mat-menu #themeMenu="matMenu">
            <button mat-menu-item (click)="setTheme('light')">
              <mat-icon>light_mode</mat-icon>
              <span>Light</span>
            </button>
            <button mat-menu-item (click)="setTheme('dark')">
              <mat-icon>dark_mode</mat-icon>
              <span>Dark</span>
            </button>
            <button mat-menu-item (click)="setTheme('auto')">
              <mat-icon>brightness_auto</mat-icon>
              <span>Auto</span>
            </button>
          </mat-menu>

          <!-- Notifications -->
          <button 
            mat-icon-button 
            matTooltip="Notifications"
            class="notification-button">
            <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
          </button>

          <!-- User menu -->
          <button 
            mat-button 
            [matMenuTriggerFor]="userMenu"
            class="user-button">
            <div class="user-info">
              <img 
                [src]="currentUser?.avatar" 
                [alt]="currentUser?.firstName"
                class="user-avatar">
              <span class="user-name mobile-hidden">{{ currentUser?.firstName }}</span>
              <mat-icon class="dropdown-icon">keyboard_arrow_down</mat-icon>
            </div>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="user-menu-header">
              <img 
                [src]="currentUser?.avatar" 
                [alt]="currentUser?.firstName"
                class="user-menu-avatar">
              <div class="user-menu-info">
                <div class="user-menu-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
                <div class="user-menu-email">{{ currentUser?.email }}</div>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 64px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
    }

    .menu-button {
      margin-right: 8px;
    }

    .app-title {
      display: flex;
      align-items: center;
    }

    .title-text {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      gap: 8px;
    }

    .title-icon {
      color: var(--primary-color, #3b82f6);
    }

    .spacer {
      flex: 1;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .theme-button,
    .notification-button {
      transition: all 0.2s ease;
    }

    .theme-button:hover,
    .notification-button:hover {
      transform: scale(1.05);
    }

    .user-button {
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .user-button:hover {
      background-color: rgba(0,0,0,0.04);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .dropdown-icon {
      font-size: 18px;
      opacity: 0.7;
    }

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .user-menu-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-menu-info {
      flex: 1;
    }

    .user-menu-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }

    .user-menu-email {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .title-text {
        font-size: 1.1rem;
      }

      .mobile-hidden {
        display: none;
      }

      .header-actions {
        gap: 4px;
      }
    }

    @media (max-width: 480px) {
      .title-text span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() showMenuButton = false;
  @Output() menuToggle = new EventEmitter<void>();

  currentUser: User | null = null;
  currentTheme: ThemeMode = 'light';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
    this.currentTheme = this.themeService.currentThemeValue;

    // Subscribe to theme changes
    this.themeService.currentTheme.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'auto':
        return 'brightness_auto';
      default:
        return 'light_mode';
    }
  }

  setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}