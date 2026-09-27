# Referencia visual de la interfaz

Status: ready-for-agent

Work status: claimed

## Objetivo

Crear una página local, estática y responsive que reúna la interfaz actual de Coronabingo antes de iniciar un rediseño. Debe permitir revisar escenas reconocibles de la aplicación y también comparar sus componentes y estados en un solo recorrido.

## Alcance acordado

- Mostrar el inicio y la preparación de una sala.
- Recrear la mesa de juego con últimos números, bolillero, cartón y accesos a herramientas.
- Incluir sonidos, fondos, código de sala, botones, campos, mensajes, banners y carga.
- Reutilizar los componentes y estilos existentes siempre que no produzcan escrituras ni dependan de una sala real.
- Mantener la página sin conexión funcional con Firestore y marcarla como `noindex`.
- Verificar escritorio y móvil en un servidor propio de este worktree.

## Criterios de aceptación

- La ruta `/kitchen-sink` carga sin crear salas, jugadores ni otros registros.
- Las escenas principales de la aplicación se reconocen y usan el sistema visual actual.
- El contenido se adapta a una pantalla móvil y a una pantalla de escritorio sin desbordes horizontales de página.
- La página incluye el bolillero, los 90 números, un cartón, la lista completa de sonidos y todos los fondos configurados actualmente.
- Pasan `npm run lint:check`, `npm run build` y `git diff --check`.
- La comprobación de navegador queda registrada con revisión móvil y de escritorio.

## Evidencia

Pendiente de verificación.

## Comments

- 2026-09-27: implementación autorizada por el pedido de crear la primera demo y levantar un servidor local para revisión.
