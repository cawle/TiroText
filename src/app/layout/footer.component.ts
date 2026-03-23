import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="w-full py-6 text-center border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300 bg-white/50 dark:bg-darkCard/50 backdrop-blur-sm z-50">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>&copy; 2026 TiroText AI Analytics. All rights reserved.</div>
        <div class="flex gap-6">
          <a routerLink="/privacy" class="hover:text-primary transition-colors duration-200 font-medium cursor-pointer">Privacy Policy</a>
          <a routerLink="/terms" class="hover:text-primary transition-colors duration-200 font-medium cursor-pointer">Terms of Service</a>
          <a routerLink="/support" class="hover:text-primary transition-colors duration-200 font-medium cursor-pointer">Support Center</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
