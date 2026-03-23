import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full flex items-center justify-center p-6 flex-1 py-12 transition-colors duration-300 relative">
      <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden glass dark:glass-dark animate-fade-in relative z-10 transition-colors duration-300 pl-0">
        
        <!-- Interactive Spline / Decorative side -->
        <div class="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary to-secondary relative overflow-hidden transition-colors duration-300">
          <div class="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white opacity-10 mix-blend-overlay"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-black opacity-10 mix-blend-overlay animate-pulse-slow"></div>
          
          <div class="flex items-baseline gap-2 mb-6 z-10 drop-shadow-md">
            <span class="font-serif italic text-6xl text-white leading-none pr-1">π</span>
            <h2 class="text-5xl font-extrabold tracking-tight text-white">TiroText</h2>
          </div>
          <p class="text-white/90 text-center text-lg z-10 max-w-xs leading-relaxed">
            Unlock real-time data and insights about your text instantly. Let AI do the heavy counting.
          </p>
        </div>

        <!-- Auth Form -->
        <div class="p-6 sm:p-8 md:p-12 flex flex-col justify-center animate-slide-up transition-colors duration-300 bg-white dark:bg-darkCard">
          <div class="mb-8 text-center md:text-left">
            <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
              {{ isLogin ? 'Welcome Back' : 'Get Started' }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {{ isLogin ? 'Sign in to access your analysis history.' : 'Create an account to save your analytics locally.' }}
            </p>
          </div>

          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100/90 text-red-600 rounded-lg text-sm transition-colors duration-300 font-medium">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="mb-4 p-3 bg-green-100/90 text-green-700 rounded-lg text-sm transition-colors duration-300 font-medium">
            {{ successMessage }}
          </div>

          <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div *ngIf="!isLogin">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Full Name</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" required
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkLayout dark:border-gray-700 dark:text-white transition-colors duration-300 text-sm"
                placeholder="John Doe"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Email Address</label>
              <input type="email" [(ngModel)]="email" name="email" required
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkLayout dark:border-gray-700 dark:text-white transition-colors duration-300 text-sm"
                placeholder="you@example.com"
              >
            </div>

            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkLayout dark:border-gray-700 dark:text-white transition-colors duration-300 text-sm"
                placeholder="••••••••"
              >
            </div>

            <button type="submit" [disabled]="loading" class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 mt-2 hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none">
              {{ loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up') }}
            </button>
          </form>

          <div class="mt-6 flex items-center gap-4">
            <div class="h-px bg-gray-200 dark:bg-gray-700 flex-1 transition-colors duration-300"></div>
            <span class="text-sm font-medium text-gray-400 dark:text-gray-500 transition-colors duration-300">OR</span>
            <div class="h-px bg-gray-200 dark:bg-gray-700 flex-1 transition-colors duration-300"></div>
          </div>

          <button (click)="onGoogleLogin()" type="button" class="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-all duration-300 dark:bg-darkCard dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 shadow-sm hover:-translate-y-0.5 active:translate-y-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button (click)="toggleMode()" class="px-1 text-primary hover:text-primary-dark hover:underline font-semibold transition-colors duration-300">
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isLogin = true;
  email = '';
  password = '';
  fullName = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
    this.cd.detectChanges();
  }

  async onSubmit() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.cd.detectChanges();
      
      if (this.isLogin) {
        const { error } = await this.authService.signIn(this.email, this.password);
        this.ngZone.run(() => {
          if (error) throw error;
          this.router.navigate(['/dashboard']);
        });
      } else {
        const { error } = await this.authService.signUp(this.email, this.password, this.fullName);
        this.ngZone.run(() => {
          if (error) throw error;
          this.successMessage = 'Successfully registered! You can now sign in.';
          this.isLogin = true;
          this.password = '';
        });
      }
    } catch (e: any) {
      this.ngZone.run(() => {
        this.errorMessage = e.message || 'An error occurred during authentication.';
      });
    } finally {
      this.ngZone.run(() => {
        this.loading = false;
        this.cd.detectChanges();
      });
    }
  }

  async onGoogleLogin() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.cd.detectChanges();
      const { error } = await this.authService.signInWithGoogle();
      this.ngZone.run(() => {
        if (error) throw error;
      });
    } catch (e: any) {
      this.ngZone.run(() => {
        this.errorMessage = e.message;
      });
    } finally {
      this.ngZone.run(() => {
        this.loading = false;
        this.cd.detectChanges();
      });
    }
  }
}
