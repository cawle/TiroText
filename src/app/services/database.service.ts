import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { TextAnalysisData } from './analysis.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) { }

  async saveAnalysis(text: string, analysis: TextAnalysisData) {
    const user = this.authService.currentUser;
    if (!user) return null;

    const { data: analysisData, error: analysisError } = await this.supabaseService.supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        text: text,
        word_count: analysis.word_count,
        char_count: analysis.char_count,
        char_no_spaces: analysis.char_no_spaces,
        sentence_count: analysis.sentence_count,
        paragraph_count: analysis.paragraph_count,
        reading_time: analysis.reading_time,
        avg_word_length: analysis.avg_word_length,
        longest_word: analysis.longest_word,
        unique_words: analysis.unique_words
      })
      .select('id')
      .single();

    if (analysisError) throw analysisError;

    if (analysisData && analysis.word_frequencies.length > 0) {
      const frequenciesToInsert = analysis.word_frequencies.slice(0, 50).map(wf => ({
        analysis_id: analysisData.id,
        word: wf.word,
        frequency: wf.frequency
      }));

      const { error: freqError } = await this.supabaseService.supabase
        .from('word_frequencies')
        .insert(frequenciesToInsert);

      if (freqError) throw freqError;
    }

    return analysisData;
  }

  async deleteAnalysis(id: string) {
    const user = this.authService.currentUser;
    if (!user) return null;

    const { error } = await this.supabaseService.supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  }

  async getAnalysisHistory() {
    const user = this.authService.currentUser;
    if (!user) return [];

    const { data, error } = await this.supabaseService.supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getUserSettings() {
    const user = this.authService.currentUser;
    if (!user) return null;

    const { data, error } = await this.supabaseService.supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async saveUserSettings(theme: string) {
    const user = this.authService.currentUser;
    if (!user) return null;

    const existing = await this.getUserSettings();
    if (existing) {
      const { data, error } = await this.supabaseService.supabase
        .from('user_settings')
        .update({ theme })
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await this.supabaseService.supabase
        .from('user_settings')
        .insert({ user_id: user.id, theme });
      if (error) throw error;
      return data;
    }
  }
}
