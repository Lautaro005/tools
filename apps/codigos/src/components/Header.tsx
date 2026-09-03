import React from 'react';
import { motion } from 'framer-motion';
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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

          {/* Volver a Herramientas (Inicio) */}
          <motion.a
            href="../../index.html"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E1E24] bg-[#131316] text-[#8A8A94] transition-all hover:border-[#D4A843]/50 hover:bg-[#D4A843]/10 hover:text-[#D4A843]"
            title="Volver a la suite de herramientas"
            aria-label="Volver a herramientas"
          >
            <Home size={18} />
          </motion.a>

          {/* Settings Trigger */}
          <motion.button
            onClick={onOpenSettings}
            whileHover={{ rotate: 45 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
              hasApiKey
                ? 'border-[#1E1E24] bg-[#131316] text-[#F2F2F0] hover:border-[#D4A843]/50 hover:text-[#D4A843]'
                : 'border-[#D4A843]/40 bg-[#D4A843]/10 text-[#D4A843] hover:bg-[#D4A843]/20'
            }`}
            title={hasApiKey ? 'Ajustes de OpenRouter' : 'Configurar OpenRouter (Requerido para IA)'}
            aria-label="Ajustes"
          >
            <SettingsIcon size={18} />
            {!hasApiKey && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A843] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D4A843]"></span>
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
