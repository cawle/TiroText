import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
      <header class="sticky top-0 z-[110] glass dark:glass-dark border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-colors duration-300 w-full shadow-sm">
        <div class="flex items-baseline gap-1.5 sm:gap-2 cursor-pointer group" (click)="goToHome()">
          <span class="font-serif italic text-3xl sm:text-4xl leading-none bg-clip-text text-transparent bg-gradient-to-tr from-primary to-secondary transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm pr-0.5 -mt-1">π</span>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">TiroText</h1>
        </div>
        
        <div class="flex items-center gap-3 sm:gap-5">
          <button (click)="theme.toggleTheme()" class="p-2.5 rounded-full bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 shadow-sm transition-all duration-300 focus:outline-none">
            <svg *ngIf="!(theme.isDarkMode$ | async)" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <svg *ngIf="(theme.isDarkMode$ | async)" class="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          </button>
          
          <div class="flex items-center gap-3 sm:gap-4 border-l border-gray-200 dark:border-gray-700 pl-3 sm:pl-5 transition-colors duration-300">
            <ng-container *ngIf="userName; else loggedOut">
              <div class="flex flex-col items-end hidden md:flex">
                  <span class="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">{{ userName }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">User</span>
              </div>
              <button (click)="logout()" class="text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20 font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 shadow-sm">Logout</button>
            </ng-container>
            <ng-template #loggedOut>
              <button (click)="goToLogin()" class="text-xs sm:text-sm bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-300 dark:hover:bg-primary/30 font-semibold px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl transition-all duration-300 shadow-sm">Sign In</button>
            </ng-template>
          </div>
        </div>
      </header>
  `
})
export class HeaderComponent implements OnInit {
  userName = '';
  
  constructor(
    public theme: ThemeService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.userName = user?.user_metadata?.['full_name'] || user?.email || '';
      this.cd.detectChanges();
    });
  }

  goToHome() { this.router.navigate(['/dashboard']); }
  goToLogin() { this.router.navigate(['/auth']); }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/auth']);
  }
}
