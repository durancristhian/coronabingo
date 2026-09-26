# UI-09: cambio de idioma en una ruta de juego

Status: needs-triage

Work status: open

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

- [ ] El test usa el selector visible, sin navegar directamente a otra URL.
- [ ] No se crea una segunda sala para probar el idioma.
- [ ] La conexión con Firestore continúa después del cambio.

## Fuera de Playwright

Logo, links del pie, donación, fallback de `localStorage` y la página 404 genérica salen del backlog. Los links pueden probarse por componente.

No se deben agregar tests de ningún tipo para rutas retiradas como `/admin`, `/eventos/[eventId]` o `/eventos/[eventId]/admin`. Esta exclusión no afecta a `/room/[roomId]/admin`, que sigue activo y forma parte del happy path de una sala.

## Comments

### 2026-09-26

El ticket original mezclaba navegación, enlaces, modales y 404. Se conserva solo la transición de idioma dentro de una partida real.
