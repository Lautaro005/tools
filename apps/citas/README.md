# Citas APA — Generador Bibliográfico (APA 7ma Edición)

Aplicación estática ligera y precisa para generar citas bibliográficas y referencias académicas bajo normas **APA 7ma Edición** a partir de URLs o páginas web.

## Objetivo

Permitir a estudiantes, investigadores y profesionales generar referencias bibliográficas instantáneas con solo ingresar el enlace de un artículo, noticia o sitio web, formateadas estrictamente según la 7ma edición del Manual APA (formato de autor, fechas, cursivas de títulos, sangría francesa, citas parentéticas y narrativas).

## Características

- **Sin dependencias pesadas ni compilación:** Funciona directamente desde el navegador de manera estática en GitHub Pages (`tools/apps/citas/index.html`).
- **Extracción multinivel de metadatos:**
  1. API de Microlink (servicio público universal sin restricciones de CORS).
  2. Fallback con proxy CORS (AllOrigins) y parseo de microdatos OpenGraph / Twitter Cards / HTML semántico vía `DOMParser`.
  3. Fallback heurístico local desde la estructura de la URL (dominio, fecha en slug y título normalizado).
- **Editor en vivo de metadatos:** Permite corregir o completar título, autor(es), sitio web, fecha de publicación, autor corporativo e inclusión de fecha de consulta/recuperación con recálculo en tiempo real.
- **Doble modo de copiado:**
  - *Texto plano*: Para pegar en cualquier editor.
  - *Texto enriquecido (HTML/RTF)*: Conserva automáticamente la cursiva (*italics*) al pegar en Microsoft Word o Google Docs.
- **Citas en el texto:** Genera citas parentéticas `(Autor, Año)` y narrativas `Autor (Año)` con botones dedicados de copiado.
- **Gestor de bibliografía local (`localStorage`):** Guarda referencias acumuladas, las ordena automáticamente en orden alfabético según APA 7, permite copiarlas en lote o descargarlas en `.txt`.
- **Integración con G-Apps:** Utiliza el mismo sistema de diseño (`Geist`, paleta oscura `#0C0C0E` / `#D4A843`), con navegación de retorno a la home `../../index.html`.

## Estructura

```text
tools/apps/citas/
├── index.html   # Aplicación web completa y autocontenida
└── README.md    # Documentación técnica de la herramienta
```

## Navegación

- Enlace de entrada desde la home: `tools/index.html` -> `./apps/citas/index.html` (reemplaza al contenedor preliminar de *Analizador de Contratos*).
- Enlace de regreso a la home: Ícono de inicio y enlaces en el header/footer dirigen a `../../index.html`.
