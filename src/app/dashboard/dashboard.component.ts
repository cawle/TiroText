import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { AnalysisService, TextAnalysisData } from '../services/analysis.service';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full relative">
      
      <!-- Custom Delete Modal -->
      <div *ngIf="itemToDelete" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in transition-all duration-300">
         <div class="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-up border border-gray-100 dark:border-white/5 relative">
           <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Snapshot?</h3>
           <p class="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">Are you sure you want to permanently delete this snapshot? This action cannot be reversed.</p>
           <div class="flex justify-end gap-3">
             <button (click)="itemToDelete = null" class="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">Cancel</button>
             <button (click)="confirmDelete()" class="px-5 py-2.5 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-300 shadow-md">Yes, Delete</button>
           </div>
         </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 w-full pb-16">
        
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <!-- Left Column: Input -->
          <div class="xl:col-span-7 flex flex-col h-[650px] animate-slide-up relative">
            <div class="flex justify-between items-end mb-4 px-1">
              <h2 class="text-xl font-semibold opacity-90">Analysis Workspace</h2>
              <button (click)="saveAnalysis()" [disabled]="!textInput || isSaving" class="text-sm bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-2">
                <svg *ngIf="isSaving" class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg *ngIf="!isSaving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                {{ isSaving ? 'Saving...' : 'Save Results' }}
              </button>
            </div>
            
            <div class="relative flex-1 rounded-2xl p-1 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-darkCard shadow-inner transition-colors duration-300 group">
                <textarea 
                  [(ngModel)]="textInput"
                  (ngModelChange)="onTextChange()"
                  placeholder="Type or paste your text here to begin real-time analysis..."
                  class="w-full h-full p-6 pb-20 rounded-xl bg-white/90 dark:bg-[#1a2333]/90 backdrop-blur-sm border-transparent focus:border-transparent focus:ring-0 shadow-sm resize-none transition-all duration-300 text-lg leading-relaxed z-10 relative custom-scrollbar outline-none"
                ></textarea>
                
                <!-- Repeated words highlight logic simulation via visually distinct background overlay (Not natively possible in textarea, usually requires contenteditable div. Here we use pure regex driven insights instead). -->
                
                <div class="absolute bottom-6 left-8 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase z-20 pointer-events-none transition-colors duration-300">
                  {{ textInput.length === 0 ? 'Awaiting Input' : 'Analyzing Live' }}
                </div>
            </div>
          </div>

          <!-- Right Column: Metrics -->
          <div class="xl:col-span-5 flex flex-col gap-5 animate-slide-up mt-8 xl:mt-11" style="animation-delay: 100ms">
            <!-- 2x2 Grid -->
            <div class="grid grid-cols-2 gap-5">
              <div class="bg-white dark:bg-darkCard p-6 rounded-2xl flex flex-col items-start justify-center shadow-lg border border-gray-100/50 dark:border-white/5 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <span class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Words</span>
                <span class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-400">{{ currentAnalysis.word_count }}</span>
              </div>
              <div class="bg-white dark:bg-darkCard p-6 rounded-2xl flex flex-col items-start justify-center shadow-lg border border-gray-100/50 dark:border-white/5 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <span class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Characters</span>
                <span class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-secondary to-purple-400">{{ currentAnalysis.char_count }}</span>
              </div>
              <div class="bg-white dark:bg-darkCard p-6 rounded-2xl flex flex-col items-start justify-center shadow-lg border border-gray-100/50 dark:border-white/5 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <span class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Sentences</span>
                <span class="text-4xl font-black text-gray-800 dark:text-white">{{ currentAnalysis.sentence_count }}</span>
              </div>
              <div class="bg-white dark:bg-darkCard p-6 rounded-2xl flex flex-col items-start justify-center shadow-lg border border-gray-100/50 dark:border-white/5 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <span class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Paragraphs</span>
                <span class="text-4xl font-black text-gray-800 dark:text-white">{{ currentAnalysis.paragraph_count }}</span>
              </div>
            </div>

            <!-- Detail Insights Vertical List -->
            <div class="bg-white dark:bg-darkCard p-7 rounded-2xl shadow-lg border border-gray-100/50 dark:border-white/5 mt-2 flex flex-col gap-5 transition-colors duration-300 flex-1">
              <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Advanced Metrics</h3>
              
              <div class="flex flex-col gap-6">
                 <div class="flex justify-between items-center group">
                   <div class="flex items-center gap-3">
                      <div class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">Est. Reading Time</span>
                   </div>
                   <span class="font-bold text-xl group-hover:scale-110 transition-transform duration-300 text-gray-900 dark:text-white">~{{ currentAnalysis.reading_time }}m</span>
                 </div>
                 
                 <div class="flex justify-between items-center group">
                   <div class="flex items-center gap-3">
                      <div class="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></div>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">Avg Word Length</span>
                   </div>
                   <div class="flex items-baseline gap-1">
                      <span class="font-bold text-xl group-hover:scale-110 transition-transform duration-300 text-gray-900 dark:text-white">{{ currentAnalysis.avg_word_length }}</span>
                      <span class="text-xs text-gray-400 font-semibold uppercase">ch</span>
                   </div>
                 </div>

                 <div class="flex justify-between items-center group">
                   <div class="flex items-center gap-3">
                      <div class="p-2 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg></div>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">Unique Vocabulary</span>
                   </div>
                   <span class="font-bold text-xl group-hover:scale-110 transition-transform duration-300 text-gray-900 dark:text-white">{{ currentAnalysis.unique_words }}</span>
                 </div>

                 <div class="flex justify-between items-center group">
                   <div class="flex items-center gap-3">
                      <div class="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg></div>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">Longest Word</span>
                   </div>
                   <span class="font-bold text-lg text-primary truncate max-w-[120px] text-right bg-primary/10 px-3 py-1 rounded-md" [title]="currentAnalysis.longest_word">{{ currentAnalysis.longest_word || '-' }}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: History & Freq -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10 animate-slide-up" style="animation-delay: 200ms">
          
          <!-- Charts Section -->
          <div class="bg-white dark:bg-darkCard rounded-2xl p-8 shadow-lg border border-gray-100/50 dark:border-white/5 transition-colors duration-300 flex flex-col min-h-[400px]">
            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              <h3 class="text-lg font-bold flex items-center gap-2">
                 <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                 Top Word Frequencies
              </h3>
              <span class="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Bar Chart</span>
            </div>
            
            <div class="flex-1 w-full relative">
                <canvas #freqChart></canvas>
                <div *ngIf="currentAnalysis.word_frequencies.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-70 bg-white/50 dark:bg-darkCard/50 backdrop-blur-sm">
                  <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <p class="text-sm font-medium tracking-wide">Analysis data waiting for input</p>
                </div>
            </div>
          </div>

          <!-- History Container -->
          <div class="bg-white dark:bg-darkCard rounded-2xl p-8 shadow-lg border border-gray-100/50 dark:border-white/5 transition-colors duration-300 flex flex-col h-[400px]">
             <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
               <h3 class="text-lg font-bold flex items-center gap-2">
                 <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Saved Snapshots
               </h3>
               <button (click)="loadHistoryList()" class="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors duration-300" title="Refresh">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               </button>
             </div>
             
             <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
               <div *ngIf="history.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                  <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                 <span class="text-sm font-medium tracking-wide">No snapshots saved yet.</span>
               </div>
               
               <div class="flex flex-col gap-3">
                 <div *ngFor="let h of history" 
                      class="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 flex justify-between items-center cursor-pointer shadow-sm hover:shadow" 
                      (click)="loadHistory(h)">
                   <div class="flex flex-col gap-1.5 overflow-hidden">
                     <span class="font-medium text-gray-800 dark:text-gray-200 truncate w-full pr-4 text-sm">{{ h.text.substring(0, 45) }}{{ h.text.length > 45 ? '...' : '' }}</span>
                     <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {{ h.created_at | date:'MMM d, yyyy - h:mm a' }}
                     </span>
                   </div>
                   <div class="flex flex-col items-end gap-1.5 shrink-0">
                     <span class="text-xs font-bold bg-white dark:bg-darkCard px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">{{ h.word_count }} Words</span>
                     <button (click)="deleteHistory($event, h.id)" class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" title="Delete Snapshot">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('freqChart') freqChartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | undefined;

  get isDarkMode() { return this.theme.isDarkMode; }

  textInput = '';
  isSaving = false;
  itemToDelete: string | null = null;
  
  currentAnalysis: TextAnalysisData;
  history: any[] = [];
  private themeSub!: Subscription;

  constructor(
    private authService: AuthService,
    private dbService: DatabaseService,
    private analysisService: AnalysisService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    public theme: ThemeService
  ) {
    this.currentAnalysis = this.analysisService.analyzeText('');
  }

  async ngOnInit() {
    this.themeSub = this.theme.isDarkMode$.subscribe(() => {
      this.updateChart();
    });

    if (this.authService.currentUser) {
      this.loadHistoryList();
    }
  }

  ngOnDestroy() {
    if (this.themeSub) this.themeSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    if (!this.freqChartCanvas) return;
    const ctx = this.freqChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const textColor = this.isDarkMode ? '#9ca3af' : '#4b5563';
    const gridColor = this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Word Frequency',
          data: [],
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { stepSize: 1, color: textColor },
            grid: { color: gridColor }
          },
          x: {
            ticks: { color: textColor },
            grid: { color: gridColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    this.updateChart();
  }

  updateChart() {
    if (!this.chartInstance) return;
    
    // Only show top 10 frequencies
    const top10 = this.currentAnalysis.word_frequencies.slice(0, 10);
    this.chartInstance.data.labels = top10.map(w => w.word);
    this.chartInstance.data.datasets[0].data = top10.map(w => w.frequency);
    
    const textColor = this.isDarkMode ? '#9ca3af' : '#4b5563';
    const gridColor = this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    if (this.chartInstance.options.scales?.['x']) {
      this.chartInstance.options.scales['x'].ticks!.color = textColor;
      if(this.chartInstance.options.scales['x'].grid) this.chartInstance.options.scales['x'].grid.color = gridColor;
    }
    if (this.chartInstance.options.scales?.['y']) {
      this.chartInstance.options.scales['y'].ticks!.color = textColor;
      if(this.chartInstance.options.scales['y'].grid) this.chartInstance.options.scales['y'].grid.color = gridColor;
    }
    
    this.chartInstance.update();
  }

  async loadHistoryList() {
    try {
      const data = await this.dbService.getAnalysisHistory();
      this.ngZone.run(() => {
        this.history = data.map(h => {
          let dateStr = h.created_at;
          if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
            dateStr += 'Z';
          }
          return { ...h, created_at: dateStr };
        });
        this.cd.detectChanges();
      });
    } catch (e) {
      console.error(e);
    }
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    const days = Math.floor(seconds / 86400);
    return days === 1 ? '1d ago' : days + 'd ago';
  }

  onTextChange() {
    this.currentAnalysis = this.analysisService.analyzeText(this.textInput);
    this.updateChart();
  }

  async saveAnalysis() {
    if (!this.textInput || this.textInput.trim().length === 0) return;
    
    if (!this.authService.currentUser) {
      alert('Please sign in or create an account to save your analysis results.');
      this.router.navigate(['/auth']);
      return;
    }
    
    this.isSaving = true;
    this.cd.detectChanges();

    try {
      await this.dbService.saveAnalysis(this.textInput, this.currentAnalysis);
      await this.loadHistoryList();
    } catch (e: any) {
      console.error(e);
      this.ngZone.run(() => {
        alert('Failed to save analysis: ' + (e.message || 'Please check Database access policies.'));
      });
    } finally {
      this.ngZone.run(() => {
        this.isSaving = false;
        this.cd.detectChanges();
      });
    }
  }

  loadHistory(h: any) {
    this.textInput = h.text;
    this.onTextChange();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteHistory(event: Event, id: string) {
    event.stopPropagation();
    this.itemToDelete = id;
  }

  async confirmDelete() {
    if (!this.itemToDelete) return;
    const id = this.itemToDelete;
    this.itemToDelete = null;

    try {
      await this.dbService.deleteAnalysis(id);
      this.ngZone.run(() => {
        this.history = this.history.filter(h => h.id !== id);
        this.cd.detectChanges();
      });
    } catch (e: any) {
      console.error(e);
      this.ngZone.run(() => alert('Failed to delete snapshot: ' + e.message));
    }
  }
}
