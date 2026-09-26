# UI-02: reconfigurar participantes entre partidas

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Extender el recorrido existente con una segunda partida cuya lista y host cambian de verdad.

## Escenario E2E

1. Completar la primera partida del recorrido base y reiniciar.
2. Eliminar a una de las personas.
3. Agregar una persona nueva.
4. Cambiar quién dirige.
5. Empezar la siguiente partida.
6. Verificar que el lobby ya no muestre a la persona eliminada.
7. Abrir los cartones de las dos personas actuales.
8. Verificar que el nuevo host tenga los controles y que el host anterior no los tenga.

## Criterios de aceptación

- [x] La prueba modifica la sala desde la UI, sin escribir la lista directamente en Firestore.
- [x] La persona nueva recibe dos cartones y puede jugar.
- [x] El cambio de rol se refleja en ambos contextos.
- [x] La prueba reutiliza la partida existente en lugar de repetir la creación desde cero.

## Fuera de Playwright

Nombre vacío o repetido, contador máximo, estados de botones y orden alfabético quedan para pruebas unitarias o de componentes.

## Comments

### 2026-09-26

El ticket original intentaba cubrir cada regla del formulario y dos pestañas de configuración. Se conserva sólo la reconfiguración real entre partidas.

### 2026-09-26: implementación y verificación local

Se extendió el recorrido existente de `tests/ui/room.spec.ts`, sin crear otra sala ni escribir participantes en Firestore. Después de reiniciar la primera partida, la preparación elimina a Bruno jugador, agrega a Carla nueva anfitriona y la elige como quien dirige. La misma sala inicia su siguiente partida; ambos contextos abren los cartones asignados, Carla recibe dos y sortea un número, y Ana anfitriona ya no ve ni el sorteo ni el reinicio.

Base: `0e60033a4de9c4b7fb07a756670da45a53dc6fea`. Worktree: `/Users/durancristhian/Repos/coronabingo-worktrees/ui-coverage-ui-02`. Rama: `codex/ui-coverage/ui-02`. Entorno: Node 24.21.0, npm 11.19.0, Chromium y Firestore Emulator local (`demo-coronabingo-ui`, `127.0.0.1:8187`); no se usó Firebase alojado, Preview ni Production.

| Comando | Resultado |
| --- | --- |
| `npm run ui-tests -- tests/ui/room.spec.ts` | Pasó, 1 caso en 12.4 s; cubre la reconfiguración UI-02. |
| `npm run lint:check` | Pasó. |
| `npm run build` | Pasó, incluida la validación de locales. |
| `git diff --check` | Pasó. |
| `npm run ui-tests` | Pasó, 11 casos en 44.0 s de Playwright; 47.6 s del runner. |
| `npm run ui-tests:production` | Pasó, 11 casos en 16.9 s de Playwright; 26.3 s del runner. |

Los avisos de APIs de dependencias y claves históricas de traducción aparecieron durante la suite, sin fallos ni cambios de producto. El runner cerró los procesos propios y eliminó el candado; no quedaron registros exportados ni servidores de tarea activos.
