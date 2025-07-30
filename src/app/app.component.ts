import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" [class.dark-theme]="isDarkTheme">
      <ng-container *ngIf="authService.isAuthenticated; else loginView">
        <mat-sidenav-container class="sidenav-container">
          <!-- Sidebar -->
          <mat-sidenav
            #drawer
            class="sidenav"
            fixedInViewport
            [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
            [mode]="(isHandset$ | async) ? 'over' : 'side'"
            [opened]="(isHandset$ | async) === false">
            <app-sidebar (menuClick)="onMobileMenuClick()"></app-sidebar>
          </mat-sidenav>

          <!-- Main content -->
          <mat-sidenav-content>
            <!-- Header -->
            <app-header 
              (menuToggle)="drawer.toggle()"
              [showMenuButton]="isHandset$ | async">
            </app-header>

            <!-- Page content -->
            <main class="main-content">
              <div class="content-wrapper fade-in">
                <router-outlet></router-outlet>
              </div>
            </main>

            <!-- Footer -->
            <app-footer></app-footer>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </ng-container>

      <!-- Login view -->
      <ng-template #loginView>
        <div class="login-container">
          <router-outlet></router-outlet>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      overflow: hidden;
    }

    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 280px;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      min-height: calc(100vh - 64px - 60px); /* header height - footer height */
      padding: 0;
    }

    .content-wrapper {
      padding: 24px;
      min-height: calc(100vh - 64px - 60px - 48px);
    }

    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isDarkTheme = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.currentTheme.subscribe(() => {
      this.isDarkTheme = this.themeService.isDarkMode();
    });

    // Close mobile menu on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.drawer?.mode === 'over') {
        this.drawer.close();
      }
    });
  }

  onMobileMenuClick() {
    if (this.drawer?.mode === 'over') {
      this.drawer.close();
    }
  }
}