export type CodeType = 'CCyC' | 'CPen' | 'CCom' | 'CCVS';

export interface Article {
  id: string;
  code: CodeType;
  codeName: string;
  number: string;
  title: string;
  text: string;
  /** The source code is kept for historical reference and is no longer in force. */
  isRepealed?: boolean;
  score?: number;
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface SearchFilters {
  code: 'ALL' | CodeType;
}
