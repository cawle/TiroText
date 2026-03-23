import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in w-full">
      <div class="glass dark:glass-dark rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-800 mb-8">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">Support Center</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl text-lg">Experiencing weird analytical glitches or login desyncs? Dive into the knowledgebase or shoot an immediate lifeline straight to our desk.</p>
        
        <div class="flex flex-col gap-6">
          <div class="px-6 py-5 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-1 duration-300">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2 text-lg">How precise is the Reading Time calculation pipeline?</h4>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">We compute the absolute reading velocity utilizing an industry-standard baseline of strictly 225 words per individual minute. Extremely dense code snippets or unspaced technical identifiers may slightly skew typical human perception scaling.</p>
          </div>
          
          <div class="px-6 py-5 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-1 duration-300">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2 text-lg">Are my saved memory snapshots safely persistent?</h4>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Yes. Once you press save, the payload completely bypasses local memory and inherently locks into your personal Postgres slice in the cloud until you explicitly hit the floating trash icon to irrevocably delete it.</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-8 sm:p-10 text-center animate-slide-up flex flex-col items-center shadow-inner">
         <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Still blocked on an issue?</h3>
         <p class="text-gray-600 dark:text-gray-400 mb-8 font-medium">The engineering team handles support channels synchronously.</p>
         <a href="mailto:support@tirotext.app" class="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">Email Engineering Team</a>
      </div>
    </div>
  `
})
export class SupportComponent {}
