# UI-07: herramientas secundarias durante una partida

Status: needs-triage

Work status: open

Type: task

## Objetivo

Hacer un smoke de las herramientas que dependen del navegador o de sincronización, sin probar cada variante.

## Escenario A: fondo personal

1. Un jugador elige un fondo incluido para las celdas vacías.
2. Recarga la página.
3. Verifica que el fondo elegido permanezca para esa persona.

## Escenario B: acciones del host

1. El host activa un tipo representativo de festejo.
2. El jugador observa el festejo en su contexto.
3. El host dispara un sonido representativo.
4. El segundo contexto intenta reproducir el mismo recurso.

## Criterios de aceptación

- [ ] Se prueba un fondo, un festejo y un sonido, no todos los catálogos.
- [ ] El audio se observa mediante una sustitución controlada de `Audio`; no se valida el parlante.
- [ ] Los recursos externos siguen bloqueados.
- [ ] Cada escenario puede filtrarse por separado.

## Fuera de Playwright

Las variantes individuales, sonidos extra, cierre del modal y `streamerView` quedan fuera. `streamerView` no tiene control visible en el producto.

## Comments

### 2026-09-26

El ticket original intentaba cubrir todos los fondos, festejos, sonidos y estados de modales. Se reduce a dos smokes representativos.
