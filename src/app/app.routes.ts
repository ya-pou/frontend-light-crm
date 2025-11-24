import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard],
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
