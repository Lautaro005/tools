import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1E1E24] bg-[#0C0C0E] py-9 text-xs text-[#8A8A94]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div>© 2026 Tools Suite.</div>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/Lautaro005/tools"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#D4A843]"
          >
            Código fuente (GitHub)
          </a>
          <a
            href="../../changelog.html"
            className="transition-colors hover:text-[#D4A843]"
          >
            Changelog
          </a>
          <a
            href="../../privacy.html"
            className="transition-colors hover:text-[#D4A843]"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};
