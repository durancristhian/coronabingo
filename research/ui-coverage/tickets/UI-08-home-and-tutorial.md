# UI-08: inicio y tutorial

Status: needs-triage

Work status: open

Type: task

## Objetivo

Completar la cobertura del inicio sin repetir la partida completa.

## Alcance

- Estado vacío y habilitación del formulario de creación.
- Bloqueo de doble envío y mensajes de progreso.
- Apertura, cierre y reapertura del tutorial.
- Video correcto por idioma.
- Enlace recomendado para videollamada.

## Criterios de aceptación

- [ ] El caso de creación termina al llegar a `Preparar sala`.
- [ ] El tutorial prueba el `videoId` o URL del iframe, no la reproducción real de YouTube.
- [ ] YouTube permanece bloqueado por la política de red del runner sin convertir eso en un fallo.
- [ ] Cerrar y reabrir el modal no duplica iframes.
- [ ] El foco vuelve a `Ver tutorial` al cerrar.
