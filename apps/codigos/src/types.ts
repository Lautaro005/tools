export type CodeType = 'CCyC' | 'CPen' | 'CCom';

export interface Article {
  id: string;
  code: CodeType;
  codeName: string;
  number: string;
  title: string;
  text: string;
  score?: number;
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface SearchFilters {
  code: 'ALL' | CodeType;
}
