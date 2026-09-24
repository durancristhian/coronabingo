# PERF-04: escuchar todos los jugadores solo en sala y configuración

Estado: diagnosticado y reproducido de forma aislada; pendiente de implementación. Prioridad alta. Esfuerzo: 0,5–1 día. Riesgo medio. Sin dependencia de tickets de assets.

## Diagnóstico

`contexts/index.tsx` monta los providers globalmente. `contexts/Players.tsx` abre `rooms/{roomId}/players` con cualquier `roomId`. La pantalla de cartones consume sala y jugador individual, pero no la lista colectiva. Lobby y configuración sí consumen `usePlayers`.

Se ejecutaron los tres providers reales con dependencias simuladas. Inicio registra 0 listeners; lobby/configuración, 2; cartones, 3. Todos retornan unsubscribe. El problema demostrado es una consulta innecesaria, no una fuga general. [Resultado](../listeners-2026-09-23.json).

Reproducción enfocada desde la raíz:

```sh
node research/performance/measure-listeners.cjs --expect-scoped
```

Resultado actual: código 1 y `FAIL: cards still subscribes to the full player collection`.

## Alcance e impacto

Activar el listener colectivo solo en las rutas que consumen la lista. Conservar sala y jugador individual en vivo. Al desactivar/reactivar o cambiar sala, descartar estado ajeno sin perder borradores de configuración.

Se elimina una consulta de colección por pestaña de cartones, pasando de 3 a 2 listeners de aplicación en esa pantalla. Si 50 jugadores entran directamente a cartones de una sala con 50 personas, se evitan 2.500 documentos de resultados iniciales colectivos potenciales. No es un conteo de lecturas facturadas: caché, reconexiones y SDK influyen. No afirmar que cada actualización reenvía los 50 documentos ni prometer un 96–98% de ahorro total.

## Aceptación

- El comando enfocado pasa; actualizar su seam si cambia la composición, manteniendo el criterio. El mock solo prueba montaje/limpieza, no navegación ni comportamiento real de Firebase.
- Verificar altas/bajas en inicio → configuración → lobby → cartones → inicio, cambio de sala y atrás/adelante. Sin suscripción colectiva en cartones, incluido anfitrión.
- Contra desarrollo/emulador, anfitrión y jugador independientes sincronizan números, opciones, reinicios, eliminación y sonidos. Lobby/configuración conservan lista y edición.
- Capturar actividad de la misma secuencia antes/después separando eventos locales, respuestas remotas y facturación no medida. No reemplazar realtime por polling ni pausar por pestaña oculta.
- Checks comunes del [índice](../README.md).

Rollback: restaurar activación global de la lista; no requiere migración de datos. [Referencia de Firestore](https://firebase.google.com/docs/firestore/query-data/listen).
