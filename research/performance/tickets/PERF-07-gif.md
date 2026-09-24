# PERF-07: reducir el GIF de coronavirus conservando la animación

Estado: diagnóstico de peso confirmado; alternativa visual pendiente de prueba. Prioridad media a baja. Esfuerzo: 0,5 día. Riesgo medio por calidad y preferencias guardadas. Coordinar URLs con PERF-03.

## Diagnóstico

`public/background-cells/coronavirus.gif` pesa 1.313.518 bytes tanto local como en HTTP. `ffprobe` identifica 256 × 256 y duración de 3,6 segundos. `BackgroundCells` lo usa en una miniatura de 64 px y `EmptyCell` como fondo del cartón. Puede descargarse al abrir el selector aunque no termine elegido. Se guarda su nombre en localStorage.

[Inventario](../assets-2026-09-23.json) y [HTTP](../baseline-2026-09-23.json). Objetivo exploratorio: 50–80% menos, aproximadamente 0,26–0,66 MB finales. No se codificaron candidatos ni se validó fidelidad; el rango tiene confianza baja. No beneficia la portada con fondo predeterminado.

## Alcance

Comparar codificaciones de la animación original, preferentemente WebP animado, con dimensiones adecuadas a la celda y densidad de pantalla. Preservar duración, loop, transparencia y contenido. Elegir por bytes y prueba visual en móvil, no solo por extensión. Si no hay ahorro con calidad aceptable, documentar y no sustituir.

Conservar funcionamiento de preferencias con el nombre anterior; mantener archivo antiguo o mapear el identificador. Usar URL versionada si PERF-03 está implementado. No transformar imágenes remotas introducidas por el usuario ni migrar todas las imágenes a `next/image` para resolver un CSS background.

## Aceptación

- Tabla de tamaño/formato/dimensiones de candidatos y revisión de animación en selector y cartón, Chrome/Safari, móvil/escritorio.
- Verificar calidad a la densidad prevista y ausencia de incremento perceptible de trabajo de decodificación con varias celdas animadas.
- Fondo guardado antes del cambio sigue funcionando; nueva URL y caché correctas. Mantener original recuperable.
- Medir ahorro en el flujo que descarga el fondo, sin multiplicar bytes por cantidad de celdas que reutilizan una misma URL.

Rollback: resolver el identificador al GIF original. Checks comunes del [índice](../README.md) si cambia código.
