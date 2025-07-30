import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<ThemeMode>('light');
  private readonly THEME_KEY = 'app-theme';

  constructor() {
    this.initializeTheme();
  }

  get currentTheme() {
    return this.currentTheme$.asObservable();
  }

  get currentThemeValue(): ThemeMode {
    return this.currentTheme$.value;
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentThemeValue === 'auto') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme$.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const body = document.body;
    const html = document.documentElement;

    // Remove existing theme classes
    body.classList.remove('dark-theme', 'light-theme');
    html.classList.remove('dark', 'light');

    // Add new theme classes
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      html.classList.add('dark');
    } else {
      body.classList.add('light-theme');
      html.classList.add('light');
    }
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeValue;
    let newTheme: ThemeMode;

    switch (currentTheme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'auto';
        break;
      case 'auto':
        newTheme = 'light';
        break;
      default:
        newTheme = 'light';
    }

    this.setTheme(newTheme);
  }

  isDarkMode(): boolean {
    if (this.currentThemeValue === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentThemeValue === 'dark';
  }
}