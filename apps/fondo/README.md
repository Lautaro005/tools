# Quitar Fondo — Eliminador de Fondos PNG Transparente Real

> Aplicación web para remover el fondo de fotos e imágenes directamente en el navegador mediante inteligencia artificial local y exportar en PNG transparente genuino con canal alfa de 32 bits (sin fondos cuadriculados simulados).

## Características

- **Canal Alfa Transparente Real**:
  - Exportación en formato PNG con canal de opacidad 100% nativo (`alpha = 0`).
  - Cero patrones cuadriculados quemados en los píxeles de la imagen. La cuadrícula solo se utiliza como ayuda visual en CSS dentro del editor.
- **Doble Motor de Procesamiento**:
  - **IA Neural (BRIA RMBG-1.4)**: Segmentación con sub-pixel matting ejecutada localmente en el navegador mediante `@xenova/transformers` y WebAssembly.
  - **Recorte Rápido por Color (Chroma / Threshold)**: Detección instantánea con tolerancia ajustable y suavizado de bordes para fondos sólidos o contrastados.
- **Opciones de Visualización y Comparación**:
  - Vista previa interactiva con fondo cuadriculado CSS, oscuro o blanco.
  - Modo Split Slider para deslizar y comparar la foto original con el recorte final.
- **Atajos y Flujo Rápido**:
  - Soporte para arrastrar y soltar (Drag & Drop), selector de archivos y pegado directo desde el portapapeles (`Ctrl+V` / `Cmd+V`).
  - Copiado de la imagen PNG recortada al portapapeles con un clic.
- **100% Privacidad**:
  - Ninguna imagen sube a ningún servidor. Todo el procesamiento ocurre en la memoria local del dispositivo.
