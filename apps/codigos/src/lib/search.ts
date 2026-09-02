import { Article, CodeType } from '../types';

const STOP_WORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'es',
  'en', 'por', 'para', 'con', 'su', 'sus', 'del', 'al', 'se', 'lo', 'como',
  'cual', 'cuales', 'son', 'a', 'e', 'o', 'u', 'y', 'sobre', 'entre', 'sin',
  'ante', 'bajo', 'cabe', 'desde', 'hacia', 'hasta', 'tras'
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripPlurals(str: string): string {
  return str.replace(/\b(\w{3,})(?:es|s)\b/g, '$1');
}

export function searchArticles(
  articles: Article[],
  rawQuery: string,
  filterCode: 'ALL' | CodeType = 'ALL'
): Article[] {
  if (!rawQuery.trim()) return [];

  const normQ = normalizeText(rawQuery);
  const strippedQ = stripPlurals(normQ);

  const rawWords = normQ.split(' ').filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const strippedWords = strippedQ.split(' ').filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const strippedPhrase = strippedWords.join(' ');

  const isDefQuery =
    /^(que es|que son|concepto|definicion|que se entiende)/i.test(normQ) ||
    normQ.includes('que es') ||
    normQ.includes('definicion') ||
    normQ.includes('concepto');

  // Direct number check e.g. "art 141", "art. 79", "34"
  const artNumberMatch = rawQuery.match(/(?:art(?:[ií]culo)?\.?\s*)?(\d+(?:\s*(?:bis|ter|quater))?)/i);
  const requestedNumber = artNumberMatch ? artNumberMatch[1].trim().toLowerCase() : null;

  const results: { article: Article; score: number }[] = [];

  for (const article of articles) {
    if (filterCode !== 'ALL' && article.code !== filterCode) {
      continue;
    }

    let score = 0;
    const titleNorm = normalizeText(article.title);
    const textNorm = normalizeText(article.text);
    const titleStripped = stripPlurals(titleNorm);
    const textStripped = stripPlurals(textNorm);
    const numNorm = article.number.toLowerCase();

    // 1. Direct article number match
    if (requestedNumber && (numNorm === requestedNumber || numNorm.startsWith(requestedNumber + ' '))) {
      score += 450;
    }

    // 2. Exact stripped phrase match
    if (strippedPhrase.length > 2) {
      if (titleStripped.includes(strippedPhrase)) {
        score += 140;
      }
      if (textStripped.includes(strippedPhrase)) {
        score += 65;
      }
      // Direct definition opening bonus
      if (
        textStripped.startsWith(strippedPhrase) ||
        textStripped.startsWith('son ' + strippedPhrase) ||
        textStripped.startsWith('es ' + strippedPhrase) ||
        textStripped.startsWith('se llama ' + strippedPhrase) ||
        textStripped.startsWith('se entiende por ' + strippedPhrase) ||
        textStripped.startsWith('la ' + strippedPhrase) ||
        textStripped.startsWith('el ' + strippedPhrase)
      ) {
        score += 260;
      }
    }

    // 3. Exact raw words match
    for (const w of rawWords) {
      if (titleNorm.includes(w)) score += 35;
      if (textNorm.includes(w)) score += 12;
    }

    // 4. Stripped words match (covers plurals and gender)
    for (const w of strippedWords) {
      if (titleStripped.includes(w)) score += 25;
      if (textStripped.includes(w)) score += 10;
    }

    // 5. Query tokens coverage
    const wordsToCheck = strippedWords.length > 0 ? strippedWords : rawWords;
    if (wordsToCheck.length > 0) {
      const allPresent = wordsToCheck.every(w => titleStripped.includes(w) || textStripped.includes(w));
      if (allPresent) {
        score += 50;
        if (isDefQuery && (titleNorm.includes('definicion') || titleNorm.includes('concepto'))) {
          score += 220;
        }
      }
    }

    if (score > 35) {
      results.push({
        article: { ...article, score },
        score
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 50).map(r => r.article);
}
