import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in w-full">
      <div class="glass dark:glass-dark rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-800">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-8">Terms of Service</h1>
        
        <div class="prose dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none space-y-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">1. Binding Agreement</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">By spinning up an account with TiroText, you immediately acknowledge and agree to abide by these overarching Terms of Service. TiroText is rendered purely for text insight metrics.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">2. Acceptable Parameters of Use</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">You expressly agree not to utilize our high-speed analytics infrastructure for illegal scraping, executing malicious SQL injunctions, distributing hazardous spam arrays, or attempting to artificially overload the Supabase database limits.</p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">3. Sovereign Responsibility</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">You maintain final accountability for securing the robust passwords backing your login pathways. If your identity becomes compromised via insecure local handling, TiroText bears strictly zero liability for lost or deleted historical snapshots.</p>
          </div>

          <p class="mt-8 text-sm text-gray-400 font-medium">Last updated: March 24, 2026</p>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}
