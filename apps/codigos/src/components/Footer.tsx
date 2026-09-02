import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1E1E24] bg-[#0C0C0E] py-8 text-xs text-[#8A8A94]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F2F2F0]">códigos<span className="text-[#D4A843]">·</span>ar</span>
          <span>—</span>
          <span>Plataforma de búsqueda y análisis normativo argentino</span>
        </div>

        <div className="text-[11px] text-[#8A8A94]/70">
          OpenMaus Tools Suite · 2025
        </div>
      </div>
    </footer>
  );
};
