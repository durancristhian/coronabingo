# Optimización interna sin cambios visibles

Fecha: 2026-09-23. Código revisado: `4f14279`. Propuesta, sin implementar cambios.

> Revalidado el 26 de septiembre sobre `8e35fa4`. Los principales ahorros ya están implementados. Ver la actualización al final antes de usar la lista histórica como backlog.

## Alcance y evidencia

Revisión de las cuatro pantallas, providers globales, hooks, modelos, almacenamiento local, audio y dependencias de carga inicial. Versiones instaladas: Next 16.3.6, React 18.3.1 y Firebase 7.24.0.

- Se ejecutaron los tres providers con React/router/Firestore simulados para contar suscripciones y funciones de limpieza. No se hicieron lecturas ni escrituras en Firebase.
- Se inspeccionaron el manifiesto y los source maps del build local ya existente. Los tamaños siguientes describen ese artefacto, no una medición de la web publicada ni un build nuevo de este commit. Los imports relevantes se confirmaron en el código actual.
- No se midieron CPU, memoria, latencia, facturación ni Core Web Vitals en producción. Los impactos son estimaciones justificadas por el código. No se prometen porcentajes de velocidad ni ahorro monetario.
- No se ejecutó otro build porque hay un servidor de desarrollo usando este checkout.

## Prioridades

| Orden | Cambio | Impacto esperado | Esfuerzo / riesgo |
| --- | --- | --- | --- |
| 1 | Limitar la suscripción a todos los jugadores a las pantallas que la usan | Alto en documentos recibidos y trabajo durante la partida | Bajo a medio / medio por navegación y estado del formulario |
| 2 | Evitar restauraciones vacías o redundantes hacia Firestore | Medio en escrituras y notificaciones; mejora de solidez | Medio / medio por recuperación de marcas |
| 3 | Cargar las bibliotecas de novedades y Excel cuando correspondan | Medio a alto en JavaScript inicial | Medio / bajo a medio por primera apertura |
| 4 | Separar el catálogo de cartones de las constantes generales | Medio en descarga y parseo de pantallas que no muestran cartones | Bajo / bajo |
| 5 | Reducir persistencia local redundante | Bajo a medio en trabajo síncrono; mejora de solidez | Medio / medio por recarga y reinicio |
| 6 | Evitar el doble árbol de bolillero y opciones | Medio en DOM y renderizados | Medio / medio por responsive y modales |
| 7 | Aislar renderizados de cartones, bolillero y opciones | Medio potencial, pendiente de profiler | Medio / medio por actualizaciones en vivo |
| 8 | Completar el ciclo de vida de audio y suscripciones | Bajo en consumo; medio en solidez | Bajo a medio / medio por audio y eventos pendientes |

## 1. Suscripción a jugadores según pantalla

Evidencia: `contexts/index.tsx:8`, `contexts/Players.tsx:37`, `pages/room/[roomId]/[playerId].tsx:25`.

Los providers se montan globalmente. `PlayersContextProvider` escucha toda la colección cuando hay `roomId`, aunque la pantalla de cartones solo consume `useRoom` y `usePlayer`.

La prueba aislada sobre el código actual dio:

| Pantalla | Suscripciones actuales | Necesarias para los consumidores actuales |
| --- | --- | --- |
| Inicio | 0 | 0 |
| Sala | Documento de sala + colección de jugadores | Las mismas 2 |
| Configuración | Documento de sala + colección de jugadores | Las mismas 2 |
| Cartones, incluido el anfitrión | Sala + colección de jugadores + jugador individual | Sala + jugador individual |

Los tres listeners devuelven una función de limpieza. No hay evidencia de una fuga general de listeners al desmontar. El problema confirmado es una suscripción innecesaria mientras la pantalla está abierta.

Propuesta: habilitar la escucha colectiva solamente en sala y configuración. Conservar los listeners individuales para recibir cambios, eliminación del jugador y reinicios en vivo. Resolver el estado al reactivar la lista sin perder el borrador de configuración ni mostrar datos de otra sala.

Impacto: se elimina una consulta de colección por pestaña de cartones. En una entrada directa a una sala con 50 jugadores se deja de solicitar una lista de 50 documentos que esa pantalla no utiliza. Si 50 personas entran directamente a sus cartones, son 2.500 documentos de resultados iniciales de consultas colectivas evitables. Es un ejemplo del volumen lógico solicitado, no un conteo garantizado de lecturas facturadas; caché, conexiones y comportamiento del SDK influyen. Tampoco son 50 documentos reenviados por cada cambio: las actualizaciones remotas pueden ser incrementales.

## 2. Restauración de marcas hacia Firestore

Evidencia: `components/Tickets.tsx:71`.

Al montar los cartones o cambiar `player.id`, se lee `roomValues`, se obtiene un objeto con respaldo o `{}`, se llama a `player.ref.update(playerValues)` y se elimina el respaldo sin esperar la promesa. La llamada ocurre incluso sin datos recuperables. Con datos, tampoco se compara si Firestore ya tiene los mismos valores.

Propuesta: validar identidad de jugador y partida, omitir el update si no hay campos o diferencias, manejar la promesa y conservar los datos recuperables ante un fallo. Mantener la precedencia actual de las marcas locales válidas al restaurar.

Impacto: elimina llamadas de escritura vacías o redundantes y, cuando la escritura cambiaba datos, las actualizaciones que propagaba a otros listeners. El máximo por montaje es una llamada evitada; no corresponde multiplicarlo por cada casillero marcado. Requiere medir requests aceptados para traducirlo a ahorro real.

Comprobar recuperación al recargar, respaldo ausente/corrupto, error de red y reinicio de partida. La eliminación prematura del respaldo es un problema de solidez además de una oportunidad de optimización.

## 3. Bibliotecas opcionales fuera de la carga inicial

Evidencia: `pages/_app.tsx:7`, `components/NewsModal.tsx:1`, `components/DownloadSpreadsheet.tsx:4`, `pages/room/[roomId].tsx:171`.

`gray-matter` y `react-markdown` se importan globalmente para un modal que normalmente no se abre. El chequeo de versión ya evita el fetch cuando no corresponde, pero no evita cargar estas bibliotecas. `zipcelx` también se importa estáticamente aunque la exportación esté detrás de una opción oculta.

Propuesta: conservar un chequeo de novedades liviano y cargar procesamiento/renderizado solo cuando hay novedades. Separar la biblioteca de Excel y precargarla al habilitar la opción para conservar una buena respuesta al clic. Mantener contenido, traducciones, formato y nombre del archivo.

El build local existente contiene `gray-matter` y `react-markdown` en `_app`. El chunk de exportación, que contiene `zipcelx` y `jszip`, mide 104.717 bytes sin comprimir y 30.088 bytes con gzip. Es una referencia de código que puede diferirse, no una reducción final garantizada: el empaquetado debe medirse después.

Verificar especialmente primera apertura con caché fría y conexión lenta. Mover una descarga al clic sin precarga puede trasladar la espera al usuario.

## 4. Catálogo de cartones separado de constantes

Evidencia: `utils/constants.ts:2`, `utils/constants.ts:174`, `hooks/useTickets.tsx:3`, `utils/generateRoomCode.ts`.

Las constantes generales importan todos los cartones para calcular `MAX_PLAYERS`. Este módulo también se usa para crear códigos y otras operaciones que no necesitan el catálogo. El build existente incluye el catálogo en el chunk `142`, cargado por inicio, configuración y cartones.

Medición del archivo actual: 1.440 cartones, 354.962 bytes en disco, 151.921 bytes al serializar sin espacios y 29.140 bytes con gzip de esa serialización. Los bytes del JSON comprimido no equivalen exactamente al ahorro de un chunk.

Propuesta: separar metadatos de capacidad del catálogo, generándolos o validándolos contra su longitud para evitar divergencias. Mantener el mismo catálogo disponible para la pantalla de cartones, sin modificar números, asignación aleatoria ni capacidad de 720 jugadores.

Impacto: evita transportar y parsear el catálogo en pantallas que solo necesitan el límite. No reduce la carga necesaria de la pantalla que sí muestra cartones.

## 5. Persistencia local solo cuando cambia el contenido

Evidencia: `components/Tickets.tsx:87`, `hooks/useTickets.tsx:6`, `contexts/BackgroundCell.tsx:24`, `components/NewsModal.tsx:27`.

No se encontró polling de localStorage. Fondo y novedades se leen al montar; las marcas se leen al montar/cambiar jugador. El candidato de optimización es la escritura de `roomValues`, que depende del objeto completo `player`, incluso si los datos persistibles no cambiaron. Además `tickets` empieza como `[]`, que es truthy, por lo que la condición permite una escritura inicial sin cartones.

Propuesta: coordinar restauración y persistencia, esperar a tener cartones válidos, identificar jugador/partida y guardar solo si cambió la representación persistida. Mantener el guardado inmediato de marcas nuevas; un debounce indiscriminado puede perder la última marca al cerrar.

Impacto: menos serialización y escrituras síncronas repetidas, especialmente al montar y recibir snapshots que no cambian marcas. Son solo dos cartones por persona, de modo que no lo considero el principal problema de rendimiento. No afirmar que se escribe por cada número anunciado: el efecto depende de `player`, no de cada cambio de `room`.

## 6. Dos bolilleros y dos grupos de opciones montados

Evidencia: `pages/room/[roomId]/[playerId].tsx:113`, `:165`, `:179`, `components/SelectedNumbers.tsx:55`.

La misma función se invoca dos veces y CSS oculta una copia según el ancho. Se montan 180 botones de números para mostrar 90, además de dos instancias de opciones con sus respectivos estados y hooks. Ocultar por CSS no evita el trabajo de React.

Propuesta: preferir una composición CSS que ubique una sola instancia en el lugar actual para cada ancho. Si la solución exige selección por breakpoint, controlar hidratación y conservar el estado al cambiar el tamaño. No prometer que un simple condicional es equivalente.

Impacto: elimina 90 botones ocultos y una copia de opciones. No equivale a reducir a la mitad el tiempo de toda la página. Comparar capturas en móvil/escritorio/modo streamer, orden del teclado, modales y cambios de orientación.

## 7. Renderizados acotados a los datos que cambian

Evidencia: `pages/room/[roomId]/[playerId].tsx:98`, `:171`, `components/Tickets.tsx:16`, `components/Cells.tsx:12`, `components/Options.tsx:20`.

La página consume sala y jugador. Un cambio de sala vuelve a ejecutar el árbol de cartones; marcar un cartón vuelve a ejecutar la página y sus dos bolilleros. Los objetos completos y callbacks nuevos dificultan omitir ese trabajo. `Confetti` ya tiene memoización.

Propuesta: medir con React Profiler, acotar props a los valores necesarios y estabilizar callbacks antes de memoizar los componentes costosos. Conservar las actualizaciones de accesibilidad, traducción y configuración. No aplicar `memo` a todo sin una medición.

Impacto: menos trabajo por número anunciado o marca local. El ahorro temporal está pendiente de medición, especialmente en móvil. Un rerender no implica reconstruir todo el DOM ni hacer otra lectura a Firebase.

## 8. Ciclo de vida de audio y suscripciones

Evidencia: `components/Sounds.tsx:11`, `contexts/Player.tsx:38`, `pages/_app.tsx:25`.

- Audio crea un `Audio` y un timeout sin cleanup. El callback del anfitrión puede escribir en la sala después de abandonar esa pantalla. `audio.remove()` no es una orden para detener reproducción. Revisar propiedad del evento, finalización y liberación de recursos. No cancelar sin más el reset remoto, porque podría dejar un sonido pendiente para otros jugadores. Preservar la reproducción normal y comprobar sonidos consecutivos y salida durante reproducción.
- El listener individual usa `roomId` y `playerId`, pero el efecto solo depende de `playerId`. Usar ambos y validar la disponibilidad de la ruta evita conservar una suscripción anterior si cambia la sala manteniendo el mismo ID de jugador. El caso es poco frecuente con IDs autogenerados; el impacto principal es corrección.
- El listener global de navegación para Analytics se registra al evaluar el módulo sin `off`. Vincularlo al ciclo de vida evita acumulación en recargas de desarrollo. No hay evidencia de que cada navegación normal de producción lo duplique.

Impacto bajo en consumo global, medio en robustez de casos puntuales. Los timeouts de cierre de toast merecen tratamiento separado: algunos deben sobrevivir a la página porque el contenedor es global.

## Aspectos que ya están bien y límites del cambio

- Los tres listeners de Firestore tienen unsubscribe; Ads limpia su timeout y Pelotita cancela su animación.
- Marcar un número en un cartón actualiza estado local y localStorage. No escribe en Firestore en cada clic. La restauración inicial sí intenta una escritura remota.
- No hay uso activo de Firebase Storage para archivos en los imports del código de la aplicación. Firestore y localStorage son los recursos relevantes en esta revisión.
- Conservar las suscripciones en vivo a sala y jugador. Reemplazarlas por lecturas únicas o polling cambiaría la sincronización.
- No pausar listeners solo porque la pestaña queda oculta sin evaluar audio y sincronización en segundo plano.
- No cambiar anuncios, animaciones, assets, textos ni reglas de juego dentro de este trabajo.
- Actualizar Firebase o rediseñar documentos puede evaluarse después; no es necesario para el primer ahorro y aumenta el riesgo.

## Verificación propuesta para una implementación posterior

1. Contar altas y bajas de listeners al navegar inicio → configuración → sala → cartones → inicio, cambiar de sala y usar atrás/adelante. Esperar 0/2/2/2/0 listeners de aplicación según la pantalla y el estado de datos.
2. Probar una partida con anfitrión y otro jugador en un proyecto/emulador de prueba: números, marcas, recarga, reasignación de cartones, reinicio, eliminación, sonidos y celebraciones.
3. Comparar lecturas/escrituras de la misma secuencia, sin confundir callbacks, resultados desde caché y operaciones facturadas.
4. Comparar capturas y navegación por teclado en móvil/escritorio, español/inglés y modo streamer. Revisar cambios de ancho con opciones abiertas.
5. Medir chunks y React Profiler antes/después; comprobar novedades y Excel con caché fría. Ejecutar los checks existentes y build en un checkout que no esté compartiendo salida con un dev server.

## Referencias técnicas

- [Firebase: listeners y cómo desconectarlos](https://firebase.google.com/docs/firestore/query-data/listen).
- [React: dependencias y cleanup de efectos](https://react.dev/reference/react/useEffect).
- [Next.js Pages Router: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading).
- Se consultaron también las guías de `node_modules/next/dist/docs/` de la versión instalada, incluidos lazy loading y eventos de router.

## Revalidación del 26 de septiembre de 2026

Solicitud: contrastar los hallazgos con la aplicación actual y recomendar únicamente cambios pendientes de impacto alto o medio-alto, conservando apariencia y comportamiento.

Base: `8e35fa47cfafc4e0095dbb6bb3eb5f1123595e8e`, rama `main`, checkout `/Users/durancristhian/Repos/coronabingo`, inicialmente limpio. Node 24.21.0 y npm 11.19.0. Revisión del código local, sin afirmar correspondencia con Production. No se implementó código ni se accedió a datos de Firebase.

**Resultado: no quedan cambios de la lista original con impacto alto o medio-alto confirmado y pendientes de implementación.** Esto no certifica que la aplicación esté completamente optimizada: los candidatos de CPU necesitan una medición antes de subir su prioridad.

| Hallazgo histórico | Comprobación actual | Decisión |
| --- | --- | --- |
| Colección completa de jugadores en cartones | `contexts/Players.tsx:14` limita rutas; el efecto limpia la suscripción al salir. El PR #191 está integrado en la historia local. | Resuelto por PERF-04; no volver a proponerlo. |
| Novedades en el bundle común | `NewsModal` fue eliminado; `_app` ya no lo importa y no quedan `gray-matter` ni `react-markdown` en los manifiestos de dependencias. | Resuelto por PERF-01 mediante retiro de la función. |
| Excel descargado antes de usarlo | `components/DownloadSpreadsheet.tsx:27` usa un import dinámico cacheado; el componente solo se monta cuando se habilita la opción en la sala. | Resuelto por PERF-05. |
| Catálogo de cartones en constantes generales | `utils/constants.ts:2` importa metadatos; `useTickets` conserva el catálogo para mostrar cartones. | Resuelto por PERF-02. |
| Escritura remota de restauración vacía o redundante | `components/Tickets.tsx:71` conserva la llamada a update y la eliminación inmediata del respaldo. | Vigente, impacto medio y de robustez; queda fuera del filtro. No es una escritura remota por marca. |
| Escrituras locales redundantes | `components/Tickets.tsx:87` conserva la dependencia de `player` completo y permite `tickets=[]`. | Vigente, impacto bajo a medio; queda fuera del filtro. |
| Doble bolillero/opciones | La página de cartones conserva ambas invocaciones y oculta una por CSS. | Vigente, 180 botones para mostrar 90; impacto medio estructural, sin medición temporal para llamarlo medio-alto. |
| Renderizados amplios | Cartones, sala y opciones conservan el acoplamiento señalado. | Candidato a perfilado; no se promueve a impacto alto sin evidencia. |
| Ciclo de vida | `_app` ya usa alta/baja del evento de navegación. Audio sigue sin cleanup y Player sigue sin roomId en dependencias. | Parcialmente resuelto; los pendientes no superan el umbral de rendimiento solicitado. |

También se verificó que PERF-06 ya monta el reproductor de YouTube bajo demanda. Se revisaron los tickets restantes del índice de rendimiento: PERF-03 no mejora la primera visita y su ahorro depende de revalidaciones y uso repetido, sin nueva traza que demuestre impacto medio-alto; PERF-07/08 afectan recursos opcionales y requieren validar fidelidad antes de recomendar conversiones; PERF-09 cambia la reserva y adaptación del anuncio y pertenece a otro alcance. La etiqueta histórica de prioridad alta de PERF-03 no equivale a impacto alto medido.

Comprobación ejecutada de nuevo:

```sh
node research/performance/measure-listeners.cjs --expect-scoped
```

Pasó. Matriz de suscripciones/cleanup: inicio 0/0, sala 2/2, configuración 2/2, cartones 2/2. El recorrido de la colección emitió tres altas y tres bajas, sin mantenerla en cartones. Ejecuta los providers actuales con React/router/Firestore simulados; no mide transporte, facturación ni reconciliación real de React.

Se contrastaron imports, efectos y cambios contra `4f14279`, además de la historia de integración y los tickets canónicos. No se reutilizaron los tamaños históricos como ahorro pendiente ni se sumaron resultados de revisiones distintas. No se ejecutaron nuevo build, suite de gameplay, profiler ni pruebas en Production: este trabajo solo actualiza el diagnóstico y documentación. El siguiente paso para descubrir oportunidades grandes nuevas sería medir el flujo real de partida en móvil y atribuir sus tiempos, no implementar automáticamente los candidatos medios.
