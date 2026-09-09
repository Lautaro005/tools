import React, { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, BookOpen, Home, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
  totalArticles: number;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  hasApiKey,
  totalArticles,
}) => {
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAppsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAppsMenuOpen(false);
      }
    };
    if (isAppsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAppsMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E1E24] bg-[#0C0C0E]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-6">
        {/* Left Side: App Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
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

        {/* Right side: article count + Home popover menu + Settings */}
        <div className="flex items-center gap-3">
          {totalArticles > 0 && (
            <div className="hidden items-center gap-1.5 rounded-full border border-[#1E1E24] bg-[#131316] px-3 py-1 text-xs text-[#8A8A94] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
              <span>{totalArticles.toLocaleString('es-AR')} artículos</span>
            </div>
          )}

          {/* Apps Popover Trigger (House icon) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsAppsMenuOpen(prev => !prev)}
              aria-expanded={isAppsMenuOpen}
              aria-haspopup="true"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isAppsMenuOpen
                  ? 'border-[#D4A843]/60 bg-[#D4A843]/15 text-[#D4A843]'
                  : 'border-[#1E1E24] bg-[#131316] text-[#8A8A94] hover:border-[#D4A843]/40 hover:bg-[#D4A843]/10 hover:text-[#D4A843]'
              }`}
              title="Menú de aplicaciones de la suite"
              aria-label="Menú de aplicaciones"
            >
              <Home size={15} />
            </button>

            {/* Floating popover dropdown */}
            <AnimatePresence>
              {isAppsMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[#1E1E24] bg-[#131316] p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                  role="menu"
                >
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A8A94]/80 border-b border-[#1E1E24]/60">
                    Aplicaciones de la suite
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {/* Home */}
                    <a
                      href="../../index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        ⚡
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          Tools Suite (Inicio)
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          Catálogo centralizado
                        </div>
                      </div>
                    </a>

                    {/* Códigos AR (Active) */}
                    <a
                      href="./index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left bg-[#1E1E24]/70 border border-[#D4A843]/30 group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#D4A843]/40 bg-[#D4A843]/10 text-base">
                        ⚖️
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#D4A843] flex items-center justify-between">
                          <span>Códigos AR</span>
                          <span className="text-[10px] font-normal text-[#D4A843]/80">Actual</span>
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          Normativa legal argentina con IA
                        </div>
                      </div>
                    </a>

                    {/* Citas APA */}
                    <a
                      href="../citas/index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        📖
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          Citas APA
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          Generador bibliográfico APA 7
                        </div>
                      </div>
                    </a>

                    {/* Markdown Editor */}
                    <a
                      href="../markdown/index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        📝
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          Markdown Editor
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          Editor, visor y chat IA
                        </div>
                      </div>
                    </a>

                    {/* Transfer (AirDrop & QR) */}
                    <a
                      href="../transfer/index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        📡
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          Transfer
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          AirDrop local & QR
                        </div>
                      </div>
                    </a>

                    {/* Quitar Fondo */}
                    <a
                      href="../fondo/index.html"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        🪄
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          Quitar Fondo
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          PNG transparente con IA
                        </div>
                      </div>
                    </a>

                    {/* FinanzAR (External) */}
                    <a
                      href="https://finanzar-delta.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#1E1E24] group"
                      role="menuitem"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1E1E24] bg-[#0C0C0E] text-base group-hover:border-[#D4A843]/30">
                        💰
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
                          <span>FinanzAR</span>
                          <ExternalLink size={12} className="text-[#8A8A94] group-hover:text-[#D4A843]" />
                        </div>
                        <div className="text-[11px] text-[#8A8A94] truncate">
                          Finanzas personales
                        </div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings / Códigos AR settings */}
          <button
            onClick={onOpenSettings}
            className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-all ${
              hasApiKey
                ? 'border-[#D4A843]/40 bg-[#D4A843]/10 text-[#D4A843] hover:bg-[#D4A843]/20'
                : 'border-[#1E1E24] bg-[#131316] text-[#8A8A94] hover:border-[#D4A843]/30 hover:text-[#F2F2F0]'
            }`}
            title="Ajustes de Códigos AR (Modelos y resumen IA)"
          >
            <SettingsIcon size={14} />
            <span className="hidden sm:inline">Ajustes</span>
            {hasApiKey && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
