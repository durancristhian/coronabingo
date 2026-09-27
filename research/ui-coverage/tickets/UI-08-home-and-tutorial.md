# UI-08: tutorial bajo demanda

Status: ready-for-agent

Work status: resolved

Type: task

## Objetivo

Verificar que el tutorial se cargue sólo cuando una persona decide verlo.

## Escenario E2E

1. Abrir el inicio y comprobar que no exista un iframe de YouTube.
2. Presionar `Ver tutorial`.
3. Verificar que el modal y el iframe correspondiente al idioma aparezcan.
4. Cerrar el modal y verificar que el iframe deje de estar montado.

## Criterios de aceptación

- [x] YouTube permanece interceptado; se verifica la integración, no la reproducción real.
- [x] El test no repite la creación completa de una sala.
- [x] La apertura diferida es observable mediante DOM o requests, sin tiempos fijos.

## Fuera de Playwright

Estado vacío del formulario, botón `Listo`, doble envío y link de videollamada quedan para pruebas más chicas.

## Answer

La cobertura ya estaba implementada en `tests/ui/tutorial.spec.ts` por PERF-06. Los tests interceptan los recursos de YouTube, comprueban que no se solicitan antes de abrir el tutorial, identifican los videos español e inglés, y verifican el desmontaje del iframe al cerrar. No crean una sala. El retraso controlado del chunk comprueba el estado de carga; las aserciones de sincronización usan Playwright y no descansos fijos.

Verificación local del 2026-09-26 en `codex/ui-coverage/main`, base `53320b5`: Node 24.21.0, npm 11.19.0, `npm run ui-tests -- tests/ui/tutorial.spec.ts`, 4 pruebas aprobadas con Next.js en `http://127.0.0.1:3187` y Firestore Emulator `demo-coronabingo-ui`. El runner detuvo sus servicios al finalizar. Esto reutiliza la cobertura existente; no se añade una prueba duplicada. No se verificó Preview ni Production en esta ejecución.

## Comments

### 2026-09-26

El ticket se reduce al comportamiento que realmente requiere navegador: montar y desmontar el recurso diferido.

### 2026-09-26: resolución

La prueba focalizada confirmó que PERF-06 ya satisface los criterios de este ticket. Se registra como resuelto sin cambios de código.
