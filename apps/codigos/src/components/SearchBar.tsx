import React, { useState } from 'react';
import { Search, CornerDownLeft, Loader2, X } from 'lucide-react';
import { CodeType } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeFilter: 'ALL' | CodeType;
  onFilterChange: (filter: 'ALL' | CodeType) => void;
}

const SUGGESTIONS = [
  'art 14 bis constitucion',
  'legítima defensa',
  'que es una persona jurídica',
  'actos de comercio',
  'prescripción',
  'art 141 ccyc'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  activeFilter,
  onFilterChange
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (sug: string) => {
    setQuery(sug);
    onSearch(sug);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-xl border border-[#1E1E24] bg-[#131316] transition-all duration-200 focus-within:border-[#D4A843] focus-within:ring-1 focus-within:ring-[#D4A843]/30 shadow-lg">
          <div className="pl-4 text-[#8A8A94] group-focus-within:text-[#D4A843] transition-colors">
            <Search size={20} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá por artículo, tema, figura jurídica o caso..."
            className="w-full bg-transparent px-3.5 py-4 text-base text-[#F2F2F0] placeholder-[#8A8A94]/60 focus:outline-none"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 pr-2.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg p-1 text-[#8A8A94] hover:text-[#F2F2F0] transition-colors"
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex h-9 items-center justify-center gap-1 rounded-lg bg-[#D4A843] px-3.5 text-xs font-semibold text-[#0C0C0E] transition-all hover:bg-[#c39736] disabled:opacity-40 disabled:hover:bg-[#D4A843]"
              title="Buscar (Enter)"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Buscar</span>
                  <CornerDownLeft size={13} className="opacity-75" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Code Filter Tabs + Suggestions */}
      <div className="space-y-2 pt-1 text-xs">
        {/* Code Filters */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#1E1E24] bg-[#0C0C0E] p-1">
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-[#1E1E24] text-[#F2F2F0]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CCyC')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CCyC'
                ? 'bg-[#D4A843]/15 text-[#D4A843]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            CCyC
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CPen')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CPen'
                ? 'bg-[#D4A843]/15 text-[#D4A843]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            CPen
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CNA')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CNA'
                ? 'bg-[#D4A843]/15 text-[#D4A843]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            Constitución
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CCom')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CCom'
                ? 'bg-[#D4A843]/15 text-[#D4A843]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            Comercio <span className="text-rose-400 text-[10px] font-normal">(derogado)</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CCVS')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CCVS'
                ? 'bg-[#D4A843]/15 text-[#D4A843]'
                : 'text-[#8A8A94] hover:text-[#F2F2F0]'
            }`}
          >
            Vélez <span className="text-rose-400 text-[10px] font-normal">(derogado)</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8A8A94]">
          <span className="hidden sm:inline">Ejemplos:</span>
          {SUGGESTIONS.slice(0, 5).map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSuggestionClick(sug)}
              className="rounded border border-[#1E1E24] bg-[#131316] px-2 py-0.5 text-[#8A8A94] hover:border-[#D4A843]/40 hover:text-[#D4A843] transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
