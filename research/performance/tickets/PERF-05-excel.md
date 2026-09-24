# PERF-05: cargar Excel al habilitar la exportación

Estado: diagnosticado, pendiente de implementación. Prioridad media. Esfuerzo: 0,5 día. Riesgo bajo a medio. Independiente de novedades.

## Diagnóstico

`components/DownloadSpreadsheet.tsx` importa `zipcelx` estáticamente. La ruta `pages/room/[roomId].tsx` importa ese componente aunque lo monte solamente cuando `isActive` habilita la opción oculta. El chunk publicado `735` contiene `zipcelx`/`jszip`: 104.717 bytes sin comprimir y 29.861 gzip. [Baseline](../baseline-2026-09-23.json).

Esperado: diferir alrededor de 29,9 KB al entrar a la sala si no se usa Excel. No beneficia los 365 KB iniciales de portada: ese chunk no forma parte de ellos. Confirmar división final y prefetch de rutas en navegador.

## Alcance

Importar la biblioteca o componente bajo demanda; precargar cuando el usuario habilita la opción para reducir espera al descargar. Conservar descubrimiento de la opción, formato, nombre de archivo, idiomas y URLs. Resolver carga/error sin descargas duplicadas ante clics repetidos.

## Aceptación

- Entrada a sala con opción inactiva no descarga ni ejecuta Excel; activar la opción inicia la carga prevista.
- Primera descarga con caché fría funciona y deja respuesta visible mientras carga. Error de chunk permite reintentar sin perder el estado de sala.
- Inspeccionar XLSX en español e inglés: sala, anfitrión, jugadores, cartones y URLs completos; comparar con el formato actual.
- Registrar bytes de entrada a sala y primera exportación por separado. Cumplir checks comunes del [índice](../README.md).

Rollback: restaurar el import estático. No cambiar la dependencia ni actualizar Firebase en este ticket.
