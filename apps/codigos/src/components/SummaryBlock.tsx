import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, Key } from 'lucide-react';

interface SummaryBlockProps {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  model: string;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({
  summary,
  isLoading,
  error,
  onRetry,
  onOpenSettings,
  hasApiKey,
  model
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasApiKey && !isLoading && !summary && !error) {
    return (
      <div className="rounded-xl border border-[#D4A843]/30 bg-[#131316] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4A843]/10 text-[#D4A843]">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F2F2F0]">
                Activá el resumen jurídico con Inteligencia Artificial
              </h4>
              <p className="text-xs text-[#8A8A94] mt-0.5">
                Configurá tu API key de OpenRouter para recibir una síntesis automática de los artículos encontrados.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D4A843] px-3.5 py-1.5 text-xs font-semibold text-[#0C0C0E] hover:bg-[#c39736] transition-colors shrink-0"
          >
            <Key size={13} />
            <span>Configurar API</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-[#1E1E24] bg-[#131316] p-5">
      {/* Header of summary */}
      <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#D4A843]/15 text-[#D4A843]">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#D4A843]">
            Resumen Jurídico IA
          </span>
          {model && (
            <span className="rounded bg-[#0C0C0E] px-2 py-0.5 text-[10px] font-mono text-[#8A8A94]">
              {model.split('/')[1] || model}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {summary && !isLoading && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-[#8A8A94] hover:text-[#F2F2F0] transition-colors"
              title="Copiar resumen"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          )}

          {!isLoading && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 text-xs text-[#8A8A94] hover:text-[#F2F2F0] transition-colors"
              title="Regenerar síntesis"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Regenerar</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Shimmer State */}
      {isLoading && (
        <div className="space-y-3 py-1">
          <div className="h-4 w-full rounded shimmer-skeleton" />
          <div className="h-4 w-11/12 rounded shimmer-skeleton" />
          <div className="h-4 w-4/5 rounded shimmer-skeleton" />
          <div className="flex items-center gap-2 pt-2 text-xs text-[#8A8A94]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#D4A843] animate-pulse" />
            <span>Consultando modelo en OpenRouter y analizando artículos normativos...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-300">{error}</p>
              <p className="text-red-300/70 mt-0.5">
                Podés verificar la API key o cambiar el modelo en Ajustes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onOpenSettings}
              className="rounded border border-red-400/30 bg-[#0C0C0E] px-2.5 py-1 font-medium text-[#F2F2F0] hover:bg-[#1E1E24]"
            >
              Ajustes
            </button>
            <button
              onClick={onRetry}
              className="rounded bg-red-500 px-2.5 py-1 font-medium text-white hover:bg-red-600 flex items-center gap-1"
            >
              <RefreshCw size={11} /> Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Actual Summary Output */}
      {!isLoading && !error && summary && (
        <div className="border-l-2 border-[#D4A843] pl-4">
          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[#F2F2F0] whitespace-pre-line font-sans">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};
