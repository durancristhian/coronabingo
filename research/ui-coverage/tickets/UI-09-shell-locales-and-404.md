# UI-09: cambio de idioma en una ruta de juego

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Verificar que el cambio de idioma conserve una ruta dinámica y el estado necesario para seguir jugando.

## Escenario E2E

1. Preparar una sala y abrir los cartones de una persona en español.
2. Cambiar el selector a inglés.
3. Verificar que la URL conserve `roomId` y `playerId`.
4. Verificar el encabezado en inglés y los mismos IDs de cartón.
5. Sortear o recibir un número para comprobar que la sesión sigue activa.

## Criterios de aceptación

- [x] El test usa el selector visible, sin navegar directamente a otra URL.
- [x] No se crea una segunda sala para probar el idioma.
- [x] La conexión con Firestore continúa después del cambio.

## Fuera de Playwright

Logo, links del pie, donación, fallback de `localStorage` y la página 404 genérica salen del backlog. Los links pueden probarse por componente.

No se deben agregar tests de ningún tipo para rutas retiradas como `/admin`, `/eventos/[eventId]` o `/eventos/[eventId]/admin`. Esta exclusión no afecta a `/room/[roomId]/admin`, que sigue activo y forma parte del happy path de una sala.

## Comments

### 2026-09-26

El ticket original mezclaba navegación, enlaces, modales y 404. Se conserva solo la transición de idioma dentro de una partida real.

### 2026-09-26: implementación en curso

Se reclama UI-09 en `codex/ui-coverage/ui-09`, desde `d89b0a41c4d3a0c0770503abf9cceae6c7a1dc17`. La cobertura usará una sala efímera del emulador local y el selector visible de idioma.

## Answer

`tests/ui/shell-locales.spec.ts` crea una sala con dos personas en español. El jugador abre sus dos cartones por la UI y cambia el selector `language` a inglés. El caso compara los dos segmentos dinámicos de la URL antes y después, comprueba el encabezado y los dos IDs de cartón en inglés, y recibe un número sorteado por el host en otro contexto. No abre otra sala.

## Evidence

Validación local en `/Users/durancristhian/Repos/coronabingo-worktrees/ui-coverage-ui-09`, rama `codex/ui-coverage/ui-09`, desde la base `d89b0a41c4d3a0c0770503abf9cceae6c7a1dc17`:

- `npm run ui-tests -- tests/ui/shell-locales.spec.ts` pasó con un caso.
- `npm run lint:check`, `npm run build` y `git diff --check` pasaron.
- `npm run ui-tests` pasó 13 casos en desarrollo.
- `npm run ui-tests:production` pasó 13 casos. Playwright informó 19.3 s y el runner completo 29.3 s.

Cada corrida usó Node 24.21.0, npm 11.19.0, `http://127.0.0.1:3187` y el Firestore Emulator `demo-coronabingo-ui` en `127.0.0.1:8187`. Los procesos y el lock del runner terminaron al finalizar. No se usó Firebase alojado, Preview ni Production.
