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

La regresión `tests/ui/spreadsheet.spec.ts` crea una sala con anfitriona y jugador en Firestore Emulator. Observa los scripts desde antes de navegar y comprueba que el chunk pedido al activar la exportación no fue solicitado durante la entrada a la sala. Antes de activar la opción, “Exportar” no existe. Después de las siete interacciones, la prueba retiene ese nuevo request y observa “Preparando exportación...”. Falla el request, comprueba el mensaje y los dos jugadores, retira el bloqueo, reintenta y hace doble clic. Chromium produce una sola descarga llamada `Sala de exportación.xlsx`; el test espera 750 ms después de volver al estado listo para descartar una segunda descarga tardía.

Los estados de carga, error, reintento y listo se verificaron con un viewport de 390 × 844 sin desborde horizontal. El armado inicial de la sala también recorrió el viewport de escritorio predeterminado. El setup compartido con la regresión principal quedó en `tests/ui/room-setup.ts`.

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
- Tras los ajustes de revisión, `npm run ui-tests:ci -- spreadsheet.spec.ts` pasó en 4,8 segundos y `npm run ui-tests:ci` pasó las dos pruebas en 6,1 segundos, con dos tests Playwright en 3,8 segundos.
- `npm run lint:check`, `npm run validate-locales` y `npm run validate-tickets` pasaron. El validador de cartones informó `There are no tickets with 10 or more`.
- `ANALYZE_BUNDLE=1 npm run ui-tests:build`, `npm run build` y `git diff --check` pasaron.

La URL de prueba local fue `http://127.0.0.1:3187`. El único destino Firebase de los recorridos funcionales fue `demo-coronabingo-ui` en Firestore Emulator, `127.0.0.1:8187`. No se creó información alojada.

## Pull request y entornos alojados

[PR #189](https://github.com/durancristhian/coronabingo/pull/189) publicó el candidato `f38f45cc498fcc1317cb685de695c04808d7e76d`. [GitHub Actions 36057328996](https://github.com/durancristhian/coronabingo/actions/runs/36057328996) pasó en 1 minuto 46 segundos: instalación, lint y tipos, build con análisis, los dos tests Playwright en Chromium y la carga de evidencia y reportes de bundle. Playwright informó dos pruebas aprobadas en 8,4 segundos; el recorrido completo, incluidos los servicios, terminó en 13 segundos.

Vercel informó el deployment como `Ready`. Se abrió la [portada del Preview](https://coronabingo-git-t3cod-433d6d-cristhian-durans-projects-3ace6550.vercel.app/) en el navegador colaborativo y se observó `Staging v1.23.1`, el formulario de creación de sala y la navegación en español. Esa comprobación fue de solo lectura: no se creó una sala porque una URL Preview no demuestra aislamiento de Firebase. Por lo tanto, el resultado alojado prueba el despliegue y la portada, mientras que la aceptación funcional de exportación corresponde al build local con Firestore Emulator y al mismo recorrido en CI. No se verificó Production ni se hizo merge.
