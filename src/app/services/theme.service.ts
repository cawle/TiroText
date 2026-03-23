import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeSub = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkModeSub.asObservable();

  get isDarkMode() { return this.darkModeSub.value; }

  constructor(private dbService: DatabaseService, private authService: AuthService) {
    this.authService.currentUser$.subscribe(async user => {
      if (user) {
        try {
          const settings = await this.dbService.getUserSettings();
          const dark = settings && settings.theme === 'dark';
          this.setDarkMode(dark);
        } catch { } 
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDarkMode(prefersDark);
      }
    });
  }

  async toggleTheme() {
    this.setDarkMode(!this.isDarkMode);
    if (this.authService.currentUser) {
      try {
        await this.dbService.saveUserSettings(this.isDarkMode ? 'dark' : 'light');
      } catch (e) { }
    }
  }

  private setDarkMode(isDark: boolean) {
    this.darkModeSub.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
