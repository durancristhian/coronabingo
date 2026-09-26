# UI-05: resiliencia de marcas en los cartones

Status: needs-triage

Work status: open

Type: task

## Objetivo

Detectar pérdida o sobrescritura de marcas entre cartones, recargas y pestañas concurrentes.

## Alcance

- Marcar y desmarcar en ambos cartones.
- Persistencia después de recargar.
- Dos pestañas de la misma persona realizando cambios distintos.
- Recarga mientras hay una escritura pendiente.
- Aislamiento entre partidas mediante `timesPlayed`.

## Criterios de aceptación

- [ ] Las aserciones usan números reales de los cartones asignados en esa ejecución.
- [ ] Las marcas de un cartón no reemplazan las del otro.
- [ ] Dos pestañas conservan las marcas acordadas por el comportamiento esperado, sin aceptar silenciosamente la última escritura si pierde datos.
- [ ] Una nueva partida no restaura marcas de la anterior.
- [ ] El ticket documenta cualquier fallo reproducido antes de cambiar código de producto.

## Riesgo conocido

La implementación combina estado React, respaldo en `localStorage` y escrituras del documento completo de la persona. Este ticket debe fijar primero el resultado esperado en el test.
