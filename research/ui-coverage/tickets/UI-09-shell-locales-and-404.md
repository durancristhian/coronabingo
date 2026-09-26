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

Logo, links del pie, donación, fallback de `localStorage`, 404 y rutas retiradas salen del backlog. Los links pueden probarse por componente y las rutas retiradas mediante checks HTTP.

## Comments

### 2026-09-26

El ticket original mezclaba navegación, enlaces, modales y 404. Se conserva sólo la transición de idioma dentro de una partida real.
