import { Article, CodeType } from '../types';

export function cleanPlainText(text: string): string {
  if (!text) return '';
  return text
    // Remove markdown headings like #, ##, ###
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic markers like **text**, *text*, __text__, _text_
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Replace bullet dashes with clean bullet dot
    .replace(/^\s*[-*+]\s+/gm, '• ')
    // Remove inline backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes >
    .replace(/^>\s+/gm, '')
    // Collapse excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function generateLegalSummary(
  apiKey: string,
  model: string,
  query: string,
  articles: Article[],
  activeFilter: 'ALL' | CodeType = 'ALL'
): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API Key no configurada');
  }

  // Pick top 10 articles to provide rich context
  const topArticles = articles.slice(0, 10);
  const contextArticles = topArticles.map(a => {
    const statusNote = a.isRepealed ? ' [DEROGADO]' : '';
    const titleText = a.title && !a.title.startsWith('Artículo') ? ` - ${a.title}` : '';
    return `[${a.codeName} (${a.code})${statusNote}] Art. ${a.number}${titleText}:\n${a.text.slice(0, 850)}`;
  }).join('\n\n---\n\n');

  const filterDescription = activeFilter === 'ALL'
    ? 'Todos los cuerpos normativos (Constitución Nacional, CCyC, CPen, CCom y Vélez).'
    : activeFilter === 'CNA'
    ? 'Constitución de la Nación Argentina exclusivamente.'
    : activeFilter === 'CCyC'
    ? 'Código Civil y Comercial de la Nación exclusivamente.'
    : activeFilter === 'CPen'
    ? 'Código Penal de la Nación Argentina exclusivamente.'
    : activeFilter === 'CCom'
    ? 'Código de Comercio histórico (derogado).'
    : 'Código Civil de Vélez Sarsfield histórico (derogado).';

  const systemPrompt = `Sos un asistente jurídico especializado y riguroso en derecho argentino.
Tu base de consulta comprende:
1. Constitución de la Nación Argentina (CNA)
2. Código Civil y Comercial de la Nación (CCyC)
3. Código Penal de la Nación Argentina (CPen)
4. Código de Comercio (CCom - derogada, valor histórico y doctrinario)
5. Código Civil de Vélez Sarsfield (CCVS - derogada, valor histórico)

Ámbito normativo consultado: ${filterDescription}

INSTRUCCIONES DE FORMATO OBLIGATORIAS:
- Respondé EXCLUSIVAMENTE en texto plano (plain text).
- ESTÁ ESTRICTAMENTE PROHIBIDO usar formato Markdown: NO uses asteriscos (* o **), NO uses numerales (#), NO uses viñetas (-), NO uses bloques de código ni títulos de sección.
- NO dividas la respuesta con títulos ni encabezados extensos. La respuesta debe ser concisa, fluida y directa, con un máximo de 2 párrafos breves.
- Citas de artículos: incorporá las citas naturalmente en el texto entre corchetes, por ejemplo [CCyC Art. 141], [Constitución Art. 14 bis] o [CPen Art. 79]. Si citás normativa derogada, aclará entre paréntesis (derogado).
- Sé directo, sobrio y técnico, explicando con claridad la solución o figura jurídica aplicable a la consulta sin preámbulos innecesarios ni listas largas.`;

  const userPrompt = `Consulta: "${query}"
Ámbito normativo: ${filterDescription}

Artículos relevantes encontrados:
${contextArticles}

Respondé en un resumen conciso y directo en texto plano (sin ningún markdown, sin títulos ni asteriscos).`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'http://localhost:5173',
        'X-Title': 'Codigos AR Legal Search'
      },
      body: JSON.stringify({
        model: model.trim() || 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Error ${response.status}: ${response.statusText}`;
      if (response.status === 401) {
        throw new Error('API Key inválida o sin autorización. Podés configurarla en el panel de Ajustes de la página principal.');
      } else if (response.status === 402) {
        throw new Error('Créditos insuficientes en la cuenta de OpenRouter.');
      } else if (response.status === 429) {
        throw new Error('Límite de solicitudes alcanzado (Rate Limit). Intentá nuevamente en unos segundos.');
      }
      throw new Error(msg);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta válida del modelo.');
    }

    return cleanPlainText(content);
  } catch (err: any) {
    console.error('OpenRouter error:', err);
    throw err;
  }
}
