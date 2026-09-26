# Inventario de cobertura UI con Playwright

Fecha: 2026-09-25

Status: needs-triage

Work status: open

Revisión relevada: `2ec2fb6`

Este inventario extiende el [plan y registro de Playwright](../playwright-test-plan.md). Describe la cobertura que existe hoy y divide lo pendiente en tickets chicos. Es una propuesta de trabajo, no autoriza implementar los tickets.

## Cómo leer los checks

- `[x]`: `tests/ui/room.spec.ts` ejecuta el comportamiento y verifica un resultado visible.
- `[ ]`: no hay una aserción de Playwright suficiente. Que el recorrido pase por la pantalla no cuenta como cobertura.
- Los IDs `UI-xx` enlazan el pendiente con un ticket propuesto.

La suite actual cubre un recorrido feliz en Chromium de escritorio y en español, con dos contextos de navegador y Firestore Emulator. No cubre Firebase desplegado, reglas de producción, servicios externos ni entrega real de anuncios.

## Mapa de páginas

| Ruta | Página | Estado actual |
| --- | --- | --- |
| `/` | Inicio y creación de sala | Cobertura parcial |
| `/room/[roomId]/admin` | Preparación de sala | Cobertura parcial |
| `/room/[roomId]` | Lobby de sala | Cobertura parcial |
| `/room/[roomId]/[playerId]` | Cartones y controles de juego | Cobertura parcial, es la página mejor cubierta |
| cualquier ruta inexistente | 404 estándar de Next.js | Sin cobertura |

Los prefijos de idioma `/es` y `/en` usan las mismas páginas. `/admin` y `/eventos/...` están retiradas y deben responder 404.

## Comportamientos compartidos

### Navegación e idioma

- [ ] El logo vuelve al inicio conservando el idioma activo. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] El selector cambia entre español e inglés sin perder la ruta ni sus parámetros. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] Las cuatro páginas activas muestran su contenido principal en español y en inglés. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] El atributo `lang` del documento coincide con el idioma elegido. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)

### Modales, estados y pie

- [ ] Los modales abren, cierran con botón y Escape, contienen el foco y lo devuelven al control que los abrió. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] Si `localStorage` no está disponible, aparece el mensaje alternativo y no se muestra un flujo de juego roto. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] El modal de donación abre y sus acciones intentan abrir Cafecito y PayPal sin navegar la página actual. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] Los enlaces de feedback, autor y Twitter tienen el destino esperado. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] La aplicación sigue siendo usable cuando los tweets, anuncios y otros recursos externos están bloqueados. [UI-09](tickets/UI-09-shell-locales-and-404.md)

## `/`: inicio y creación de sala

### Crear sala

- [ ] El botón `Listo` empieza deshabilitado y se habilita al ingresar un nombre. [UI-08](tickets/UI-08-home-and-tutorial.md)
- [x] Ingresar un nombre y confirmar crea una sala y navega a `Preparar sala`.
- [ ] Durante el guardado se bloquea un segundo envío y se muestra el estado correspondiente. [UI-08](tickets/UI-08-home-and-tutorial.md)
- [ ] Un error de Firestore deja el formulario recuperable y muestra un mensaje visible. [UI-01](tickets/UI-01-route-and-firestore-states.md)

### Ayuda y enlaces

- [ ] `Ver tutorial` abre el modal y carga el video correcto para español o inglés. Sólo se verifica la integración del iframe, no la reproducción real de YouTube. [UI-08](tickets/UI-08-home-and-tutorial.md)
- [ ] El tutorial se puede cerrar y reabrir sin dejar un iframe o foco residual. [UI-08](tickets/UI-08-home-and-tutorial.md)
- [ ] El enlace de videollamada apunta al destino esperado. [UI-08](tickets/UI-08-home-and-tutorial.md)

## `/room/[roomId]/admin`: preparación de sala

### Carga y datos básicos

- [x] Una sala recién creada muestra `Preparar sala`.
- [ ] Se ven el nombre y el link de sala como campos de solo lectura. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [ ] El modal de compartir permite copiar y ofrece WhatsApp y Telegram con la URL correcta. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [ ] Se cubren carga, error de Firestore, sala inexistente, desactualizada y bloqueada. [UI-01](tickets/UI-01-route-and-firestore-states.md)

### Personas

- [x] Se agregan dos personas y ambas aparecen en la configuración.
- [ ] No se puede agregar un nombre vacío ni repetido. [UI-02](tickets/UI-02-setup-player-management.md)
- [ ] El contador y el formulario respetan el máximo de personas. [UI-02](tickets/UI-02-setup-player-management.md)
- [ ] Se puede eliminar una persona que no dirige la sala. [UI-02](tickets/UI-02-setup-player-management.md)
- [ ] Eliminar a quien dirige limpia la selección y vuelve a bloquear `Jugar`. [UI-02](tickets/UI-02-setup-player-management.md)
- [x] Se elige quién dirige la sala.
- [ ] `Jugar` permanece deshabilitado hasta tener al menos dos personas y alguien que dirija. [UI-02](tickets/UI-02-setup-player-management.md)
- [ ] Dos pestañas de preparación no pierden cambios de personas por escrituras concurrentes. [UI-02](tickets/UI-02-setup-player-management.md)

### Opciones y configuración

- [x] Se activa el bolillero online y luego quien dirige ve `Próximo número`.
- [ ] Desactivar el bolillero online habilita el marcado manual y no muestra `Próximo número`. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)
- [ ] `Ocultar los significados` elimina el significado del último número para todos. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)
- [ ] La opción oculta de código muestra el código y protege los cartones de quien dirige. [UI-06](tickets/UI-06-host-room-code.md)
- [x] Configurar reparte dos cartones por persona y navega al lobby.
- [ ] El estado de guardado bloquea cambios y un error permite reintentar sin perder el borrador. [UI-01](tickets/UI-01-route-and-firestore-states.md)

## `/room/[roomId]`: lobby

### Información y participantes

- [x] El lobby muestra el encabezado y dos filas de participantes.
- [x] Cada fila muestra los dos IDs de cartón asignados.
- [ ] La lista queda ordenada por nombre y señala de forma visible a quien dirige. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [ ] El nombre y el link de sala son correctos y seleccionables. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [ ] El modal de compartir usa la URL exacta del lobby. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [x] `Jugar` lleva a los cartones de la persona elegida.
- [x] Entrar directamente al link personal conserva los cartones asignados.
- [ ] El lobby muestra espera mientras la sala no está lista y se actualiza sin recarga al configurarla. [UI-01](tickets/UI-01-route-and-firestore-states.md)
- [ ] Los cambios de participantes se reflejan en tiempo real. [UI-02](tickets/UI-02-setup-player-management.md)

### Exportación oculta

- [ ] Siete activaciones del título muestran la exportación. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [ ] La descarga genera un `.xls` con sala, capacidad, quien dirige, cartones y links de todas las personas. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)

### Estados de ruta

- [ ] Se cubren carga, error de Firestore, sala inexistente, desactualizada y bloqueada. [UI-01](tickets/UI-01-route-and-firestore-states.md)

## `/room/[roomId]/[playerId]`: cartones y juego

### Entrada, rol y cartones

- [x] El saludo identifica a la persona.
- [ ] El saludo muestra el nombre correcto de la sala. [UI-04](tickets/UI-04-lobby-sharing-and-export.md)
- [x] Aparecen exactamente dos cartones con los IDs asignados en el lobby.
- [x] Cada cartón tiene 15 números interactivos.
- [x] Quien dirige ve controles de sorteo y reinicio; la otra persona no.
- [ ] Una persona inexistente ve el mensaje correcto y no recibe cartones. [UI-01](tickets/UI-01-route-and-firestore-states.md)
- [x] Al reiniciar, la otra persona ve el estado de espera y deja de ver cartones.
- [ ] Se cubren carga, error de Firestore, sala inexistente y sala desactualizada. [UI-01](tickets/UI-01-route-and-firestore-states.md)

### Marcas del cartón

- [x] Marcar un número actualiza `aria-pressed` y persiste tras recargar.
- [ ] Desmarcar un número persiste tras recargar. [UI-05](tickets/UI-05-card-marking-resilience.md)
- [ ] Las marcas independientes de los dos cartones no se pisan. [UI-05](tickets/UI-05-card-marking-resilience.md)
- [ ] Dos pestañas de la misma persona conservan marcas concurrentes en vez de sobrescribirlas. [UI-05](tickets/UI-05-card-marking-resilience.md)
- [ ] Una recarga durante una escritura pendiente recupera la última selección válida. [UI-05](tickets/UI-05-card-marking-resilience.md)
- [ ] Una partida nueva no recupera marcas de la partida anterior. [UI-05](tickets/UI-05-card-marking-resilience.md)

### Bolillero y sincronización

- [x] Antes del primer sorteo, ambas personas ven el estado vacío.
- [x] Quien dirige sortea un número y la otra persona lo recibe sin recargar.
- [ ] Varios números mantienen el mismo orden en ambos contextos y muestran el significado del último. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)
- [ ] En modo manual, quien dirige puede agregar y quitar números; los demás sólo observan. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)
- [ ] Con significados ocultos, no aparece el texto ni el link de la Quiniela. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)
- [ ] Tras sortear los 90 números, el botón queda deshabilitado y no se repiten valores. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md)

### Personalización de cartones

- [ ] Cualquier persona puede abrir la configuración de celdas vacías y elegir un fondo incluido. [UI-07](tickets/UI-07-game-tools.md)
- [ ] Una URL personalizada cambia las celdas vacías y la preferencia persiste para esa persona. [UI-07](tickets/UI-07-game-tools.md)
- [ ] Cambiar el fondo no modifica cartones ni preferencias de otra persona. [UI-07](tickets/UI-07-game-tools.md)

### Herramientas de quien dirige

- [ ] Confetti, ghaneses y globos se activan, sincronizan y se pueden apagar. [UI-07](tickets/UI-07-game-tools.md)
- [ ] Un sonido se publica para ambos contextos, bloquea otro disparo mientras suena y luego se limpia. Se puede simular `Audio`; no hace falta validar parlantes reales. [UI-07](tickets/UI-07-game-tools.md)
- [ ] Siete activaciones del título de sonidos muestran el catálogo extra. [UI-07](tickets/UI-07-game-tools.md)
- [x] El modal de reinicio abre, confirma y devuelve a quien dirige a la preparación.
- [x] Reiniciar limpia el sorteo, reparte de nuevo y permite volver a sincronizar.
- [ ] Cerrar el modal de reinicio no cambia la partida. [UI-07](tickets/UI-07-game-tools.md)

### Código de sala y vista especial

- [ ] Con protección activa, los cartones de quien dirige piden el código; los demás entran sin código. [UI-06](tickets/UI-06-host-room-code.md)
- [ ] Un código incorrecto muestra error y permite reintentar; el correcto habilita el juego. [UI-06](tickets/UI-06-host-room-code.md)
- [ ] Reiniciar vuelve a exigir el código en la partida siguiente. [UI-06](tickets/UI-06-host-room-code.md)
- [ ] `streamerView` oculta los cartones de quien dirige y amplía el bolillero. Hoy no tiene control visible; requiere decidir cómo preparar el dato de prueba. [UI-07](tickets/UI-07-game-tools.md)

## 404 y rutas retiradas

- [ ] Una ruta desconocida muestra la 404 estándar y permite volver al inicio. [UI-09](tickets/UI-09-shell-locales-and-404.md)
- [ ] `/admin`, `/eventos/[eventId]` y `/eventos/[eventId]/admin` responden 404 en español e inglés. [UI-09](tickets/UI-09-shell-locales-and-404.md)

## Matriz de entorno pendiente

- [x] Chromium de escritorio, español, 1280 x 720.
- [ ] Chromium móvil en un ancho representativo para inicio, preparación, lobby y juego. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] Un recorrido corto en inglés. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] Recorrido crítico sólo con teclado, incluidos tabs y modales. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] Firefox o WebKit para el recorrido crítico. Conviene elegir con datos de uso antes de duplicar toda la suite. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)
- [ ] Baselines visuales estables de una pantalla por ruta y breakpoint. Deben congelar contenido aleatorio y excluir embeds/anuncios. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md)

## Orden sugerido

1. [UI-01](tickets/UI-01-route-and-firestore-states.md): estados de ruta y errores recuperables.
2. [UI-05](tickets/UI-05-card-marking-resilience.md): persistencia y concurrencia de marcas.
3. [UI-06](tickets/UI-06-host-room-code.md): protección por código de quien dirige.
4. [UI-02](tickets/UI-02-setup-player-management.md): altas, bajas, límites y concurrencia de la preparación.
5. [UI-03](tickets/UI-03-game-configuration-and-draw-modes.md): opciones y bolillero manual.
6. [UI-04](tickets/UI-04-lobby-sharing-and-export.md): datos, compartir y exportar.
7. [UI-07](tickets/UI-07-game-tools.md): fondos, festejos, sonidos y vista especial.
8. [UI-08](tickets/UI-08-home-and-tutorial.md): inicio y tutorial.
9. [UI-09](tickets/UI-09-shell-locales-and-404.md): shell, enlaces y 404.
10. [UI-10](tickets/UI-10-responsive-accessibility-matrix.md): móvil, inglés, teclado, navegadores y visuales.

El orden prioriza fallas conocidas y pérdida de estado. No implica que los primeros tickets estén aprobados ni que deban entrar en un único PR.

## Fuera del alcance de Playwright UI

- Reglas, índices, cuotas y disponibilidad de Firebase desplegado.
- Entrega real de AdSense, Analytics, Sentry, tweets, YouTube, WhatsApp, Telegram, Cafecito o PayPal.
- Calidad de audio o video en el dispositivo.
- Carga, costos, conteo de listeners y rendimiento. Esos puntos necesitan mediciones específicas.
- Seguridad real del código de sala. El flujo actual es cliente; un test UI sólo verifica la barrera visible.
