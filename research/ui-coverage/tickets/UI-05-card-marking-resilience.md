# UI-05: concurrencia y ciclo de vida de marcas

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Detectar pérdida de marcas en las dos situaciones donde una prueba unitaria no reproduce el sistema real: dos pestañas y el cambio de partida.

## Escenario A: dos pestañas de la misma persona

1. Abrir los mismos cartones en dos pestañas o contextos.
2. Marcar un número distinto desde cada pestaña.
3. Esperar la sincronización de Firestore.
4. Recargar ambas pestañas.
5. Verificar que las dos marcas acordadas permanezcan.

## Escenario B: partida nueva

1. Marcar un número y comprobar su persistencia.
2. Reiniciar y configurar la siguiente partida.
3. Abrir los nuevos cartones.
4. Verificar que ninguna marca anterior reaparezca.

## Criterios de aceptación

- [ ] Los números provienen de los cartones asignados en esa ejecución.
- [ ] La prueba falla si una escritura completa pisa la marca de la otra pestaña.
- [ ] El cambio de `timesPlayed` aísla las dos partidas.
- [ ] No se usan esperas fijas para resolver la sincronización.

## Comments

### 2026-09-26

Se eliminan casos individuales de marcar y desmarcar, ya cubiertos en parte por el recorrido base o aptos para tests más chicos. Se conservan concurrencia y aislamiento entre partidas.

## Answer

Se reemplazó el guardado diferido de marcas en `localStorage` por actualizaciones atómicas de Firestore para cada número: `arrayUnion` al marcar y `arrayRemove` al desmarcar. Así dos pestañas del mismo jugador no escriben un arreglo completo y no pueden perder la marca de la otra.

`tests/ui/card-marking-resilience.spec.ts` crea una sala en el emulador, abre dos pestañas del mismo jugador y toma dos números del primer cartón asignado en esa ejecución. Marca ambos en paralelo, espera las aserciones visibles de sincronización, recarga las dos pestañas y confirma las dos marcas. Después reinicia y configura una partida nueva, lo que incrementa `timesPlayed`, y confirma que los cartones nuevos no tienen botones marcados. No usa esperas fijas.

## Verification

Local, 2026-09-26, Firestore Emulator `demo-coronabingo-ui` en `127.0.0.1:8187`; no se usaron Firebase alojado, Preview ni Production.

- Fallo de reproducción: `npm run ui-tests -- tests/ui/card-marking-resilience.spec.ts` terminó con exit 1 antes de la corrección: la segunda pestaña mantenía `aria-pressed="false"` para la marca hecha en la primera.
- Corrección focalizada: el mismo comando pasó: 1 prueba, 8.6 s de Playwright y 13.1 s del runner.
- `npm run lint:check`: pasó.
- `git diff --check`: pasó.
- `npm run build`: pasó, incluida la validación de locales.
- `npm run ui-tests`: pasó las 7 pruebas de la suite contra un emulador nuevo.
