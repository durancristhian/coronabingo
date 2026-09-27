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
- Servidor para revisión: `npm run dev -- --port 3127`, URL `http://localhost:3127/kitchen-sink`, ejecutado desde el worktree de la tarea. El PID final se informa en el handoff después de reiniciarlo tras los checks y commits.

## Comments

- 2026-09-27: implementación autorizada por el pedido de crear la primera demo y levantar un servidor local para revisión.
- 2026-09-27: se completó la referencia estática y se verificó en escritorio y móvil. No se crearon salas ni registros de juego.
