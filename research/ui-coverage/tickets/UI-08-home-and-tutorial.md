# UI-08: tutorial bajo demanda

Status: needs-triage

Work status: open

Type: task

## Objetivo

Verificar que el tutorial se cargue sólo cuando una persona decide verlo.

## Escenario E2E

1. Abrir el inicio y comprobar que no exista un iframe de YouTube.
2. Presionar `Ver tutorial`.
3. Verificar que el modal y el iframe correspondiente al idioma aparezcan.
4. Cerrar el modal y verificar que el iframe deje de estar montado.

## Criterios de aceptación

- [ ] YouTube permanece interceptado; se verifica la integración, no la reproducción real.
- [ ] El test no repite la creación completa de una sala.
- [ ] La apertura diferida es observable mediante DOM o requests, sin tiempos fijos.

## Fuera de Playwright

Estado vacío del formulario, botón `Listo`, doble envío y link de videollamada quedan para pruebas más chicas.

## Comments

### 2026-09-26

El ticket se reduce al comportamiento que realmente requiere navegador: montar y desmontar el recurso diferido.
