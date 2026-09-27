# Referencia visual de la interfaz

Status: ready-for-agent

Work status: claimed

## Objetivo

Crear una página local, estática y responsive que reúna la interfaz actual de Coronabingo antes de iniciar un rediseño. Debe permitir revisar escenas reconocibles de la aplicación y también comparar sus componentes y estados en un solo recorrido.

## Alcance acordado

- Mostrar el inicio y la preparación de una sala.
- Recrear la mesa de juego con últimos números, bolillero, cartón y accesos a herramientas.
- Incluir sonidos, fondos, código de sala, botones, campos, mensajes, banners y carga.
- Reutilizar los componentes y estilos existentes siempre que no produzcan escrituras ni dependan de una sala real.
- Mantener la página sin conexión funcional con Firestore y marcarla como `noindex`.
- Verificar escritorio y móvil en un servidor propio de este worktree.

## Criterios de aceptación

- La ruta `/kitchen-sink` carga sin crear salas, jugadores ni otros registros.
- Las escenas principales de la aplicación se reconocen y usan el sistema visual actual.
- El contenido se adapta a una pantalla móvil y a una pantalla de escritorio sin desbordes horizontales de página.
- La página incluye el bolillero, los 90 números, un cartón, la lista completa de sonidos y todos los fondos configurados actualmente.
- Pasan `npm run lint:check`, `npm run build` y `git diff --check`.
- La comprobación de navegador queda registrada con revisión móvil y de escritorio.

## Rediseño comparativo

Alcance aprobado el 2026-09-27:

- Conservar `/kitchen-sink` como referencia original sin cambios visuales.
- Añadir tres propuestas aplicadas a la misma anatomía y contenido estático, sin cambiar tipografía, iconos ni significado funcional de cartones, bolillero, listas o controles.
- Propuesta 1: dirección cálida y lineal inspirada en time.fyi, con jerarquía tipográfica fuerte, líneas estructurales y puntos circulares en los encuentros del layout.
- Propuesta 2: evolución refinada, minimalista y profesional de la interfaz actual.
- Propuesta 3: dirección original, lúdica, simple e inclusiva, reconocible como juego para todo público.
- Añadir una vista que permita comparar las cuatro versiones lado a lado en escritorio y apiladas en pantallas angostas.

Criterios adicionales:

- Las cuatro versiones están disponibles en rutas independientes y la comparación no depende de Firestore.
- Las propuestas comparten el mismo contenido base para que las diferencias observadas sean de diseño, no de funcionalidad.
- La comparación y cada propuesta evitan desbordes horizontales de página en escritorio y móvil.
- Se conservan los 90 números, el cartón, la lista de jugadores, los sonidos y los fondos de la referencia original.

## Evidencia

- Rama y worktree: `t3code/build-ui-kitchen-sink` en `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-5c7c877e`.
- Base verificada al comenzar: `d8f5e60`. Durante la implementación `origin/main` avanzó a `4c98747`; se integró mediante `00116d7` para conservar el fondo WebP vigente.
- Implementación: `d0cf161` y ajuste al resolver actual de fondos en `c1668b7`.
- `npm run lint:check`: pasó con Node 24.21.0 y npm 11.19.0.
- `npm run build`: pasó; validó los locales y generó `/kitchen-sink` para español e inglés como página estática.
- `git diff --check`: pasó.
- Navegador de escritorio: la ruta cargó sin errores ni advertencias de consola, mostró 4 secciones, 19 sonidos y 13 fondos, y mantuvo `scrollWidth` igual a `clientWidth`.
- Navegador móvil a 375 × 812: las 4 secciones siguieron visibles y el documento mantuvo 360 px tanto de `scrollWidth` como de `clientWidth`. La tira de últimos números conserva su scroll horizontal interno, igual que la pantalla real.
- El fondo COVID-19 resolvió a `/background-cells/coronavirus.28e4692f.webp`, en línea con `origin/main`.
- Se inspeccionó la página pública de time.fyi el 2026-09-27. La propuesta 1 toma como sistema sus líneas finas, nodos circulares, superficies planas, botones píldora y jerarquía tipográfica marcada, aplicados a los componentes propios de Coronabingo.
- Rutas del estudio: original en `/kitchen-sink`, propuesta lineal en `/kitchen-sink/time`, refinada en `/kitchen-sink/refined`, lúdica en `/kitchen-sink/playful` y comparación en `/kitchen-sink/compare`.
- `npm run lint:check`: pasó para el rediseño comparativo.
- `npm run build`: pasó, validó los locales y generó las cinco rutas del estudio como páginas estáticas para español e inglés.
- `git diff --check`: pasó.
- Navegador de escritorio a 1920 px: la comparación mostró cuatro paneles simultáneos de 452 px y el documento mantuvo `scrollWidth` igual a `clientWidth` (1905 px).
- Comprobación angosta dentro de cada panel a 437 px: original y tres propuestas mantuvieron `scrollWidth` igual a `clientWidth`, 4 secciones, 90 números, 19 sonidos y 13 fondos.
- Las cuatro rutas individuales también mantuvieron `scrollWidth` igual a `clientWidth` a 1905 px. Se revisaron visualmente sus mesas de juego y la consola final no presentó errores ni advertencias de aplicación.
- No se realizaron lecturas ni escrituras en Firestore.
- Durante el estudio comparativo se usó temporalmente `npm run dev -- --port 3127` con `/kitchen-sink/compare`; ese servidor se detuvo antes de los checks de adopción. La URL vigente se registra en el handoff final.

## Comments

- 2026-09-27: implementación autorizada por el pedido de crear la primera demo y levantar un servidor local para revisión.
- 2026-09-27: se completó la referencia estática y se verificó en escritorio y móvil. No se crearon salas ni registros de juego.
- 2026-09-27: se añadieron tres direcciones visuales sobre la misma anatomía, se conservó la original y se creó la comparación simultánea solicitada.
- 2026-09-27: se eligió la propuesta 3, “Mesa de juego”, como dirección oficial. Se autorizó descartar las demás propuestas, aplicar el sistema a toda la app y abrir un pull request para revisión.

## Adopción del sistema “Mesa de juego”

Alcance aprobado el 2026-09-27:

- Aplicar la propuesta seleccionada al inicio, configuración de sala, sala de espera, mesa de juego, modales, listas, formularios y estados compartidos.
- Conservar tipografía, iconos, arquitectura de información y comportamiento funcional.
- Mantener una única ruta `/kitchen-sink` como inventario vigente del sistema visual.
- Eliminar las rutas y estilos exclusivos de las propuestas descartadas y de la comparación.
- Centralizar color, bordes, radios y elevación para permitir una etapa posterior de pulido.
- Verificar la experiencia real en escritorio y móvil, incluyendo el recorrido automatizado de anfitrión y jugador.
- Abrir un pull request contra la base verificada y monitorear GitHub y Vercel hasta un resultado terminal.

Criterios de aceptación:

- Todas las superficies reales adoptan el lenguaje “Mesa de juego” sin perder controles ni estados.
- `/kitchen-sink/time`, `/kitchen-sink/refined`, `/kitchen-sink/playful` y `/kitchen-sink/compare` dejan de existir.
- `/kitchen-sink` representa el único sistema visual vigente.
- La app mantiene navegación, creación y preparación de sala, sincronización, marcado de cartones y reinicio.
- No aparecen desbordes horizontales de página en los anchos verificados.
- Pasan `npm run lint:check`, `npm run build`, `npm run ui-tests` y `git diff --check`.

Evidencia local del 2026-09-27:

- Base de comparación verificada: `origin/main` en `4c98747`.
- `npm run lint:check`: pasó.
- `npm run build`: pasó con Next.js 16.3.6 y Webpack; validó locales y generó únicamente `/`, `/kitchen-sink` y las tres rutas dinámicas de sala.
- `npm run ui-tests`: después de los ajustes de revisión pasaron los 15 escenarios en Chromium en 63,1 s sobre `e57eb99`, contra `demo-coronabingo-ui` y Firestore Emulator. La cobertura incluyó los recorridos reales de anfitrión y jugador, marcado y reinicio, cambio de idioma, herramientas de juego y el recorrido móvil a 390 × 844 sin overflow.
- La revisión visual local cubrió el inicio y `/kitchen-sink` en escritorio; la ruta mostró 4 secciones, 90 números, 19 sonidos y 13 fondos sin desborde horizontal.
- Las advertencias de navegador observadas durante la suite pertenecen a ciclos de vida y `defaultProps` de dependencias existentes; no aparecieron fallos de aplicación.
- La revisión de código final contra `origin/main` no dejó hallazgos bloqueantes en los ejes de estándares ni especificación. Quedó una observación no bloqueante sobre posible extracción futura de presentacionales estáticos de la kitchen sink.
- [PR #205](https://github.com/durancristhian/coronabingo/pull/205) quedó abierto en `70462f2`. [GitHub Actions 36338443014](https://github.com/durancristhian/coronabingo/actions/runs/36338443014) pasó lint, build y los 15 escenarios de regresión en 43,3 s; Vercel quedó Ready.
- Preview verificado: `https://coronabingo-git-t3cod-cc7165-cristhian-durans-projects-3ace6550.vercel.app`. La portada y `/kitchen-sink` cargaron con el sistema visual, sin overflow a 1905 px; la referencia conservó 4 secciones, 90 números, 19 sonidos y 13 fondos. Las cuatro rutas descartadas respondieron 404.
- La revisión del Preview fue de solo lectura: no creó salas ni escribió datos en Firebase alojado. No se verificó ni desplegó Production.

## Ajustes posteriores a la revisión del PR

Feedback aprobado el 2026-09-27:

- Dar al campo de sólo lectura una distinción visual clara y mantenerlo realmente no editable.
- Hacer que el indicador “Dirige el juego” contraste con cualquier color de fila.
- Simplificar el estado del bolillero a una única señal: círculo relleno alrededor del número llamado, sin fondo de celda.
- Dar a los iconos de mensajes un color semántico visible para información, éxito y error.

Criterios de aceptación:

- El readonly se diferencia por superficie, borde y guía lateral, conserva contraste y permite seleccionar el texto.
- El badge de anfitrión mantiene contraste sobre filas normales, alternadas y destacadas.
- Los números llamados no combinan fondo completo y círculo.
- Cada icono semántico destaca sobre el fondo del mensaje sin depender sólo del color para comunicar el estado.
- Pasan lint, build, la regresión de UI aplicable y `git diff --check`; el Preview del PR se vuelve a inspeccionar.
