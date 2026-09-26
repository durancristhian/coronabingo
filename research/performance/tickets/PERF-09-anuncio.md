# PERF-09: reservar espacio estable para el anuncio manual

Status: needs-info

Work status: open

Type: task

Blocked by: None (sin dependencias con PERF-10 ni PERF-11).

Decisiones pendientes: confirmar estados elegibles, disponibilidad del loader y estrategia de unidad publicitaria según el plan canónico. Son condiciones de este trabajo; no dependen de terminar otro ticket de rendimiento.

Estado: diagnóstico de código confirmado; implementación y decisiones de cuenta pendientes. Prioridad separada del trabajo de assets. Esfuerzo y dependencias: definidos por el plan canónico.

## What to build

Un anuncio manual que reserve su espacio desde el primer render elegible y se adapte al ancho disponible. La persona puede crear, preparar y jugar una sala sin que la llegada o ausencia del anuncio desplace los controles. Incluye inicialización y pruebas de navegación, carga lenta, error y falta de anuncio; no se limita a un cambio de CSS.

## Diagnóstico

`components/Ads.tsx` sigue retornando `null` inicialmente e inserta el bloque después de un segundo, con 728 × 90 px declarados. `Layout` lo coloca antes del contenido. Esto demuestra ausencia de reserva inicial, no un valor concreto de CLS ni desborde de una creatividad real.

El diagnóstico de cuenta y diseño detallado ya existe en [Plan del anuncio manual adaptable](../../responsive-manual-ad-plan-2026-09-23.md). Ese archivo es la fuente de verdad para decisiones, elegibilidad, loader, pruebas y reversión. Su estado de cuenta es una observación anterior y debe verificarse antes de ejecutarlo.

## Alcance

Ejecutar el plan existente como trabajo propio cuando se decida abordar publicidad. No duplicarlo con un parche de `width:100%` ni incluirlo de forma incidental en PERF-03. La creación de este ticket no autoriza cambios de AdSense ni publicación.

Resultado esperado: reserva estable de 90 px en los estados elegibles y adaptación al ancho disponible. No se estiman porcentaje de velocidad, CLS final ni ingresos. El script de publicidad puede seguir teniendo costos independientes de CPU/red.

## Aceptación y dependencias

- [ ] Resolver los prerrequisitos del plan: elegibilidad de estados, disponibilidad del loader y coordinación del tipo de unidad. Revisar si consentimiento ya cambió el loader.
- [ ] Geometría estable desde el primer render elegible; juego usable en móvil/escritorio, orientación y resize. Sin refrescos por bolillas, marcas o cambios de tamaño.
- [ ] QA repetitiva con stub y publicidad real bloqueada; comprobar navegación, carga lenta, error y ausencia de anuncio. La comprobación real breve se realiza solo en el alcance aprobado. Distinguir reserva vacía de creatividad entregada.
- [ ] Registrar CLS antes/después con condiciones equivalentes y atribución al bloque manual; no atribuirle todo el impacto de Auto ads.
- [ ] Completar los controles de implementación vigentes del repositorio y registrar revisión, entorno y evidencia. Los tests que desactivan anuncios no certifican este comportamiento.
- [ ] Cierre y rollback según el plan canónico, incluida reversión de cuenta si se hubiera cambiado. Una validación local no prueba entrega de anuncios reales.

Este ticket enlaza la oportunidad anterior número 7. No incorpora las propuestas de vinculación GA4, consentimiento o Search Console a la tanda de rendimiento.

## Comments

### 2026-09-26: desglose aprobado con to-tickets

El usuario aprobó conservar este ticket como una entrega completa e independiente de PERF-10 y PERF-11. Se incorporan estado estructurado, dependencias y aceptación verificable sin reemplazar el plan canónico ni su historia. Permanece `needs-info` por las decisiones publicitarias pendientes. La aprobación corresponde al desglose y registro de tickets; no autoriza implementar, modificar AdSense ni publicar.
