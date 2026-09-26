# UI-04: datos, compartir y exportar desde la sala

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir las funciones del lobby y de la preparación que no forman parte del juego en sí: datos de sala, compartir y exportar.

## Alcance

- Nombre y URL de sala en preparación y lobby.
- Modal de compartir, copia al portapapeles y destinos de WhatsApp y Telegram.
- Orden alfabético y distintivo de quien dirige.
- Desbloqueo de exportación mediante siete activaciones del título.
- Descarga y contenido del `.xls`.

## Criterios de aceptación

- [ ] La URL compartida contiene la sala actual y no un valor fijo.
- [ ] Portapapeles y `window.open` se interceptan; no se llama a servicios externos.
- [ ] La descarga tiene el nombre esperado y se valida su contenido básico.
- [ ] El archivo incluye sala, capacidad, quien dirige, cartones y links de todas las personas.
- [ ] El caso no valida estilos internos de un servicio o aplicación de terceros.
