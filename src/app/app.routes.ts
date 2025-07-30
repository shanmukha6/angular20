import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'forms',
    loadComponent: () => import('./components/dynamic-forms/dynamic-forms.component').then(m => m.DynamicFormsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./components/chatbot/chatbot.component').then(m => m.ChatbotComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];