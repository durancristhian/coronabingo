# UI-07: herramientas secundarias durante una partida

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Hacer un smoke de las herramientas que dependen del navegador o de sincronización, sin probar cada variante.

## Escenario A: fondo personal

1. Un jugador elige un fondo incluido para las celdas vacías.
2. Recarga la página.
3. Verifica que el fondo elegido permanezca para esa persona.

## Escenario B: acciones del host

1. El host activa un tipo representativo de festejo.
2. El jugador observa el festejo en su contexto.
3. El host dispara un sonido representativo.
4. El segundo contexto intenta reproducir el mismo recurso.

## Criterios de aceptación

- [ ] Se prueba un fondo, un festejo y un sonido, no todos los catálogos.
- [ ] El audio se observa mediante una sustitución controlada de `Audio`; no se valida el parlante.
- [ ] Los recursos externos siguen bloqueados.
- [ ] Cada escenario puede filtrarse por separado.

## Fuera de Playwright

Las variantes individuales, sonidos extra, cierre del modal y `streamerView` quedan fuera. `streamerView` no tiene control visible en el producto.

## Comments

### 2026-09-26

El ticket original intentaba cubrir todos los fondos, festejos, sonidos y estados de modales. Se reduce a dos smokes representativos.

### 2026-09-26: cobertura implementada y verificada

Implementación: `66fa6525b52ca1f8af53d478435ec395ff152eba`.

- `tests/ui/game-tools.spec.ts` contiene dos tests filtrables: el jugador elige Pikachu, un fondo incluido, y comprueba sus celdas vacías antes y después de recargar; el host activa confetti y el jugador lo observa, luego dispara Cardi B - Coronavirus y el segundo contexto registra el recurso mediante un reemplazo controlado de `Audio`.
- Los pasos equivalentes de sonido y festejo se retiraron del recorrido general `room.spec.ts`, para conservar la señal sin duplicarla. Cerrar el modal de festejos sólo habilita la acción siguiente y no añade una aserción de cierre.
- Los contextos de host y jugador usan el fixture de red aislada: sólo permite la app local y el Firestore Emulator, y falla ante Firebase alojado u otros recursos externos.

Evidencia local, sin datos alojados:

| Check | Resultado |
| --- | --- |
| `npm run ui-tests -- tests/ui/game-tools.spec.ts -g "included empty-cell background"` | Pasó, 1 test, desarrollo y emulador. |
| `npm run ui-tests -- tests/ui/game-tools.spec.ts -g "celebration and sound"` | Pasó, 1 test, desarrollo y emulador. |
| `npm run lint:check` | Pasó. |
| `npm run build` | Pasó, incluyendo `validate-locales`. |
| `npm run ui-tests` | Pasó, 15 tests; Playwright registró `passed`. |
| `npm run ui-tests:production` | Pasó, 15 tests sobre el build aislado; Playwright registró `passed`. |
| `git diff --check` | Pasó. |

El runner usó `http://127.0.0.1:3187`, Firestore Emulator en `127.0.0.1:8187` y el proyecto desechable `demo-coronabingo-ui`. Los servicios se apagaron al finalizar; no hubo Preview, CI ni Production.
