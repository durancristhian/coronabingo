# PERF-02: separar metadatos del catálogo de cartones

Estado: diagnosticado, pendiente de implementación. Prioridad alta. Esfuerzo: 0,5 día. Riesgo bajo. Independiente de PERF-01.

## Diagnóstico

`utils/constants.ts` importa `public/tickets.json` para `MAX_PLAYERS = ticketsData.length / 2`. Consumidores como `utils/generateRoomCode.ts` solo necesitan constantes, pero arrastran el catálogo. `hooks/useTickets.tsx` sí necesita números reales.

El catálogo tiene 1.440 cartones y capacidad de 720 jugadores. El literal minificado pesa 151.921 bytes y aparece en el chunk inicial `142`, de 28.135 bytes gzip. Sustituir solo ese literal por `[]` y recomprimir da una diferencia de 26.148 bytes. Es un proxy de bytes atribuibles, no un build válido ni una modificación aplicada. [Evidencia](../baseline-2026-09-23.json).

Hipótesis: desacoplar los metadatos elimina el catálogo de inicio/configuración sin alterar cartones. Esperado: cerca de 26 KB menos de JS inicial en portada, alrededor de 7%; el empaquetado final puede variar.

## Alcance

Separar capacidad del catálogo mediante metadatos generados o una constante comprobada por el validador. Conservar el import del catálogo donde se muestran cartones si alcanza para obtener el aislamiento por ruta.

No agregar API, lecturas Firestore ni fetch de todo `/tickets.json` como sustituto automático. No dividir todavía en bloques ni generar nuevos cartones. Esa segunda fase requiere justificar el costo frente a solo unos 25 KB gzip de JSON compacto.

## Aceptación

- El literal del catálogo no está en el conjunto de scripts iniciales de portada/configuración; comprobar también navegación entre rutas.
- Todos los IDs conservan exactamente sus números; capacidad y asignación no cambian. El validador comprueba metadatos frente al catálogo y detecta divergencias.
- Anfitrión y jugador muestran sus dos cartones correctos tras entrada directa, recarga y reinicio.
- Registrar bytes antes/después por pantalla; la pantalla de cartones puede seguir descargando el catálogo completo.
- Ejecutar validación de cartones y checks comunes del [índice](../README.md).

Rollback: volver a la relación de imports anterior, preservando el catálogo original intacto.
