# PERF-10: sacar Firestore de la carga inicial de portada

Status: ready-for-agent

Work status: open

Type: task

Blocked by: None (puede abordarse independientemente de PERF-09 y PERF-11).

Estado: propuesta nueva del 26/09/2026; implementación pendiente de aprobación. Prioridad propuesta alta para primera visita a portada. Esfuerzo estimado: 2–4 días. Riesgo medio por inicialización asíncrona, navegación y separación de Analytics.

## What to build

Una portada que descargue menos JavaScript antes de que la persona necesite crear o abrir una sala. La creación de sala ofrece respuesta inmediata y recuperación ante una descarga fallida, mientras la entrada directa y el recorrido de juego conservan su comportamiento. La separación interna necesaria forma parte de esta entrega completa; no se abre un ticket horizontal solo para mover imports.

## Diagnóstico

`utils/firebase.ts` importa e inicializa Analytics y Firestore en el mismo módulo. Los providers globales de `contexts/index.tsx` y el modelo importado por `components/CreateRoom.tsx` lo llevan a la portada aunque no haya sala ni listeners activos.

La [medición actual](../revalidation-2026-09-26/README.md) da 242.121 bytes de JS inicial gzip en producción. Firestore aporta unos 64 KB según atribución del código generado. Los sources de los imports relevantes coinciden con el código local. No se confunde no tener listeners con no descargar la biblioteca.

Estimación para planificar: diferir 50–65 KB gzip, aproximadamente 21–27% del JS inicial de portada. Confianza media: es un proxy por source maps, no un build optimizado. No mejora en esa misma proporción el tiempo total y no elimina Firestore cuando se entra al juego.

## Alcance propuesto

1. Separar inicialización común y Analytics de la dependencia de Firestore. Conservar destinos y eventos analíticos, sin importar indirectamente Firestore desde el provider analítico.
2. Cargar providers y acceso a datos de juego cuando la ruta requiera una sala. Cubrir también entrada directa, atrás/adelante y cambio de sala, conservando el alcance y cleanup de PERF-04.
3. Diferir el modelo de creación y sus referencias a `Timestamp`. Precargar por intención de crear sala, por ejemplo al enfocar el formulario, y esperar la misma promesa al enviar. Evitar cargar todo automáticamente después de hidratar, porque solo trasladaría la descarga unos milisegundos.
4. Mantener el formulario usable, feedback inmediato, prevención de creación duplicada y reintento si falla el chunk. Medir también el primer envío para no trasladar toda la espera al clic.

No requiere cambiar de backend, activar Authentication, migrar a App Router ni actualizar Firebase de forma masiva. La posible migración modular es una investigación posterior con su propia medida; no sumar dos ahorros sobre los mismos bytes.

## Aceptación

- [ ] Comparación antes/después de builds equivalentes y traza con caché fría. Portada sin carga de Firestore antes de la interacción elegida; registrar bytes, momento de descarga y efecto sobre el envío.
- [ ] Crear sala en ES/EN con carga rápida, lenta y fallida; no duplicar salas por clics repetidos. Error recuperable.
- [ ] `npm run lint:check`, `npm run build`, `npm run ui-tests:production` y `git diff --check` en worktree propio. Ejecutar también el probe de listeners.
- [ ] Conservar preparación, asignación, entrada directa, sincronización, marcas/recarga y reinicio. Confirmar que no se reinicializa Firebase ni se duplican listeners al navegar.
- [ ] Revisar Analytics por separado: el emulador de UI lo desactiva y un pase verde no prueba recepción de eventos.
- [ ] Registrar entorno, revisión, servidor, mediciones y límites antes de resolver. Rollback mediante el commit aislado del ticket.

## Comments

### 2026-09-26

Creado después de revisar las mejoras integradas y los tests actuales. El objetivo es reducir la carga inicial de portada; el SDK sigue siendo necesario durante una partida. No implementado.

### 2026-09-26: desglose aprobado con to-tickets

El usuario aprobó este alcance como un ticket independiente, con creación de sala, entrada directa, medición y regresión incluidas. Se conserva la estimación como hipótesis, no como ahorro conseguido. `ready-for-agent` indica que el trabajo está especificado; la aprobación recibida es para registrar los tickets y no inicia su implementación.
