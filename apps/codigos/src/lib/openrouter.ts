import { Article, CodeType } from '../types';

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

  // Pick top 10 articles to provide rich, comprehensive context across sources
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
4. Código de Comercio (CCom - normativa derogada de valor histórico y doctrinario)
5. Código Civil de Vélez Sarsfield (CCVS - normativa derogada de valor civil histórico)

Ámbito normativo consultado: ${filterDescription}

Tu tarea es responder la consulta del usuario de forma concisa, rigurosa y directa utilizando los artículos provistos como sustento normativo principal.

Estructura de respuesta requerida:
1. Resumen conceptual claro y sintético (1 o 2 párrafos) respondiendo la pregunta o explicando la figura jurídica consultada.
2. Cita precisa y destacada de los artículos aplicables en formato [Cuerpo Normativo] Art. X (ej: [Constitución] Art. 14 bis, [CCyC] Art. 141, [CPen] Art. 79, [Comercio - Derogado] Art. 8, [Vélez - Derogado] Art. 1).
3. En caso de que se citen artículos de regímenes derogados (Código de Comercio o Vélez Sarsfield), advertir explícitamente su carácter de derecho derogado y su vigencia histórica.
4. Conclusión o efecto jurídico práctico relevante.

Reglas:
- Sé sobrio, técnico y preciso sin perder claridad divulgativa.
- Basate primordialmente en los artículos provistos en el contexto.
- No inventes artículos ni números que no consten en las fuentes provistas.
- Si los artículos provistos no agotan completamente la consulta, aclará el alcance normativo.`;

  const userPrompt = `Consulta del usuario: "${query}"
Filtro normativo seleccionado: ${filterDescription}

Artículos relevantes encontrados:
${contextArticles}

Generá el resumen legal conciso y la fundamentación jurídica según las instrucciones.`;

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
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Error ${response.status}: ${response.statusText}`;
      if (response.status === 401) {
        throw new Error('API Key inválida o sin autorización. Verificá tus credenciales en Ajustes ⚙.');
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

    return content;
  } catch (err: any) {
    console.error('OpenRouter error:', err);
    throw err;
  }
}
