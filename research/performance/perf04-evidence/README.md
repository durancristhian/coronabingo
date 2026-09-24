# Evidencia de PERF-04

Verificación local del 24 de septiembre de 2026 sobre la base `2ec2fb61b8d9ae733d8258e7af8510a26876f83c`, en la rama `t3code/optimize-player-listeners` y el worktree `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-b998d293`. Se usaron Node 24.21.0 y npm 11.19.0.

## Resultado

`PlayersContextProvider` conserva su lugar en el árbol global, pero solo escucha la colección completa de participantes en sala y configuración. Al entrar a cartones o salir de una ruta habilitada, el efecto cancela la escucha colectiva y limpia su estado. Los listeners de sala y jugador individual no cambiaron.

| Pantalla | Antes | Después | Cleanup después |
| --- | ---: | ---: | ---: |
| Inicio | 0 | 0 | 0 |
| Sala | 2 | 2 | 2 |
| Configuración | 2 | 2 | 2 |
| Cartones | 3 | 2 | 2 |

[El resultado posterior](listeners-after.json) proviene de los providers reales con React, router y Firestore simulados. Cuenta registros y cleanups iniciales. No mide navegación, respuestas remotas, caché ni lecturas facturadas.

## Comprobaciones

- El ciclo rojo amplió `node research/performance/measure-listeners.cjs --expect-scoped` para exigir la matriz completa. Falló porque cartones registraba la colección y limpiaba tres listeners en vez de dos.
- El ciclo verde pasó con 0/2/2/2 listeners en inicio, sala, configuración y cartones. Cada registro tuvo su cleanup.
- `npm run ui-tests -- tests/ui/room.spec.ts` pasó en desarrollo. El recorrido añadió atrás y adelante entre cartones y sala, recuperó la lista de dos participantes y volvió a mostrar los mismos cartones. Playwright informó una prueba aprobada en 9,2 segundos; el runner completo tardó 15,9 segundos.
- `npm run lint:check`, `npm run validate-locales`, `npm run validate-tickets`, `npm run build` y `git diff --check` pasaron. El validador de cartones mostró `There are no tickets with 10 or more`.
- `npm run ui-tests:production` generó el build aislado. La primera ejecución de navegador se descartó porque otro worktree ocupó los puertos del emulador después del chequeo inicial. Tras confirmar que los cinco puertos estaban libres, `npm run ui-tests:production -- --skip-build` arrancó procesos propios y pasó la prueba en 2,4 segundos; el runner completo tardó 4,8 segundos.

Los recorridos usaron `http://127.0.0.1:3187`, el proyecto de demostración `demo-coronabingo-ui` y Firestore Emulator en `127.0.0.1:8187`. Anfitrión y jugador corrieron en contextos de navegador separados. El runner bloqueó Firebase alojado, no exportó datos y detuvo sus procesos. No se verificaron Preview, Production, reglas desplegadas ni facturación.
