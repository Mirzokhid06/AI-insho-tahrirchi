export type GenreId = 'badiiy_hikoya' | 'blog_post' | 'falsafiy_esse' | 'qisqa_hikoya';

export interface GenreDefinition {
  id: GenreId;
  label: string;
  tagline: string;
  defaultTemp: number;
  badge: string;
  hint: string;
}

export interface KeyChange {
  aspect: string;
  explanation: string;
  benefit: string;
}

export interface RewriteResult {
  improvedText: string;
  coachSummary: string;
  keyChanges: KeyChange[];
  readabilityScore: number;
  styleTone: string;
  coachTip: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  originalText: string;
  result: RewriteResult;
  genre: GenreId;
  appliedTemperature: number;
}

export interface SentenceAlternative {
  style: string;
  sentence: string;
  whyBetter: string;
}

export interface SentenceAdvice {
  coachFeedback: string;
  alternatives: SentenceAlternative[];
}

export interface WritingSample {
  id: string;
  title: string;
  genre: GenreId;
  text: string;
  note: string;
}

export interface SpellingIssue {
  id: string;
  word: string;
  suggestion: string;
  reason: string;
  index: number;
  length: number;
}
