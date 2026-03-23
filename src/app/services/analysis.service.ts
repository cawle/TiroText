import { Injectable } from '@angular/core';

export interface TextAnalysisData {
  word_count: number;
  char_count: number;
  char_no_spaces: number;
  sentence_count: number;
  paragraph_count: number;
  reading_time: number;
  avg_word_length: number;
  longest_word: string;
  unique_words: number;
  word_frequencies: { word: string; frequency: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  
  analyzeText(text: string): TextAnalysisData {
    if (!text || text.trim().length === 0) {
      return this.getEmptyStats();
    }

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraph_count = paragraphs.length;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentence_count = sentences.length;
    
    const rawWords = text.match(/\b\w+\b/g) || [];
    const lowerWords = rawWords.map(w => w.toLowerCase());
    const word_count = rawWords.length;
    
    const reading_time = word_count > 0 ? Math.max(1, Math.ceil(word_count / 250)) : 0;
    
    const totalWordLength = rawWords.reduce((sum, word) => sum + word.length, 0);
    const avg_word_length = word_count > 0 ? parseFloat((totalWordLength / word_count).toFixed(2)) : 0;
    
    const longest_word = rawWords.reduce((longest, current) => current.length > longest.length ? current : longest, "");
    
    const frequencies: { [key: string]: number } = {};
    for (const w of lowerWords) {
      frequencies[w] = (frequencies[w] || 0) + 1;
    }
    
    const unique_words = Object.keys(frequencies).length;
    
    const sortedFrequencies = Object.keys(frequencies)
      .map(word => ({ word, frequency: frequencies[word] }))
      .sort((a, b) => b.frequency - a.frequency);

    return {
      word_count,
      char_count: chars,
      char_no_spaces: charsNoSpaces,
      sentence_count,
      paragraph_count,
      reading_time,
      avg_word_length,
      longest_word,
      unique_words,
      word_frequencies: sortedFrequencies
    };
  }

  private getEmptyStats(): TextAnalysisData {
    return {
      word_count: 0,
      char_count: 0,
      char_no_spaces: 0,
      sentence_count: 0,
      paragraph_count: 0,
      reading_time: 0,
      avg_word_length: 0,
      longest_word: "",
      unique_words: 0,
      word_frequencies: []
    };
  }
}
