# UI-05: concurrencia y ciclo de vida de marcas

Status: needs-triage

Work status: open

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
