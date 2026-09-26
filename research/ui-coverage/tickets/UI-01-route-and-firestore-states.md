# UI-01: estados de ruta y errores recuperables

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir los estados que hoy quedan fuera del recorrido feliz: carga, error de Firestore, recursos inexistentes, salas desactualizadas, salas bloqueadas y sala todavía no configurada.

## Alcance

- Inicio: fallo al crear una sala y reintento.
- Preparación, lobby y cartones: carga y error de lectura.
- Preparación y lobby: sala inexistente, desactualizada o bloqueada.
- Cartones: sala inexistente o desactualizada, persona inexistente y espera mientras la sala no está lista.
- Lobby: transición en tiempo real desde espera hasta sala lista.

## Criterios de aceptación

- [ ] Cada estado tiene una aserción sobre el mensaje o control visible correspondiente.
- [ ] Los errores recuperables prueban `Recargar` o el reintento disponible.
- [ ] Ningún caso toca Firebase alojado; los documentos se preparan en el emulador.
- [ ] Las pruebas no dependen de esperas fijas ni de IDs aleatorios.
- [ ] El recorrido feliz existente continúa pasando.

## Nota de implementación

Agregar helpers de datos del emulador antes de duplicar navegación en cada prueba. No confundir estos casos con reglas o disponibilidad de Firebase desplegado.
