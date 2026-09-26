# Rendimiento: revisión del 26 de septiembre

Status: needs-triage

Work status: open

Propuesta solicitada: recomendar únicamente oportunidades de prioridad alta o medio-alta después de las implementaciones y pruebas recientes. No autoriza implementar ni publicar. La prioridad propuesta combina alcance y beneficio; no equivale a una mejora temporal ya medida.

## Base y método

- Checkout `/Users/durancristhian/Repos/coronabingo`, rama `main`, base inicial `8e35fa47cfafc4e0095dbb6bb3eb5f1123595e8e`.
- Durante la revisión avanzó a `ee6421cb0defe4d55dda78c6931f7f51361acd62` por documentación de otra tarea. Entre ambas revisiones no cambió código de producto. Se preservaron sus cambios y los de la auditoría funcional en curso.
- Se revisaron las cuatro rutas activas, providers, modelos, persistencia, imports, anuncios, medios, configuración, los seis tests Playwright de tres archivos y el flujo de CI. La revisión mantiene el foco en rendimiento y assets del hilo.
- HTTP público a las 15:57 UTC, build `6b5E9UDpqrnb0DgW6EDpL`. No se ejecutaron scripts del sitio, anuncios ni Analytics. No se accedió a Firestore.
- No se verificó la asociación del build con un SHA en Vercel. Sí coinciden exactamente los sources publicados de Firebase, Analytics, composición de providers, creación de sala, Ads y Layout con los archivos locales: [comparación por hash](source-parity.json).
- No se ejecutó un build nuevo ni la suite de navegador. No hay nueva medición de LCP, INP, CLS, CPU móvil, latencia de partida ni proporción de uso de funciones optativas. No se crearon servidores, worktrees ni datos de prueba.

## Qué cambió y qué queda

PERF-01/02/04/05/06 están integrados. No se vuelven a proponer novedades, separar el catálogo, quitar el listener colectivo de cartones, diferir Excel ni diferir YouTube.

La portada publicada suma **242.121 bytes gzip nivel 9**, frente a 365.303 de la observación del 23/09: 123.182 bytes menos, aproximadamente 33,7%. Son observaciones públicas con el mismo método, no una atribución exacta por commit. No incluye terceros ni descargas posteriores y no equivale a cargar un 33,7% más rápido. El método incluye los manifests explícitos del HTML.

El probe actual de listeners pasa: inicio 0, sala 2, preparación 2, cartones 2; limpieza correcta en su recorrido simulado. Se ejecutó `node research/performance/measure-listeners.cjs --expect-scoped`. [Resultado](listeners.json). No mide lecturas facturadas.

## Selección propuesta

| Prioridad | Ticket | Alcance y beneficio | Esfuerzo estimado |
| --- | --- | --- | --- |
| Alta, nueva | [PERF-10: Firestore fuera de la carga inicial de portada](../tickets/PERF-10-firestore-inicial.md) | Hipótesis de 50–65 KB gzip menos antes de usar la creación de sala, aproximadamente 21–27% del JS inicial observado. Requiere comparación de builds para confirmar. | 2–4 días con regresión |
| Medio-alta por alcance de interfaz | [PERF-09: anuncio estable y adaptable](../tickets/PERF-09-anuncio.md) | Reservar el espacio elegible desde el primer render y adaptar el ancho. El código actual pasa de ningún bloque a uno de 90 px de alto, con ancho declarado de 728 px, después de 1 s. No se asigna porcentaje de velocidad ni CLS. | 1–2 días técnicos una vez resueltas las decisiones del plan canónico |

Firestore aporta 243.037 bytes de código generado atribuido por source map. Su concatenación pesa unos 64,7 KB gzip; quitar esos spans produce un proxy de unos 64,3 KB. Son aproximaciones de contribución, **no un bundle ejecutable ni una eliminación ya conseguida**. Los demás módulos Firebase y Sentry se conservan fuera de esa estimación. El gzip del análisis por spans se calculó con Node/zlib y el inventario HTTP con Python/zlib; no se suman sus grupos ni se comparan diferencias de unos pocos bytes entre compresores. [Atribución](app-attribution.json).

PERF-09 ya existía. Se conserva su [plan canónico](../../responsive-manual-ad-plan-2026-09-23.md), incluyendo elegibilidad, loader y decisiones pendientes. La presencia de 728 px en código no demuestra desborde de una creatividad real. La falta de reserva sí está confirmada. Se propone priorizarlo por aparecer en el Layout compartido; el impacto de campo debe medirse antes de prometer un resultado de CLS.

## Qué aportan los tests nuevos

La suite actual sí verifica crear/configurar, asignación exacta, host y jugador separados, sincronización, recarga, reinicio, navegación, cambios de sala, sonidos y festejos representativos. También tiene carga diferida, fallo/reintento y descarga de Excel, y cuatro tests de tutorial con ES/EN y proveedor simulado.

Para PERF-10 debe agregarse una aserción de red de que la portada fría no descarga Firestore hasta la interacción prevista, además de creación durante la carga, fallo/reintento y entrada directa a sala. Los tests de gameplay actuales son una base útil y deben seguir pasando en build compilado. Firebase Analytics se desactiva en el entorno de tests: su conservación exige una comprobación separada y autorizada.

Para PERF-09 la suite actual desactiva explícitamente Ads mediante `UI_TESTS=1`. No detectaría la inserción tardía ni certificaría geometría de un anuncio. Usar un proveedor simulado con el contenedor real para comprobar reserva, anchos móviles/escritorio, resize y medición de cambios de layout, sin generar publicidad real repetidamente.

## Fuera del filtro

- PERF-03 sigue pendiente: los GIF/MP3 muestreados revalidan, mientras JS/CSS con hash ya tienen un año e `immutable`. Falta una traza de uso repetido para justificar prioridad alta global. No recomendar caché eterna sobre URLs mutables.
- PERF-07/08: GIF de 1.313.518 bytes y audio Cardi B de 522.590 bytes, confirmados otra vez por HTTP. El potencial por recurso es grande, pero son funciones optativas y no hay evidencia nueva de frecuencia de uso o calidad de alternativas que justifique subir su prioridad general.
- Doble bolillero y renderizados amplios: continúan; sin profiler no se los eleva a medio-alto por contar nodos.
- Firebase modular puede estudiarse después de PERF-10 para reducir bytes también durante la partida. La documentación respalda el tree-shaking, pero no hay comparación local de builds que permita prometer un ahorro alto aquí. Cambiar solo a `compat` no aporta el beneficio buscado. Conservar realtime; no sustituir automáticamente por Firestore Lite.
- Los hallazgos funcionales conservan su [auditoría propia](../../functional-audit-2026-09-23.md) y el backlog de [cobertura UI](../../ui-coverage/README.md). No se cuentan como ganancias de rendimiento.

## Evidencia y referencias

- [Inventario HTTP actual](public-http.json), generado mediante `python3 research/performance/measure-production.py`.
- [Atribución de `_app`](app-attribution.json): se recorrieron los mappings con `source-map` y se agruparon los spans generados por `/@firebase/firestore/`, otros `/@firebase/` y `/@sentry/`; se comprimieron sus concatenaciones con gzip nivel 9. No se guardaron contenidos de source maps ni valores de entorno.
- [Next.js: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading). También se consultó la guía instalada de Pages Router y su documento compartido `01-app/02-guides/lazy-loading.md`.
- [Firebase: API modular y limitaciones de compat](https://firebase.google.com/docs/web/modular-upgrade).
- [web.dev: reservar espacio para reducir cambios de layout](https://web.dev/articles/optimize-cls).

## Comments

### 2026-09-26

Investigación completada; propuestas abiertas para decisión del usuario. La selección incorpora una oportunidad nueva de carga inicial y conserva un ticket existente de interfaz. Ningún cambio de producto, dependencia, cuenta o despliegue se implementó en esta revisión.
