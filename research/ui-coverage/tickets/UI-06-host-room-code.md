# UI-06: código de acceso de quien dirige

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Cubrir en un único recorrido la barrera visible de acceso a los cartones del host.

## Escenario E2E

1. Activar la opción de código desde la preparación y leer la secuencia generada.
2. Empezar la partida.
3. Verificar que el jugador común entre sin código.
4. Verificar que el host encuentre la pantalla de acceso.
5. Ingresar una secuencia incorrecta y observar el rechazo.
6. Ingresar la secuencia correcta y acceder a los cartones y controles.
7. Reiniciar la partida.
8. Empezar otra partida y verificar que el host vuelva a necesitar el código.

## Criterios de aceptación

- [x] El test obtiene el código de la sala actual y no fija emojis.
- [x] El rechazo no deja bloqueado el reintento.
- [x] Los roles usan contextos separados.
- [x] El recorrido termina con la protección activa en la partida siguiente.

## Límite

Esto verifica UX, no seguridad. La comparación ocurre en el cliente y no demuestra autorización mediante reglas de Firestore o servidor.

## Comments

### 2026-09-26

Los estados incompletos del selector de emojis salen del alcance. El ticket queda como un único flujo de acceso, juego y reinicio.

### 2026-09-26: implementación y verificación local

`tests/ui/room-code.spec.ts` agrega un recorrido Chromium en español sobre Firestore Emulator (`demo-coronabingo-ui`). Activa la opción desde la preparación visible, lee los tres emojis generados que renderiza la UI sin fijarlos, usa dos contextos para jugador y host, comprueba el rechazo de una secuencia distinta y el reintento correcto, y confirma que el reinicio seguido de una nueva partida vuelve a mostrar la barrera para quien dirige.

En el worktree `/Users/durancristhian/Repos/coronabingo-worktrees/ui-coverage-ui-06`, rama `codex/ui-coverage/ui-06`, base inicial `7b6d2fe8c8250830ed0036a2d5ac958ccc899782`, con Node 24.21.0 y npm 11.19.0:

- `npm run lint:check`, `npm run build` y `git diff --check`: pasaron.
- `npm run ui-tests -- tests/ui/room-code.spec.ts`: pasó; un caso en 5.2 s (runner 9.4 s).
- `npm run ui-tests:production -- tests/ui/room-code.spec.ts`: pasó; un caso en 3.7 s (runner 13.1 s, incluyendo build).
- `npm run ui-tests` se ejecutó dos veces con emulador fresco y falló ambos intentos en el caso preexistente `tests/ui/room.spec.ts`, al recargar una marca de cartón (`aria-pressed` quedó `false`). UI-06 pasó en esas ejecuciones. No se modificó ese flujo fuera de alcance.

Después de integrar la corrección UI-05 por separado, esta rama se rebasó sobre el nuevo HEAD del agregador sin conflictos. En ese código, `npm run lint:check`, `npm run build`, `git diff --check` y `npm run ui-tests` pasaron; la suite completa informó 9 casos aprobados en 37,1 s con Firestore Emulator fresco y el runner terminó en 41,5 s. La prueba del código y el recorrido base de marcas pasaron juntos. La revisión Standards/Spec de UI-06 se mantuvo separada; no dejó hallazgos pendientes. Esta nueva evidencia reemplaza el resultado rojo de integración anterior, sin borrar su historia.

No se accedió a Firebase alojado, Preview ni Production; los servicios del runner terminaron y no quedan datos persistentes.
