export type ThemeId = 'modern' | 'technical' | 'editorial' | 'brutalist' | 'luxury' | 'organic' | 'minimal' | 'artistic';

export interface CardTheme {
  id: ThemeId;
  name: string;
  bg: string;
  text: string;
  accent: string;
  fontSans: string;
  fontDisplay?: string;
  fontMono?: string;
}

export interface CardData {
  id: string;
  title: string;
  content: string;
  image?: string;
  bgOverride?: string;
}

export interface AppState {
  cards: CardData[];
  currentTheme: ThemeId;
  isGenerating: boolean;
}
