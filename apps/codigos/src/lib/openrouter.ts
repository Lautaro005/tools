import { Article } from '../types';

export async function generateLegalSummary(
  apiKey: string,
  model: string,
  query: string,
  articles: Article[]
): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API Key no configurada');
  }

  // Pick top 8 articles to send as context (to avoid exceeding context window while providing relevant content)
  const topArticles = articles.slice(0, 8);
  const contextArticles = topArticles.map(a => 
    `[${a.code}] Art. ${a.number} - ${a.title}:\n${a.text.slice(0, 700)}`
  ).join('\n\n---\n\n');

  const systemPrompt = `Sos un asistente jurídico especializado en derecho argentino (Código Civil y Comercial, Código Penal y Código de Comercio).
Tu tarea es responder la consulta del usuario de forma concisa, rigurosa y directa a partir de los artículos provistos.

Estructura de respuesta requerida:
1. Resumen claro y sintético (1 o 2 párrafos) explicando el concepto o respuesta a la pregunta.
2. Mención precisa y destacada de los artículos aplicables en formato [Código] Art. X (ej: [CCyC] Art. 141, [CPen] Art. 79).
3. Conclusión o efecto jurídico práctico relevante si corresponde.

Reglas:
- Sé sobrio, preciso y técnico sin perder claridad.
- No inventes artículos que no existan en la normativa.
- Si los artículos no cubren totalmente la consulta, aclará el alcance normativo.`;

  const userPrompt = `Consulta: "${query}"

Artículos relevantes encontrados en los códigos:
${contextArticles}

Generá el resumen legal conciso y la vinculación con los artículos anteriores.`;

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
