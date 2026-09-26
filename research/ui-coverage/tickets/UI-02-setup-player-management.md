# UI-02: reconfigurar participantes entre partidas

Status: needs-triage

Work status: open

Type: task

## Objetivo

Extender el recorrido existente con una segunda partida cuya lista y host cambian de verdad.

## Escenario E2E

1. Completar la primera partida del recorrido base y reiniciar.
2. Eliminar a una de las personas.
3. Agregar una persona nueva.
4. Cambiar quién dirige.
5. Empezar la siguiente partida.
6. Verificar que el lobby ya no muestre a la persona eliminada.
7. Abrir los cartones de las dos personas actuales.
8. Verificar que el nuevo host tenga los controles y que el host anterior no los tenga.

## Criterios de aceptación

- [ ] La prueba modifica la sala desde la UI, sin escribir la lista directamente en Firestore.
- [ ] La persona nueva recibe dos cartones y puede jugar.
- [ ] El cambio de rol se refleja en ambos contextos.
- [ ] La prueba reutiliza la partida existente en lugar de repetir la creación desde cero.

## Fuera de Playwright

Nombre vacío o repetido, contador máximo, estados de botones y orden alfabético quedan para pruebas unitarias o de componentes.

## Comments

### 2026-09-26

El ticket original intentaba cubrir cada regla del formulario y dos pestañas de configuración. Se conserva sólo la reconfiguración real entre partidas.
