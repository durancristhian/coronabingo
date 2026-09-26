# UI-03: modos de bolillero y límite de 90

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir el modo de juego que falta y el límite que debe detener el sorteo.

## Escenario A: bolillero manual

1. Crear y configurar una sala con el bolillero online desactivado.
2. Abrir host y jugador en contextos separados.
3. El host marca un número en la grilla.
4. El jugador recibe el mismo número sin recargar.
5. El host desmarca ese número y desaparece en ambos contextos.

## Escenario B: número 90

1. Preparar 89 números sorteados mediante un helper del emulador.
2. Abrir los cartones del host.
3. Sortear el único número restante desde la UI.
4. Verificar 90 valores únicos y el botón de sorteo deshabilitado.

## Criterios de aceptación

- [ ] Sólo el host puede modificar el bolillero manual.
- [ ] Ambos contextos muestran el mismo resultado.
- [ ] El caso de 90 no realiza noventa clics ni depende del orden aleatorio.
- [ ] El recorrido base con bolillero online continúa pasando.

## Fuera de Playwright

El texto del significado del número y su variante oculta quedan para pruebas de componente.

## Comments

### 2026-09-26

Se eliminan las aserciones pequeñas de presentación. Se conservan el flujo manual y el límite de 90 por su impacto directo en una partida.
