# UI-06: código de acceso de quien dirige

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir la barrera visible que pide el código de sala antes de mostrar los cartones de quien dirige.

## Alcance

- Activación de la opción oculta en la preparación.
- Visualización del código para quien configura.
- Entrada sin código para una persona común.
- Código incompleto, incorrecto y correcto para quien dirige.
- Nuevo pedido de código después de reiniciar.

## Criterios de aceptación

- [ ] La prueba obtiene el código generado para la sala actual; no fija una secuencia de emojis.
- [ ] El botón de ingreso permanece deshabilitado con una secuencia incompleta.
- [ ] Un código incorrecto muestra error y mantiene la pantalla utilizable.
- [ ] El código correcto muestra el juego y los controles de quien dirige.
- [ ] Reiniciar borra el acceso local y vuelve a pedir el código en la partida siguiente.

## Límite

Esto verifica UX, no seguridad. La comparación ocurre en el cliente y Playwright no demuestra una autorización protegida por reglas de Firestore o servidor.
