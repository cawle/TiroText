import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyComponent } from './pages/privacy.component';
import { TermsComponent } from './pages/terms.component';
import { SupportComponent } from './pages/support.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'support', component: SupportComponent },
  { path: '**', redirectTo: '/dashboard' }
];
