# PERF-03: reutilizar imágenes y sonidos versionados en el navegador

Estado: diagnosticado, pendiente de implementación. Prioridad alta. Esfuerzo: 0,5–1 día. Riesgo medio por URLs persistidas. Independiente de los tickets de bundle; coordinar nombres con PERF-07/08.

## Diagnóstico

GIF y MP3 muestreados en producción devuelven `public,max-age=0,must-revalidate` y `X-Vercel-Cache: HIT`. La CDN funciona; el navegador debe validar de nuevo cuando reutiliza una respuesta vencida. JS/CSS con hash ya tienen un año e `immutable` y no necesitan otra política. [Cabeceras](../baseline-2026-09-23.json).

Esperado: eliminar las consultas de validación de los assets versionados durante su vigencia y mientras el navegador conserve el archivo. Primera visita: sin mejora material por este cambio. Un 304 ya evita reenviar el cuerpo: no prometer ahorro igual al peso completo en cada repetición.

## Alcance

Crear URLs con hash de contenido para los assets locales de juego y aplicar un año/immutable únicamente a ese conjunto. Usar un resolver/manifest común donde haga falta. Conservar compatibilidad con nombres guardados en `backgroundCell` de localStorage y rutas publicadas en `room.soundToPlay`.

Mantener los nombres antiguos operativos para clientes/salas existentes, con su política anterior, o resolverlos explícitamente sin perder preferencias. No agregar caché larga global a HTML, Firestore, `ads.txt`, favicon sin versión, URLs externas ni todo `public/`. No limpiar la CDN como paso rutinario.

## Aceptación

- Archivo versionado: contenido esperado, `200`, `max-age=31536000,immutable`; MIME y reproducción correctos. La regla funciona en Vercel, no solo en local.
- En navegador con caché habilitada, repetir navegación/reproducción ordinaria sin forzar reload evita red para el asset fresco. Registrar caché de memoria/disco y distinguir 304 de ausencia de solicitud.
- Cambiar el contenido produce URL nueva; actualización y rollback recuperan el asset correcto. No sobrescribir bytes bajo una URL immutable.
- Preferencias guardadas con nombres anteriores y clientes ya abiertos conservan fondos/sonidos; no reescribir datos de producción para probarlo.
- Comparar visita fría y repetida por separado. Seguir los checks comunes del [índice](../README.md).

Referencia: [Vercel Cache-Control](https://vercel.com/docs/caching/cache-control-headers). Reversión: volver al resolver anterior y mantener los archivos publicados necesarios para clientes antiguos.
