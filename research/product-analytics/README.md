# Plan de analytics de producto

Status: needs-info

Work status: claimed

Base revision: `d8f5e60a1a7f207a61bca1fac98048a97ea7e7f8`

Fecha de investigación: 2026-09-27

Alcance original: propuesta para revisión. Las entregas autorizadas se registran abajo; el resto continúa como propuesta y no autoriza cambios de propiedades de Analytics, Firebase, BigQuery, Vercel ni Production.

## Primera entrega autorizada

El 27 de septiembre de 2026 se aprobó un PR limitado a estos prerrequisitos:

- eliminar el nombre libre de sala del evento `room_created`;
- normalizar `page_location` y `page_referrer` para no enviar IDs de sala o jugador, queries ni fragmentos;
- usar un solo destino de GA4 en el navegador, configurado con `GA_TRACKING_ID`, para vistas y eventos de producto.

La entrega desactiva el `page_view` automático del Google tag, emite la vista inicial y las navegaciones desde el mismo helper, y retira el inicializador paralelo de Firebase Analytics. Firebase continúa siendo el backend de Firestore. No se cambia ninguna propiedad ni configuración de cuenta.

Quedan fuera de este PR los eventos nuevos, las dimensiones e informes, BigQuery, consentimiento/CMP, cambios de proveedor, merge y despliegue a Production.

Antes de implementar se actualizó la rama a `origin/main` en `d8f5e60a1a7f207a61bca1fac98048a97ea7e7f8`. La portada pública de Production devolvió únicamente la etiqueta directa `G-WYG7FMEWEF`; esta comprobación confirma el destino público actual, pero no sustituye una revisión autenticada de la propiedad ni modifica su configuración.

## Segunda entrega autorizada

El 27 de septiembre de 2026 se aprobó un PR apilado sobre la primera entrega, con base en `t3code/plan-product-analytics` en `14880b933409c9b9a3209c36383ef9991428deb0`. Su alcance es:

- definir una API tipada y versionada para los eventos existentes y los tres eventos del ciclo de sala;
- emitir `room_created`, `room_started` y `room_restarted` únicamente después de que la escritura remota correspondiente se confirme;
- registrar opciones finales, cantidad de participantes, número de partida y fecha de creación sin nombres, IDs, códigos ni URLs privadas;
- evitar emisiones duplicadas por doble clic en inicio y reinicio;
- habilitar un colector de pruebas local, sin requests a Analytics, y verificar creación, refresh, primera partida, reinicio y replay.

Quedan fuera de esta entrega los eventos de fondos, festejos, sonidos, idioma y tutorial; las dimensiones e informes de GA4; BigQuery; cambios de cuenta; merge y Production.

## Recomendación

Conviene ampliar GA4, pero no sumando eventos sueltos sobre la integración actual. Primero hay que elegir una sola propiedad como destino de producto, eliminar los datos privados que hoy pueden salir y tipar el contrato de eventos. Después se instrumentan las acciones.

La primera entrega puede responder casi todas las preguntas con datos agregados, sin enviar nombres, códigos, IDs de jugadores, IDs de sala ni URLs privadas. No propongo identificar una sala concreta en Analytics. Para "salas con más personas", el informe mostrará el mayor número de participantes, su distribución y cuántas partidas alcanzaron cada tamaño. Saber qué sala exacta fue requeriría un identificador correlacionable y una decisión de privacidad adicional.

La unidad principal será una partida configurada, no cada cambio de un control. `room_started` se emitirá una vez después de guardar la configuración y repartir cartones. Llevará una fotografía de las opciones finales y del número de participantes. Así, los porcentajes de bolillero y significados usan el mismo denominador y no se inflan cuando alguien cambia una opción varias veces.

BigQuery no es necesario para el primer lanzamiento. Sí es recomendable en una segunda etapa si se quieren máximos exactos, cohortes y consultas repetibles fuera de las limitaciones de los informes de GA4. Vincularlo cambia configuración y puede generar costo de almacenamiento o consultas, por lo que requiere aprobación aparte. Google permite BigQuery Sandbox con límites y dice que la exportación comienza después de crear el vínculo, sin recuperar días anteriores. [Configuración oficial de BigQuery Export](https://support.google.com/analytics/answer/9823238?hl=es).

## Estado encontrado al comenzar

Hay dos caminos de Analytics en el navegador:

- [`pages/_document.tsx`](../../pages/_document.tsx) carga el Google tag cuando existe `GA_TRACKING_ID`. La vista inicial sale desde `config`.
- [`utils/gtag.ts`](../../utils/gtag.ts) envía `page_view` en las navegaciones del Pages Router al ID de `GA_TRACKING_ID`.
- [`utils/firebase.ts`](../../utils/firebase.ts) inicializa Firebase Analytics con `MEASUREMENT_ID`, y [`contexts/Analytics.tsx`](../../contexts/Analytics.tsx) expone un `log` sin nombres ni parámetros tipados.
- [`components/CreateRoom.tsx`](../../components/CreateRoom.tsx) emite el único evento de producto encontrado, `room_created`. Incluye el nombre escrito por el usuario en `description`.
- [`components/Layout.tsx`](../../components/Layout.tsx) también emite `no_local_storage_support`. No hay instrumentación para configuración, participantes, reinicios, fondos, festejos, sonidos, idioma o tutorial.
- Las pruebas UI deshabilitan Analytics y bloquean solicitudes externas. Esa separación debe mantenerse.

La investigación autenticada del 23 de septiembre registró la etiqueta directa en una propiedad GA4 y Firebase Analytics en otra. El código de base conservaba esa separación. El estado de las propiedades es temporal y debe revalidarse antes de cualquier cambio de cuenta. Firebase documenta una configuración adicional cuando conviven su SDK web y llamadas directas a `gtag`, sobre todo si comparten un ID. [Firebase Analytics web y una etiqueta existente](https://firebase.google.com/docs/analytics/web/get-started?hl=es#use-firebase-with-existing-gtagjs-tagging).

### Datos que ya modela el juego

El documento de sala tiene `date`, `bingoSpinner`, `hideNumbersMeaning`, `timesPlayed`, `readyToPlay`, `confettiType` y `soundToPlay`. Los participantes viven en la subcolección `players`; el conteo está disponible en la configuración cuando se reparten los cartones. Ver [`interfaces/models/Room.ts`](../../interfaces/models/Room.ts), [`models/room.tsx`](../../models/room.tsx) y [`pages/room/[roomId]/admin.tsx`](../../pages/room/%5BroomId%5D/admin.tsx).

Hay diferencias importantes entre las preferencias:

- Bolillero y significados son opciones de la sala elegidas por quien la configura. No son preferencias de cada persona.
- Festejos y sonidos son acciones transitorias de quien dirige la sala. El modelo no guarda un historial de uso.
- El fondo es una preferencia local por jugador y navegador. [`contexts/BackgroundCell.tsx`](../../contexts/BackgroundCell.tsx) la guarda en `localStorage`; no queda en Firestore.
- Reiniciar incrementa `timesPlayed` en [`components/Restart.tsx`](../../components/Restart.tsx).
- El cambio de idioma reemplaza la ruta en [`components/Header.tsx`](../../components/Header.tsx).
- El tutorial se abre en un modal y carga YouTube bajo demanda en [`pages/index.tsx`](../../pages/index.tsx), pero no registra apertura ni finalización.

## Riesgos que deben resolverse primero

### Datos privados en eventos y vistas

El `description` de `room_created` contiene el nombre libre de la sala. Debe eliminarse y no debe conservarse como dimensión. Google prohíbe enviar información que permita identificar personas y advierte sobre texto escrito por usuarios, URLs y títulos. [Buenas prácticas para evitar PII](https://support.google.com/analytics/answer/6366371?hl=es).

El helper de vistas arma `page_location` con la URL completa y conserva la referencia anterior. En rutas de juego eso incluye IDs de sala y de jugador. La configuración inicial del tag también puede emitir la URL real antes de que React normalice nada. Antes de agregar eventos se debe:

1. desactivar la vista automática inicial con `send_page_view: false`;
2. emitir todas las vistas desde un único helper;
3. reemplazar segmentos dinámicos por rutas canónicas como `/room/[roomId]`, `/room/[roomId]/admin` y `/room/[roomId]/[playerId]`;
4. normalizar también `page_referrer` y cualquier contexto de ruta;
5. comprobar que Firebase Analytics no vuelve a enviar una vista automática con la URL privada.

La redacción automática de GA4 es una defensa adicional, no el mecanismo principal. Google la describe como una eliminación de mejor esfuerzo para emails y parámetros de consulta, no para IDs arbitrarios en la ruta. [Redacción de datos](https://support.google.com/analytics/answer/13544947?hl=es).

### Dos destinos de Analytics

Hoy `page_view` directo y `logEvent` de Firebase pueden terminar en propiedades distintas. Agregar eventos al contexto actual sin resolverlo dejaría tráfico y producto separados.

Recomendación: después de revalidar la cuenta, usar como destino canónico la propiedad que recibe el tráfico de producción y está vinculada con los informes del sitio. Enviar los eventos de producto mediante el mismo Google tag y `send_to` explícito. Firebase debe seguir siendo el backend del juego, pero no necesita ser un segundo emisor de producto. La migración debe comprobar que no rompe integraciones reales antes de retirar el inicializador de Firebase Analytics.

No se deben duplicar eventos en las dos propiedades para "estar seguros". Eso hace que dos tableros parezcan válidos y complica cualquier porcentaje.

### Población medida y decisión sobre consentimiento

El 27 de septiembre de 2026 se decidió diferir el trabajo de European Consent: por ahora el producto seguirá midiendo todo el tráfico como lo hace actualmente. Esta iniciativa no implementará una CMP ni Consent Mode y la ausencia de esa integración no bloquea los eventos de producto. Es una decisión de alcance del producto; no constituye una evaluación legal ni modifica por sí sola la configuración de ninguna cuenta.

Todo informe debe decir "entre las salas o navegadores medidos". Los bloqueadores, la pérdida de conexión u otras fallas de medición pueden dejar actividad afuera. GA4 tampoco equivale a personas reales: no hay cuentas en Coronabingo, un navegador puede representar a varias personas y una persona puede usar varios dispositivos.

## Contrato de eventos propuesto

Los nombres usan minúsculas y guiones bajos. Los valores categóricos salen de listas cerradas. Google limita los nombres de eventos y parámetros a 40 caracteres, y una propiedad estándar admite hasta 25 parámetros por evento. [Límites de colección](https://support.google.com/analytics/answer/9267744?hl=es-419).

Todos los eventos propios llevan `schema_version: "v1"` y `ui_language: "es" | "en"`. Ninguno lleva nombre de sala o jugador, ID de sala o jugador, código de acceso, ruta dinámica, URL pegada por el usuario ni una marca de tiempo como dimensión.

| Evento | Cuándo se emite | Parámetros adicionales | Regla de conteo |
| --- | --- | --- | --- |
| `room_created` | Después de que Firestore confirma la creación | `room_created_date` (UTC, `YYYY-MM-DD`) | Una vez por sala medida. Se elimina `description`. |
| `room_started` | Después del `batch.commit` que configura la sala y reparte cartones | `player_count`, `play_number`, `play_kind: first_play | replay`, `spinner_mode: online | physical`, `number_meanings: shown | hidden`, `room_created_date` | Una vez por partida configurada. Es el denominador de opciones de sala. |
| `room_restarted` | Después de confirmar el incremento de `timesPlayed` | `restart_number`, `first_restart: yes | no`, `room_created_date` | Una vez por reinicio confirmado. El primer reinicio permite una cohorte sin enviar ID de sala. |
| `player_card_opened` | Cuando un cartón válido termina de cargar | `play_number`, `background_key`, `background_source: preset | custom_url` | Como máximo una vez por jugador, partida y navegador. La clave de deduplicación puede usar IDs solo en almacenamiento local; nunca se envía. |
| `background_selected` | Después de guardar una elección de fondo local | `background_key`, `background_source` | Una vez por elección explícita. La URL libre se convierte siempre en `background_key: custom_url`. |
| `celebration_used` | Al activar un festejo y confirmar la escritura | `celebration_type: confetti | pallbearers | balloons`, `play_number`, `first_use_in_play: yes | no` | Ocultarlo no cuenta. La primera activación se deduplica localmente por partida. |
| `sound_used` | Al elegir un sonido y confirmar la escritura | `sound_key`, `sound_catalog: standard | extra`, `play_number`, `first_use_in_play: yes | no` | Un evento por reproducción solicitada; la primera se deduplica localmente por partida. No se envía la ruta MP3. |
| `language_changed` | Cuando `router.replace` termina correctamente y el idioma cambió | `from_language`, `to_language`, `page_type` | Una vez por cambio real. `page_type` usa `home`, `room_setup`, `room_lobby`, `player_card` o `not_found`. |
| `tutorial_opened` | Al abrir el modal del tutorial | `tutorial_language`, `tutorial_provider: youtube` | Una vez por apertura. Mide intención aunque el reproductor falle o no se inicie. |
| `tutorial_begin` | Cuando el reproductor confirma el inicio de reproducción | `tutorial_language`, `tutorial_provider: youtube` | Una vez por reproducción iniciada. Es un evento recomendado por GA4. |
| `tutorial_complete` | En el callback de finalización del reproductor | `tutorial_language`, `tutorial_provider: youtube` | Una vez por reproducción completada. Es un evento recomendado por GA4. |
| `tutorial_error` | Si falla el reproductor | `tutorial_language`, `tutorial_provider: youtube` | Diagnóstico del embudo. No reemplaza errores de Sentry. |

`tutorial_begin` y `tutorial_complete` pertenecen a la lista recomendada por GA4. Los demás son eventos personalizados porque no hay un recomendado con esa semántica. [Eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/recommended-events).

Las claves de fondo y sonido deben vivir junto al catálogo de [`utils/constants.ts`](../../utils/constants.ts), no derivarse de nombres traducidos ni de rutas de assets. Esto conserva las series aunque cambie el texto o se versionen los archivos.

### Dimensiones y métricas personalizadas

Enviar un parámetro no alcanza para verlo como columna en los informes normales. GA4 exige registrar las definiciones y puede tardar entre 24 y 48 horas en habilitarlas. [Parámetros de eventos](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters), [dimensiones y métricas personalizadas](https://support.google.com/analytics/answer/14240153?hl=es).

Registrar como dimensiones de evento:

- `schema_version`, `ui_language`, `room_created_date` (UTC, `YYYY-MM-DD`);
- `play_kind`, `spinner_mode`, `number_meanings`, `first_restart`;
- `background_key`, `background_source`;
- `celebration_type`, `sound_key`, `sound_catalog`, `first_use_in_play`;
- `from_language`, `to_language`, `page_type`, `tutorial_language`.

Registrar como métricas de evento:

- `player_count`;
- `play_number`;
- `restart_number`.

Son valores acotados. No registrar identificadores, timestamps ni URLs como dimensiones. Google considera de alta cardinalidad una dimensión con más de 500 valores diarios y puede agrupar filas bajo `(other)`. [Cardinalidad en GA4](https://support.google.com/analytics/answer/12226705?hl=es).

## Cómo se responde cada pregunta

Los porcentajes usan `event count`, no `users`, salvo donde se aclara. Eso evita presentar cookies de navegador como personas.

| Pregunta | Consulta y denominador | Qué responde exactamente | Límite |
| --- | --- | --- | --- |
| Salas creadas por día, semana o mes | Conteo de `room_created`, agrupado por fecha de la propiedad | Salas cuya creación se confirmó y cuyo evento fue medido | Empieza con el despliegue; no hay backfill automático. Para cierres, esperar datos procesados. |
| Salas jugadas con más personas | Máximo y distribución de `player_count` en `room_started`, filtrados por intervalo | Mayor tamaño de partida configurada y cantidad de partidas por tamaño | No muestra nombre, URL ni cuál sala fue. Una configuración no prueba que se extrajo una bolilla. |
| Porcentaje que usa bolillero online | `room_started` con `spinner_mode = online` dividido por todos los `room_started` | Proporción de partidas configuradas con bolillero online | Es opción de sala, no porcentaje de personas. |
| Porcentaje que oculta significados | `room_started` con `number_meanings = hidden` dividido por todos los `room_started` | Proporción de partidas configuradas con significados ocultos | Es opción de sala, no preferencia individual. |
| Porcentaje de cada fondo | Distribución de `background_key` en `player_card_opened`; aparte, distribución de `background_selected` | Fondo observado al abrir cartones y elecciones explícitas. `custom_url` incluye toda URL externa sin revelar cuál | Un jugador abierto en dos dispositivos puede contarse dos veces. Las selecciones miden acciones y pueden sumar varias por navegador. |
| Porcentaje de uso de festejos | Eventos con `first_use_in_play = yes` divididos por `room_started`; distribución por `celebration_type` | Aproximación de partidas medidas donde quien dirige activó al menos un festejo, más mezcla de tipos | La deduplicación local puede duplicarse si la dirección cambia de navegador o borra almacenamiento. El porcentaje exacto requiere correlación anónima por partida y BigQuery. |
| Porcentaje de uso de sonidos | Eventos con `first_use_in_play = yes` divididos por `room_started`; distribución de todos los `sound_used` por `sound_key` | Aproximación de partidas medidas con al menos un sonido y mezcla de sonidos solicitados | Pedir reproducción no garantiza que el navegador pudo reproducir el audio. El porcentaje exacto requiere correlación anónima por partida y BigQuery. |
| Porcentaje de salas reiniciadas | `room_restarted` con `first_restart = yes`, agrupado por `room_created_date`, dividido por `room_created` de esa cohorte | Salas creadas en un período que registraron al menos un primer reinicio | La cohorte queda abierta: una sala puede reiniciarse días después. Definir una ventana, por ejemplo 7 o 30 días, requiere BigQuery o una consulta programada. |
| Cambios de idioma | Conteo de `language_changed` y matriz `from_language` por `to_language`, con `page_type` | Cuántos cambios reales hubo, dirección y pantalla | No equivale a personas únicas. Las vistas de página siguen midiendo páginas, no la intención de cambio. |
| Cuántos ven el tutorial | Conteo de `tutorial_begin`; además `tutorial_begin / tutorial_opened` y `tutorial_complete / tutorial_begin` | Aperturas, reproducciones iniciadas y finalizaciones por idioma | GA4 mide navegadores con consentimiento, no espectadores físicos. |

No recomiendo intentar reconstruir el historial enviando eventos viejos a GA4. El `room_created` antiguo está en el destino de Firebase, incluye un campo que debe dejar de recopilarse y no comparte necesariamente la misma población. Si se necesita una línea de base histórica, corresponde otra tarea de lectura agregada de Firestore, con autorización para el entorno y sin exportar nombres ni IDs.

## Informes sugeridos

La entrega debe dejar consultas guardadas, no solo eventos:

1. Volumen: `room_created` y `room_started` por día, semana y mes.
2. Tamaño de partida: cantidad de partidas por `player_count`, con máximo, mediana y percentil 90 en BigQuery si se habilita.
3. Configuración: distribución de `spinner_mode` y `number_meanings` sobre `room_started`.
4. Personalización: fondos observados, fondos elegidos, festejos y sonidos por clave estable.
5. Retención de partida: primeros reinicios por cohorte de creación y profundidad de `play_number`.
6. Idioma y ayuda: matriz de cambio de idioma y embudo `page_view home -> tutorial_opened -> tutorial_begin -> tutorial_complete`.

Como ideas adicionales, conviene evaluar `share` con el método `copy`, `whatsapp` o `telegram`, un evento al extraer la primera bolilla para distinguir una sala configurada de una partida que efectivamente comenzó, y errores de creación o configuración agrupados por una causa estable. Nunca se enviaría el enlace compartido ni el texto de un error.

Los eventos actuales permiten observar el recorrido del organizador `room_created -> room_started`. `player_card_opened` muestra alcance entre participantes, pero no completa un embudo exacto por sala porque suele ocurrir en otros navegadores. Esa correlación necesitaría el diseño anónimo de ANA-06. No agregaría todavía clics genéricos, cada bolilla ni cada marca de cartón. Generan mucho volumen y no responden una decisión de producto definida.

## Etapas propuestas

Son tickets propuestos dentro de este mismo plan. `Status` describe triage, no aprobación para ejecutar.

### ANA-01: destino y contrato

Status: ready-for-agent

Work status: open

Decisiones humanas:

- confirmar en vivo cuál propiedad y flujo recibirán producto;
- mantener European Consent diferido y fuera de esta iniciativa mientras no haya una nueva decisión explícita;
- confirmar la definición de "sala jugada" como configuración guardada y cartones repartidos;
- aceptar que no se identificarán salas concretas y que "personas" se informará como navegadores o aperturas medidas.

Criterios de aceptación:

- se registra propiedad, flujo, zona horaria y retención sin exponer valores secretos;
- existe un catálogo tipado y versionado de eventos y parámetros;
- cada métrica tiene numerador, denominador, unidad y límite documentados;
- no se modifica una cuenta en esta etapa sin autorización específica.

### ANA-02: privacidad y cliente único

Status: ready-for-agent

Work status: resolved

Depends on: las decisiones vigentes de ANA-01. La primera entrega fijó el destino canónico usado por esta implementación.

Trabajo:

- reemplazar el `log` libre por una API tipada;
- dirigir producto a un solo destino;
- quitar `description` de `room_created`;
- normalizar vistas iniciales, navegación y referencias con plantillas de ruta;
- apagar emisión en local, pruebas UI y Preview por defecto;
- agregar un colector falso para pruebas.

Criterios de aceptación:

- tipos y pruebas rechazan nombres o parámetros fuera del contrato;
- ninguna captura de red contiene nombre, código o ID de sala, ID o nombre de jugador, URL privada ni URL de fondo;
- una carga y cada navegación real emiten una sola vista al destino previsto;
- el modo de prueba nunca contacta endpoints de Analytics.

### ANA-03: ciclo de sala

Status: ready-for-agent

Work status: resolved

Depends on: ANA-02, implementado en la primera entrega y completado por el contrato tipado de esta entrega.

Trabajo: implementar `room_created`, `room_started` y `room_restarted` en los puntos de éxito remoto, con protección contra doble clic y emisión duplicada.

Criterios de aceptación:

- fallos de Firestore no generan eventos de éxito;
- un primer juego y un replay generan los conteos y parámetros esperados una sola vez;
- `player_count`, opciones y `timesPlayed` corresponden al estado confirmado;
- reiniciar por primera vez conserva una sola marca `first_restart = yes`;
- las pruebas cubren creación, configuración, refresh y restart sin cambiar el comportamiento del juego.

### ANA-04: preferencias, idioma y tutorial

Status: needs-triage

Work status: open

Blocked by: ANA-02

Trabajo: instrumentar fondos, festejos, sonidos, idioma y tutorial. Agregar claves analíticas estables a catálogos, sin usar traducciones ni rutas de assets como valores.

Criterios de aceptación:

- el fondo inicial incluye el valor por defecto y las URLs libres llegan solo como `custom_url`;
- los porcentajes de uso de festejos y sonidos cuentan una primera activación por partida en el flujo normal;
- un idioma igual al actual no genera evento y uno distinto se registra después de navegar;
- apertura, inicio de reproducción, finalización y error del tutorial se distinguen;
- ES y EN, escritorio y móvil, pasan el recorrido afectado.

### ANA-05: configuración de GA4 e informes

Status: needs-info

Work status: open

Blocked by: ANA-03, ANA-04

Trabajo humano y de cuenta, con aprobación separada:

- crear solo las dimensiones y métricas de baja cardinalidad listadas;
- preparar las exploraciones de volumen, configuración, personalización, restart, idioma y tutorial;
- excluir tráfico de desarrollo usado en DebugView;
- dejar un diccionario con nombre visible, parámetro, alcance y propietario.

Criterios de aceptación:

- Realtime y DebugView muestran el evento, destino y parámetros correctos;
- después de 24 a 48 horas las definiciones aparecen en informes procesados;
- los informes usan la zona horaria acordada y un día completo para aceptación;
- no hay dimensiones de IDs, URLs o timestamps;
- cada porcentaje muestra su denominador y la nota "población medida".

### ANA-06: BigQuery opcional

Status: needs-info

Work status: open

Blocked by: ANA-05

Implementar solo si los informes agregados no alcanzan. Habilitar exportación diaria, no streaming, en un proyecto y región aprobados. Agregar consultas versionadas para máximos de participantes, percentiles y reinicio por cohorte. Configurar límites de costo y retención antes de vincular.

Si se aprueba que los porcentajes de festejos y sonidos sean exactos por partida, generar un `analytics_play_id` aleatorio al configurar cada juego. No debe derivarse del documento de sala, jugador, nombre, código o URL. Se enviaría solo en `room_started`, `celebration_used` y `sound_used`, no se registraría como dimensión de GA4 y tendría acceso y retención limitados en BigQuery. Sin esa aprobación, conservar la versión sin identificador y rotular esos dos porcentajes como aproximados.

Criterios de aceptación:

- el propietario aprobó proyecto, región, facturación, acceso y retención;
- la tabla diaria contiene los eventos nuevos sin campos prohibidos;
- si existe `analytics_play_id`, es aleatorio, no está registrado como dimensión y no permite recuperar una sala desde GA4;
- las consultas filtran `schema_version = "v1"` y días completos;
- la cifra de control concilia con GA4 dentro de las diferencias documentadas;
- no se afirma que el vínculo recuperó datos anteriores.

## Plan de verificación

### Local

- Usar un sink en memoria para inspeccionar eventos. Analytics real permanece apagado.
- Probar el contrato y el sanitizador de rutas con nombres, IDs, URLs de sala, query strings y fondos externos sintéticos.
- Extender Playwright sobre Firestore Emulator para creación, configuración, opciones, reinicio, fondos, idioma y tutorial. Las aserciones leen el sink y confirman ausencia de red externa.
- Ejecutar `npm run lint:check`, `npm run build`, `npm run ui-tests:production` y `git diff --check`. Si el cambio no afecta todo el recorrido, igualmente hay que conservar la regresión host/jugador porque los eventos se insertan en sus mutaciones.

Esta evidencia prueba contrato y momento de emisión. No prueba recepción ni procesamiento de Google.

### Vercel Preview

- Mantener Analytics real desactivado por defecto. Verificar el build publicado con el colector de prueba o un destino QA separado previamente aprobado.
- Confirmar una vista por navegación y los eventos del flujo en ES y EN, móvil y escritorio.
- Si Preview apunta a Production Firestore, usar solo salas de QA inequívocas según `AGENTS.md`, registrar sus IDs únicamente en evidencia privada de prueba y limpiarlas. Esos IDs nunca van a Analytics.
- No cambiar definiciones ni propiedades de GA4 como parte implícita del Preview.

Esta evidencia prueba el artefacto desplegado y la integración de navegador. No prueba Production ni recepción de la propiedad final.

### Production

- Requiere autorización de despliegue y, por separado, de cualquier cambio de cuenta.
- Comprobar con Tag Assistant o DebugView desde un dispositivo de desarrollo filtrado: destino, nombre, parámetros y una sola emisión. Google documenta que DebugView muestra eventos en tiempo real cuando se habilita `debug_mode`. [DebugView](https://support.google.com/analytics/answer/7201382?hl=es).
- Verificar primero idioma y tutorial, que no escriben en Firestore. No crear una sala de Production solo para probar Analytics sin autorización expresa. Para eventos de sala, esperar tráfico orgánico o acordar un registro sintético y su limpieza.
- Inspeccionar requests para demostrar que `page_location`, `page_referrer` y eventos no contienen segmentos privados ni texto libre.
- Esperar 24 a 48 horas y comparar un día completo procesado. Google advierte que los informes pueden cambiar durante ese plazo. [Actualización de datos](https://support.google.com/analytics/answer/11198161?hl=es).
- Aceptar cada informe contra un conteo controlado. Un HTTP exitoso o un evento en Realtime no demuestra que dimensiones, métricas y porcentajes procesados sean correctos.

## Definición de terminado

La iniciativa queda resuelta cuando:

- todos los eventos del contrato están implementados, probados y documentados;
- una única propiedad canónica recibe vistas y producto sin duplicados;
- no se recopilan nombres, IDs, códigos o URLs privadas;
- la decisión vigente de medición y cualquier cambio futuro de consentimiento quedan documentados explícitamente;
- existen informes procesados para las diez preguntas, con denominadores y límites visibles;
- local, Preview y Production tienen evidencia separada;
- se documentan fecha de inicio, zona horaria y ausencia de backfill;
- BigQuery queda implementado y validado, o rechazado explícitamente porque GA4 cubre las consultas acordadas.

## Fuentes

Fuentes del repositorio:

- [`components/CreateRoom.tsx`](../../components/CreateRoom.tsx), evento existente y campo libre.
- [`contexts/Analytics.tsx`](../../contexts/Analytics.tsx), adaptador Firebase sin contrato tipado.
- [`utils/firebase.ts`](../../utils/firebase.ts), inicialización de Analytics y Firestore.
- [`utils/gtag.ts`](../../utils/gtag.ts), vistas de navegación con URL completa.
- [`models/room.tsx`](../../models/room.tsx) e [`interfaces/models/Room.ts`](../../interfaces/models/Room.ts), estado persistido de la sala.
- [`pages/room/[roomId]/admin.tsx`](../../pages/room/%5BroomId%5D/admin.tsx), configuración y conteo de participantes.
- [`components/Restart.tsx`](../../components/Restart.tsx), incremento de partidas.
- [`contexts/BackgroundCell.tsx`](../../contexts/BackgroundCell.tsx) y [`components/BackgroundCells.tsx`](../../components/BackgroundCells.tsx), preferencia local y URL libre.
- [`components/Celebrations.tsx`](../../components/Celebrations.tsx) y [`components/Pato.tsx`](../../components/Pato.tsx), acciones transitorias.
- [`components/Header.tsx`](../../components/Header.tsx) y [`pages/index.tsx`](../../pages/index.tsx), idioma y tutorial.
- [`research/2026-09-23-adsense-ga4-link-plan.md`](../2026-09-23-adsense-ga4-link-plan.md) y [`research/european-consent-implementation-plan-2026-09-23.md`](../european-consent-implementation-plan-2026-09-23.md), antecedentes de propiedades, vistas y consentimiento.

Fuentes oficiales:

- [Configurar eventos con Google tag](https://developers.google.com/analytics/devguides/collection/ga4/events).
- [Eventos recomendados de GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/recommended-events).
- [Parámetros de eventos y definiciones personalizadas](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).
- [Límites de propiedades estándar y 360](https://support.google.com/analytics/answer/11202874?hl=es).
- [Buenas prácticas para evitar PII](https://support.google.com/analytics/answer/6366371?hl=es).
- [Firebase Analytics web con `gtag.js`](https://firebase.google.com/docs/analytics/web/get-started?hl=es#use-firebase-with-existing-gtagjs-tagging).
- [BigQuery Export](https://support.google.com/analytics/answer/9823238?hl=es).
- [DebugView](https://support.google.com/analytics/answer/7201382?hl=es) y [actualización de datos](https://support.google.com/analytics/answer/11198161?hl=es).

## Comments

### 2026-09-27: implementación local de la primera entrega

- Rama: `t3code/plan-product-analytics`; base actualizada por fast-forward a `origin/main` en `d8f5e60a1a7f207a61bca1fac98048a97ea7e7f8` antes de implementar.
- `room_created` dejó de enviar `description`; el evento se dirige al mismo `GA_TRACKING_ID` que las vistas.
- Firebase Analytics dejó de inicializarse. La configuración y el uso de Firestore no cambiaron.
- El Google tag acepta solamente IDs `G-`, desactiva la vista automática y usa rutas de Pages Router para enviar ubicaciones canónicas. Los referers internos reemplazan sala y jugador por plantillas, y los externos se reducen al origen.
- `npm run validate-analytics`: aprobado. Cubre ES/EN, rutas de sala, administración y jugador, query y fragmento, referer externo, deduplicación y destino de `room_created`.
- `npm run lint:check`: aprobado con generación de tipos, TypeScript y ESLint.
- `GA_TRACKING_ID=G-TEST123 npm run build`: aprobado. El artefacto contiene `send_page_view: false` y el único ID sintético.
- `npm run ui-tests:production`: 15 pruebas aprobadas en Chromium con Firestore Emulator. Incluye creación, host, jugador, sincronización, persistencia, reinicio, idiomas y tutorial.
- Comprobación dirigida con Playwright sobre `http://127.0.0.1:3199`: la URL real `/room/private-room/private-player?secret=value` produjo una sola vista con `page_location` `/room/[roomId]/[playerId]`, sin los valores privados. Se bloquearon los endpoints de Google y se usó `G-TEST123`.
- `git diff --check`: aprobado. No se crearon salas ni datos persistentes y el servidor local fue detenido. El navegador colaborativo no estaba disponible, por lo que la comprobación dirigida usó el Playwright del repositorio.
- Sin verificación de cuenta autenticada, recepción en GA4 ni Production en esta etapa. No se cambió configuración de proveedor ni se autorizó merge o despliegue.

### 2026-09-27: PR y Preview de la primera entrega

- PR: [#203](https://github.com/durancristhian/coronabingo/pull/203), abierto contra `main` con commit de implementación `f0bd2fcf580bc695287c13cee7a7e7828aadaae3`.
- Mientras se consultaba metadata de Preview, una invocación incorrecta al endpoint de deployments hizo que GitHub actualizara la rama con el `main` recién avanzado. No se creó un objeto de deployment de GitHub ni se desplegó a Production. El merge resultante es `827513613841802c63a3642a6e9b2397135ffabc`; el diff del PR siguió limitado a analytics.
- Se repitieron sobre `827513613841802c63a3642a6e9b2397135ffabc`: `npm run validate-analytics`, `npm run lint:check`, `GA_TRACKING_ID=G-TEST123 npm run build`, `npm run ui-tests:production` con 15 pruebas aprobadas y `git diff --check`.
- GitHub Actions `build`: aprobado. Vercel: aprobado. No hubo revisiones ni comentarios de código pendientes.
- Preview: `https://coronabingo-git-t3cod-525de9-cristhian-durans-projects-3ace6550.vercel.app`, HTTP 200. El HTML no contiene una etiqueta de Analytics porque `GA_TRACKING_ID` está desactivado en ese entorno, por lo que no se enviaron vistas ni eventos durante la comprobación.
- No se crearon salas ni registros de juego en Preview. Esta evidencia prueba el build publicado y la ausencia de Analytics en Preview; no prueba recepción en la propiedad GA4 de Production.

### 2026-09-27: implementación local de la segunda entrega

- Rama: `codex/analytics-room-lifecycle`; base apilada `t3code/plan-product-analytics` en `14880b933409c9b9a3209c36383ef9991428deb0`.
- Se agregó un contrato TypeScript cerrado y versionado para `room_created`, `room_started`, `room_restarted` y el evento preexistente `no_local_storage_support`. Los tipos rechazan nombres y valores fuera del catálogo.
- `room_created` usa la misma fecha que se persiste en Firestore. `room_started` se emite después de confirmar el batch de configuración y cartones. `room_restarted` se emite después de confirmar el incremento de `timesPlayed`.
- Inicio y reinicio tienen guardas sincrónicas contra doble clic. Los fallos de escritura salen por la rama de error antes de registrar un evento de éxito.
- En `UI_TESTS=1`, los eventos se guardan en `sessionStorage` y retornan antes de resolver o contactar el destino GA4. El recorrido comprueba parámetros, ausencia de nombre/ID de sala y nombres de participantes, persistencia tras refresh, primer reinicio y replay.
- `npm run validate-analytics`: aprobado.
- `npm run lint:check`: aprobado con generación de tipos, TypeScript y ESLint.
- `GA_TRACKING_ID=G-TEST123 npm run build`: aprobado.
- `npm run ui-tests:production`: 15 pruebas aprobadas en Chromium con Firestore Emulator; el runner detuvo sus procesos al terminar.
- No se usó Firebase alojado, no se crearon datos persistentes y no se verificó recepción en GA4 ni Production.

### 2026-09-27: PR y Preview de la segunda entrega

- PR apilado: [#204](https://github.com/durancristhian/coronabingo/pull/204), abierto contra `t3code/plan-product-analytics` (#203) con commit de implementación `e57a63780bcf44591d4fbc524c6056749c795441`.
- GitHub Actions `build`: aprobado. Vercel y Vercel Preview Comments: aprobados. No hubo revisiones ni comentarios de código pendientes al registrar esta evidencia.
- Preview: `https://coronabingo-git-codex-50a38f-cristhian-durans-projects-3ace6550.vercel.app`, HTTP 200. El HTML no contiene ID `G-`, `googletagmanager` ni inicialización `gtag`, porque Analytics está desactivado en ese entorno.
- El navegador colaborativo no estaba disponible; la comprobación de Preview fue HTTP y la interacción completa se cubrió localmente con el build de producción, Chromium, el colector de prueba y Firestore Emulator.
- No se crearon salas ni registros de juego en Preview. Esta evidencia no prueba recepción ni procesamiento en la propiedad GA4 de Production.
