# UI-06: código de acceso de quien dirige

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir en un único recorrido la barrera visible de acceso a los cartones del host.

## Escenario E2E

1. Activar la opción de código desde la preparación y leer la secuencia generada.
2. Empezar la partida.
3. Verificar que el jugador común entre sin código.
4. Verificar que el host encuentre la pantalla de acceso.
5. Ingresar una secuencia incorrecta y observar el rechazo.
6. Ingresar la secuencia correcta y acceder a los cartones y controles.
7. Reiniciar la partida.
8. Empezar otra partida y verificar que el host vuelva a necesitar el código.

## Criterios de aceptación

- [ ] El test obtiene el código de la sala actual y no fija emojis.
- [ ] El rechazo no deja bloqueado el reintento.
- [ ] Los roles usan contextos separados.
- [ ] El recorrido termina con la protección activa en la partida siguiente.

## Límite

Esto verifica UX, no seguridad. La comparación ocurre en el cliente y no demuestra autorización mediante reglas de Firestore o servidor.

## Comments

### 2026-09-26

Los estados incompletos del selector de emojis salen del alcance. El ticket queda como un único flujo de acceso, juego y reinicio.
