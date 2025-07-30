import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule
  ],
  template: `
    <div class="sidebar-container">
      <!-- Sidebar header -->
      <div class="sidebar-header">
        <div class="logo-container">
          <mat-icon class="logo-icon">dashboard</mat-icon>
          <span class="logo-text">Dashboard</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Navigation menu -->
      <nav class="sidebar-nav">
        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of menuItems">
            <!-- Menu item without children -->
            <mat-list-item 
              *ngIf="!item.children" 
              [routerLink]="item.route"
              routerLinkActive="active-link"
              class="nav-item"
              (click)="onMenuClick()">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </mat-list-item>

            <!-- Menu item with children -->
            <mat-expansion-panel 
              *ngIf="item.children"
              class="expansion-panel"
              [expanded]="item.expanded">
              <mat-expansion-panel-header class="expansion-header">
                <mat-panel-title class="panel-title">
                  <mat-icon class="panel-icon">{{ item.icon }}</mat-icon>
                  <span class="panel-text">{{ item.label }}</span>
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="expansion-content">
                <mat-list-item 
                  *ngFor="let child of item.children"
                  [routerLink]="child.route"
                  routerLinkActive="active-sub-link"
                  class="sub-nav-item"
                  (click)="onMenuClick()">
                  <mat-icon matListItemIcon class="sub-icon">{{ child.icon }}</mat-icon>
                  <span matListItemTitle>{{ child.label }}</span>
                </mat-list-item>
              </div>
            </mat-expansion-panel>
          </ng-container>
        </mat-nav-list>
      </nav>

      <!-- Sidebar footer -->
      <div class="sidebar-footer">
        <div class="footer-info">
          <small class="version-text">v1.0.0</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--sidebar-bg);
    }

    .sidebar-header {
      padding: 20px 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      color: #3b82f6;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .nav-list {
      padding: 0;
    }

    .nav-item {
      margin: 2px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }

    .nav-item.active-link {
      background-color: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }

    .nav-item.active-link mat-icon {
      color: #3b82f6;
    }

    .expansion-panel {
      margin: 2px 8px;
      border-radius: 8px !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }

    .expansion-header {
      padding: 0 16px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .expansion-header:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    .panel-icon {
      color: var(--text-secondary);
    }

    .panel-text {
      color: var(--text-primary);
    }

    .expansion-content {
      padding: 0;
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 0 0 8px 8px;
    }

    .sub-nav-item {
      margin: 2px 16px;
      border-radius: 6px;
      padding-left: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .sub-nav-item:hover {
      background-color: rgba(59, 130, 246, 0.08);
    }

    .sub-nav-item.active-sub-link {
      background-color: rgba(59, 130, 246, 0.12);
      color: #3b82f6;
    }

    .sub-nav-item.active-sub-link mat-icon {
      color: #3b82f6;
    }

    .sub-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .footer-info {
      text-align: center;
    }

    .version-text {
      color: var(--text-secondary);
      font-size: 12px;
    }

    /* Dark theme adjustments */
    .dark-theme .expansion-content {
      background-color: rgba(255, 255, 255, 0.02);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .sidebar-header {
        padding: 16px;
      }
      
      .logo-text {
        font-size: 1.1rem;
      }
    }
  `]
})
export class SidebarComponent {
  @Output() menuClick = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      children: [
        { label: 'Overview', icon: 'visibility', route: '/dashboard' },
        { label: 'Reports', icon: 'assessment', route: '/dashboard' },
        { label: 'Charts', icon: 'show_chart', route: '/dashboard' }
      ],
      expanded: false
    },
    {
      label: 'Forms',
      icon: 'description',
      route: '/forms'
    },
    {
      label: 'User Management',
      icon: 'people',
      children: [
        { label: 'Users', icon: 'person', route: '/dashboard' },
        { label: 'Roles', icon: 'security', route: '/dashboard' },
        { label: 'Permissions', icon: 'lock', route: '/dashboard' }
      ],
      expanded: false
    },
    {
      label: 'AI Features',
      icon: 'psychology',
      children: [
        { label: 'Chatbot', icon: 'chat', route: '/chatbot' },
        { label: 'AI Assistant', icon: 'smart_toy', route: '/chatbot' },
        { label: 'Document AI', icon: 'description', route: '/chatbot' }
      ],
      expanded: false
    },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'General', icon: 'tune', route: '/dashboard' },
        { label: 'Security', icon: 'shield', route: '/dashboard' },
        { label: 'Integrations', icon: 'extension', route: '/dashboard' }
      ],
      expanded: false
    }
  ];

  constructor(private router: Router) {}

  onMenuClick(): void {
    this.menuClick.emit();
  }
}