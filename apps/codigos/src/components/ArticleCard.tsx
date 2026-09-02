import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = article.text.length > 380;
  const displayText = !isExpanded && isLong ? `${article.text.slice(0, 380)}...` : article.text;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clip = `[${article.code}] Art. ${article.number} - ${article.title}\n\n${article.text}`;
    navigator.clipboard.writeText(clip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group border-b border-[#1E1E24] py-4 transition-colors hover:border-[#1E1E24]/80"
    >
      {/* Top row: Code badge + Article number & Title + Copy button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2.5">
          {/* Code Chip */}
          <span className="inline-flex items-center rounded border border-[#D4A843]/30 bg-[#D4A843]/10 px-2 py-0.5 text-xs font-mono font-semibold text-[#D4A843]">
            {article.code}
          </span>

          {/* Article Header */}
          <h3 className="text-base font-semibold text-[#F2F2F0] group-hover:text-[#D4A843] transition-colors">
            Art. {article.number}
            {article.title && !article.title.startsWith('Artículo') && (
              <span className="font-normal text-[#F2F2F0]/90"> — {article.title}</span>
            )}
          </h3>

          <span className="hidden text-xs text-[#8A8A94]/70 sm:inline">
            ({article.codeName})
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded text-[#8A8A94] hover:bg-[#1E1E24] hover:text-[#F2F2F0] transition-colors"
          title="Copiar texto del artículo"
          aria-label="Copiar artículo"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Article text */}
      <div className="mt-2.5 pl-1">
        <p className="font-mono text-sm leading-relaxed text-[#8A8A94] whitespace-pre-line text-balance">
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#D4A843] hover:underline"
          >
            {isExpanded ? (
              <>
                <span>Mostrar menos</span>
                <ChevronUp size={12} />
              </>
            ) : (
              <>
                <span>Leer artículo completo</span>
                <ChevronDown size={12} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.article>
  );
};
