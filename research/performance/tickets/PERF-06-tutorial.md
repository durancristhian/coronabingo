# PERF-06: cargar el reproductor al abrir el tutorial

Estado: diagnosticado, pendiente de implementación. Prioridad media a baja. Esfuerzo: 0,5 día. Riesgo bajo. Puede ejecutarse después de PERF-01 para medir la nueva distribución de chunks.

## Diagnóstico

`pages/index.tsx` importa `react-youtube` estáticamente aunque `showModal` comienza en falso. El conjunto inicial de scripts contiene el chunk `573`, de 7.808 bytes gzip, con `react-youtube` y `youtube-player`. Esto demuestra carga de la biblioteca, no que el video o iframe se descarguen con el modal cerrado. [Baseline](../baseline-2026-09-23.json).

Esperado: diferir hasta aproximadamente 7,8 KB, alrededor de 2% del JS de portada. El chunk puede contener dependencias compartidas; no se promete eliminarlo completo.

## Alcance

Diferir el reproductor hasta intención de apertura y conservar el modal, videos por idioma, tamaños y accesibilidad. Si se precarga al foco/hover, documentar ese disparador. No reemplazar YouTube ni cambiar contenido.

## Aceptación

- Sin intención de apertura, no se descarga el código específico del reproductor; capturar requests para distinguir biblioteca, SDK remoto e iframe.
- Apertura en español e inglés con caché fría y conexión limitada funciona; cierre detiene reproducción y restaura foco; reapertura no crea reproductores duplicados.
- Error de carga muestra salida/reintento utilizable. No agregar una precarga global que anule el ahorro.
- Medir entrada y apertura por separado; checks comunes del [índice](../README.md).

Rollback: restaurar import estático del reproductor. [Next: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading).
