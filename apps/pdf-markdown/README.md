# PDF a Markdown · Extracción Local & Optimización LLM

Webapp estática de la suite Tools para extraer texto de documentos PDF 100% en el navegador (usando PDF.js) y opcionalmente pulir, estructurar y enriquecer el contenido en formato Markdown con Inteligencia Artificial vía OpenRouter.

## Características

- **Extracción 100% Client-Side:** Gracias a PDF.js, el archivo PDF se procesa de forma íntegra en la memoria del navegador. No se envía a ningún servidor de backend para su lectura.
- **Rango de Páginas Personalizado:** Permite extraer todo el documento o rangos selectivos (ej. `1-5, 8, 12-15`).
- **Optimización Semántica con IA (OpenRouter):**
  - Generación de bloque frontmatter YAML inicial (`title`, `author`, `summary`, `key_topics`, `total_pages`).
  - Limpieza de artefactos y ruidos estructurales: números de página huérfanos, encabezados repetitivos, cortes de línea con guiones.
  - Reconstrucción de tablas en formato GitHub Flavored Markdown (GFM).
  - Jerarquía clara de encabezados (`#`, `##`, `###`).
- **Integración con Tools Suite:**
  - Consume la clave centralizada de OpenRouter (`codigos_ar_openrouter_key`) y catálogo de modelos compartidos sin inputs redundantes.
  - Previsualización en código crudo, Markdown editable y HTML renderizado con syntax highlighting.
  - Copiado rápido en un clic y descarga de archivo `.md`.
