# Backlog de cobertura E2E con Playwright

Fecha: 2026-09-26

Status: needs-triage

Work status: open

Revisión relevada: `f8dab14`

Este documento reemplaza el inventario exhaustivo del 25 de septiembre. El primer inventario mezclaba recorridos E2E con validaciones pequeñas que serían más rápidas y claras como pruebas unitarias o de componentes.

La decisión actual es mantener Playwright enfocado en situaciones donde aporta una señal que una prueba chica no puede dar.

## Qué merece Playwright

Un escenario entra en este backlog si necesita al menos uno de estos elementos:

- navegación entre páginas;
- dos personas o pestañas sincronizadas mediante Firestore;
- persistencia real entre navegador, `localStorage` y Firestore;
- comportamiento que depende del viewport;
- carga real de un recurso diferido;
- un límite importante del flujo que podría bloquear una partida.

No alcanza con que algo sea visible en la UI. Estados de botones, validaciones de campos, variantes de mensajes, destinos de enlaces y props aisladas deben bajar a una futura capa unitaria o de componentes.

## Cobertura base ya implementada

`tests/ui/room.spec.ts` ya cubre el recorrido principal en Chromium de escritorio y español:

- [x] crear una sala;
- [x] agregar dos personas y elegir quién dirige;
- [x] configurar y repartir cartones;
- [x] abrir host y jugador en contextos separados;
- [x] sortear y sincronizar un número;
- [x] marcar un cartón y conservarlo tras recargar;
- [x] reiniciar y mostrar la espera al jugador;
- [x] empezar otra partida y volver a sincronizar.

Este recorrido sigue siendo la base. Los tickets siguientes agregan otro recorrido real o un límite de negocio relevante. No repiten validaciones pequeñas del mismo formulario.

## Tickets E2E activos

### [UI-05: concurrencia y ciclo de vida de marcas](tickets/UI-05-card-marking-resilience.md)

- [ ] Dos pestañas de la misma persona hacen marcas distintas y ninguna se pierde.
- [ ] Una partida nueva no recupera marcas de la partida anterior.

### [UI-06: código de acceso de quien dirige](tickets/UI-06-host-room-code.md)

- [ ] Activar la protección, entrar como jugador sin código, fallar y acertar como host, jugar, reiniciar y volver a exigir el código.

### [UI-03: modos de bolillero y límite de 90](tickets/UI-03-game-configuration-and-draw-modes.md)

- [ ] En modo manual, quien dirige agrega y quita un número y el jugador lo ve en tiempo real.
- [ ] Con 89 números preparados, la UI sortea el último, llega a 90 sin duplicados y deshabilita el sorteo.

### [UI-02: reconfigurar participantes entre partidas](tickets/UI-02-setup-player-management.md)

- [ ] Después de reiniciar, eliminar una persona, agregar otra, cambiar quién dirige y jugar con la nueva configuración.

### [UI-10: recorrido principal en móvil](tickets/UI-10-responsive-accessibility-matrix.md)

- [ ] Crear, configurar, abrir cartones y sincronizar un sorteo en un viewport móvil sin perder acciones esenciales.

### [UI-08: tutorial bajo demanda](tickets/UI-08-home-and-tutorial.md)

- [x] Abrir el tutorial, comprobar el iframe correcto y cerrarlo sin cargar YouTube antes de tiempo. Cobertura existente de PERF-06, verificada en [UI-08](tickets/UI-08-home-and-tutorial.md).

### [UI-09: cambio de idioma en una ruta de juego](tickets/UI-09-shell-locales-and-404.md)

- [ ] Cambiar una URL dinámica de español a inglés sin perder la sala, la persona ni los cartones.

### [UI-07: herramientas secundarias durante una partida](tickets/UI-07-game-tools.md)

- [ ] Un jugador cambia un fondo y lo conserva tras recargar.
- [ ] Quien dirige activa un festejo y un sonido representativos y el otro contexto recibe ambos.

## Tickets retirados de Playwright

### [UI-01: estados de ruta y errores](tickets/UI-01-route-and-firestore-states.md)

`wontfix` como E2E. Los estados de carga, error, sala inexistente y reintento son mejores candidatos para pruebas de componentes con estados remotos controlados. La transición de espera a partida ya aparece en el recorrido base de reinicio.

### [UI-04: datos, compartir y exportar](tickets/UI-04-lobby-sharing-and-export.md)

`wontfix` como E2E. URLs, portapapeles, `window.open`, orden de listas y contenido de la planilla se pueden verificar sin una partida completa. La exportación está escondida detrás de siete activaciones y no justifica el costo de un recorrido de navegador permanente.

## Candidatos para una futura capa unitaria o de componentes

Estos puntos salen del backlog Playwright. No se implementa todavía ningún framework de unit tests.

- campos vacíos, nombres repetidos y máximo de personas;
- habilitación y deshabilitación de botones durante formularios;
- textos de carga, error y reintento;
- campos de solo lectura, badges, orden de listas y links;
- copia al portapapeles y URLs de WhatsApp, Telegram, Cafecito y PayPal;
- contenido generado para el `.xls`;
- apertura, Escape, foco y cierre de modales;
- significado visible u oculto del último número;
- variantes individuales de fondos, festejos y sonidos;
- la página 404 genérica, fuera del backlog actual;
- `streamerView`, porque no tiene un control visible en el producto;
- Firefox, WebKit y baselines visuales hasta tener una necesidad concreta o datos de uso.

## Exclusiones explícitas

No agregar tests UI, HTTP, unitarios, de integración ni de regresión para rutas retiradas. Esto incluye `/admin`, `/eventos/[eventId]`, `/eventos/[eventId]/admin` y cualquier otra ruta que se elimine del producto.

Esta exclusión no incluye `/room/[roomId]/admin`: es la preparación activa de una sala y forma parte del happy path principal.

## Orden sugerido

1. UI-05, porque cubre una pérdida de datos conocida.
2. UI-06, porque protege el acceso visible de quien dirige.
3. UI-03, porque agrega el segundo modo de juego y el límite de 90.
4. UI-02, porque amplía el ciclo entre partidas.
5. UI-10, porque el juego se usa en pantallas chicas.
6. UI-08, por la carga diferida del tutorial.
7. UI-09, por rutas dinámicas e idioma.
8. UI-07, porque son herramientas secundarias y de menor riesgo.

La suite completa debe seguir siendo corta y determinista. El objetivo no es subir el número de tests, sino detectar regresiones que impidan crear, jugar, sincronizar o continuar una partida.

## Entrega de esta tanda

La entrega se organiza con un PR agregador de `codex/ui-coverage/main` hacia `main`. Cada ticket que necesite código tendrá una rama y un PR propio hacia el agregador. Tras verificarlo, se integrará allí antes de abrir la siguiente rama. Este orden de PRs no crea dependencias funcionales entre tickets. El PR agregador queda para revisión humana y no se integra en `main` como parte de este trabajo. UI-08 se resuelve aquí con evidencia de la cobertura ya existente, sin repetirla en otro PR.
