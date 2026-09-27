# UI-10: recorrido principal en móvil

Status: needs-triage

Work status: resolved

Type: task

## Objetivo

Probar que el flujo principal sigue siendo jugable en un viewport móvil sin duplicar toda la suite de escritorio.

## Escenario E2E

1. Crear una sala desde un viewport móvil representativo.
2. Agregar dos personas, elegir host y configurar.
3. Abrir los cartones del host y del jugador en contextos móviles.
4. Verificar que los cartones y controles esenciales sean visibles y accionables.
5. Sortear un número y observar la sincronización.

El escenario termina después del primer sorteo. Reinicio, persistencia y segunda partida permanecen cubiertos por el recorrido de escritorio.

## Criterios de aceptación

- [x] Ninguna acción esencial desaparece en el layout móvil.
- [x] No hay overflow horizontal en inicio, preparación, lobby ni juego.
- [x] Los dos contextos usan el mismo viewport definido por el ticket.
- [x] El caso reutiliza helpers del recorrido base.

## Fuera de Playwright

Recorrido completo en Firefox o WebKit, baselines visuales, foco detallado y cada combinación idioma-viewport quedan fuera hasta tener una necesidad concreta.

## Comments

### 2026-09-26

La matriz original era demasiado amplia. Se conserva un único recorrido móvil que representa el uso real de la aplicación.

### 2026-09-26: implementación y verificación local

`tests/ui/mobile-room.spec.ts` agrega un único caso Chromium español a 390 × 844. Host y jugador se abren en contextos aislados con ese mismo viewport; el host crea la sala, agrega Ana anfitriona y Bruno jugador, elige a Ana, configura el bolillero online y llega al lobby. Antes de iniciar el lobby comprueba el overflow con esas dos personas y la configuración aún visibles. Ambos abren sus dos cartones, que se comprueban visibles con su primer número habilitado; el botón host `Próximo número` queda visible y accionable, y el jugador recibe el primer número sorteado sin recargar. El caso comprueba `documentElement.scrollWidth <= innerWidth` en inicio, preparación, lobby y juego para los contextos que están abiertos en cada estado.

`tests/ui/room-setup.ts` separa los pasos reutilizables de crear y configurar una sala; `createReadyRoom` conserva su interfaz y los casos existentes. No se modificó producto ni se cubrieron Firefox, WebKit, baselines visuales, foco detallado, idiomas adicionales, UI-01, UI-04 ni rutas retiradas.

Evidencia local en la rama `codex/ui-coverage/ui-10`, base `ab527be9d91ca38186d0e1be81be700c8a8d911a`, con Node 24.21.0 y npm 11.19.0:

- `npm run ui-tests -- mobile-room.spec.ts`: pasó 1 caso en 5.4 s (9.1 s con servicios).
- `npm run lint:check`: pasó.
- `npm run build`: pasó.
- `npm run ui-tests`: pasaron 12 casos en 47.4 s (51.1 s con servicios).
- `npm run ui-tests:production`: pasaron 12 casos en 17.9 s (27.2 s con servicios).
- `git diff --check`: pasó antes del commit.

Todos los recorridos usaron `http://127.0.0.1:3187` y Firestore Emulator `demo-coronabingo-ui` en `127.0.0.1:8187`; los servicios del runner se detuvieron al finalizar. No se usaron Firebase alojado, Preview ni Production.

Tras la revisión del caso se reforzaron la visibilidad y disponibilidad de cada cartón y el control host, y la medición de preparación con participantes ya cargados. Volvieron a pasar el foco (1 caso, 4.8 s / 8.4 s con servicios), `lint:check`, `build`, `git diff --check`, la suite de desarrollo (12 casos, 46.9 s / 50.5 s) y la compilada (12 casos, 17.5 s / 24.9 s).
