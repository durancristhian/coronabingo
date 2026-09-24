# PERF-01: retirar novedades y sus dependencias exclusivas

Status: ready-for-agent
Work status: resolved
Type: task

Estado: implementado y verificado localmente; pendiente de publicación. Alcance redefinido por el usuario: eliminar la funcionalidad de novedades y verificar el resto de la app. Sin dependencias obligatorias.

## Diagnóstico original

`pages/_app.tsx` importa `components/NewsModal.tsx` globalmente. Este importa `gray-matter` y `react-markdown` antes de comprobar la versión guardada. El `_app` publicado de 235.313 bytes gzip contiene ambas librerías y fuentes de `esprima` y `js-yaml`. La portada paga ese costo aunque sea la primera visita o ya se hayan visto las novedades.

Evidencia: [baseline publicado](../baseline-2026-09-23.json), `module_source_counts` de `_app`; [auditoría interna, punto 3](../../2026-09-23-internal-optimization-audit.md).

Hipótesis: mantener liviano el chequeo y diferir el procesamiento/renderizado hará desaparecer esas librerías del conjunto inicial de scripts. Estimación provisional: 40–80 KB gzip, 11–22% de la portada actual. No se aislaron sus bytes minificados ni se produjo un build alternativo; el rango debe validarse.

## Alcance vigente

Eliminar el modal de novedades, su montaje global, interfaz exclusiva, estilos Markdown, clave de traducción en ambos idiomas, archivos públicos de changelog y configuración de carga de Markdown sin consumidores. Retirar `gray-matter` y `react-markdown` del manifiesto y lockfile, junto con las dependencias transitivas que queden sin uso. Mantener versiones de paquetes sobrevivientes.

Conservar el Modal compartido, traducciones, noticias de prensa del footer, tutorial, compartir, donaciones, opciones, Excel, Firebase, publicidad y reglas del juego. La clave antigua `coronabingo-version` puede quedar inerte en navegadores existentes: no agregar código de migración o borrado de almacenamiento.

## Aceptación vigente

- Sin import, montaje, fetch, lectura/escritura de versión, traducción ni estilos exclusivos de novedades en el código activo; sin sus librerías en bundles cliente.
- Los changelogs retirados responden 404 en el nuevo build. No afectar rutas de salas ni otros archivos públicos.
- Auditoría del lockfile: solo las dependencias exclusivas desaparecen, sin upgrades incidentales. Instalación limpia y verificaciones de tipos, lint, idiomas, cartones y build satisfactorias.
- Comparar bundles antes/después con el mismo entorno y gzip nivel 9.
- Probar portada ES/EN, tutorial y modales compartidos; sala/configuración/juego con anfitrión y jugador independiente en desarrollo, recarga y reinicio. Registrar lo comprobado y cualquier límite preexistente sin prometer equivalencia universal.
- Actualizar ticket e índice con resultados y evidencia. No desplegar como parte de esta implementación.

## Comments

- 2026-09-24: el usuario decidió retirar la funcionalidad completa después de ver la demostración. Sustituye la propuesta de carga diferida; su estimación de 40–80 KB queda como referencia histórica, no como criterio de aceptación. Se conserva el diagnóstico original arriba.

## Answer

Se retiraron `NewsModal`, su interfaz, montaje global, traducciones exclusivas ES/EN, estilos Markdown, archivos `public/changelog` y la regla de Webpack para importar Markdown sin consumidores. Se eliminaron `gray-matter` y `react-markdown` junto con 44 entradas transitivas exclusivas del lockfile, 46 en total. No se agregaron paquetes ni cambiaron versiones sobrevivientes. `esprima` y `js-yaml` siguen instalados por herramientas compartidas y no se borraron manualmente.

El Modal compartido, tutorial, compartir, donaciones y modales de opciones permanecen. No se agregó ninguna migración de localStorage; una clave histórica de novedades queda inerte. Tampoco se modificaron Firebase, Analytics, AdSense, las reglas del juego ni otros tickets.

Dos builds limpios, con Node 24.21.0, npm 11.19.0 y el mismo entorno de desarrollo, dieron:

| Ruta | JS inicial antes, gzip | Después | Reducción |
| --- | --- | --- | --- |
| Portada | 364.589 bytes | 271.538 bytes | 93.051 bytes, 25,52% |
| Sala | 364.501 bytes | 277.751 bytes | 86.750 bytes, 23,80% |
| Preparación | 365.691 bytes | 272.310 bytes | 93.381 bytes, 25,54% |
| Cartones | 368.190 bytes | 275.051 bytes | 93.139 bytes, 25,30% |

CSS inicial: de 6.652 a 6.411 bytes gzip. La comparación local excluye scripts de manifiesto y polyfills `nomodule`; por eso el total base difiere ligeramente del probe HTTP de producción. No equivale a un 25,5% menos de tiempo de carga.

Pasaron instalación limpia, lint/tipos, validación de idiomas y cartones, build y revisión de diff. Sin fuentes de novedades ni sus renderizadores en los bundles cliente. Los dos changelogs históricos devuelven 404; inicio ES/EN y assets restantes responden correctamente.

Se probó con Chrome contra `coronabingo-dev`: visita con versión antigua, idiomas, tutorial y sus iframes, donaciones, compartir, creación/configuración, dos participantes de orígenes distintos, bolilla 68 sincronizada, marca 27 persistida tras recarga, opciones de fondo, reinicio, nueva asignación y juego en inglés. La revisión móvil midió viewport y scrollWidth de 375 px, sin desborde. Sin advertencias/errores en las consolas de anfitrión y jugador capturadas.

Límites: el portapapeles virtual de la herramienta no permite certificar el contenido del portapapeles nativo; sí se verificaron cierre y confirmación visual al copiar. YouTube se verificó hasta iframe con video y dimensiones correctos, no reproducción audiovisual. Publicidad/Analytics estuvieron bloqueados en el puente local de QA; no se validó entrega comercial. Los fallos funcionales preexistentes documentados en la auditoría no se corrigieron ni quedaron certificados por este cambio. No se afirma equivalencia universal del 100%.

La evidencia y los datos sintéticos creados están descritos en [el registro de verificación](../perf01-evidence/README.md). La implementación está verificada localmente; publicación pendiente. Reversión: restaurar únicamente los 13 archivos de producto de este ticket y reinstalar desde el lockfile restaurado.
