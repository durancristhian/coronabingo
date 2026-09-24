# Evidencia de PERF-02

Verificación local del 24 de septiembre de 2026. La base y el candidato usaron Node 24.21.0, npm 11.19.0, Webpack y la configuración aislada de pruebas de UI. No se creó ni modificó `.env`, y no hubo tráfico a Firebase alojado.

## Resultado

`utils/constants.ts` ahora lee `public/tickets-metadata.json`. El catálogo completo queda importado solo por `hooks/useTickets.tsx`, dentro de la ruta de cartones.

| Pantalla | JS gzip antes | JS gzip después | Diferencia | Catálogo después |
| --- | ---: | ---: | ---: | --- |
| Portada `/` | 256.976 B | 230.605 B | -26.371 B (-10,26%) | No |
| Sala `/room/[roomId]` | 263.041 B | 263.041 B | 0 B | No |
| Configuración `/room/[roomId]/admin` | 257.747 B | 231.035 B | -26.712 B (-10,36%) | No |
| Cartones `/room/[roomId]/[playerId]` | 260.527 B | 261.164 B | +637 B (+0,24%) | Sí |

Los valores cuentan los scripts modernos únicos que el manifiesto asigna a cada ruta y comprimen cada archivo con gzip nivel 9. [El JSON de comparación](bundle-comparison.json) guarda los bytes sin comprimir, los bytes gzip y la presencia del literal exacto del catálogo. [El medidor](measure-build.py) reproduce la lectura sobre un build local.

La prueba de navegador de producción recorrió portada, configuración, sala y cartones mediante navegación de cliente. También abrió la URL de cartones directamente, recargó, reinició la partida y volvió a repartir. En cada caso mostró los mismos dos IDs que la sala había asignado. El manifiesto candidato solo relaciona el literal del catálogo con el chunk de `/room/[roomId]/[playerId]`; navegar por portada, configuración y sala no requiere ese chunk.

El SHA-256 de `public/tickets.json` fue `1becf3e8f17eb9202fce21c6974bd85e32e2830fac4de5097a36b72eb60539f1` tanto en `f6e789e` como en el candidato. El catálogo y el orden que define sus IDs no cambiaron.

## Comprobaciones

- Ciclo rojo: con `ticketCount: 1439`, `npm run validate-tickets` terminó con código 1 y `Ticket metadata count must match the catalog`, mostrando `1439 !== 1440`.
- Ciclo verde: con 1.440 cartones y capacidad 720, `npm run validate-tickets` mostró `There are no tickets with 10 or more`.
- `npm run typecheck` pasó durante la implementación.
- `ANALYZE_BUNDLE=1 npm run ui-tests:build` pasó y produjo el build candidato en `.next-ui-tests`.
- `npm run ui-tests:ci` pasó el recorrido completo en Chromium contra el emulador local de Firestore.
- `npm run lint:check` y `npm run validate-tickets` pasaron en el gate final.
- `ANALYZE_BUNDLE=1 npm run ui-tests:production` volvió a generar el build, validó locales y pasó el recorrido completo con la comprobación de entrada directa.
- `git diff --check` pasó. No se verificó Preview ni Production.
