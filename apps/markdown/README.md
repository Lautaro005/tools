# Markdown Editor · Tools Suite

Herramienta de edición y previsualización de documentos Markdown con soporte para asistente IA contextual integrado con OpenRouter.

## Características

- **Gestión de Archivos:** Creación, edición de nombre, eliminación y listado de múltiples documentos guardados en `localStorage` (`tools_markdown_docs`).
- **Importación & Descarga:** Carga directa de archivos `.md`, `.markdown` o `.txt` desde tu computadora o mediante drag & drop, y descarga instantánea en formato `.md`.
- **Toolbar de Formato (Mini Header):** Botones rápidos para encabezados (H1, H2, H3), negrita (`**`), cursiva (`*`), subrayado (`<u>`), tachado (`~~`), código en línea y bloque (` ``` `), citas (`>`), listas (viñetas, numeradas y tareas con checkboxes), tablas, enlaces e imágenes.
- **Vista Previa en Vivo:** Renderizado con GitHub Flavored Markdown (GFM), resaltado de código mediante `highlight.js` y checkboxes interactivos.
- **Modos de Vista:** Split (dividido), Solo Editor y Solo Preview.
- **Asistente IA Contextual:** Panel lateral de chat alimentado por la API de OpenRouter (`https://openrouter.ai/api/v1/chat/completions`) que inyecta automáticamente el contenido del archivo abierto en el prompt para resumir, mejorar redacción, crear tablas de contenidos o traducir, con botones para copiar, insertar o reemplazar el documento.
- **Sincronización de Ajustes:** Comparte la clave de API (`codigos_ar_openrouter_key`), modelo activo (`codigos_ar_openrouter_model`) y modelos guardados (`codigos_ar_saved_models`) con Códigos AR y la página principal de Tools Suite.
- **Responsive & Accesible:** Diseñado con los tokens de color y tipografías Geist de G-Apps, sin scroll horizontal (`overflow-x: hidden`).
