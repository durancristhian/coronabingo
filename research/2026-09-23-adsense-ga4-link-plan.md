# Plan para vincular AdSense con Coronabingo - GA4

Status: ready-for-agent
Work status: claimed

**Actualización de ejecución, 23 de septiembre de 2026, 23:27 ART:** el usuario autorizó implementar. La etiqueta directa está publicada y el vínculo está confirmado en ambas consolas. La tarea permanece abierta por verificación de ingresos e impresiones. Ver el registro al final y la [evidencia de implementación](2026-09-23-adsense-ga4-implementation-evidence.json). Los apartados de investigación conservan las observaciones y decisiones anteriores.

Investigación, segunda revisión y revalidación posterior a Search Console realizadas el 23 de septiembre de 2026. Estado de este plan: propuesto, sin ejecutar. Se consultaron las consolas autenticadas, el código local, recursos públicos de producción y documentación oficial. Se abrió el selector de propiedades de AdSense y se canceló sin seleccionar ni crear una vinculación. Durante estas revisiones no se modificaron cuentas, etiquetas, variables, código del producto ni despliegues. La implementación de Search Console se realizó por separado y ya está reflejada aquí.

El resultado buscado es ver impresiones e ingresos reales de AdSense en la propiedad `385744187`, con evidencia de recepción y continuidad. Una vinculación activa será un paso intermedio.

La investigación encontró una dependencia concreta: producción sigue cargando una etiqueta Universal Analytics que deriva hacia GA4. Google advierte sobre ese mecanismo en el diagnóstico de esta misma etiqueta. Recomiendo preparar la carga directa de GA4 y después crear el vínculo, con pruebas separadas de etiquetado y de datos publicitarios.

## Identidades y estado verificados

| Elemento | Valor observado | Decisión para este trabajo |
| --- | --- | --- |
| Cuenta Analytics | `coronabingo`, `161408428` | Conservar |
| Propiedad objetivo | `Coronabingo - GA4`, `385744187` | Vincular esta propiedad |
| Flujo web objetivo | `5469366293` | Conservar el flujo y su historial |
| ID de medición | `G-WYG7FMEWEF` | Destino directo para el etiquetado web |
| ID adicional de etiqueta de Google | `GT-W6J4R92` | Identifica la misma etiqueta en su consola |
| URL declarada del flujo | `https://coronabingo.com.ar/`, revalidada después del trabajo de Search Console | Conservar; la actualización de la URL ya está hecha |
| Asociación Search Console | Prefijo `https://coronabingo.com.ar/`, flujo `5469366293`, fecha 23 de septiembre de 2026 | Conservar durante implementación y rollback de AdSense |
| Cuenta AdSense | `pub-6231280485856921` | Es la cuenta que aparece en los anuncios de producción |
| Producto AdSense | Contenido; cuenta abierta | Es el producto compatible |
| Vínculos AdSense actuales | Cero, confirmado desde AdSense y desde GA4 | Crear uno hacia `385744187` |
| Permisos de Cristhian | Administrador en AdSense y en la propiedad GA4 | No hace falta solicitar roles adicionales |
| Acceso adicional a GA4 | Hay otro usuario con rol Editor | Los nuevos informes serán accesibles según los permisos actuales; no modificar accesos |
| Zona horaria | Buenos Aires, UTC-03:00, en GA4, AdSense y el selector del informe AdSense | Comparar con el mismo corte diario |
| Moneda | USD en GA4 y en el informe AdSense | Comparar ingresos estimados en USD |
| Firebase de producción | Proyecto `coronabingo-bf16f` | No confundir nombre visible con ID de proyecto |
| Analytics asociado a Firebase | Propiedad `226709381`, flujo `1861645851`, medición `G-PR7XZB4T8W` | Es otra propiedad; mantener esta asociación |

El asistente de AdSense ofrece tanto `coronabingo-bf16f - 226709381` como `Coronabingo - GA4 - 385744187`, además del entorno de desarrollo. La selección debe verificarse por ID numérico.

En el período completo del 16 al 22 de septiembre, el informe de sitios de AdSense muestra para `coronabingo.com.ar` 2.609 impresiones, 932 vistas de página y USD 0,81 de ingresos estimados. Existe actividad suficiente para esperar una señal observable tras la implementación, aunque no garantiza un plazo. Estos importes son una referencia previa, no datos que vayan a importarse retroactivamente.

Evidencia estructurada y enlaces de consola: [archivo de evidencia](2026-09-23-adsense-ga4-link-evidence.json).

## Qué cambia respecto de un plan de solo vinculación

El HTML de producción carga `gtag/js?id=UA-161408428-1` y ejecuta `config` para ese ID. El JavaScript público de la app contiene `G-PR7XZB4T8W` para Firebase. El recurso de Google servido para el ID UA contiene `G-WYG7FMEWEF`. Esto es consistente con la recepción actual de tráfico en la propiedad objetivo a través del mecanismo heredado.

La consola de la etiqueta objetivo confirma dos avisos: uso de etiquetas antiguas de Universal Analytics y páginas sin etiquetar. La cobertura lista 2.251 páginas: 1 sin etiquetar, 1.191 sin actividad reciente y 1.059 etiquetadas. La página señalada es una URL de participante bajo `/es/room/…/…`. Una sala sin actividad reciente no demuestra una etiqueta rota y no requiere recorrer todas las salas históricas.

Google documenta limitaciones de las etiquetas conectadas para esta integración. También exige que el etiquetado esté disponible al servir los anuncios y explica que no se recuperan ingresos anteriores al vínculo. [Integración y discrepancias de AdSense con GA4](https://support.google.com/analytics/answer/13610380?hl=en).

La inspección de red en Chrome encontró sustituciones de scripts publicitarios y analíticos por recursos de extensiones. Por eso no se considera probada en esta investigación la entrega efectiva de `g/collect` en una sesión limpia. No se cambiaron extensiones. Esa prueba será una condición previa al cierre técnico del etiquetado.

## Alcance propuesto

Implementar la etiqueta directa del flujo existente, crear el vínculo AdSense y verificar datos posteriores. Mantener la asociación actual de Firebase. No requiere un proyecto Firebase nuevo, migración de Firestore, cambio de plan de facturación, BigQuery ni Google Ads.

Search Console ya está vinculado al prefijo `https://coronabingo.com.ar/` y la URL descriptiva del flujo ya fue actualizada. Se revalidaron ambos cambios en GA4. La propiedad, el flujo y la medición conservan los mismos IDs. Search Console y AdSense son integraciones independientes: no hace falta esperar la llegada de datos de búsqueda para implementar AdSense. Conservar la asociación actual y los mecanismos de verificación del sitio, incluidos metaetiquetas o archivos existentes. El seguimiento de importación de Search Console continúa en su propio documento.

El consentimiento, la colocación de anuncios y su formato tienen trabajos propios. Si afectan la medición se registrarán como dependencias concretas, sin ampliar esta tarea a un rediseño publicitario. No se generarán manualmente eventos `ad_impression`, importes ficticios ni clics de prueba.

## Secuencia de implementación, una vez autorizada

### 1. Preparar el corte y la evidencia previa

Responsable: quien implemente y tenga la sesión administrativa de Cristhian. Tiempo orientativo: 20 a 40 minutos.

1. Revalidar los IDs de la tabla, permisos y ausencia de vínculo. Si ya existe exactamente el vínculo correcto por otro trabajo concurrente, conservarlo y pasar a la verificación. No crear duplicados ni borrar vínculos ajenos.
2. Registrar nuevamente commit y despliegue de producción, valor actual de `GA_TRACKING_ID` y ámbito de la variable en Vercel antes del cambio. Verificar la elegibilidad del despliegue para regresar y acordar quién ejecutaría la recuperación. La revalidación encontró Vercel Hobby, rol OWNER y producción `dpl_4XHmTtzUJEbr2tkmj6A6HTKFZj27`, commit `e7f36c552f3ce68886298de945fe435108b640ef`. Es la referencia de esta consulta; si otro trabajo publica después, tomar una nueva referencia.
3. Guardar una línea base de los últimos siete días completos. AdSense: sitio, producto Contenido, impresiones e ingresos estimados. GA4: propiedad, flujo, hostname y vistas. Si el informe publicitario todavía no está disponible, registrar esa ausencia; no convertirla en un cero numérico.
4. Registrar filtros activos, restricciones de ingresos del usuario que validará, zona horaria, moneda y fecha de consulta. Confirmar que el reporte incluya `coronabingo.com.ar`; incluir `www` solo cuando figure con tráfico en el período comparado.
5. Coordinar los cambios con las otras tareas del repositorio y reservar dos revisiones posteriores. Al aprobar la ejecución, asignar quién vuelve a las 24 horas y quién revisa el intervalo consolidado. Este documento no crea recordatorios ni automatizaciones.

Salida: evidencia previa y responsables definidos. La implementación aún no está terminada.

### 2. Preparar y verificar la carga directa de GA4

Responsable: implementación técnica. Tiempo orientativo: 1 a 3 horas, según lo que revele la prueba sin extensiones.

1. Releer `AGENTS.md` y las guías de la versión instalada de Next.js antes de editar. El proyecto actual usa Pages Router y Next.js 16.3.6. Los archivos vigentes son `pages/_document.tsx`, `pages/_app.tsx`, `utils/gtag.ts` y `next.config.js`.
2. Preparar `GA_TRACKING_ID=G-WYG7FMEWEF` únicamente en Production. La revalidación encontró entradas separadas y de tipo sensitive para Production y Preview; no se extrajeron sus valores. Conservar la entrada Preview, `MEASUREMENT_ID`, los identificadores y la configuración de Firebase. La referencia pública compilada de Firebase es `G-PR7XZB4T8W`. Las variables incorporadas por Next.js requieren un nuevo build para cambiar el JavaScript servido.
3. Sustituir la carga UA por una sola carga directa de la etiqueta objetivo. Revisar el orden de inicialización y de `config` respecto de los anuncios; no introducir una carga tardía que deje impresiones sin contexto analítico. Inspeccionar también la coexistencia con el SDK de Firebase.
4. Mantener la estrategia de vistas manuales en navegación. Se verificó que las cargas de página están habilitadas y los eventos automáticos por cambios de historial están deshabilitados. Para el flujo objetivo: una vista inicial desde `config` y una vista por transición real, desde el helper del router. Preparar el helper con `event: page_view` dirigido explícitamente a `G-WYG7FMEWEF`, con ubicación, título y referencia correctos, evitando repetir `config` como mecanismo de navegación. No activar simultáneamente las vistas automáticas por historial.
5. Verificar en un contexto limpio que la carga inicial y cada cambio real de pantalla produzcan exactamente un `page_view` por destino previsto. Dos propiedades distintas pueden recibir sus propias vistas; el error a evitar es duplicar una vista dentro de `G-WYG7FMEWEF`. Comprobar que el flujo Firebase conserve su comportamiento previo.
6. Cubrir inicio en español e inglés, enlace directo y navegación cliente a una sala de prueba válida, cambio de idioma y atrás/adelante. Usar salas sintéticas de desarrollo para pruebas funcionales. Revisar el patrón de URL que aparece sin etiquetar sin alterar salas de usuarios.
7. Ejecutar `npm run lint:check`, `npm run validate-locales` y `npm run build`. El build ya invoca la validación de idiomas; no hace falta repetirla si quedó cubierta en ese mismo build. La prueba determinante es la recepción por el destino correcto, no solo que compile.
8. Validar la versión candidata en un entorno controlado sin impresiones publicitarias de prueba. Guardar evidencia de los eventos y sus destinos, omitiendo identificadores personales. Preparar un commit específico de analítica y el despliegue verificable antes de publicar. No mezclar con optimización, anuncios adaptables u otras tareas. Tras publicarlo, evitar otro despliegue de producción hasta completar la validación técnica inmediata; Hobby limita Instant Rollback al despliegue de producción inmediatamente anterior.
9. Con autorización de publicación, desplegar y comprobar en producción una navegación breve, sin hacer clic en anuncios ni recargar para producir impresiones. Confirmar etiqueta directa, recepción en GA4 y ausencia de doble conteo. Registrar `T_tag`, instante en que el etiquetado correcto queda verificado.

Google recomienda elegir un único mecanismo para las vistas de una SPA y advierte sobre el doble conteo al combinarlo con envíos manuales. [Vistas de página](https://developers.google.com/analytics/devguides/collection/ga4/views), [medición de SPA](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications). Firebase documenta la convivencia del SDK con etiquetas de otras propiedades. [Firebase con gtag.js existente](https://firebase.google.com/docs/analytics/web/get-started#use-firebase-with-existing-gtagjs-tagging).

Salida: etiquetado verificado. Si no hay entrega al destino correcto, resolver antes de atribuir el problema a AdSense.

### 3. Crear la vinculación exacta

Responsable: operador de la cuenta administrativa. Tiempo orientativo: 10 a 15 minutos.

1. Abrir AdSense y confirmar `pub-6231280485856921`.
2. Ir a Cuenta → Acceso y autorización → Integración de Google Analytics → Nueva vinculación.
3. Seleccionar exactamente `coronabingo - Coronabingo - GA4 - 385744187`. No seleccionar `226709381` ni el entorno de desarrollo.
4. Revisar la selección y crear la vinculación. Esta será la acción de escritura en la cuenta, que no se ejecutó durante la investigación.
5. Guardar fecha, hora, propiedad y editor mostrados. Verificar el vínculo desde AdSense y desde GA4 → Administrar → Vinculaciones con otros productos → Google AdSense.
6. Registrar `T_link`. Definir `T0 = máximo de T_tag y T_link`. A partir de ese momento empieza la ventana válida de observación.

La sesión actual reúne los permisos requeridos y la propiedad aparece en el selector. [Procedimiento oficial y permisos](https://support.google.com/adsense/answer/6084409?hl=en). La vinculación hace visibles los datos dentro de los accesos existentes de Analytics, sin conceder acceso a la cuenta AdSense. [Preguntas frecuentes](https://support.google.com/adsense/answer/6089284?hl=en).

Salida: estado `Vinculado, pendiente de datos`.

### 4. Verificar impresiones e ingresos reales

Responsable: persona asignada al seguimiento. Primera revisión a `T0 + 24 h`; revisión consolidada después de varios días completos.

1. En escritorio, localizar el informe de anuncios de editores. La ayuda actual lo ubica en Publicidad → Publicación → Anuncios de editores; otra guía conserva Monetización → Anuncios de editores. Confirmar la navegación visible después del vínculo. Si falta en el menú, buscar el informe o preparar una exploración con las métricas publicitarias, sin confundir su ausencia visual con ausencia de datos. [Informe de anuncios de editores](https://support.google.com/analytics/answer/12925552?hl=en).
2. Seleccionar `385744187`, flujo `5469366293`, las fechas posteriores a `T0` y la fuente publicitaria correspondiente a `pub-6231280485856921`. El hostname deberá corresponder al sitio de producción. Si una combinación de dimensiones no es compatible, separar la prueba del hostname y la del informe publicitario, manteniendo el mismo flujo y período.
3. Leer `Publisher ad impressions` e `Total ad revenue`, según las etiquetas equivalentes de la interfaz. Registrar valores positivos en ambos campos. No usar vistas de página como sustituto de impresiones ni ingresos totales de todas las fuentes como prueba del origen AdSense.
4. Guardar captura o exportación con propiedad, período, filtros, fuente, impresiones, moneda e ingreso. Usar eventos publicitarios como apoyo al diagnóstico, sin considerarlos sustituto del ingreso unido por Google.
5. Abrir AdSense con idéntico período, producto Contenido y sitio. Comparar impresiones con impresiones e ingresos publicitarios con ingresos estimados. No comparar pagos finales, RPM o páginas vistas como si fueran las mismas métricas.
6. Registrar valores de ambos sistemas y diferencias absolutas. Calcular diferencia porcentual solo cuando el denominador sea mayor que cero. Con importes pequeños, revisar precisión y redondeo antes de interpretar un `0,00` como ausencia absoluta de ingresos.
7. Repetir con una ventana que incluya al menos un nuevo día completo. Para la comprobación consolidada, usar tres días completos posteriores al día de `T0` y esperar 48 horas desde el cierre del último día. Habitualmente eso ubica la revisión entre los días 5 y 7. Es un margen operativo del plan, no un SLA de Google.

Google indica hasta 24 horas para que empiece a aparecer información tras el vínculo. El procesamiento de informes GA4 puede tardar entre 24 y 48 horas y cambiar durante ese intervalo. [Datos faltantes de AdSense](https://support.google.com/adsense/answer/6090771?hl=en), [actualización de datos GA4](https://support.google.com/analytics/answer/11198161?hl=en).

Salida: `Datos verificados` únicamente cuando hay importes e impresiones del editor correcto y continuidad posterior. No se promete igualdad exacta entre plataformas. Diferencias amplias y sin explicación mantienen abierta la investigación; no se fija un porcentaje universal inventado como tolerancia.

## Si los datos no aparecen

| Resultado | Acción siguiente | Estado |
| --- | --- | --- |
| No pasaron 24 h desde T0 | Esperar a la revisión acordada y conservar evidencia | Pendiente de procesamiento |
| AdSense y GA4 no tienen actividad comparable | Ampliar la ventana y comprobar tráfico y entrega de anuncios | Pendiente de muestra; no cerrado |
| AdSense tiene impresiones e ingresos y GA4 no | Revisar IDs, fuente, fechas, entrega de `g/collect`, carga directa y disponibilidad simultánea de etiquetas | Incidencia de integración |
| Hay `page_view` pero no métricas publicitarias | Revisar vínculo, orden de carga, producto Contenido, consentimiento y bloqueo de scripts | Incidencia de integración |
| Hay impresiones y el ingreso se muestra como cero | Consultar exportación con precisión suficiente y ampliar el período; comprobar restricciones de ingresos | Pendiente de ingresos verificables |
| Solo falla el navegador de prueba | Repetir en un contexto limpio autorizado y documentar las extensiones o restricciones | Evidencia de navegador insuficiente |
| Hay diferencias persistentes | Comparar por día, sitio y formato; revisar filtros, consentimiento, bloqueadores, cobertura y duplicaciones | Conciliación pendiente |
| Sigue en cero tras 72 h con AdSense positivo y datos ya procesados | Abrir diagnóstico con evidencia y preparar un caso de soporte; enviarlo solo si se autoriza | Incidencia, no volver a vincular a ciegas |

La configuración de consentimiento no se debe modificar para forzar una prueba positiva. La investigación previa del repositorio señaló un mensaje europeo en borrador; su estado y la existencia de otra CMP requieren revisión actual específica si intervienen en el fallo. No se presupone que ese aviso explique todas las discrepancias.

## Criterios de aceptación y registro

- [x] El HTML de producción configura directamente `G-WYG7FMEWEF` y las solicitudes llegan al destino correcto en un contexto sin interferencias.
- [x] No hay vistas duplicadas en el flujo objetivo en la carga inicial y la navegación probada.
- [x] Se conservó la asociación Firebase previamente verificada a `226709381`, sin escribir en esa configuración; su instrumentación `G-PR7XZB4T8W` sigue enviando vistas en producción.
- [x] El vínculo visible en ambos productos une `pub-6231280485856921` con `385744187`.
- [ ] Se guardaron impresiones publicitarias mayores que cero e ingresos publicitarios mayores que cero, posteriores a T0 y atribuibles al editor correcto.
- [ ] Una segunda observación confirma datos de al menos un nuevo día completo.
- [ ] Se comparó un intervalo consolidado con AdSense y se documentaron las diferencias y cualquier limitación material.
- [ ] No quedan discrepancias amplias sin investigar ni validaciones pendientes presentadas como aprobadas.

Para cada revisión guardar: fecha de consulta, T_tag, T_link, T0, período, zona horaria, moneda, IDs, filtros, métricas de ambas plataformas, diferencias, capturas o CSV, resultado y próxima acción. Un registro de valores redactado a mano debe distinguirse de una exportación de Google. El archivo de evidencia inicial conserva el estado anterior al vínculo; el archivo de implementación registra las comprobaciones posteriores.

## Recuperación si algo sale mal

La recuperación existe, pero comprende tres operaciones independientes. No hay un botón que deshaga al mismo tiempo código, variables e integraciones de Google.

| Qué falla | Recuperación propuesta | Límite |
| --- | --- | --- |
| La nueva versión rompe la app, pierde eventos o los duplica | Volver al despliegue guardado antes del cambio | Restaura el código y configuración de ese build, no la configuración de Google |
| `GA_TRACKING_ID` queda cambiado en los ajustes de Vercel | Restituir su valor anterior únicamente en el ámbito modificado y revertir el commit de analítica antes del próximo build | Instant Rollback no sustituye esta limpieza de configuración para futuros builds |
| Se vinculó una propiedad incorrecta o se decide retirar la integración | En AdSense → Cuenta → Acceso y autorización → Integración de Google Analytics, quitar solo el vínculo creado por esta tarea | Se detiene la recepción nueva de AdSense en esa propiedad |

El 23 de septiembre, aproximadamente a las 22:40 ART, Vercel devolvió plan `hobby`, rol `OWNER`, producción `Ready` y dominio `coronabingo.com.ar` asociado a `dpl_4XHmTtzUJEbr2tkmj6A6HTKFZj27`. Una vez publicado el cambio aislado, esta versión sería el destino inmediato anterior, siempre que no haya otra publicación intermedia. La restricción Hobby está documentada en [Vercel CLI rollback](https://vercel.com/docs/cli/rollback).

Procedimiento preparado, no ejecutado:

1. Ante un fallo reproducible del juego o de la medición introducido por la nueva versión, registrar el síntoma, hora y despliegue afectado. Detener nuevas publicaciones coordinadamente. No usar una demora normal del informe AdSense como motivo automático de rollback del sitio.
2. Revalidar el ID de la versión que servía antes del cambio. Si sigue siendo el despliegue elegible, usar Instant Rollback en Vercel o el siguiente comando, sustituyendo el ID si cambió la referencia previa:

   ```sh
   vercel rollback dpl_4XHmTtzUJEbr2tkmj6A6HTKFZj27 --scope cristhian-durans-projects-3ace6550
   ```

3. Confirmar con `vercel inspect https://coronabingo.com.ar --scope cristhian-durans-projects-3ace6550` que el dominio apunta al destino esperado. Comprobar portada, navegación, juego y recepción analítica respecto de la línea base. Las pestañas ya abiertas pueden conservar el JavaScript de la versión fallida hasta recargar; no confundirlas con una nueva carga de la versión restaurada.
4. Restituir `GA_TRACKING_ID` en el ámbito modificado y preparar la reversión del commit aislado, preservando cualquier cambio ajeno. Cambiar una variable afecta a los builds nuevos; no modifica los despliegues ya construidos. [Variables de entorno de Vercel](https://vercel.com/docs/environment-variables).
5. Instant Rollback suspende la asignación automática de dominios a nuevas publicaciones. Tras validar la corrección, promover deliberadamente una versión sana para reanudarla. No promover de nuevo la versión fallida por error. [Funcionamiento de Instant Rollback](https://vercel.com/docs/instant-rollback).
6. Mantener intactos el vínculo Search Console, la URL actual del flujo y Firebase. Si el vínculo AdSense es correcto y el fallo era de código, conservarlo mientras se corrige. Si el problema es el vínculo, quitar exclusivamente esa asociación y confirmar su ausencia. [Desvincular Analytics de AdSense](https://support.google.com/adsense/answer/6089298?hl=en).

Si el despliegue deseado dejó de ser elegible, la alternativa es revertir únicamente el commit de analítica sobre la rama actual, restituir la variable y construir una versión nueva. Esa ruta requiere build y validación y no es instantánea. No usar un reset de toda la rama ni volver a un commit viejo que elimine trabajo posterior.

Volver a UA sería una recuperación temporal de la situación anterior. El rollback no elimina automáticamente eventos incorrectos ya recogidos, no recupera impresiones perdidas ni reconstruye ingresos no capturados. Registrar el intervalo afectado. Si posteriormente se restablecen etiqueta y vínculo, fijar una nueva ventana de verificación.

Se verificaron acceso de lectura, plan, rol, despliegue y documentación del procedimiento. No se hizo un ensayo real de rollback ni se garantizan permisos efectivos de escritura o disponibilidad futura sin revalidarlos al ejecutar. Antes de publicar, dejar acordado si la autorización de implementación incluye la recuperación de emergencia o quién la realizará.

## Segunda revisión del plan

Revisión realizada por el mismo agente después de contrastar consolas, producción y documentación. No se delegó ni se ejecutó la implementación.

| Riesgo detectado al revisar | Mejora incorporada |
| --- | --- |
| Elegir la propiedad Firebase por el nombre Coronabingo | Tabla de IDs y selección exacta confirmada en el asistente AdSense |
| Dar por suficiente el tráfico actual de GA4 | Carga directa tras confirmar el aviso oficial de UA en esta etiqueta |
| Cambiar solo una variable y duplicar vistas | Estrategia explícita de vista inicial automática y navegación manual; historial automático continúa desactivado |
| Migrar Firebase innecesariamente | Mantener su propiedad y separar una eventual unificación de analítica |
| Interpretar todo el aviso de cobertura como páginas rotas | Se contaron los estados y se acotó a una URL de participante sin etiquetar |
| Declarar fallo por un navegador con bloqueadores | Se dejó como pendiente la prueba de recepción en contexto limpio |
| Comparar períodos anteriores al vínculo o un día parcial | T0 y ventana de días completos con margen de procesamiento |
| Cerrar con un único número positivo | Segunda observación, conciliación y evidencia del editor correcto |
| Seguir esperando indefinidamente | Diagnóstico desde 72 h con fuente positiva; ausencia de datos conserva la tarea abierta |
| Dejar el seguimiento sin dueño | Asignación de responsable y fechas antes de implementar |

Quedan por resolver durante la implementación: la prueba de red sin interferencias, el registro recuperable del valor anterior de la variable Production, la recepción publicitaria después del vínculo y el tamaño real de las discrepancias. El ámbito Production ya está identificado; su valor compilado visible es UA, pero la variable sensible no se descifró. Son verificaciones delimitadas; ninguna se da por realizada en este plan.

## Revalidación posterior a Search Console

La revisión de las 22:40 ART mantiene la recomendación de implementar este plan con las correcciones de recuperación anteriores. Se confirmó en vivo que Search Console apunta a `https://coronabingo.com.ar/` y al flujo `5469366293`, que la URL descriptiva es la actual, que AdSense aún no tiene vínculo en GA4 y que producción continúa configurando `UA-161408428-1`.

Se eliminó del trabajo pendiente la actualización de URL ya realizada. Se añadió preservación explícita de Search Console, despliegue aislado, recuperación independiente de variables y vínculo, límite Hobby y alternativa de reversión de código si se pierde la elegibilidad. Los criterios de cierre siguen exigiendo impresiones e ingresos reales, continuidad y conciliación posterior.

El registro separado de Search Console documenta recepción adicional de `page_view` tras una recarga del usuario desde incógnito. Esa observación refuerza que el flujo elegido recibe tráfico; no demuestra por sí sola entrega de eventos publicitarios ni una captura de red sin interferencias. Ver [comprobaciones de Search Console](2026-09-23-search-console-preflight.md).

## Ejecución autorizada y seguimiento

El usuario autorizó los cambios con "ok, vamos adelante con los cambios de esta tarea". La implementación inicial está en el commit `ef582b7`. Se cambió exclusivamente la variable sensible `GA_TRACKING_ID` de Production a `G-WYG7FMEWEF`, conservando Preview y Firebase. Vercel no devuelve el valor sensible anterior descifrado; el valor efectivo de recuperación `UA-161408428-1` se comprobó en el HTML de producción antes del cambio.

Se conservaron el script, editor y bloque de AdSense y la verificación de Search Console. La configuración GA4 se encola antes de cargar los scripts asíncronos de Analytics y anuncios. La vista inicial procede de `config`; las navegaciones emiten `page_view` dirigido al destino elegido, con URL, título y referencia. El helper omite transiciones a la misma URL y conserva el comportamiento UA de otros entornos. El listener del router se registra al montar y se retira al desmontar.

El despliegue inicial `dpl_HN5MoCPZormST4jxSnVJEahPyQ6T` quedó Ready. En Chrome, después de que el usuario desactivara bloqueadores para el sitio, se observaron respuestas HTTP 204 para una vista inicial de `/` y una navegación a `/en` en `G-WYG7FMEWEF`, sin duplicación en esa secuencia. También se recibió la vista inicial en `G-PR7XZB4T8W`. AdSense respondió 200 y aparecieron espacios con `data-ad-status=filled`; otros estaban sin relleno. Eso demuestra funcionamiento técnico, no un ingreso acreditado. No hubo clics en anuncios ni eventos publicitarios artificiales.

Durante las pruebas ampliadas de atrás/adelante se observó una vista con el título del idioma anterior. Se ajustó el envío para esperar el efecto de `next/head` después del primer pintado. Un capturador temporal local, sin envío a Google, confirmó una vista por cambio de idioma, título español/inglés correcto y referencia anterior correcta. La compilación y lint volvieron a pasar después del ajuste. El capturador se retira al cerrar la pestaña de prueba.

La vinculación se creó desde GA4 el **23 de septiembre de 2026 a las 23:26:46 ART**, equivalente a `2026-09-24T02:26:46.655Z`. GA4 confirmó "Vinculación creada correctamente" para `pub-6231280485856921`, AdSense para contenido. AdSense confirmó `Coronabingo - GA4`, propiedad `385744187`. Se toma ese instante como `T0`, posterior a la validación inicial de la etiqueta. No se alteraron Search Console, la asociación Firebase ni permisos.

El informe se encuentra en **Publicidad → Publicación → Anuncios del editor**. Se abrió el 23 de septiembre, con dimensión **Fuente del anuncio**, sin filtros: 0 impresiones, USD 0,00 y "No hay datos disponibles". Se consultó minutos después del vínculo y abarca un día parcial mayormente anterior a T0. No se interpreta como fallo ni como prueba de recepción publicitaria. Los informes aún deben mostrar el editor correcto y valores positivos.

### Revisiones pendientes

Responsable de implementación: Codex en esta sesión. Responsable de reabrir el seguimiento: Cristhian; Codex puede realizar las consultas cuando se reanude esta tarea. No hay automatización ni recordatorio programado y no habrá ejecución autónoma después de esta sesión.

| Fecha, hora argentina | Comprobación y decisión |
| --- | --- |
| 24 de septiembre, después de 23:27; por comodidad, 25 de septiembre por la mañana | Primera revisión: impresiones e ingresos de AdSense posteriores a T0 y presencia en GA4. Registrar editor, flujo, fechas, USD, filtros y capturas o exportación. |
| 26 de septiembre, después de 23:27 | Si AdSense tiene actividad positiva y GA4 sigue sin datos ya procesados, iniciar diagnóstico de la integración. No desvincular automáticamente. |
| 29 de septiembre | Comparar días completos 24, 25 y 26; ya transcurrieron 48 horas desde el cierre del día 26. Conciliar AdSense por sitio y GA4 por fuente publicitaria, con el mismo corte UTC-3 y USD. |
| 30 de septiembre | Repetir incluyendo el día 27 para demostrar continuidad. Cerrar solo con impresiones e ingresos mayores que cero y discrepancias explicadas. |

### Validación técnica y entorno

Pasaron `npm run lint:check`, `GA_TRACKING_ID=G-WYG7FMEWEF npm run build`, la validación de idiomas incluida en prebuild y pruebas aisladas del helper: vista inicial sin repetición, destino explícito, query string, referencia anterior, navegación atrás y ausencia de error cuando falta `gtag`. La consulta de errores de Vercel para el despliegue inicial devolvió "No logs found"; no equivale a cobertura continua de monitoreo.

La prueba funcional se realizó en `http://localhost:3107`, Firebase `coronabingo-dev`, con sala propia `yeZ5sUAPiVtJhlDgqD49`, nombre `QA GA4 2026-09-23` y dos participantes sintéticos. Se comprobaron creación, configuración, lobby, cartones, idioma y navegación. Se bloquearon peticiones locales de anuncios y recolección. La evidencia local es la cola de eventos, mientras que la recepción HTTP 204 se probó aparte en producción. Se conserva la sala de desarrollo como registro de prueba; no se escribieron salas de producción.

La primera implementación se hizo en el checkout principal, antes de la incorporación concurrente de las reglas de worktrees. La corrección de título y este registro se prepararon en `codex/adsense-ga4`, `/Users/durancristhian/Repos/coronabingo-worktrees/adsense-ga4`, con instalación y build propios. Node 24.21.0 y npm 11.19.0 en las verificaciones finales. Se preservaron los documentos de otras tareas.

### Recuperación actualizada

La referencia previa a toda esta tarea fue `dpl_WADSHvUBXxBrMHcVEwciAfJYSP8U`, commit `215deb3`. Hubo después una publicación concurrente de documentación, commit `d92a9fb`, despliegue `dpl_95M9qH73ZYW3BEZBap7LcyTViZ5h`, que ya contiene la etiqueta GA4. **El comando antiguo del plan no debe ejecutarse sin revalidar elegibilidad.**

En Hobby, el rollback inmediato regresa al despliegue anterior elegible y puede conservar la integración GA4. Para deshacer toda esta tarea, revertir solamente sus commits de código sobre la rama actual, restituir `GA_TRACKING_ID=UA-161408428-1` únicamente en Production y publicar una nueva versión validada. Preservar cambios concurrentes. Si hace falta quitar el vínculo, eliminar únicamente `pub-6231280485856921` ↔ `385744187`. No se ensayó ni fue necesario un rollback real; las limitaciones sobre datos perdidos y eventos existentes siguen vigentes.
