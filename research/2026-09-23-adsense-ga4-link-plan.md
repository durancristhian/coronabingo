# Plan para vincular AdSense con Coronabingo - GA4

Investigación y segunda revisión realizadas el 23 de septiembre de 2026. Estado: propuesto, sin ejecutar. Se consultaron las consolas autenticadas, el código local, recursos públicos de producción y documentación oficial. Se abrió el selector de propiedades de AdSense y se canceló sin seleccionar ni crear una vinculación. No se modificaron cuentas, etiquetas, variables, código del producto ni despliegues.

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
| URL declarada del flujo | `https://coronabingo.now.sh` | Es antigua; no crear otro flujo por este motivo |
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

La actualización de la URL descriptiva del flujo a `https://coronabingo.com.ar` es recomendable y puede coordinarse con el trabajo de Search Console. Debe conservar los mismos IDs y registrarse como cambio aparte. No es una condición para seleccionar correctamente la propiedad de AdSense.

El consentimiento, la colocación de anuncios y su formato tienen trabajos propios. Si afectan la medición se registrarán como dependencias concretas, sin ampliar esta tarea a un rediseño publicitario. No se generarán manualmente eventos `ad_impression`, importes ficticios ni clics de prueba.

## Secuencia de implementación, una vez autorizada

### 1. Preparar el corte y la evidencia previa

Responsable: quien implemente y tenga la sesión administrativa de Cristhian. Tiempo orientativo: 20 a 40 minutos.

1. Revalidar los IDs de la tabla, permisos y ausencia de vínculo. Si ya existe exactamente el vínculo correcto por otro trabajo concurrente, conservarlo y pasar a la verificación. No crear duplicados ni borrar vínculos ajenos.
2. Registrar commit y despliegue de producción, valor actual de `GA_TRACKING_ID` y ámbito de la variable en Vercel. El HTML demuestra el valor compilado UA, pero no se auditó aquí la configuración viva de Vercel.
3. Guardar una línea base de los últimos siete días completos. AdSense: sitio, producto Contenido, impresiones e ingresos estimados. GA4: propiedad, flujo, hostname y vistas. Si el informe publicitario todavía no está disponible, registrar esa ausencia; no convertirla en un cero numérico.
4. Registrar filtros activos, restricciones de ingresos del usuario que validará, zona horaria, moneda y fecha de consulta. Confirmar que el reporte incluya `coronabingo.com.ar`; incluir `www` solo cuando figure con tráfico en el período comparado.
5. Coordinar los cambios con las otras tareas del repositorio y reservar dos revisiones posteriores. Al aprobar la ejecución, asignar quién vuelve a las 24 horas y quién revisa el intervalo consolidado. Este documento no crea recordatorios ni automatizaciones.

Salida: evidencia previa y responsables definidos. La implementación aún no está terminada.

### 2. Preparar y verificar la carga directa de GA4

Responsable: implementación técnica. Tiempo orientativo: 1 a 3 horas, según lo que revele la prueba sin extensiones.

1. Releer `AGENTS.md` y las guías de la versión instalada de Next.js antes de editar. El proyecto actual usa Pages Router y Next.js 16.3.6. Los archivos vigentes son `pages/_document.tsx`, `pages/_app.tsx`, `utils/gtag.ts` y `next.config.js`.
2. Preparar `GA_TRACKING_ID=G-WYG7FMEWEF` en el ámbito de producción que corresponda. Cambiar únicamente esta variable. Conservar `MEASUREMENT_ID=G-PR7XZB4T8W`, los identificadores y la configuración de Firebase. Las variables incorporadas por Next.js requieren un nuevo build para cambiar el JavaScript servido.
3. Sustituir la carga UA por una sola carga directa de la etiqueta objetivo. Revisar el orden de inicialización y de `config` respecto de los anuncios; no introducir una carga tardía que deje impresiones sin contexto analítico. Inspeccionar también la coexistencia con el SDK de Firebase.
4. Mantener la estrategia de vistas manuales en navegación. Se verificó que las cargas de página están habilitadas y los eventos automáticos por cambios de historial están deshabilitados. Para el flujo objetivo: una vista inicial desde `config` y una vista por transición real, desde el helper del router. Preparar el helper con `event: page_view` dirigido explícitamente a `G-WYG7FMEWEF`, con ubicación, título y referencia correctos, evitando repetir `config` como mecanismo de navegación. No activar simultáneamente las vistas automáticas por historial.
5. Verificar en un contexto limpio que la carga inicial y cada cambio real de pantalla produzcan exactamente un `page_view` por destino previsto. Dos propiedades distintas pueden recibir sus propias vistas; el error a evitar es duplicar una vista dentro de `G-WYG7FMEWEF`. Comprobar que el flujo Firebase conserve su comportamiento previo.
6. Cubrir inicio en español e inglés, enlace directo y navegación cliente a una sala de prueba válida, cambio de idioma y atrás/adelante. Usar salas sintéticas de desarrollo para pruebas funcionales. Revisar el patrón de URL que aparece sin etiquetar sin alterar salas de usuarios.
7. Ejecutar `npm run lint:check`, `npm run validate-locales` y `npm run build`. El build ya invoca la validación de idiomas; no hace falta repetirla si quedó cubierta en ese mismo build. La prueba determinante es la recepción por el destino correcto, no solo que compile.
8. Validar la versión candidata en un entorno controlado sin impresiones publicitarias de prueba. Guardar evidencia de los eventos y sus destinos, omitiendo identificadores personales. Preparar el diff y el despliegue verificable antes de publicar.
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

- [ ] El HTML de producción configura directamente `G-WYG7FMEWEF` y las solicitudes llegan al destino correcto en un contexto sin interferencias.
- [ ] No hay vistas duplicadas en el flujo objetivo en la carga inicial y la navegación probada.
- [ ] Firebase sigue asociado a `226709381`; se conservó su instrumentación existente.
- [ ] El vínculo visible en ambos productos une `pub-6231280485856921` con `385744187`.
- [ ] Se guardaron impresiones publicitarias mayores que cero e ingresos publicitarios mayores que cero, posteriores a T0 y atribuibles al editor correcto.
- [ ] Una segunda observación confirma datos de al menos un nuevo día completo.
- [ ] Se comparó un intervalo consolidado con AdSense y se documentaron las diferencias y cualquier limitación material.
- [ ] No quedan discrepancias amplias sin investigar ni validaciones pendientes presentadas como aprobadas.

Para cada revisión guardar: fecha de consulta, T_tag, T_link, T0, período, zona horaria, moneda, IDs, filtros, métricas de ambas plataformas, diferencias, capturas o CSV, resultado y próxima acción. Un registro de valores redactado a mano debe distinguirse de una exportación de Google. El archivo de evidencia inicial no contiene pruebas posteriores a una vinculación porque todavía no existe.

## Recuperación si algo sale mal

Antes de publicar, conservar el despliegue anterior y el valor anterior de la única variable prevista. Si el cambio de etiqueta rompe la aplicación o duplica eventos, volver a la versión de etiquetado anterior mediante el procedimiento de despliegue autorizado y registrar el intervalo afectado. Volver al mecanismo UA es una recuperación temporal, no un estado final aceptable.

Si se creó el vínculo hacia la propiedad equivocada, documentar el error y retirar solo ese vínculo antes de crear el correcto. No cambiar la asociación Firebase para compensarlo. Ante ausencia de datos con IDs correctos, investigar antes de eliminar y recrear el vínculo. Los períodos sin captura correcta no se reparan retroactivamente con un relink.

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

Quedan por resolver durante la implementación: la prueba de red sin interferencias, el ámbito vigente de la variable en Vercel, la recepción publicitaria después del vínculo y el tamaño real de las discrepancias. Son verificaciones delimitadas; ninguna se da por realizada en este plan.
