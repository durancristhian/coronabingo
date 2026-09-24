# Evidencia de PERF-05

Verificación local del 24 de septiembre de 2026. La base fue `2ec2fb61b8d9ae733d8258e7af8510a26876f83c` y el código candidato quedó en `919c8072b92f15660600cb6105397421dd846cbd`. Ambos builds usaron Node 24.21.0, npm 11.19.0, Webpack y la configuración aislada de pruebas de UI.

## Resultado

`DownloadSpreadsheet` conserva su lugar en la ruta y carga `zipcelx` mediante `import()` al activarse la exportación. La promesa se comparte mientras está en curso y se descarta si falla, de modo que el usuario puede reintentar. La descarga queda bloqueada mientras carga o genera el archivo, y una guarda síncrona evita descargas duplicadas ante clics consecutivos.

| Condición | JS sin comprimir | JS gzip nivel 9 | Excel |
| --- | ---: | ---: | --- |
| Entrada a sala, antes | 897.148 B | 263.041 B | Incluido |
| Entrada a sala, después | 770.837 B | 227.034 B | Ausente |
| Diferencia | -126.311 B | -36.007 B (-13,69%) | Diferido |
| Primera exportación | 127.321 B | 36.502 B | Chunk asíncrono |

La portada cambió 18 bytes gzip por el mapa de módulos asíncronos de Webpack. No obtiene el ahorro de la sala. [El JSON de comparación](bundle-comparison.json) guarda las cifras de las cuatro rutas, y [el medidor](measure-build.py) reproduce la lectura de un build.

## Navegador y archivo

La regresión `tests/ui/spreadsheet.spec.ts` crea una sala con anfitriona y jugador en Firestore Emulator. Antes de activar la opción, “Exportar” no existe. Después de las siete interacciones, la prueba retiene el nuevo request de script y observa “Preparando exportación...”. Falla ese request, comprueba el mensaje y los dos jugadores, retira el bloqueo, reintenta y hace doble clic. Chromium produce una sola descarga llamada `Sala de exportación.xlsx`.

Una comprobación puntual adicional descargó los archivos español e inglés desde el build candidato. Se abrió `xl/worksheets/sheet1.xml` con `zipfile` de Python y se verificaron estos valores:

- Etiquetas `Sala`, `Link`, `Capacidad`, `Dirige` y `Room`, `URL`, `Capacity`, `Admin`.
- Nombre de sala, anfitriona, jugador, dos pares de cartones y capacidad 2.
- URL de sala y URL individual completa para ambas personas, con el idioma correspondiente.

Los archivos medían 4.368 y 4.365 bytes. Eran evidencia local descartable y no se agregaron al repositorio. El test permanente comprueba nombre, tamaño mayor que cero, reintento, estado de sala y ausencia de duplicados; no importa una dependencia adicional para leer XLSX.

## Comprobaciones

- `npm ci` completó con el lockfile vigente.
- El ciclo rojo falló porque la implementación anterior no mostraba el estado de carga ni solicitaba un chunk al activar la opción.
- `npm run ui-tests -- spreadsheet.spec.ts` pasó en desarrollo.
- `npm run ui-tests:ci -- spreadsheet.spec.ts` pasó contra el build de producción.
- `npm run ui-tests:ci` pasó las dos pruebas en 5,3 segundos, con dos tests Playwright en 3,1 segundos.
- `npm run lint:check`, `npm run validate-locales` y `npm run validate-tickets` pasaron. El validador de cartones informó `There are no tickets with 10 or more`.
- `ANALYZE_BUNDLE=1 npm run ui-tests:build`, `npm run build` y `git diff --check` pasaron.

La URL de prueba fue `http://127.0.0.1:3187`. El único destino Firebase fue `demo-coronabingo-ui` en Firestore Emulator, `127.0.0.1:8187`. No se creó información alojada ni se verificaron Preview o Production.
