import React from 'react';
import { Settings as SettingsIcon, BookOpen, Home } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
  totalArticles: number;
  onReset?: () => void; // kept for API compatibility; no longer used in render
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  hasApiKey,
  totalArticles,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E1E24] bg-[#0C0C0E]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-6">
        {/* Left Side: App Branding */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Logo / Wordmark — links to tools home */}
          <a
            href="../../index.html"
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
            title="Volver a la suite de herramientas"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4A843]/30 bg-[#D4A843]/10 text-[#D4A843] transition-colors group-hover:border-[#D4A843]/60 group-hover:bg-[#D4A843]/20">
              <BookOpen size={16} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold tracking-[-0.04em] text-[#F2F2F0]">
                códigos<span className="text-[#D4A843]">·</span>ar
              </span>
              <span className="hidden text-xs font-medium text-[#8A8A94] lg:inline-block">
                normativa ia
              </span>
            </div>
          </a>
        </div>

        {/* Right side: article count + Home link + Settings */}
        <div className="flex items-center gap-3">
          {totalArticles > 0 && (
            <div className="hidden items-center gap-1.5 rounded-full border border-[#1E1E24] bg-[#131316] px-3 py-1 text-xs text-[#8A8A94] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
              <span>{totalArticles.toLocaleString('es-AR')} artículos</span>
            </div>
          )}

          {/* Back to Tools Suite icon button */}
          <a
            href="../../index.html"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E1E24] bg-[#131316] text-[#8A8A94] transition-colors hover:border-[#D4A843]/40 hover:bg-[#D4A843]/10 hover:text-[#D4A843]"
            title="Volver a la suite de herramientas"
            aria-label="Volver a herramientas"
          >
            <Home size={15} />
          </a>

          {/* Settings / OpenRouter key toggle */}
          <button
            onClick={onOpenSettings}
            className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-all ${
              hasApiKey
                ? 'border-[#D4A843]/40 bg-[#D4A843]/10 text-[#D4A843] hover:bg-[#D4A843]/20'
                : 'border-[#1E1E24] bg-[#131316] text-[#8A8A94] hover:border-[#D4A843]/30 hover:text-[#F2F2F0]'
            }`}
            title="Configuración de IA (OpenRouter)"
          >
            <SettingsIcon size={14} />
            <span className="hidden sm:inline">
              {hasApiKey ? 'IA Activa' : 'Configurar IA'}
            </span>
            {hasApiKey && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
