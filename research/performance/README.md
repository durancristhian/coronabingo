# Rendimiento: diagnóstico y tickets

Revisión nueva: [selección de prioridades altas y medio-altas del 26/09](revalidation-2026-09-26/README.md). Incluye [PERF-10: Firestore fuera de la carga inicial](tickets/PERF-10-firestore-inicial.md), propuesto y pendiente de aprobación, y revalida PERF-09. La portada publicada mide ahora 242.121 bytes gzip; las cifras del diagnóstico original que siguen se conservan como historia.

Diagnóstico inicial del 23 de septiembre de 2026. Actualizado el 26 de septiembre: PERF-01, PERF-02, PERF-04, PERF-05 y PERF-06 están integrados en el `main` local `8e35fa4`. Los demás tickets continúan abiertos y no se modificaron cuentas. La [revalidación de la auditoría interna](../2026-09-23-internal-optimization-audit.md#revalidación-del-26-de-septiembre-de-2026) distingue los ahorros ya implementados de los candidatos que no alcanzan un impacto alto o medio-alto confirmado.

## Tickets acordados el 26 de septiembre

Desglose aprobado por el usuario mediante `to-tickets`. Se actualizan los tickets existentes y se agrega una investigación independiente. Todos conservan `Work status: open`; registrar el alcance no inicia implementaciones ni autoriza cambios de cuentas o despliegues.

| Ticket | Entrega | Estado de triage | Bloqueado por |
| --- | --- | --- | --- |
| [PERF-10: Firestore cuando haga falta](tickets/PERF-10-firestore-inicial.md) | Portada más liviana, creación de sala recuperable y juego verificado | `ready-for-agent` | Ningún ticket |
| [PERF-09: anuncio estable y adaptable](tickets/PERF-09-anuncio.md) | Reserva inicial y adaptación al ancho, con pruebas del comportamiento publicitario | `needs-info` | Ningún ticket de esta tanda; faltan decisiones de elegibilidad, loader y unidad del plan canónico |
| [PERF-11: investigar el peso de los assets](tickets/PERF-11-investigar-peso-assets.md) | Inventario, candidatos comparados y recomendaciones con ahorro y calidad comprobados | `ready-for-agent` | Ningún ticket |

PERF-10 es el primer trabajo de implementación propuesto. PERF-11 puede investigarse de forma independiente y debe alimentar PERF-03/07/08, sin duplicarlos ni esperar su implementación. PERF-09 conserva sus decisiones pendientes en el plan existente.

## Línea base posterior al push

Medición pública a las 22:18 UTC. HEAD local `c85eeb92b7accc69e161f1ecec27f3805c00632c`; build publicado `Y3Y7XVd6hwy5_jiQeneED`. No se consultó la asociación Git/deployment en Vercel: el build ID no certifica un SHA. Sí se verificó que el JavaScript publicado ya no contiene fuentes de Firebase Auth ni Storage, y conserva Firestore.

| Medida | Resultado |
| --- | --- |
| JS inicial de portada, gzip nivel 9 | 365.303 bytes, 365,3 KB decimales |
| JS inicial sin compresión | 1.310.788 bytes |
| `_app` publicado, gzip nivel 9 | 235.313 bytes |
| CSS inicial, gzip nivel 9 | 6.651 bytes |
| Chunk con catálogo de cartones | 28.135 bytes gzip; 26.148 bytes de diferencia al sustituir solo el literal JSON por `[]` |
| Chunk con YouTube | 7.808 bytes gzip |
| Chunk con Excel | 29.861 bytes gzip, fuera de la portada |
| GIF coronavirus | 1.313.518 bytes, 256 × 256, 3,6 segundos |
| MP3 Cardi B | 522.590 bytes, 13 segundos, estéreo a 320 kbps |
| Todos los MP3 en disco | 2.041.513 bytes, 19 archivos; no se descargan todos al entrar |

La medición anterior de esta conversación dio 437.840 bytes de JS inicial con gzip nivel 9. La reducción observada es de 72.537 bytes, un 16,6%. No volver a incluir ese ahorro en los tickets pendientes. El artefacto JSON anterior no se guardó; esa comparación procede de la salida de la primera revisión. La nueva línea base sí queda persistida.

La portada y los assets muestreados dieron `X-Vercel-Cache: HIT`. JS/CSS con hash ya usan `max-age=31536000,immutable`. GIF y MP3 usan `max-age=0,must-revalidate`: caché de CDN y reutilización sin consulta desde el navegador son cosas diferentes. No hace falta activar una caché global adicional.

## Tickets y orden sugerido

PERF-01, PERF-02, PERF-04, PERF-05 y PERF-06 están integrados. Los restantes están diagnosticados y pendientes de implementación. Cada archivo define alcance, estimación, límites y aceptación. Publicidad conserva su plan canónico previo. Los valores base de la sección anterior siguen siendo la observación histórica de producción.

| Orden | Ticket | Resultado esperado | Esfuerzo orientativo |
| --- | --- | --- | --- |
| Integrado | [PERF-01: retirar novedades](tickets/PERF-01-novedades.md) | Medido: 93 KB menos de JS inicial en portada, 25,5%; 46 entradas de dependencias retiradas | Verificado e integrado |
| Integrado | [PERF-02: separar catálogo de cartones](tickets/PERF-02-cartones.md) | Medido: 26,4 KB menos en portada y 26,7 KB menos en configuración | Verificado e integrado |
| 3 | [PERF-03: caché de assets versionados](tickets/PERF-03-cache-assets.md) | Evitar revalidaciones de los archivos versionados aún presentes y frescos en caché | 0,5–1 día |
| Integrado | [PERF-04: suscripción colectiva de jugadores](tickets/PERF-04-listeners.md) | Medido: cartones baja de 3 a 2 listeners; sala y configuración conservan 2 | Verificado en local, CI y Preview; matriz aislada repetida el 26/09 en main |
| Integrado | [PERF-05: Excel bajo demanda](tickets/PERF-05-excel.md) | Medido: 36,0 KB menos al entrar a la sala; 36,5 KB bajo demanda al activar Excel | Verificado e integrado |
| Integrado | [PERF-06: tutorial bajo demanda](tickets/PERF-06-tutorial.md) | Medido: 4,0 KB menos en portada, 1,72%; reproductor diferido hasta abrir el modal | Verificado e integrado |
| 7 | [PERF-07: GIF de coronavirus](tickets/PERF-07-gif.md) | Objetivo experimental: 50–80% menos en ese archivo; calidad pendiente | 0,5 día |
| 8 | [PERF-08: audios grandes](tickets/PERF-08-audios.md) | Cardi B: alrededor de 60% menos si 128 kbps mantiene calidad | 0,5–1 día |
| 9 | [PERF-09: estabilidad del anuncio](tickets/PERF-09-anuncio.md) | Reserva estable de espacio; sin porcentaje de velocidad ni ingresos prometido | Según plan y dependencias de cuenta |

El esfuerzo incluye implementación y comprobación enfocada, no esperas de aprobación, revisión o despliegue. La hipótesis inicial conjunta para PERF-01/02/06 era llegar a 250–300 KB. Tras PERF-01 y PERF-02, la portada del build aislado de PERF-02 quedó en 230.605 bytes gzip. PERF-05 llevó la entrada a sala de 263.041 a 227.034 bytes gzip y dejó 36.502 bytes para la primera exportación. Las cifras no se suman directamente con la base pública porque corresponden a revisiones y entornos distintos. PERF-07/08 afectan recursos optativos y PERF-04 datos en vivo; sus porcentajes no se suman.

## Cómo atacar uno por uno

1. Seleccionar un ticket y cambiar su estado a en curso. Revisar HEAD, cambios concurrentes y guías instaladas de Next antes de editar código.
2. Registrar una base comparable para su pantalla y condición: primera visita o repetida, idioma y funciones abiertas. Trabajar solo ese alcance.
3. Cumplir su aceptación y los checks aplicables; actualizar el ticket con cambios, resultados, commit si lo hay y límites. Un resultado local no cierra una comprobación pendiente en producción.
4. Recalcular los bytes que puedan haberse movido entre chunks antes del siguiente ticket.

Para código de producto, usar los validadores vigentes, `npm run lint:check` y build en un checkout aislado si hay un servidor usando `.next`. Para gameplay, añadir prueba de anfitrión y jugador independiente contra desarrollo/emulador. Los gameplays en Preview siguen las reglas de `AGENTS.md`; no ejecutar partidas ni publicidad repetitiva directamente contra Production. PERF-01 cumplió los checks locales y documenta su cobertura de navegador y límites en [el registro de verificación](perf01-evidence/README.md).

## Evidencia y reproducción

- [HTTP, tamaños, hashes y módulos publicados](baseline-2026-09-23.json).
- [Inventario local de medios](assets-2026-09-23.json), generado con `ffprobe`; no se codificaron alternativas.
- [Registro de listeners aislado](listeners-2026-09-23.json). Ejecuta providers reales con React/router/Firestore simulados, sin tráfico ni facturación.
- [Comparación local y verificación de PERF-02](perf02-evidence/README.md).
- [Comparación local y verificación de PERF-04](perf04-evidence/README.md).
- [Comparación local y verificación de PERF-05](perf05-evidence/README.md).
- [Comparación local y verificación de PERF-06](perf06-evidence/README.md).

Desde la raíz:

```sh
python3 research/performance/measure-production.py > /tmp/coronabingo-performance-new.json
node research/performance/measure-listeners.cjs --expect-scoped
```

El segundo comando pasa tras PERF-04 y exige la matriz completa: inicio 0, sala 2, configuración 2 y cartones 2. También comprueba un cleanup por cada listener registrado durante inicio → configuración → sala → cartones → sala → otra sala → inicio. `--players-source-ref <revisión>` permite repetir esa medición con la versión histórica del provider; el script deberá adaptarse si cambian la composición de providers o sus imports, pero el criterio funcional permanece.

Los tamaños normalizados comprimen cada recurso con gzip nivel 9, independientemente de cómo lo sirva Vercel. `wire_body_bytes` guarda el cuerpo HTTP recibido por separado. Se cuentan scripts explícitos del HTML, excluyendo `nomodule`; no anuncios, Analytics, módulos que se descarguen después ni source maps. El probe solicita también chunks de otras rutas para inspeccionarlos, pero no los suma a la portada. No ejecuta JavaScript del sitio. No es una traza de navegador, Lighthouse ni medición de LCP/INP/CLS. Los bytes de fuentes en un source map no son bytes de transferencia.

## Relación con los otros diagnósticos

- [Auditoría interna](../2026-09-23-internal-optimization-audit.md): PERF-02/04/05 formalizan sus puntos coincidentes. PERF-01 sustituyó la propuesta de diferir novedades por su retiro completo, ya implementado localmente. Restauración de marcas, persistencia, doble bolillero, renderizados y ciclo de vida siguen en ese documento; no se agregan silenciosamente a estos tickets.
- [Plan canónico de anuncio adaptable](../responsive-manual-ad-plan-2026-09-23.md): PERF-09 es el enlace de seguimiento, no otro diseño del anuncio.
- [Limpieza de eventos y administración](../admin-events-cleanup.md): su eliminación de Auth/Storage ya se refleja en los assets de producción y deja de ser una oportunidad pendiente.

Referencias verificadas: [Next: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading), [Vercel: cabeceras de caché](https://vercel.com/docs/caching/cache-control-headers), [Firestore: listeners](https://firebase.google.com/docs/firestore/query-data/listen). Las estimaciones numéricas son propias de este diagnóstico, no promesas de esas fuentes.
