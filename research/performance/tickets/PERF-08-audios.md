# PERF-08: comprimir los audios con mayor margen

Status: needs-info

Work status: claimed

Type: research

Estado: el usuario aprobó los 19 candidatos livianos después de escucharlos en local. Implementación, CI y Vercel Preview correctos; confirmación auditiva del usuario en Preview pendiente. Coordinar el versionado de caché con PERF-03.

## Diagnóstico

Hay 19 MP3 que suman 2.041.513 bytes en disco. `Sounds.tsx` crea `Audio` a partir de `room.soundToPlay`: se descargan al reproducir, no todo el catálogo al entrar. [Inventario completo](../assets-2026-09-23.json).

| Archivo | Base | Oportunidad inicial |
| --- | --- | --- |
| Cardi B / coronavirus | 522.590 bytes; 13 s; estéreo, 320 kbps | Probar 128 kbps: alrededor de 60% menos, unos 210 KB finales |
| Funeral / dance-with-the-coffin | 383.196 bytes; 15,9 s; estéreo, 192 kbps | Probar 128 kbps: alrededor de 33% menos, unos 255 KB finales |
| Friends / lets-get-ready-to-rumble | 247.359 bytes; 15,4 s; 128 kbps | Menor margen; no recomprimir por defecto |

Los dos primeros candidatos ahorrarían aproximadamente 440 KB juntos si conservan calidad. Es aritmética de bitrate/duración, no resultado de una conversión ni ahorro por visita. Se reemplaza el rango genérico anterior por candidatos específicos.

## Investigación del 27/09/2026

Se midieron los 19 MP3 del repositorio sobre `62a97f25ff5c39585a63637b973a474658b55725`. No hay fuentes WAV, FLAC u otros originales sin pérdida en el árbol ni en el historial de los dos candidatos principales. Una nueva codificación MP3 parte, por lo tanto, de un MP3 ya comprimido y agrega pérdida generacional.

### Recompresión sin pérdida

Se probaron dos implementaciones independientes que reordenan frames y optimizan la codificación Huffman sin volver a cuantizar el audio: `go-mp3packer` 0.1.0 en `f063f91` y `mp3packercpp` 1.2.1. FFmpeg 8.1.2 decodificó a PCM idéntico el resultado de 16 archivos. Uno de ellos creció 2 bytes, por lo que también debe conservarse sin cambios.

La opción conservadora aplica sólo los 15 resultados que son más chicos y cuyo PCM coincidió byte por byte con el original:

| Alcance | Antes | Después | Ahorro | Resultado de calidad |
| --- | ---: | ---: | ---: | --- |
| Cardi B / coronavirus | 522.590 B | 483.878 B | 38.712 B; 7,41% | PCM idéntico con FFmpeg |
| Windows / windows-error | 15.846 B | 11.759 B | 4.087 B; 25,79% | PCM idéntico con FFmpeg |
| Selección conservadora de 15 MP3 | 2.041.513 B | 1.988.823 B | 52.690 B; 2,58% | PCM idéntico por archivo con FFmpeg |

`ojo-al-tejo`, `cruzar-dedos` y `hundiste-mi-acorazado` no pasaron la comparación PCM después del repack con ninguna de las dos implementaciones. Se deben mantener originales aunque el formato recomprimido declare igual duración. `mira-la-repe` también debe mantenerse porque el repack creció 2 bytes. La documentación de `go-mp3packer` advierte además diferencias de hasta una unidad de 16 bits con CoreAudio en su corpus; una implementación futura necesita reproducción real en Safari aunque el contenido MP3 sea equivalente según el formato.

Conclusión: sí existe una optimización sin recodificación, pero reduce sólo 52,7 KB decimales del catálogo completo. No cambia el hecho de que cada sonido se descarga bajo demanda al reproducirlo.

### Recodificación con pérdida

Se generaron copias temporales con `libmp3lame`; no se reemplazó ningún asset. `SI-SDR` compara la señal decodificada y un valor mayor indica menor distorsión matemática, pero no demuestra transparencia auditiva. LAME recomienda pruebas de escucha para juzgar calidad.

| Archivo y variante | Tamaño | Ahorro | Duración | Volumen integrado / pico real | SI-SDR |
| --- | ---: | ---: | ---: | ---: | ---: |
| Cardi B original, MP3 320 kbps | 522.590 B | - | 13,003 s | -12,1 LUFS / -0,6 dBFS | referencia |
| Cardi B, VBR `-q:a 0` | 212.679 B | 309.911 B; 59,3% | 13,003 s | -12,1 LUFS / -0,6 dBFS | 37,20 dB |
| Cardi B, CBR 128 kbps | 209.023 B | 313.567 B; 60,0% | 13,003 s | -12,5 LUFS / -1,0 dBFS | 41,10 dB |
| Funeral original, MP3 192 kbps | 383.196 B | - | 15,900 s | -8,1 LUFS / 0,3 dBFS | referencia |
| Funeral, VBR `-q:a 2` | 362.953 B | 20.243 B; 5,3% | 15,900 s | -8,0 LUFS / 0,5 dBFS | 24,64 dB |
| Funeral, CBR 128 kbps | 255.417 B | 127.779 B; 33,3% | 15,900 s | -8,5 LUFS / 0,7 dBFS | 20,71 dB |

La estimación anterior queda confirmada: convertir ambos archivos a CBR 128 kbps ahorra 441.346 bytes, el 21,62% de todo el catálogo. Ese resultado no cumple un requisito literal de cero pérdida. En Cardi B, la variante VBR de máxima calidad medida conserva mejor el volumen y cuesta sólo 3.656 bytes más que CBR 128; es el único candidato con pérdida que merece una escucha ciega. En Funeral, el modo de mayor calidad probado crece y VBR `-q:a 2` ahorra apenas 5,3%; no compensa agregar otra generación de pérdida sin conseguir antes una fuente original.

### Recomendación

1. Si no perder calidad es una condición estricta, aplicar sólo el repack conservador: 52.690 bytes menos, 2,58% del catálogo. El beneficio es real pero de prioridad baja.
2. Mantener Funeral sin cambios. No hay un punto medido que combine ahorro importante y ausencia de pérdida.
3. Si se admite calidad perceptualmente equivalente, preparar una comparación ciega entre Cardi B original y VBR `-q:a 0`. Sólo reemplazarlo si la escucha no detecta diferencia en parlantes y auriculares; el ahorro potencial del archivo es 59,3%.
4. Mantener MP3 y las rutas actuales. Cambiar de codec no evita la pérdida de recodificar y agrega trabajo de fallback y compatibilidad. Coordinar cualquier versión de URL con PERF-03.

Comandos principales: `ffprobe` para tamaño, duración, bitrate, canales y sample rate; `ffmpeg -f hash -hash md5` para PCM; `ebur128=peak=true` para LUFS y pico; `asisdr` para diferencia de señal; `libmp3lame -q:a 0`, `-q:a 2` y `-b:a 128k` para candidatos temporales. Los artefactos de prueba quedaron fuera del repositorio y los assets publicados no se modificaron.

### Demo local de escucha

Se agregó una demo descartable en [`../audio-demo/index.html`](../audio-demo/index.html) que pone lado a lado, para los 19 sonidos, el MP3 original, un candidato liviano y el repack sin pérdida. La tabla muestra el peso y el ahorro de cada alternativa y permite marcar una preferencia. Sólo se reproduce un audio a la vez para facilitar la comparación.

La variante liviana usa LAME VBR `-q:a 4`; en `friends/lets-get-ready-to-rumble.mp3` usa `-q:a 5` porque V4 no reducía el archivo. Es deliberadamente más agresiva que los candidatos de la medición inicial: sirve para decidir por escucha cuánto deterioro es aceptable, no se considera aprobada por sus métricas. El conjunto baja de 2.041.513 a 1.263.164 bytes: 778.349 bytes menos, o 38,12%.

La columna sin pérdida usa `mp3packercpp` 1.2.1 sólo cuando el resultado es menor y FFmpeg produce el mismo hash PCM. En los cuatro casos sin candidato seguro, la demo reproduce el original y muestra ahorro cero. El conjunto baja a 1.988.823 bytes: 52.690 bytes menos, o 2,58%.

Para regenerarla desde una Mac:

```sh
bash research/performance/audio-demo/generate-demo.sh
python3 -m http.server 4178 --bind 127.0.0.1
```

Luego abrir `http://127.0.0.1:4178/research/performance/audio-demo/index.html`. Los audios generados quedan ignorados por Git. La demo no modifica `public/sounds`; la implementación aprobada se registra a continuación.

### Decisión e implementación

El usuario escuchó la demo local y eligió la variante liviana para los 19 sonidos. Se reemplazaron los MP3 de `public/sounds` sin cambiar rutas, nombres ni el mecanismo de carga bajo demanda.

| Medición | Original | Implementado | Diferencia |
| --- | ---: | ---: | ---: |
| Catálogo completo, 19 MP3 | 2.041.513 B | 1.263.164 B | -778.349 B; -38,13% |

FFmpeg decodificó los 19 archivos nuevos sin errores. Todos conservan MP3, sample rate y cantidad de canales. La mayor diferencia de duración informada por el contenedor es 0,011996 segundos. La escucha local del usuario cubre la pérdida perceptual aceptada; falta confirmar la reproducción dentro del flujo real en Vercel Preview.

Validación local en la rama `t3code/optimize-audio-size`:

- `npm run lint:check`: correcto.
- `npm run build`: correcto con Next.js 16.3.6 y Webpack; conserva la advertencia existente de Tailwind sin rutas de purge.
- Servidor de producción local en `http://127.0.0.1:4179`: los 19 MP3 respondieron `200 audio/mpeg` y entregaron exactamente los bytes esperados.
- `git diff --check`: correcto.

Validación remota del commit de implementación `31fa432`:

- GitHub Actions `build`: correcto en 2 min 16 s.
- Vercel: despliegue completado en `https://coronabingo-git-t3cod-eb5fee-cristhian-durans-projects-3ace6550.vercel.app`.
- La portada del Preview cargó en español sin errores ni advertencias de consola.
- Los 19 MP3 del Preview respondieron `200 audio/mpeg` y cada descarga coincidió en bytes con el archivo local aprobado.
- No se creó ninguna sala durante esta verificación. La reproducción dentro del flujo de anfitrión y jugador queda para la confirmación auditiva del usuario.

## Alcance

Codificar y escuchar candidatos a partir del original disponible. Conservar duración, volumen percibido y canales cuando sean relevantes. Evitar recompresión sucesiva con pérdida. Mantener MP3 salvo evidencia a favor de otro formato y fallback compatible. No precargar todos los sonidos.

Resolver URLs antiguas y nuevas para salas/clientes existentes: la ruta circula por Firestore, no solo por un import local. No modificar estado de salas reales ni mezclar con el rediseño del ciclo de vida de audio de la auditoría interna.

## Aceptación

- Registro de tamaño, codec, bitrate y duración antes/después; escucha comparada sin distorsión o pérdida que empeore el efecto.
- Chrome y Safari reproducen el sonido completo tras la interacción requerida, con anfitrión y jugador en desarrollo; validación con caché fría y repetida.
- URLs antiguas siguen disponibles y nuevas usan versión si corresponde. El catálogo no se descarga al entrar a una sala.
- Medir inicio de reproducción por separado del peso; no afirmar mejora de sincronización sin medirla.

Rollback: restaurar URLs originales, conservar copias de los originales y archivos publicados necesarios. Checks del [índice](../README.md) si cambia código.

## Comments

### 2026-09-27: medición de alternativas

El usuario pidió investigar cuánto puede reducirse el catálogo sin perder calidad. La recompresión sin pérdida ofrece 2,58% con una selección verificada. La reducción de aproximadamente 440 KB requiere recodificar dos MP3 y no se recomienda como equivalente sin una prueba auditiva; no se cambió producto ni se preparó despliegue.

### 2026-09-27: demo comparativa local

Se preparó una tabla reproducible con los originales, una variante liviana para evaluación auditiva y una variante sin pérdida validada. El usuario elegirá la política después de escucharla; los assets publicados permanecen intactos y el trabajo sigue abierto.

### 2026-09-27: elección e implementación

El usuario eligió `liviano` para los 19 sonidos. Se aplicaron esos archivos a las rutas existentes y se verificó una reducción total de 38,13%. El ticket queda reclamado hasta que el usuario confirme el comportamiento en Vercel Preview.

### 2026-09-27: Preview listo para revisión

GitHub Actions y Vercel terminaron correctamente para el commit de implementación. Los 19 audios desplegados coinciden en tamaño con los aprobados. Falta la confirmación auditiva del usuario en el flujo real antes de resolver el ticket.
