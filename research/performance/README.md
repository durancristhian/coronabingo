# Rendimiento: diagnóstico y tickets

Diagnóstico inicial del 23 de septiembre de 2026. Actualizado tras implementar PERF-01, PERF-02 y PERF-06. Sus implementaciones y verificaciones locales están completas; publicación pendiente. Los demás tickets continúan abiertos y no se modificaron cuentas.

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

PERF-01, PERF-02 y PERF-06 están resueltos localmente; los restantes están diagnosticados y pendientes de implementación. Cada archivo define alcance, estimación, límites y aceptación. Publicidad conserva su plan canónico previo. Los valores base de la sección anterior siguen siendo la observación histórica de producción.

| Orden | Ticket | Resultado esperado | Esfuerzo orientativo |
| --- | --- | --- | --- |
| Hecho local | [PERF-01: retirar novedades](tickets/PERF-01-novedades.md) | Medido: 93 KB menos de JS inicial en portada, 25,5%; 46 entradas de dependencias retiradas | Verificado, sin publicar |
| Hecho local | [PERF-02: separar catálogo de cartones](tickets/PERF-02-cartones.md) | Medido: 26,4 KB menos en portada y 26,7 KB menos en configuración | Verificado, sin publicar |
| 3 | [PERF-03: caché de assets versionados](tickets/PERF-03-cache-assets.md) | Evitar revalidaciones de los archivos versionados aún presentes y frescos en caché | 0,5–1 día |
| 4 | [PERF-04: suscripción colectiva de jugadores](tickets/PERF-04-listeners.md) | Quitar una consulta de colección por pestaña de cartones; conservar sala y jugador | 0,5–1 día |
| 5 | [PERF-05: Excel bajo demanda](tickets/PERF-05-excel.md) | Diferir un chunk de 29,9 KB en la sala; 0 KB de ahorro en portada | 0,5 día |
| Hecho local | [PERF-06: tutorial bajo demanda](tickets/PERF-06-tutorial.md) | Medido: 4,0 KB menos en portada, 1,72%; reproductor diferido hasta abrir el modal | Verificado, sin publicar |
| 7 | [PERF-07: GIF de coronavirus](tickets/PERF-07-gif.md) | Objetivo experimental: 50–80% menos en ese archivo; calidad pendiente | 0,5 día |
| 8 | [PERF-08: audios grandes](tickets/PERF-08-audios.md) | Cardi B: alrededor de 60% menos si 128 kbps mantiene calidad | 0,5–1 día |
| 9 | [PERF-09: estabilidad del anuncio](tickets/PERF-09-anuncio.md) | Reserva estable de espacio; sin porcentaje de velocidad ni ingresos prometido | Según plan y dependencias de cuenta |

El esfuerzo incluye implementación y comprobación enfocada, no esperas de aprobación, revisión o despliegue. La hipótesis inicial conjunta para PERF-01/02/06 era llegar a 250–300 KB. Tras PERF-01 y PERF-02, la portada del build aislado de PERF-02 quedó en 230.605 bytes gzip. Las cifras no se suman directamente con la base pública porque corresponden a revisiones y entornos distintos. Recalcular PERF-06 sobre este build antes de implementarlo. PERF-05 afecta sala, PERF-07/08 recursos optativos y PERF-04 datos en vivo: sus porcentajes no se suman.

## Cómo atacar uno por uno

1. Seleccionar un ticket y cambiar su estado a en curso. Revisar HEAD, cambios concurrentes y guías instaladas de Next antes de editar código.
2. Registrar una base comparable para su pantalla y condición: primera visita o repetida, idioma y funciones abiertas. Trabajar solo ese alcance.
3. Cumplir su aceptación y los checks aplicables; actualizar el ticket con cambios, resultados, commit si lo hay y límites. Un resultado local no cierra una comprobación pendiente en producción.
4. Recalcular los bytes que puedan haberse movido entre chunks antes del siguiente ticket.

Para código de producto, usar los validadores vigentes, `npm run lint:check` y build en un checkout aislado si hay un servidor usando `.next`. Para gameplay, añadir prueba de anfitrión y jugador independiente contra desarrollo/emulador. No ejecutar partidas de prueba ni publicidad repetitiva contra producción. PERF-01 cumplió los checks locales y documenta su cobertura de navegador y límites en [el registro de verificación](perf01-evidence/README.md).

## Evidencia y reproducción

- [HTTP, tamaños, hashes y módulos publicados](baseline-2026-09-23.json).
- [Inventario local de medios](assets-2026-09-23.json), generado con `ffprobe`; no se codificaron alternativas.
- [Registro de listeners aislado](listeners-2026-09-23.json). Ejecuta providers reales con React/router/Firestore simulados, sin tráfico ni facturación.
- [Comparación local y verificación de PERF-02](perf02-evidence/README.md).
- [Comparación local y verificación de PERF-06](perf06-evidence/README.md).

Desde la raíz:

```sh
python3 research/performance/measure-production.py > /tmp/coronabingo-performance-new.json
node research/performance/measure-listeners.cjs --expect-scoped
```

El segundo comando se ejecutó y falla actualmente con `FAIL: cards still subscribes to the full player collection`. Esa es la señal enfocada de PERF-04, no una regresión creada por esta entrega. El script deberá adaptarse si cambian la composición de providers o sus imports; el criterio funcional permanece.

Los tamaños normalizados comprimen cada recurso con gzip nivel 9, independientemente de cómo lo sirva Vercel. `wire_body_bytes` guarda el cuerpo HTTP recibido por separado. Se cuentan scripts explícitos del HTML, excluyendo `nomodule`; no anuncios, Analytics, módulos que se descarguen después ni source maps. El probe solicita también chunks de otras rutas para inspeccionarlos, pero no los suma a la portada. No ejecuta JavaScript del sitio. No es una traza de navegador, Lighthouse ni medición de LCP/INP/CLS. Los bytes de fuentes en un source map no son bytes de transferencia.

## Relación con los otros diagnósticos

- [Auditoría interna](../2026-09-23-internal-optimization-audit.md): PERF-02/04/05 formalizan sus puntos coincidentes. PERF-01 sustituyó la propuesta de diferir novedades por su retiro completo, ya implementado localmente. Restauración de marcas, persistencia, doble bolillero, renderizados y ciclo de vida siguen en ese documento; no se agregan silenciosamente a estos tickets.
- [Plan canónico de anuncio adaptable](../responsive-manual-ad-plan-2026-09-23.md): PERF-09 es el enlace de seguimiento, no otro diseño del anuncio.
- [Limpieza de eventos y administración](../admin-events-cleanup.md): su eliminación de Auth/Storage ya se refleja en los assets de producción y deja de ser una oportunidad pendiente.

Referencias verificadas: [Next: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading), [Vercel: cabeceras de caché](https://vercel.com/docs/caching/cache-control-headers), [Firestore: listeners](https://firebase.google.com/docs/firestore/query-data/listen). Las estimaciones numéricas son propias de este diagnóstico, no promesas de esas fuentes.
