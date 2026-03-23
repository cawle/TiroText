import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in w-full">
      <div class="glass dark:glass-dark rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-800">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-8">Privacy Policy</h1>
        
        <div class="prose dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none space-y-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">1. Local Data Processing</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">All active text analysis you perform on the TiroText dashboard happens entirely in real-time localized entirely inside your browser cache. We do not stealthily exfiltrate keystrokes to remote servers.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">2. Secure Cloud Snapshots</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">If you optionally click 'Save Results', the raw text and its algorithmic breakdown are securely uploaded directly to your private tier in our heavily encrypted Supabase instance. These isolated rows are barricaded by strict Row Level Security (RLS) policies exclusively accessible via your unique authentication token.</p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">3. Account Authentication tokens</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Depending on whether you sign up natively or use Google OAuth, we strictly capture and store your minimal public identity vectors (just Email and Name) required for secure session persistence.</p>
          </div>

          <p class="mt-8 text-sm text-gray-400 font-medium">Last updated: March 24, 2026</p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
