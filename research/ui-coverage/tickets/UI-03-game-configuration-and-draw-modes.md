# UI-03: opciones de partida y modos de bolillero

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir la configuración que cambia el juego: bolillero online o manual y significados de los números.

## Alcance

- Bolillero online con varios sorteos, orden idéntico en dos contextos y límite de 90.
- Bolillero manual con alta y baja de números sólo para quien dirige.
- Significado del último número visible por defecto.
- Ocultamiento del significado y del link de la Quiniela.

## Criterios de aceptación

- [ ] Los dos modos se configuran desde la página de preparación, no modificando el DOM.
- [ ] La persona que no dirige nunca obtiene controles de escritura.
- [ ] Agregar o quitar un número se refleja sin recarga en el segundo contexto.
- [ ] El orden visible coincide en ambos contextos tras varios cambios.
- [ ] El caso de 90 números evita noventa clics lentos si un helper del emulador puede preparar 89 y la UI completa el último.
