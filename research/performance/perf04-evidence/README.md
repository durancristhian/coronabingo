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

## Pull request y servicios remotos

El [PR #191](https://github.com/durancristhian/coronabingo/pull/191) se abrió contra `main`. La primera ejecución remota verificó el commit de producto y pruebas `4a9a352ae0ffbb265d1d8241f4c58e5e3e99a87e`:

- [GitHub Actions 36058490008](https://github.com/durancristhian/coronabingo/actions/runs/36058490008) terminó correctamente en 2 min 8 s. Pasaron instalación, lint/tipos, build, Chromium, Firestore Emulator y el recorrido anfitrión/jugador; Playwright informó una prueba aprobada en 9,3 segundos y el runner en 19,0 segundos. Los artefactos de UI y bundles se cargaron.
- El deployment Vercel `6648005075` terminó en `success` y GitHub lo asocia al mismo SHA. La portada del Preview compartido abrió con título `Coronabingo | Tu juego de Bingo Online`, banner `Staging v1.23.1` y el formulario de creación visible.
- No se creó una sala ni se ejecutó gameplay en Preview porque su URL no demuestra aislamiento de Firebase. CI sí ejecutó ese flujo contra el emulador. No se verificaron Production, reglas desplegadas ni facturación.

## Integración de `main` y gameplay en Preview del 26 de septiembre

`origin/main` incorporó PERF-06 y dejó el PR en conflicto documental. La rama integró `4f75283`, conservó los registros de ambos tickets y quedó mergeable en `44fb3251b10be645b1af5d88d7469e4d236053c7`. Sobre esa combinación pasaron Node 24.21.0, npm 11.19.0, `npm run lint:check`, locales, cartones, el seam de listeners 0/2/2/2, `npm run build`, `git diff --check` y `npm run ui-tests:production`. El último comando ejecutó cinco pruebas en 14,3 segundos; Playwright informó cinco aprobadas en 5,9 segundos.

[GitHub Actions 36251154817](https://github.com/durancristhian/coronabingo/actions/runs/36251154817) pasó sobre ese mismo SHA en 1 min 52 s. Los checks de Vercel y Vercel Preview Comments también terminaron correctamente.

Vercel asoció el deployment `6680510514` al SHA exacto y lo marcó `success`. El Preview usado fue `https://coronabingo-1c5z2sk7z-cristhian-durans-projects-3ace6550.vercel.app`. Antes de escribir se comparó el `PROJECT_ID` compilado con el `.env` aprobado, sin imprimir valores; coincidió con el proyecto no productivo.

La partida `QA PERF04 20260926` creó la sala `9PRWClk0RoyZZihAqp9P` y dos participantes en pestañas separadas. Se comprobó lo siguiente mediante la UI y los efectos visibles de Firestore alojado:

- Ambos participantes recibieron dos cartones y el anfitrión obtuvo los controles.
- Atrás y adelante devolvieron al lobby con dos filas y restauraron los mismos cartones del anfitrión.
- El número `69` apareció en ambas pestañas sin recarga. Marcar el `1` del jugador sobrevivió una recarga junto con los mismos cartones y el mismo número llamado.
- Reiniciar llevó al anfitrión a configuración y al jugador al estado de espera sin cartones. La segunda partida mostró dos cartones por participante, comenzó sin números y sincronizó el `65`.
- Activar confetti produjo 20 elementos en cada pestaña; desactivarlo dejó 0 en ambas.
- Se disparó el sonido Cardi B desde el anfitrión, pero esta superficie de navegador no expuso el `Audio` separado del DOM para demostrar reproducción en ambas pestañas. La prueba local sí intercepta `HTMLMediaElement.play` y conserva esa cobertura.
- Al borrar el jugador mediante el mismo cliente configurado para el Preview, su pestaña mostró `Ocurrió un error.`, retiró ambos cartones y la configuración dejó de mostrarlo.

La limpieza eliminó los dos documentos de jugadores. Un batch posterior para borrar la sala falló con `PERMISSION_DENIED`; no había acceso administrativo configurado y no se cambiaron reglas. Se verificó que `rooms/9PRWClk0RoyZZihAqp9P` quedó vacío, con cero jugadores. Es el único dato de prueba retenido. Esta comprobación cubre el Preview y las reglas alojadas del proyecto no productivo; no cubre Production ni facturación.
