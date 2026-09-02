import { Article, CodeType } from '../types';

const STOP_WORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'es',
  'en', 'por', 'para', 'con', 'su', 'sus', 'del', 'al', 'se', 'lo', 'como',
  'cual', 'cuales', 'son', 'a', 'e', 'o', 'u', 'y', 'sobre', 'entre', 'sin',
  'ante', 'bajo', 'cabe', 'desde', 'hacia', 'hasta', 'tras', 'pasa', 'si',
  'caso', 'casos', 'persona', 'personas', 'alguien', 'algo'
]);

const HOMICIDE_QUERY = /\b(mat(?:ar|o|as|e|an|aron)|muerte|muere|murio|homicidio|asesin)/i;

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
  const isHomicideQuery = HOMICIDE_QUERY.test(normQ);

  const isDefQuery =
    /^(que es|que son|concepto|definicion|que se entiende)/i.test(normQ) ||
    normQ.includes('que es') ||
    normQ.includes('definicion') ||
    normQ.includes('concepto');

  // Direct number check e.g. "art 141", "art. 79", "34"
  const artNumberMatch = rawQuery.match(/(?:art(?:[ií]culo)?\.?\s*)?(\d+(?:\s*(?:bis|ter|quater))?)/i);
  const requestedNumber = artNumberMatch ? artNumberMatch[1].trim().toLowerCase() : null;

  // Code explicit mention detection
  const mentionsCCyC = /\b(ccyc|civil y comercial)\b/i.test(normQ);
  const mentionsCPen = /\b(cpen|penal|codigo penal)\b/i.test(normQ);
  const mentionsCNA = /\b(cna|constitucion|constitucional)\b/i.test(normQ);
  const mentionsCCom = /\b(ccom|comercio|codigo de comercio)\b/i.test(normQ);
  const mentionsCCVS = /\b(ccvs|velez|sarsfield)\b/i.test(normQ);

  const results: { article: Article; score: number }[] = [];

  for (const article of articles) {
    if (filterCode !== 'ALL' && article.code !== filterCode) {
      continue;
    }

    let score = 0;
    let substantiveMatches = 0;
    const titleNorm = normalizeText(article.title);
    const textNorm = normalizeText(article.text);
    const titleStripped = stripPlurals(titleNorm);
    const textStripped = stripPlurals(textNorm);
    const numNorm = article.number.toLowerCase();

    // Intent rules keep plain-language criminal questions from being drowned out
    // by generic words such as "persona" in civil-law articles.
    if (isHomicideQuery && article.code === 'CPen') {
      if (HOMICIDE_QUERY.test(textNorm) || HOMICIDE_QUERY.test(titleNorm)) score += 200;
      if (numNorm === '79') score += 420; // homicidio simple
      if (['80', '81', '82', '83', '84', '84 bis', '85', '86', '41 bis'].includes(numNorm)) score += 180;
    }

    // Boost articles when the user explicitly mentions the specific legal body
    if (mentionsCCyC && article.code === 'CCyC') score += 350;
    if (mentionsCPen && article.code === 'CPen') score += 350;
    if (mentionsCNA && article.code === 'CNA') score += 350;
    if (mentionsCCom && article.code === 'CCom') score += 350;
    if (mentionsCCVS && article.code === 'CCVS') score += 350;

    // 1. Direct article number match
    if (requestedNumber) {
      if (numNorm === requestedNumber) {
        score += 480;
      } else if (numNorm.startsWith(requestedNumber + ' ')) {
        score += 320;
      }
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
      if (titleNorm.includes(w)) { score += 35; substantiveMatches++; }
      if (textNorm.includes(w)) { score += 12; substantiveMatches++; }
    }

    // 4. Stripped words match (covers plurals and gender)
    for (const w of strippedWords) {
      if (titleStripped.includes(w)) { score += 25; substantiveMatches++; }
      if (textStripped.includes(w)) { score += 10; substantiveMatches++; }
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

    // A criminal-intent query should never surface civil articles merely because
    // they contain a broad term. Penal articles are retained by the intent rule.
    if (isHomicideQuery && article.code !== 'CPen') continue;

    if (score > 35 && (requestedNumber || isHomicideQuery || substantiveMatches >= 2 || strippedPhrase.length > 2 && textStripped.includes(strippedPhrase))) {
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
