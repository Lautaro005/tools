# Website a Markdown · Jina Reader & Optimización LLM

Webapp de la suite Tools para extraer artículos y páginas web en formato Markdown limpio y listo para LLMs, combinando el endpoint `r.jina.ai`, fallback local para código HTML crudo y refinamiento con IA de OpenRouter.

## Características

- **Jina Reader Endpoint (`r.jina.ai`):** Scraping y parseo directo a Markdown sin banners ni código superfluo.
- **Fallback Local de HTML:** Para páginas que requieran inicio de sesión o bloqueen requests automáticos, el usuario puede pegar el código HTML crudo y convertirlo a Markdown en el navegador mediante Turndown.
- **Pulido y Estructuración para LLM (OpenRouter):**
  - Elimina de forma inteligente cualquier remanente de menús, cookies y publicidad.
  - Genera frontmatter YAML inicial (`title`, `source_url`, `author`, `published_date`, `summary`, `key_takeaways`).
  - Estandariza la jerarquía de títulos (`#`, `##`, `###`).
- **Integración con Tools Suite:**
  - Consume la clave centralizada de OpenRouter (`codigos_ar_openrouter_key`) y catálogo de modelos compartidos sin inputs redundantes.
  - Previsualización en código Markdown, HTML renderizado y salida cruda.
  - Copiado rápido y descarga del archivo `.md`.
