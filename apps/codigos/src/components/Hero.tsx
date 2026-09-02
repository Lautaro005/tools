import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  hasSearched: boolean;
}

export const Hero: React.FC<HeroProps> = ({ hasSearched }) => {
  return (
    <motion.section
      layout
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`text-center transition-all ${
        hasSearched ? 'pt-8 pb-4' : 'pt-16 pb-8 md:pt-24 md:pb-12'
      }`}
    >
      <div className="mx-auto max-w-3xl px-4">
        {/* Subtle pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10 px-3.5 py-1 text-xs font-medium text-[#D4A843]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
          <span>Normativa Argentina · CCyC + CPen + CCom</span>
        </div>

        {/* Display Title */}
        <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-[#F2F2F0] sm:text-5xl md:text-6xl text-balance">
          Consultá los códigos.{' '}
          <span className="text-[#D4A843] block sm:inline">Sin rodeos.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-[#8A8A94] sm:text-base md:text-lg max-w-xl mx-auto text-balance">
          Búsqueda de alta precisión en más de 3.300 artículos con síntesis jurídica directa potenciada por IA.
        </p>
      </div>
    </motion.section>
  );
};
