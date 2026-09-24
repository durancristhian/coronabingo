# PERF-05: cargar Excel al habilitar la exportación

Estado: diagnosticado, pendiente de implementación. Prioridad media. Esfuerzo: 0,5 día. Riesgo bajo a medio. Independiente de novedades.

Status: ready-for-agent
Work status: resolved

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

## Comments

- 2026-09-24: el usuario autorizó implementar PERF-05, agregar una regresión Playwright para la exportación y, después de la verificación local, publicar la rama y abrir un pull request. La revisión del PR y sus checks forma parte del alcance; merge y Production no están autorizados.
- 2026-09-24: la implementación y regresión quedaron en `919c807`. La comprobación local de bundle, error y reintento, descarga única, contenido bilingüe y suite completa pasó; los resultados están en [la evidencia de PERF-05](../perf05-evidence/README.md).
- 2026-09-24: la revisión previa al PR detectó huecos en la observación de prefetch, la espera de una posible segunda descarga y el viewport móvil. Se corrigieron en `36a6f8f`, se compartió el setup de sala con la regresión principal y la suite compilada volvió a pasar completa.
- 2026-09-24: [PR #189](https://github.com/durancristhian/coronabingo/pull/189) quedó abierto y mergeable. GitHub Actions y Vercel pasaron para `f38f45c`; la portada del Preview cargó en una comprobación sin sesión y sin escrituras. No se ejercitó la exportación contra Firebase alojado ni se verificó Production.

## Answer

Implementado el 24 de septiembre de 2026. `DownloadSpreadsheet` precarga `zipcelx` al activarse la opción oculta, muestra carga y generación, permite reintentar un chunk fallido y evita descargas duplicadas. No se modificaron la dependencia, Firebase, el contenido del archivo ni el descubrimiento de la opción.

El JavaScript inicial de la sala bajó de 263.041 a 227.034 bytes gzip, una diferencia de 36.007 bytes. La primera exportación carga un chunk separado de 36.502 bytes gzip. La portada varió 18 bytes por el mapa de módulos asíncronos, sin incorporar el ahorro de la sala.

La nueva prueba Playwright crea la sala mediante la interfaz, demuestra que el chunk no se solicita durante la entrada, activa la exportación, falla y reintenta el chunk, conserva los jugadores y obtiene un único XLSX ante doble clic. También cubre los estados nuevos en un viewport móvil y espera para descartar una descarga duplicada tardía. La inspección puntual de los archivos español e inglés confirmó sala, anfitriona, jugador, cartones y URLs completas. Pasaron los checks y builds enumerados en [la evidencia](../perf05-evidence/README.md). No se verificaron Preview ni Production.
