# Referencia visual de la interfaz

Status: ready-for-agent

Work status: resolved

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

Evidencia local:

- Implementación: `f762615`.
- `npm run lint:check`, `npm run build` y `git diff --check`: pasaron.
- `npm run ui-tests`: pasaron los 15 escenarios de Chromium en 62,8 s contra Firestore Emulator, incluido el recorrido móvil sin overflow.
- Revisión visual de `/kitchen-sink` a 1905 px: el readonly expuso el atributo HTML y su estilo diferenciado; el badge conservó fondo azul oscuro sobre la fila verde; las celdas llamadas quedaron transparentes alrededor de un único círculo; los iconos mostraron verde, ocre y rojo según el tipo de mensaje. El documento mantuvo `scrollWidth` igual a `clientWidth`.
- La comprobación local no leyó ni escribió Firebase alojado.
- La primera inspección del Preview de `ef36018` detectó que PurgeCSS quitaba los modificadores de color construidos dinámicamente para los iconos. Se reemplazaron por nombres de clase estáticos y se protegieron esas tres reglas semánticas durante el purge antes de considerar resuelto el feedback.
- El build de producción posterior pasó y su CSS compilado conservó `cb-message-icon--information`, `cb-message-icon--success` y `cb-message-icon--error`.
- Implementación final del ajuste: `0475f3d`. [GitHub Actions 36340804182](https://github.com/durancristhian/coronabingo/actions/runs/36340804182) pasó y Vercel quedó Ready para ese mismo HEAD.
- En el Preview se midieron los colores computados de los iconos: verde `rgb(39, 122, 93)`, ocre `rgb(149, 89, 0)` y rojo `rgb(185, 58, 53)`. También se reconfirmaron el readonly real con borde punteado, el badge azul oscuro con sombra amarilla, la celda transparente alrededor del único círculo llamado y ausencia de overflow a 1905 px.
- La verificación remota fue de solo lectura; no creó salas ni escribió datos en Firebase alojado. Production no fue desplegado ni verificado.

## Segunda ronda de feedback visual

Feedback aprobado el 2026-09-27:

- Aplicar números tabulares desde la raíz visual de la aplicación.
- Quitar la guía violeta del input de solo lectura y conservar su superficie y borde diferenciados.
- Reducir el espacio vertical del bolillero y regularizar su cuadrícula.
- Evaluar una futura dupla tipográfica de `next/font` y comprobar la cobertura de los iconos actuales en Lucide, sin migrarlos todavía.

Criterios de aceptación:

- Toda la aplicación hereda `font-variant-numeric: tabular-nums`.
- El readonly mantiene fondo apagado y borde discontinuo, sin línea violeta interior.
- El bolillero conserva 10 columnas en escritorio y 5 en móvil, con filas compactas y regulares.
- La recomendación tipográfica prioriza legibilidad numérica y carácter lúdico; la auditoría de Lucide distingue pictogramas de logos de marca.
- Pasan lint, build, la regresión de UI aplicable y `git diff --check`; el Preview del PR se vuelve a inspeccionar.

Decisiones propuestas:

- Usar `Fredoka` para títulos y `Atkinson Hyperlegible Next` para cuerpo, controles y números. Ambas familias están disponibles en `next/font/google` dentro de Next.js 16.3.6. [Google Fonts describe Fredoka](https://github.com/google/fonts/blob/main/ofl/fredoka/DESCRIPTION.en_us.html) como una familia redonda orientada a titulares; [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next) prioriza la distinción de caracteres y amplía pesos y glifos de la familia original.
- Migrar los 25 pictogramas funcionales actuales a `lucide-react` es viable. El paquete 1.48.0 declara compatibilidad con React 18 y contiene sus equivalentes, con `CirclePlay` como nombre vigente para el actual `FiPlayCircle`.
- Los cuatro logos actuales, WhatsApp, Telegram, PayPal y Twitter/X, no existen en Lucide. Su [política oficial](https://github.com/lucide-icons/lucide/blob/main/BRAND_LOGOS_STATEMENT.md) excluye logos de marca; deberían conservarse como recursos de marca o migrarse a una fuente especializada.

Evidencia local:

- `npm run lint:check`, `npm run build` y `git diff --check`: pasaron.
- Revisión de `/kitchen-sink` a 1920 px: el root computó `tabular-nums`, el readonly mantuvo fondo apagado y borde discontinuo sin `box-shadow`, y el bolillero mostró 90 celdas en 10 columnas con filas de 36 px sin separación adicional ni overflow horizontal.
- `npm run ui-tests`: pasaron los 15 escenarios de Chromium en 63,2 s contra Firestore Emulator, incluido el recorrido móvil a 390 × 844.
- La comprobación fue local y no leyó ni escribió Firebase alojado. Queda pendiente verificar el nuevo HEAD en CI y Vercel Preview.
- Implementación: `6b82f7d`. [GitHub Actions 36343091690](https://github.com/durancristhian/coronabingo/actions/runs/36343091690) pasó y Vercel quedó Ready para ese mismo HEAD.
- El Preview computó `tabular-nums` en el root, `box-shadow: none` en el readonly y una grilla de 90 celdas, 10 columnas y filas de 36 px en escritorio. `scrollWidth` y `clientWidth` coincidieron en 1905 px.
- La verificación remota fue de solo lectura; no creó salas ni escribió datos en Firebase alojado. Production no fue desplegado ni verificado.

## Laboratorio de identidad visual

Feedback aprobado el 2026-09-27:

- Añadir a `/kitchen-sink` la dupla propuesta Fredoka + Atkinson Hyperlegible Next para decidirla visualmente antes de migrar la aplicación.
- Mostrar los 25 reemplazos funcionales propuestos de Lucide sin cambiar todavía los iconos reales.
- Buscar una biblioteca SVG coherente para WhatsApp, Telegram, PayPal y X, e incorporar sus recursos a la comparación.
- Conservar la kitchen sink como demo estática, sin lecturas ni escrituras en Firestore.

Criterios de aceptación:

- La tipografía actual y la propuesta aparecen lado a lado, con títulos, cuerpo, caracteres ambiguos y una muestra numérica.
- Los 25 pictogramas funcionales auditados aparecen identificados con su nombre actual y su equivalente en Lucide.
- Los cuatro logos de marca aparecen en su color de referencia y en versión monocroma, con un origen y una advertencia de marca documentados.
- Las fuentes e iconos nuevos permanecen aislados a la kitchen sink hasta recibir aprobación explícita para migrarlos.
- La ruta no presenta desborde horizontal en escritorio ni móvil y pasan lint, build y `git diff --check`.

Evidencia local:

- Se incorporaron `lucide-react` 1.48.0 y `simple-icons` 16.33.0; la investigación de cobertura, licencia y uso de marca quedó en `research/brand-icons-simple-icons-2026-09-27.md`.
- `npm run lint:check`, `npm run build` y `git diff --check`: pasaron con Node 24.21.0 y npm 11.19.0. El build compiló `/kitchen-sink` como página estática en español e inglés y no emitió advertencias de fuentes.
- `npm run ui-tests`: pasaron los 15 escenarios de Chromium en 62,9 s contra Firestore Emulator, incluido el recorrido móvil real.
- Revisión local de escritorio a 1440 × 900: se computaron Fredoka para el título propuesto y Atkinson Hyperlegible Next para el cuerpo; aparecieron 25 muestras Lucide y 4 logos Simple Icons. Los colores computados fueron WhatsApp `rgb(37, 211, 102)`, Telegram `rgb(38, 165, 228)`, PayPal `rgb(0, 41, 145)` y X `rgb(0, 0, 0)`.
- Revisión local móvil a 390 × 844: las grillas de pictogramas y marcas conservaron dos columnas y `scrollWidth` coincidió con `clientWidth` en 375 px. La comparación tipográfica se apiló en una columna.
- La prueba de navegador fue de sólo lectura y la suite usó el proyecto aislado `demo-coronabingo-ui`; no se leyó ni escribió Firebase alojado.
- La primera revisión del Preview de `7bdc596` detectó que PurgeCSS quitaba el selector dinámico `cb-heading--h1`: el título introductorio quedaba en 24 px aunque el resto del laboratorio era correcto. Se protegieron el modificador y sus dos reglas de la kitchen sink; el build siguiente conservó los tamaños `clamp(2.5rem, 6vw, 4.5rem)` y `2.5rem` para móvil.
- Implementación final: `7bdc596` y corrección de paridad Production en `d25c73b`. [GitHub Actions 36351061754](https://github.com/durancristhian/coronabingo/actions/runs/36351061754) pasó en 2 min 37 s y Vercel quedó Ready para ese mismo HEAD.
- Preview verificado: `https://coronabingo-git-t3cod-cc7165-cristhian-durans-projects-3ace6550.vercel.app/kitchen-sink`. En escritorio a 1440 × 900 el H1 volvió a 72 px, Fredoka y Atkinson se cargaron correctamente, aparecieron las 25 muestras Lucide y los 4 logos, y `scrollWidth` coincidió con `clientWidth` en 1425 px. En móvil a 390 × 844 el H1 quedó en 40 px, ambas grillas conservaron dos columnas y no hubo overflow horizontal.
- La consola del Preview final no presentó errores ni advertencias. La verificación remota fue de sólo lectura: no creó salas ni escribió datos en Firebase alojado. Production no fue desplegado ni verificado.
- Antes del handoff, `origin/main` avanzó a `3c58867` con la instrumentación de analítica. Se integró esa base preservando tanto las clases visuales de la lista de sonidos y la mesa como el bloqueo de duplicados y los nuevos eventos. Pasaron nuevamente `npm run validate-analytics`, lint, build, `git diff --check` y los 16 escenarios de `npm run ui-tests` en 69,6 s.

## Identidad integrada y auditoría visual

Feedback aprobado el 2026-09-27:

- Adoptar Fredoka en peso 500 para títulos y Atkinson Hyperlegible Next para cuerpo, controles y números dentro de la kitchen sink.
- Adoptar Lucide para los pictogramas funcionales mostrados en la demo y Simple Icons para WhatsApp, Telegram, PayPal y X.
- Retirar las comparaciones del laboratorio y presentar una única demo integrada con escenas reales y componentes.
- Auditar armonía, color, contraste, responsive, accesibilidad y pulido antes de confirmar la migración final a toda la app.

Resultado:

- `/kitchen-sink` quedó como una única referencia integrada; se retiraron la comparación tipográfica, la galería de iconos y la galería de logos separada.
- Los logos aprobados aparecen ahora dentro del grupo real de acciones de marca y los pictogramas visibles de la demo usan Lucide.
- Los componentes compartidos aceptan iconos alternativos, pero conservan Feather como valor por defecto; esta etapa no cambia todavía la identidad tipográfica ni los iconos del resto de la aplicación.
- Fredoka se redujo a peso 500 y a un tracking más abierto; Atkinson Hyperlegible Next se aplica a todo el contenido de la kitchen sink mediante `next/font`.
- La auditoría completa quedó en [ui-design-audit-2026-09-27.md](./ui-design-audit-2026-09-27.md): obtuvo 17/20, validó la dirección y dejó cuatro correcciones P1 antes de la migración final.
- `npm run lint:check` y `npm run build`: pasaron.
- `npm run ui-tests`: pasaron los 16 escenarios de Chromium en 69,5 s contra Firestore Emulator.
- Revisión local a 1440 × 900, 390 × 844 y 320 × 800: no hubo overflow de página ni controles cortados; la consola de la demo no presentó errores ni advertencias.
- La prueba fue local y de sólo lectura; no leyó ni escribió Firebase alojado. Production no fue desplegado ni verificado.
