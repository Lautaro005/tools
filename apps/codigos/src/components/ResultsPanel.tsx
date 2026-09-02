import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Landmark, ShieldAlert } from 'lucide-react';
import { Article, CodeType } from '../types';
import { ArticleCard } from './ArticleCard';
import { SummaryBlock } from './SummaryBlock';

interface ResultsPanelProps {
  query: string;
  articles: Article[];
  summary: string | null;
  isSummaryLoading: boolean;
  summaryError: string | null;
  onRetrySummary: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  model: string;
}

interface CodeGroup {
  code: CodeType;
  name: string;
  icon: React.ReactNode;
  articles: Article[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  query,
  articles,
  summary,
  isSummaryLoading,
  summaryError,
  onRetrySummary,
  onOpenSettings,
  hasApiKey,
  model
}) => {
  if (!query) return null;

  // Group articles by legal code
  const groups: CodeGroup[] = [
    {
      code: 'CCyC',
      name: 'Código Civil y Comercial de la Nación',
      icon: <Scale size={16} className="text-[#D4A843]" />,
      articles: articles.filter(a => a.code === 'CCyC')
    },
    {
      code: 'CPen',
      name: 'Código Penal de la Nación Argentina',
      icon: <ShieldAlert size={16} className="text-rose-400" />,
      articles: articles.filter(a => a.code === 'CPen')
    },
    {
      code: 'CCom',
      name: 'Código de Comercio',
      icon: <Landmark size={16} className="text-amber-400" />,
      articles: articles.filter(a => a.code === 'CCom')
    },
    {
      code: 'CCVS',
      name: 'Código Civil de Vélez Sarsfield',
      icon: <Landmark size={16} className="text-amber-400" />,
      articles: articles.filter(a => a.code === 'CCVS')
    }
  ];

  const activeGroups = groups.filter(g => g.articles.length > 0);

  // Empty state if no articles matched
  if (articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="mx-auto mt-10 max-w-2xl text-center py-12 rounded-xl border border-[#1E1E24] bg-[#131316] p-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C0C0E] border border-[#1E1E24] text-3xl font-serif text-[#D4A843]">
          §
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#F2F2F0]">
          No se encontraron artículos para "{query}"
        </h3>
        <p className="mt-1.5 text-xs text-[#8A8A94] max-w-md mx-auto">
          Probá buscando por palabras clave (ej: "persona jurídica", "homicidio", "compraventa"),
          o directamente por número de artículo (ej: "art 141", "art 79").
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="mx-auto max-w-3xl space-y-8 pt-4 pb-16"
    >
      {/* 1. Resumen IA at the top */}
      <SummaryBlock
        summary={summary}
        isLoading={isSummaryLoading}
        error={summaryError}
        onRetry={onRetrySummary}
        onOpenSettings={onOpenSettings}
        hasApiKey={hasApiKey}
        model={model}
      />

      {/* 2. Results Header Stats */}
      <div className="flex items-center justify-between border-b border-[#1E1E24] pb-2 text-xs text-[#8A8A94]">
        <span>
          <strong className="text-[#F2F2F0] font-semibold">{articles.length}</strong> artículos encontrados para "{query}"
        </span>
        <span>Organizados por código normativo</span>
      </div>

      {/* 3. Articles grouped and separated by code */}
      <div className="space-y-10">
        {activeGroups.map(group => (
          <section key={group.code} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-[#1E1E24] pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#131316] border border-[#1E1E24]">
                  {group.icon}
                </span>
                <h3 className="text-sm font-semibold text-[#F2F2F0]">
                  {group.name}
                </h3>
                {(group.code === 'CCom' || group.code === 'CCVS') && (
                  <span className="rounded border border-rose-400/30 bg-rose-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-300">
                    Derogado
                  </span>
                )}
              </div>
              <span className="rounded-full bg-[#131316] border border-[#1E1E24] px-2.5 py-0.5 text-[11px] font-mono text-[#D4A843]">
                {group.articles.length} {group.articles.length === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            {/* List of articles */}
            <div className="divide-y divide-[#1E1E24]/60">
              {group.articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
};
