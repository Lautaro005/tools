import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1E1E24] bg-[#0C0C0E] py-9 text-xs text-[#8A8A94]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F2F2F0]">códigos<span className="text-[#D4A843]">·</span>ar</span>
          <span>—</span>
          <span>Plataforma de búsqueda y análisis normativo argentino</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11.5px]">
          <a
            href="https://github.com/Lautaro005/tools/tree/main/apps/codigos"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#D4A843]"
          >
            Código fuente (GitHub)
          </a>
          <span>·</span>
          <a
            href="../../index.html"
            className="transition-colors hover:text-[#D4A843]"
          >
            Suite de Herramientas
          </a>
          <span>·</span>
          <a
            href="../../privacy.html"
            className="transition-colors hover:text-[#D4A843]"
          >
            Política de Privacidad
          </a>
        </div>

        <div className="text-[11px] text-[#8A8A94]/70">
          Tools Suite · 2025
        </div>
      </div>
    </footer>
  );
};
