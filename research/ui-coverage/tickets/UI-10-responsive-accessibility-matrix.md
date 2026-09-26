# UI-10: recorrido principal en móvil

Status: needs-triage

Work status: open

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

- [ ] Ninguna acción esencial desaparece en el layout móvil.
- [ ] No hay overflow horizontal en inicio, preparación, lobby ni juego.
- [ ] Los dos contextos usan el mismo viewport definido por el ticket.
- [ ] El caso reutiliza helpers del recorrido base.

## Fuera de Playwright

Recorrido completo en Firefox o WebKit, baselines visuales, foco detallado y cada combinación idioma-viewport quedan fuera hasta tener una necesidad concreta.

## Comments

### 2026-09-26

La matriz original era demasiado amplia. Se conserva un único recorrido móvil que representa el uso real de la aplicación.
