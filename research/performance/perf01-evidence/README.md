# PERF-01: retiro completo de novedades

Verificación local del 24 de septiembre de 2026 UTC, 23 de septiembre en Buenos Aires. Base `125bbad`. Resultado implementado y verificado localmente; publicación pendiente.

## Entorno

Build antes/después en checkout aislado, Node 24.21.0 y npm 11.19.0. Se copió `.env` de forma privada con permisos 0600, usando `coronabingo-dev`; no se modificaron archivos de entorno originales ni se guardaron sus valores en evidencia. Se fijó el runtime explícitamente: una prueba inicial fuera del repo había tomado npm 12 del shell. Los logs de referencia finales son las ejecuciones repetidas con las versiones soportadas.

El servidor de referencia del usuario en 3124 no se alteró. El candidato se ejecutó en 3128. El navegador accedió mediante un puente temporal en 3130 que conservó JS/CSS y contenido de la app, retiró del HTML los loaders de anuncios/gtag y bloqueó tráfico publicitario y de Analytics mediante CSP. Firestore de desarrollo y YouTube permanecieron accesibles. No se modificó el código de producto para QA. El puente y el checkout de prueba se retiraron al terminar.

## Evidencia

- `baseline-install.log`, `baseline-build.log`: instalación y build de la referencia.
- `install.log`, `lint.log`, `locales.log`, `tickets.log`, `build.log`: controles finales. El validador de cartones imprime éxito; no se depende solo de su código de salida.
- `dependency-diff.json`: 46 entradas eliminadas, ninguna agregada, cero cambios de versión sobrevivientes. Son 2 dependencias directas y 44 transitivas.
- `shared-transitives.json`: consumidores que todavía necesitan esprima/js-yaml; se conservaron esas dependencias compartidas.
- `bundle-before.json`, `bundle-after.json`, `bundle-comparison.json`: tamaños por ruta, gzip nivel 9, y ausencia final de fuentes de novedades. `measure-build.py` permite repetir el cálculo sobre un build.
- `http.json`: portada ES/EN 200, ambos changelogs retirados 404, cartones y favicon 200. El 200 de una ruta de sala certifica HTTP, no que exista la sala.
- `browser.json`: snapshots, URLs sintéticas, sincronización, marcas, iframes y consolas. Solo datos de desarrollo generados para esta prueba.
- `player-desktop.png`, `player-mobile.png`: juego en inglés después de reiniciar y repartir nuevamente. Ambas capturas se inspeccionaron visualmente; la vista móvil mide 375 px sin desborde.
- `verification.json`: runtime y lista de archivos de producto modificados. Fuera de esos 13 archivos solo se editaron documentos/evidencia de este esfuerzo.

## Resultado funcional

| Flujo | Resultado |
| --- | --- |
| Visitante anterior | Una página auxiliar local dejó `coronabingo-version=1.12.1` antes de abrir el candidato. No aparece modal. Ningún código activo conserva esa clave o el fetch de changelog. |
| ES/EN | Portadas y cambio de idioma del juego correctos. |
| Tutorial | Modal abre/cierra y ambos títulos se traducen. El iframe español carga el mismo video `XJpKBegq5GY` y mide 977 × 549,5625 en referencia y candidato; playback no certificado. El primer bloqueo se debió a que el puente permitía HTTPS pero la librería solicitaba el SDK por HTTP; se corrigió solo el puente y se repitió. |
| Donaciones | Modal conserva texto y opciones; cierre por Escape funciona. No se inició ninguna donación. |
| Compartir | Modal conserva Copiar/WhatsApp/Telegram. Copiar cierra y muestra confirmación. La lectura/pegado del portapapeles virtual no certifica el nativo. No se enviaron mensajes. |
| Configuración | Crear sala, agregar Ana/Beto, seleccionar anfitrión y repartir dos cartones a cada persona funciona. |
| Realtime | Anfitrión en `localhost` y jugador en `127.0.0.1`, ambos puerto 3130: la bolilla 68 llega a ambos. Es aislamiento por origen dentro de un perfil, no perfiles independientes. |
| Marcas | La marca 27 cambia de estilo y conserva `bg-orange-400` después de recargar el jugador. |
| Opciones | Selector de fondos abre, permite seleccionar Azul y cierra por Escape. |
| Reinicio | Modal de confirmación abre; anfitrión vuelve a preparación y jugador muestra espera. Nueva partida reasigna cartones y permite continuar en inglés. |
| Consola | Sin mensajes de error/advertencia en las capturas finales de anfitrión y jugador. |

Se creó exclusivamente la sala sintética `ASsVzRbrde3pmnSmZf4K`, nombre `QA PERF-01 sin novedades`, con Ana PERF01 y Beto PERF01. Las URLs de sus documentos están en `browser.json`. Se conservan para trazabilidad en `coronabingo-dev`; no se tocaron partidas existentes ni producción.

## Límites

No se validó reproducción audiovisual, portapapeles nativo, envío externo, entrega publicitaria, ingresos, ni reglas/estado de producción. Excel y la protección por código no se recertificaron de extremo a extremo en esta tanda; sus implementaciones y dependencias compartidas no cambiaron. No se recreó una suite de E2E para esta eliminación.

La [auditoría funcional anterior](../../functional-audit-2026-09-23.md) registra problemas de marcas entre pestañas, borradores al eliminar jugadores, autorización y errores genéricos. Son asuntos separados; conservar el comportamiento actual no los corrige. Los controles realizados no permiten afirmar un 100% universal.

El `node_modules` y `.next` del checkout principal no se reemplazaron porque los usa el servidor anterior abierto por el usuario. El manifiesto y lockfile sí contienen la eliminación. El siguiente `npm ci`/build habitual actualizará esos artefactos; la instalación limpia ya fue comprobada en el checkout aislado.
