# UI-01: estados de ruta y errores recuperables

Status: wontfix

Work status: resolved

Type: task

## Resultado

Este ticket se retira del backlog Playwright. La matriz propuesta cubría carga, errores de lectura, recursos inexistentes, salas desactualizadas, salas bloqueadas y reintentos. Son estados aislados que pueden prepararse y afirmar con menos costo en pruebas de componentes.

El recorrido E2E existente ya prueba una transición relevante: después del reinicio, el jugador pasa a espera y vuelve al juego cuando el host configura la siguiente partida.

## Candidatos para pruebas más chicas

- render de carga, error y mensajes de recurso inexistente;
- acción de `Recargar`;
- error y reintento al crear o guardar;
- sala desactualizada o bloqueada;
- persona inexistente.

## Comments

### 2026-09-26

El dueño pidió reservar Playwright para recorridos realistas y límites importantes. Se descarta esta matriz E2E. La decisión no implementa todavía una herramienta de unit tests ni elimina los comportamientos del producto.
