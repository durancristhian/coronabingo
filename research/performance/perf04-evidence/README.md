# Evidencia de PERF-04

Verificación local del 24 de septiembre de 2026 sobre la base `2ec2fb61b8d9ae733d8258e7af8510a26876f83c`, en la rama `t3code/optimize-player-listeners` y el worktree `/Users/durancristhian/.t3/worktrees/coronabingo/t3code-b998d293`. Se usaron Node 24.21.0 y npm 11.19.0.

## Resultado

`PlayersContextProvider` conserva su lugar en el árbol global, pero solo escucha la colección completa de participantes en sala y configuración. Al entrar a cartones o salir de una ruta habilitada, el efecto cancela la escucha colectiva y deja de exponer su estado. Los listeners de sala y jugador individual no cambiaron.

Los borradores de participantes quedan separados por sala dentro del provider. Al volver con atrás/adelante, el primer snapshot no reemplaza altas o bajas locales aún no confirmadas; cuando Firestore refleja los mismos IDs, el borrador se descarta. Al cambiar de sala nunca se expone la lista anterior, y una respuesta tardía de una suscripción cancelada se ignora.

| Pantalla | Antes | Después | Cleanup después |
| --- | ---: | ---: | ---: |
| Inicio | 0 | 0 | 0 |
| Sala | 2 | 2 | 2 |
| Configuración | 2 | 2 | 2 |
| Cartones | 3 | 2 | 2 |

[El resultado anterior](listeners-before.json) carga `PlayersContextProvider` desde el commit base y [el posterior](listeners-after.json) carga la implementación actual. Ambos ejecutan los providers reales con React, router y Firestore simulados. Además de la matriz inicial, recorren inicio → configuración → sala → cartones → sala → otra sala → inicio. En la base, la colección queda activa al entrar a cartones; después, se cancela allí, vuelve a activarse al regresar a sala y cambia correctamente de `room-a` a `room-b`. El seam mide altas y bajas locales de listeners, no respuestas remotas, caché ni lecturas facturadas.

## Comprobaciones

- El ciclo rojo amplió `node research/performance/measure-listeners.cjs --expect-scoped` para exigir la matriz completa. Falló porque cartones registraba la colección y limpiaba tres listeners en vez de dos.
- El ciclo verde pasó con 0/2/2/2 listeners en inicio, sala, configuración y cartones. El ciclo de rutas también pasó con un cleanup por cada listener y sin colección activa en cartones.
- La revisión encontró que limpiar el estado al desactivar el listener perdía participantes todavía no guardados. Una prueba de navegador lo reprodujo; la implementación pasó a conservar borradores por sala y la misma prueba pasó.
- `npm run ui-tests -- tests/ui/room.spec.ts` pasó en desarrollo. El recorrido comprueba atrás/adelante antes de guardar, eliminación del participante temporal, lista y edición, cartones asignados, opción de bolillero, números, recarga, reinicio, sonido y festejo sincronizados en ambos contextos, cambio de sala, aislamiento de sus listas y eliminación de un participante persistido mientras conserva sus cartones abiertos. Playwright informó una prueba aprobada en 11,1 segundos; el runner completo tardó 14,9 segundos.
- `npm run lint:check`, `npm run validate-locales`, `npm run validate-tickets`, `npm run build` y `git diff --check` pasaron. El validador de cartones mostró `There are no tickets with 10 or more`.
- `npm run ui-tests:production` generó un build aislado de la versión final, arrancó procesos propios y pasó la prueba en 4,0 segundos; el runner completo tardó 11,4 segundos. Una ejecución anterior, previa a la corrección de borradores, se había descartado porque otro worktree ocupó los puertos del emulador después del chequeo inicial.

Los recorridos usaron `http://127.0.0.1:3187`, el proyecto de demostración `demo-coronabingo-ui` y Firestore Emulator en `127.0.0.1:8187`. Anfitrión y jugador corrieron en contextos de navegador separados. Para comprobar la propagación del sonido sin depender del dispositivo de audio, la prueba interceptó `HTMLMediaElement.play` y verificó el mismo archivo en ambos contextos. El runner bloqueó Firebase alojado, no exportó datos y detuvo sus procesos.

La comparación antes/después cuenta los eventos locales de alta y baja de listeners. Las respuestas reales del emulador se observaron por sus efectos semánticos en dos clientes —listas, asignaciones, números, festejo, sonido, reinicio y eliminación—, pero no se contó el transporte interno del SDK ni se lo convirtió en lecturas. La facturación no se midió. Preview, Production y reglas desplegadas siguen fuera de esta evidencia local.
