# PERF-07: reducir el GIF de coronavirus conservando la animación

Status: ready-for-human

Work status: claimed

Type: task

Estado: implementación local completa; pendiente revisar el Vercel Preview. Prioridad media a baja. Esfuerzo: 0,5 día. Riesgo bajo tras conservar el identificador persistido y el GIF de rollback.

## Diagnóstico

`public/background-cells/coronavirus.gif` pesa 1.313.518 bytes tanto local como en HTTP. `ffprobe` identifica 256 × 256 y duración de 3,6 segundos. `BackgroundCells` lo usa en una miniatura de 64 px y `EmptyCell` como fondo del cartón. Puede descargarse al abrir el selector aunque no termine elegido. Se guarda su nombre en localStorage.

[Inventario](../assets-2026-09-23.json) y [HTTP](../baseline-2026-09-23.json). Objetivo exploratorio: 50–80% menos, aproximadamente 0,26–0,66 MB finales. No se codificaron candidatos ni se validó fidelidad; el rango tiene confianza baja. No beneficia la portada con fondo predeterminado.

## Alcance

Comparar codificaciones de la animación original, preferentemente WebP animado, con dimensiones adecuadas a la celda y densidad de pantalla. Preservar duración, loop, transparencia y contenido. Elegir por bytes y prueba visual en móvil, no solo por extensión. Si no hay ahorro con calidad aceptable, documentar y no sustituir.

Conservar funcionamiento de preferencias con el nombre anterior; mantener archivo antiguo o mapear el identificador. Usar URL versionada si PERF-03 está implementado. No transformar imágenes remotas introducidas por el usuario ni migrar todas las imágenes a `next/image` para resolver un CSS background.

## Aceptación

- Tabla de tamaño/formato/dimensiones de candidatos y revisión de animación en selector y cartón, Chrome/Safari, móvil/escritorio.
- Verificar calidad a la densidad prevista y ausencia de incremento perceptible de trabajo de decodificación con varias celdas animadas.
- Fondo guardado antes del cambio sigue funcionando; nueva URL y caché correctas. Mantener original recuperable.
- Medir ahorro en el flujo que descarga el fondo, sin multiplicar bytes por cantidad de celdas que reutilizan una misma URL.

Rollback: resolver el identificador al GIF original. Checks comunes del [índice](../README.md) si cambia código.

## Investigación del 27/09/2026

Esta sección registra la comparación que precedió a la implementación. El usuario eligió el WebP lossless de 50 fps después de revisar la demo visual.

### Lo que tiene que conservarse

La inspección local sobre `62a97f25ff5c39585a63637b973a474658b55725` confirmó:

- GIF de 1.313.518 bytes, 256 × 256, 180 cuadros, 3,6 segundos y 50 fps.
- Píxeles transparentes y opacos, con alpha mínimo 0 y máximo 255, loop infinito y cuadros de 20 ms.
- El selector lo muestra a 64 px. En el cartón, la altura es 32 px en móvil y 80 px desde `sm`.
- `coronavirus.gif` es también el valor persistido. El formato servido puede cambiar mediante un resolvedor, pero el identificador guardado debe seguir funcionando.

Hay dos umbrales distintos. "Sin pérdida" significa reconstruir los mismos píxeles y conservar todos los cuadros. "Sin diferencia perceptible" permite reducir resolución, cuadros o calidad, pero exige mirar la animación en su tamaño real. No conviene tratarlos como equivalentes.

### Cuadro comparativo

| Alternativa | Tamaño local | Ahorro frente al GIF | Calidad y comportamiento | Impacto en la app | Decisión propuesta |
| --- | ---: | ---: | --- | --- | --- |
| GIF optimizado sin pérdida | Pendiente | Pendiente | Conserva formato, transparencia, loop y cuadros. `gifsicle -O2/-O3` guarda regiones modificadas y puede usar transparencia, aunque su manual aclara que la optimización no garantiza un archivo menor. | Cambio mínimo y compatibilidad histórica. Sirve como control antes de cambiar de formato. | Medir. No instalarlo sin comparar bytes, porque puede ahorrar poco si el original ya está optimizado. |
| WebP animado lossless, 256 px y 50 fps | 1.049.854 bytes | 20,1% | Conserva 180 cuadros, duración, loop y transparencia. La codificación es espacialmente lossless. | Sigue siendo una imagen y puede usarse como `background-image`. Google documenta soporte nativo en Chrome, Safari, Firefox y Edge. | **Elegido.** Conserva todos los cuadros y reduce 263.664 bytes sin pérdida visible ni estructural. |
| WebP animado lossless, 256 px y 25 fps | 518.682 bytes | 60,5% | Conserva resolución, color y alpha de los 90 cuadros retenidos, además de 3,6 s y loop. Elimina uno de cada dos cuadros, por lo que no es lossless respecto de la animación completa. | Mantiene el modelo de imagen de fondo y no reduce nitidez en pantallas densas. | No elegido: logra más ahorro, pero sacrifica la mitad de los cuadros. |
| WebP animado lossless, 256 px y 20 fps | 415.170 bytes | 68,4% | Conserva los píxeles de 72 cuadros y la duración, pero descarta más movimiento que el candidato de 25 fps. | Mismo cambio que los otros WebP. | Candidato agresivo. Compararlo solo si 25 fps no ofrece margen suficiente. |
| WebP animado lossy, 256 px y 50 fps | q90: 1.615.436 bytes; q80: 1.180.190 bytes | q90: -23,0%; q80: 10,2% | Conserva estructura y transparencia, pero comprime el color con pérdida. | Mismo cambio de integración que WebP lossless. | Descartar q90. q80 ahorra poco y pierde color; ambos son peores que reducir a 25 fps sin pérdida espacial. |
| WebP con remuestreo Lanczos | q80 a 128 px: 872.316 bytes; q80 a 192 px: 1.370.386 bytes | 33,6%; -4,3% | El remuestreo introduce colores y niveles de alpha intermedios. Las variantes lossless de 128 y 192 px también crecieron por encima del original. | Reduce nitidez en densidades altas y no mejora la integración. | Descartar este pipeline. Reducir dimensiones no garantiza menos bytes en este dibujo plano. |
| AVIF animado | No se generó un candidato válido | Sin medir | El formato admite animación, compresión con o sin pérdida y alpha. Puede comprimir mejor que WebP. | Necesita fallback. WebKit mantiene incidencias recientes de AVIF animado en blanco y de animación con transparencia incorrecta o muy lenta. No cumple hoy la verificación Chrome/Safari como fuente única. | Dejar como experimento secundario, no como primera implementación. |
| WebM VP9 q18 a 25 fps en `<video>` | 341.416 bytes | 74,0% | Conserva 3,6 s, 90 cuadros y declara alpha. VP9 lossless pesó 1.227.195 bytes, solo 6,6% menos que el GIF. La variante q18 no se validó visualmente. | No reemplaza un `background-image`: exige cambiar `BackgroundCells` y cada `EmptyCell` por contenido de video o una capa adicional. Varias celdas implican varias reproducciones. WebKit tiene una incidencia abierta de VP9 con alpha incorrecto. | El tamaño es atractivo, pero no compensa el cambio de arquitectura ni el riesgo Safari. No es el candidato principal. |
| MP4/H.264 en `<video>` | No se generó un candidato válido | Sin medir | Video suele comprimir bien el movimiento y necesita `autoplay loop muted playsinline` para imitar el GIF. La ruta MP4/H.264 común no ofrece alpha portable. | Requiere el mismo cambio de componentes que WebM y perdería la transparencia o exigiría componer sobre un fondo fijo. | Fuera de alcance mientras la transparencia siga siendo un requisito. |

Los resultados son propios de este archivo. Las cifras generales de los formatos no sustituyen esta medición. En particular, WebP lossy a calidad alta salió peor que el GIF y el remuestreo lossless también creció. Un GIF reexportado a 25 fps pesó 1.117.809 bytes, 14,9% menos, pero los hashes de cuadros cambiaron; no se toma como optimización segura.

### Recomendación

Se eligió el WebP lossless de 256 px y 50 fps: reduce 20,1% (263.664 bytes) y conserva los 180 cuadros, los píxeles visibles, la duración, el loop y la transparencia. El ahorro queda por debajo del objetivo exploratorio porque se priorizó no reducir cuadros ni comprimir colores con pérdida.

La integración conserva `coronavirus.gif` como identificador de preferencia y como rollback, pero lo resuelve a una URL WebP versionada. AVIF y video no justifican el fallback o el cambio de renderizado para este asset y no eliminan el riesgo principal de transparencia entre Chrome y Safari.

### Reproducción de las mediciones

Se usaron `ffprobe` y FFmpeg 8.1.2, junto con `gif2webp`, `img2webp`, `webpinfo` y `webpmux` 1.6.0. Durante la investigación los candidatos quedaron en un directorio temporal. El archivo elegido se incorporó después como `public/background-cells/coronavirus.28e4692f.webp`. `webpinfo` y `webpmux` verificaron canvas de 256 × 256, 180 cuadros `ANMF`, 3.600 ms acumulados, alpha, fondo transparente y loop infinito.

```sh
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,duration \
  -show_entries format=size,duration -of json \
  public/background-cells/coronavirus.gif

trial_dir="$(mktemp -d /tmp/coronabingo-perf07.XXXXXX)"
mkdir -p "$trial_dir/frames-25fps"

ffmpeg -hide_banner -loglevel error \
  -i public/background-cells/coronavirus.gif \
  -vf 'fps=25' \
  "$trial_dir/frames-25fps/frame-%03d.png"

img2webp -loop 0 -d 40 -lossless -m 4 -exact \
  "$trial_dir"/frames-25fps/frame-*.png \
  -o "$trial_dir/coronavirus-256px-25fps-lossless.webp"

webpmux -set bgcolor 0,0,0,0 \
  "$trial_dir/coronavirus-256px-25fps-lossless.webp" \
  -o "$trial_dir/coronavirus-256px-25fps-lossless-transparent.webp"

ffmpeg -hide_banner -loglevel error \
  -i public/background-cells/coronavirus.gif \
  -vf 'fps=25' -an -c:v libvpx-vp9 -pix_fmt yuva420p \
  -crf 18 -b:v 0 -auto-alt-ref 0 \
  "$trial_dir/coronavirus-256px-25fps-vp9-crf18.webm"
```

La [demo local](../perf07-demo/index.html) compara el original con el WebP lossless de 256 px y 50 fps, muestra sus pesos y permite revisar ambos a 256, 80 y 64 px sobre cuatro fondos. Se abre desde la raíz con `open research/performance/perf07-demo/index.html`. Chrome 154 decodificó los 180 cuadros mediante `ImageDecoder`: no encontró cuadros ni píxeles visibles distintos al comparar RGBA y omitir solo el RGB irrelevante de píxeles con alpha cero. El usuario revisó el ciclo completo y aprobó visualmente esta variante. La medición específica del trabajo de decodificación queda como límite conocido; no bloquea el cambio porque no se alteran la cantidad de cuadros ni las instancias renderizadas.

## Implementación

- Asset público: `public/background-cells/coronavirus.28e4692f.webp`, 1.049.854 bytes y SHA-256 `28e4692fa02f895354ab025485841932801f18aa16b0e17ec32ca9557c4903b7`.
- Compatibilidad: el valor guardado continúa siendo `{ type: 'img', value: 'coronavirus.gif' }`; un resolvedor interno entrega el WebP versionado tanto en el selector como en las celdas.
- Rollback: `public/background-cells/coronavirus.gif` permanece intacto y basta cambiar el mapeo para volver a servirlo.
- Cobertura: la prueba UI siembra una preferencia legacy antes de recargar y comprueba MIME, tamaño exacto, uso del WebP en 24 celdas y vista activa del selector. Después elimina el valor sembrado, selecciona COVID-19 desde la UI y confirma que el identificador anterior vuelve a persistirse y sobrevive otra recarga.
- Validación local sobre la rama: `npm run lint:check`, `npm run ui-tests` (15/15), `npm run build` y `git diff --check` correctos. El build incluyó `validate-locales`. Validación de Preview: pendiente.
- Criterios todavía abiertos: revisión de Safari y viewport móvil, comparación perceptible del costo de decodificación con varias celdas y cabecera de caché de Preview. La política `immutable` general permanece en PERF-03; PERF-07 aporta la URL versionada sin cerrar ese ticket.

### Fuentes primarias

- [Manual de Gifsicle](https://www.lcdf.org/gifsicle/man.html): `-O1`, `-O2` y `-O3`, transparencia y advertencia de que optimizar puede no reducir el archivo.
- [Descripción oficial de WebP](https://developers.google.com/speed/webp): compresión lossless y lossy, transparencia, animación y soporte en navegadores principales.
- [Documentación de gif2webp](https://developers.google.com/speed/webp/docs/gif2webp): modos lossless, lossy y mixed, calidad, cuadros clave y `min_size`.
- [Especificación del contenedor WebP](https://developers.google.com/speed/webp/docs/riff_container): animación, alpha, duración por cuadro y loop.
- [WebP FAQ](https://developers.google.com/speed/webp/faq): comparación con GIF y mayor coste de decodificación de WebP animado, que debe verificarse con varias celdas.
- [AV1 Image File Format](https://aomediacodec.github.io/av1-avif/v1.2.0.html): secuencias animadas y alpha en AVIF.
- [WebKit 322274](https://bugs.webkit.org/show_bug.cgi?id=322274) y [WebKit 275906](https://bugs.webkit.org/show_bug.cgi?id=275906): fallos recientes de AVIF animado y AVIF animado con transparencia.
- [Reemplazar GIF por video](https://web.dev/articles/replace-gifs-with-videos) y [política de video de WebKit](https://webkit.org/blog/6784/new-video-policies-for-ios/): atributos necesarios y consecuencias de usar `<video>`.
- [Alpha en WebM](https://wiki.webmproject.org/alpha-channel) y [WebKit 275908](https://bugs.webkit.org/show_bug.cgi?id=275908): definición de alpha y fallo de reproducción de VP9 transparente en WebKit.

## Comments

### 2026-09-27: comparación de formatos y candidatos temporales

El usuario pidió comparar alternativas para bajar el peso sin implementar todavía un reemplazo. Se midieron candidatos temporales de WebP y se revisaron GIF optimizado, AVIF animado y video contra documentación primaria.

### 2026-09-27: demo visual local

Se agregó una demo descartable bajo `research/performance/perf07-demo/`. Compara el GIF original de 1.313.518 bytes con un WebP lossless de 1.049.854 bytes, ambos a 256 × 256, 180 cuadros, 50 fps y 3,6 segundos. Chrome 154 cargó las seis vistas, cambió el fondo, reinició las animaciones y no registró errores de consola. `ImageDecoder` comparó los 180 cuadros y no encontró diferencias de alpha ni de píxeles visibles. El usuario revisó y aprobó la animación WebP de 50 fps.

### 2026-09-27: elección e implementación autorizada

El usuario aprobó visualmente el WebP lossless de 256 × 256 y 50 fps, y autorizó implementarlo en una rama con pull request y Vercel Preview. La implementación conserva `coronavirus.gif` como identificador persistido, sirve el WebP con nombre versionado y mantiene el GIF original como rollback. El ticket permanece en curso hasta completar checks, revisión y Preview.
