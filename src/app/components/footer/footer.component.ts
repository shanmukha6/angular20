import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <footer class="footer-container">
      <mat-divider></mat-divider>
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-left">
            <span class="copyright">
              © 2024 Angular Starter Pack. All rights reserved.
            </span>
          </div>
        </div>

        <div class="footer-section">
          <div class="footer-center mobile-hidden">
            <span class="powered-by">
              Powered by Angular 20 & Material Design
            </span>
          </div>
        </div>

        <div class="footer-section">
          <div class="footer-right">
            <div class="footer-links">
              <button mat-button class="footer-link" title="Documentation">
                <mat-icon>help</mat-icon>
                <span class="mobile-hidden">Help</span>
              </button>
              <button mat-button class="footer-link" title="Support">
                <mat-icon>support</mat-icon>
                <span class="mobile-hidden">Support</span>
              </button>
              <button mat-button class="footer-link" title="GitHub">
                <mat-icon>code</mat-icon>
                <span class="mobile-hidden">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: var(--footer-bg);
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 16px 24px;
      min-height: 60px;
      max-width: 1200px;
      margin: 0 auto;
      gap: 16px;
    }

    .footer-section {
      display: flex;
      align-items: center;
    }

    .footer-left {
      justify-self: start;
    }

    .footer-center {
      justify-self: center;
      text-align: center;
    }

    .footer-right {
      justify-self: end;
    }

    .copyright {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .powered-by {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .footer-link {
      color: var(--text-secondary);
      font-size: 0.875rem;
      padding: 6px 12px;
      min-width: auto;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .footer-link:hover {
      color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }

    .footer-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr auto;
        padding: 12px 16px;
        gap: 12px;
      }

      .footer-section:nth-child(2) {
        display: none;
      }

      .footer-section:nth-child(3) {
        grid-column: 2;
      }

      .mobile-hidden {
        display: none;
      }

      .copyright {
        font-size: 0.75rem;
      }

      .footer-link {
        padding: 8px;
        min-width: 40px;
      }

      .footer-link mat-icon {
        margin-right: 0;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 8px;
      }

      .footer-section {
        justify-content: center;
      }

      .footer-left,
      .footer-right {
        justify-self: center;
      }
    }

    /* Dark theme adjustments */
    .dark-theme .footer-link:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}