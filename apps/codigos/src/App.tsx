import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { ResultsPanel } from './components/ResultsPanel';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { useSettings } from './hooks/useSettings';
import { useArticles } from './hooks/useArticles';
import { searchArticles } from './lib/search';
import { generateLegalSummary } from './lib/openrouter';
import { CodeType, Article } from './types';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { settings, saveSettings, hasApiKey } = useSettings();
  const { articles, isLoading: isArticlesLoading, error: articlesError } = useArticles();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | CodeType>('ALL');

  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Filtered/matched articles
  const matchedArticles = useMemo(() => {
    if (!currentQuery.trim() || articles.length === 0) return [];
    return searchArticles(articles, currentQuery, activeFilter);
  }, [articles, currentQuery, activeFilter]);

  // Handle AI summary fetch
  const triggerSummary = useCallback(
    async (queryText: string, foundArticles: Article[], filter: 'ALL' | CodeType = activeFilter) => {
      if (!settings.apiKey.trim()) {
        setSummary(null);
        setSummaryError(null);
        setIsSummaryLoading(false);
        return;
      }

      if (foundArticles.length === 0) {
        setSummary(null);
        setIsSummaryLoading(false);
        return;
      }

      setIsSummaryLoading(true);
      setSummaryError(null);

      try {
        const text = await generateLegalSummary(
          settings.apiKey,
          settings.model,
          queryText,
          foundArticles,
          filter
        );
        setSummary(text);
      } catch (err: any) {
        console.error('Error generating summary:', err);
        setSummaryError(err.message || 'Error al conectar con OpenRouter');
      } finally {
        setIsSummaryLoading(false);
      }
    },
    [settings.apiKey, settings.model, activeFilter]
  );

  // User triggers a search
  const handleSearch = useCallback(
    (query: string) => {
      setCurrentQuery(query);
      const results = searchArticles(articles, query, activeFilter);
      triggerSummary(query, results, activeFilter);
    },
    [articles, activeFilter, triggerSummary]
  );

  // User changes filter
  const handleFilterChange = useCallback(
    (newFilter: 'ALL' | CodeType) => {
      setActiveFilter(newFilter);
      if (currentQuery.trim()) {
        const results = searchArticles(articles, currentQuery, newFilter);
        triggerSummary(currentQuery, results, newFilter);
      }
    },
    [articles, currentQuery, triggerSummary]
  );

  const handleRetrySummary = useCallback(() => {
    if (currentQuery.trim()) {
      triggerSummary(currentQuery, matchedArticles, activeFilter);
    }
  }, [currentQuery, matchedArticles, activeFilter, triggerSummary]);

  const handleReset = useCallback(() => {
    setCurrentQuery('');
    setSummary(null);
    setSummaryError(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0C0C0E] text-[#F2F2F0]">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
        totalArticles={articles.length}
        onReset={handleReset}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6">
        {/* If articles are still loading initially */}
        {isArticlesLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
            <p className="mt-3 text-sm text-[#8A8A94]">
              Cargando e indexando artículos de Códigos de la Nación...
            </p>
          </div>
        )}

        {/* If error loading dataset */}
        {!isArticlesLoading && articlesError && (
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-200">
            <p className="font-semibold">Error al cargar la base de artículos:</p>
            <p className="mt-1 text-xs opacity-80">{articlesError}</p>
          </div>
        )}

        {/* Ready */}
        {!isArticlesLoading && !articlesError && (
          <div className="mx-auto max-w-4xl">
            <Hero hasSearched={Boolean(currentQuery)} />

            {/* Search Bar */}
            <div className="py-2">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isSummaryLoading}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Results Panel */}
            {currentQuery && (
              <ResultsPanel
                query={currentQuery}
                articles={matchedArticles}
                summary={summary}
                isSummaryLoading={isSummaryLoading}
                summaryError={summaryError}
                onRetrySummary={handleRetrySummary}
                onOpenSettings={() => setIsSettingsOpen(true)}
                hasApiKey={hasApiKey}
                model={settings.model}
              />
            )}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default App;
