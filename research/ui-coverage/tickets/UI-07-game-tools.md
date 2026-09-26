# UI-07: fondos, festejos, sonidos y vista especial

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir las herramientas secundarias de la página de juego en casos cortos e independientes.

## Bloques

### Fondos

- [ ] Elegir un fondo incluido cambia las celdas vacías.
- [ ] Una URL personalizada persiste para la misma persona.
- [ ] La preferencia no afecta a otra persona.

### Festejos

- [ ] Activar y apagar confetti, ghaneses y globos se sincroniza entre contextos.

### Sonidos

- [ ] Disparar un sonido se sincroniza y bloquea un segundo disparo mientras está activo.
- [ ] Simular el fin de `Audio` limpia el estado.
- [ ] Siete activaciones del título muestran los sonidos extra.

### Reinicio y vista especial

- [ ] Cerrar el modal de reinicio no modifica la partida.
- [ ] Preparar `streamerView` en el emulador oculta los cartones de quien dirige y amplía el bolillero.

## Criterios de aceptación

- [ ] Cada bloque puede ejecutarse o filtrarse por separado.
- [ ] No se descargan imágenes o audios externos; se interceptan los recursos cuando haga falta.
- [ ] No se valida calidad audiovisual real.
- [ ] `streamerView` queda documentado como función sin control visible, salvo que otro ticket agregue ese control.
