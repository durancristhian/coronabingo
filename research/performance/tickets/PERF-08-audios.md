# PERF-08: comprimir los audios con mayor margen

Estado: diagnóstico de formatos confirmado; escucha de candidatos pendiente. Prioridad media a baja. Esfuerzo: 0,5–1 día. Riesgo medio por calidad, reproducción y URLs compartidas. Coordinar con PERF-03.

## Diagnóstico

Hay 19 MP3 que suman 2.041.513 bytes en disco. `Sounds.tsx` crea `Audio` a partir de `room.soundToPlay`: se descargan al reproducir, no todo el catálogo al entrar. [Inventario completo](../assets-2026-09-23.json).

| Archivo | Base | Oportunidad inicial |
| --- | --- | --- |
| Cardi B / coronavirus | 522.590 bytes; 13 s; estéreo, 320 kbps | Probar 128 kbps: alrededor de 60% menos, unos 210 KB finales |
| Funeral / dance-with-the-coffin | 383.196 bytes; 15,9 s; estéreo, 192 kbps | Probar 128 kbps: alrededor de 33% menos, unos 255 KB finales |
| Friends / lets-get-ready-to-rumble | 247.359 bytes; 15,4 s; 128 kbps | Menor margen; no recomprimir por defecto |

Los dos primeros candidatos ahorrarían aproximadamente 440 KB juntos si conservan calidad. Es aritmética de bitrate/duración, no resultado de una conversión ni ahorro por visita. Se reemplaza el rango genérico anterior por candidatos específicos.

## Alcance

Codificar y escuchar candidatos a partir del original disponible. Conservar duración, volumen percibido y canales cuando sean relevantes. Evitar recompresión sucesiva con pérdida. Mantener MP3 salvo evidencia a favor de otro formato y fallback compatible. No precargar todos los sonidos.

Resolver URLs antiguas y nuevas para salas/clientes existentes: la ruta circula por Firestore, no solo por un import local. No modificar estado de salas reales ni mezclar con el rediseño del ciclo de vida de audio de la auditoría interna.

## Aceptación

- Registro de tamaño, codec, bitrate y duración antes/después; escucha comparada sin distorsión o pérdida que empeore el efecto.
- Chrome y Safari reproducen el sonido completo tras la interacción requerida, con anfitrión y jugador en desarrollo; validación con caché fría y repetida.
- URLs antiguas siguen disponibles y nuevas usan versión si corresponde. El catálogo no se descarga al entrar a una sala.
- Medir inicio de reproducción por separado del peso; no afirmar mejora de sincronización sin medirla.

Rollback: restaurar URLs originales, conservar copias de los originales y archivos publicados necesarios. Checks del [índice](../README.md) si cambia código.
