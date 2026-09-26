# UI-03: modos de bolillero y límite de 90

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Cubrir el modo de juego que falta y el límite que debe detener el sorteo.

## Escenario A: bolillero manual

1. Crear y configurar una sala con el bolillero online desactivado.
2. Abrir host y jugador en contextos separados.
3. El host marca un número en la grilla.
4. El jugador recibe el mismo número sin recargar.
5. El host desmarca ese número y desaparece en ambos contextos.

## Escenario B: número 90

1. Preparar 89 números sorteados mediante un helper del emulador.
2. Abrir los cartones del host.
3. Sortear el único número restante desde la UI.
4. Verificar 90 valores únicos y el botón de sorteo deshabilitado.

## Criterios de aceptación

- [ ] Sólo el host puede modificar el bolillero manual.
- [ ] Ambos contextos muestran el mismo resultado.
- [ ] El caso de 90 no realiza noventa clics ni depende del orden aleatorio.
- [ ] El recorrido base con bolillero online continúa pasando.

## Fuera de Playwright

El texto del significado del número y su variante oculta quedan para pruebas de componente.

## Comments

### 2026-09-26

Se eliminan las aserciones pequeñas de presentación. Se conservan el flujo manual y el límite de 90 por su impacto directo en una partida.

### 2026-09-26: implementación iniciada

Se reclama UI-03 en `codex/ui-coverage/ui-03`, desde la base fija `e93f48257d881190c2e68b0f2e63c8192886007c`. La verificación se limita al runner local aislado con Firestore Emulator; no se accederá a Firebase alojado.

## Answer

Se agregaron dos recorridos Playwright deterministas en
`tests/ui/game-configuration-and-draw-modes.spec.ts`:

- Con bolillero online desactivado, host y jugador abren sus cartones en contextos aislados. El host agrega y quita el 7 en la grilla; ambos contextos observan el cambio sin recargar. El jugador no recibe el control de sorteo y su clic no modifica el número.
- Con bolillero online activado, un helper de test escribe los números 1 a 89 mediante la API REST del Firestore Emulator `demo-coronabingo-ui`. La UI sortea el único faltante (90), muestra 90 valores únicos y deshabilita `Próximo número`.

`createReadyRoom` ahora fija explícitamente el checkbox del bolillero para que el escenario manual no dependa del valor por defecto del modelo de sala.

### Evidencia local 2026-09-26

- Base: `e93f48257d881190c2e68b0f2e63c8192886007c`; rama: `codex/ui-coverage/ui-03`.
- Runtime: Node `v24.21.0`, npm `11.19.0`.
- `npm run ui-tests -- tests/ui/game-configuration-and-draw-modes.spec.ts`: 2 casos aprobados en desarrollo, 11.6 s incluyendo servicios.
- `npm run lint:check`: aprobado.
- `npm run build`: aprobado.
- `npm run ui-tests`: suite completa aprobada; `test-results/.last-run.json` registró `passed`.
- `npm run ui-tests:production`: build aislado y 11 casos aprobados en 16.7 s de Playwright, 26.8 s incluyendo servicios.
- `git diff --check`: aprobado.

Los recorridos usaron `http://127.0.0.1:3187` y Firestore Emulator en `127.0.0.1:8187`. No se creó ni consultó ningún dato de Firebase alojado, Preview ni Production. El runner retiró sus procesos y lock al finalizar.
