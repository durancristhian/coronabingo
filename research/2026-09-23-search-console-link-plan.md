# Plan revisado para corregir Search Console

Investigación del 23 de septiembre de 2026. Estado: propuesta, sin ejecutar. Se consultaron Search Console, dos propiedades de Analytics, Firebase, el sitio publicado y DNS. No se guardaron cambios en las cuentas, no se crearon propiedades ni se modificó código de la aplicación. Los archivos de este trabajo son documentación local.

La corrección recomendada es conservar la propiedad `Coronabingo - GA4`, ID `385744187`, y su flujo `5469366293`, verificar una propiedad de Search Console que cubra `https://coronabingo.com.ar/` y reemplazar únicamente su vinculación antigua. Antes de hacerlo hay dos condiciones: acreditar la propiedad actual y repetir una prueba reciente de recepción por dominio. La investigación encontró otra propiedad GA4 asociada a Firebase; no conviene trasladar los informes a ella de manera implícita.

**Lo comprobado en las cuentas**

| Elemento | Resultado observado |
| --- | --- |
| Cuenta de Analytics | `coronabingo`, ID `161408428` |
| Propiedad del informe previo | `Coronabingo - GA4`, ID `385744187` |
| Su único flujo web | `Coronabingo - GA4`, ID `5469366293`, medición `G-WYG7FMEWEF` |
| URL configurada en ese flujo | `https://coronabingo.now.sh`, desactualizada |
| Vínculo Search Console vigente | Prefijo `https://coronabingo.now.sh/`, creado el 13 de agosto de 2026, asociado al flujo `5469366293` |
| Permiso del usuario conectado en esa propiedad GA4 | Administrador |
| Propiedades visibles en Search Console | Solamente `https://coronabingo.now.sh/` |
| Propiedad antigua de Search Console | Usuario conectado es propietario verificado; métodos HTML y Google Analytics confirmados; incorporada a la cuenta el 30 de marzo de 2020 |
| Informes Search Console en `385744187` | Colección ya visible, con Consultas y Tráfico de búsqueda orgánica de Google. Consultas muestra 0 clics, 0 impresiones y ningún dato para 25/06–22/09/2026 |
| Proyecto Firebase de producción | `coronabingo-bf16f` |
| Propiedad Analytics vinculada a Firebase | `coronabingo-bf16f`, ID `226709381` |
| Flujo Firebase | `coronabingo`, ID `1861645851`, medición `G-PR7XZB4T8W`; URL del flujo vacía en la ficha |
| Search Console en la propiedad Firebase | Sin vinculaciones |
| Recepción reciente | Ambos flujos indican recepción durante las últimas 48 horas |
| Sitio actual | Canonical de la portada `https://coronabingo.com.ar/`; etiqueta HTML de verificación presente |
| Instrumentación publicada | HTML carga `UA-161408428-1`; bundle de la aplicación contiene `G-PR7XZB4T8W`; respuesta Firebase `webConfig` confirma proyecto, app e ID `G-PR7XZB4T8W` |
| DNS público | Nameservers de Vercel; consulta TXT al dominio raíz con `NOERROR` y cero respuestas |

El selector de Search Console permite concluir que no hay una propiedad actual accesible en esta sesión. No prueba que nadie la haya creado en otra cuenta. La ausencia de TXT tampoco demuestra ausencia global de verificación, porque existen otros métodos.

Para identificar el dominio real de los datos se consultó el informe de tecnología de ambas propiedades, añadiendo temporalmente la dimensión Nombre de host, sin guardar una personalización. Intervalo 25 de junio a 22 de septiembre de 2026:

| Propiedad | Único hostname mostrado | Usuarios activos | Eventos |
| --- | --- | ---: | ---: |
| `385744187` | `coronabingo.com.ar` | 3.542 | 25.459 |
| `226709381` | `coronabingo.com.ar` | 3.493 | 25.584 |

Esto confirma que ambas propiedades contienen datos del dominio actual. No hay que sumar sus usuarios ni asumir que representan públicos distintos. La ruta exacta por la que la etiqueta heredada alimenta `G-WYG7FMEWEF` no quedó demostrada. La sesión de Chrome devolvió para `gtag.js` un script de reemplazo de 1.204 caracteres con funciones vacías, compatible con bloqueo local, y no permitió observar solicitudes `collect`. No se cambiaron extensiones. Esa ausencia no demuestra un fallo general de producción.

Firebase permitió resolver la identidad de la segunda propiedad. AdSense no es una dependencia del vínculo Search Console y no se reabrió su configuración para esta tarea.

**Decisiones propuestas**

Conservar `385744187` como destino de esta corrección: tiene la colección, el vínculo que se debe corregir, permisos suficientes y datos del dominio actual. Mantener su flujo e ID de medición. No crear otro flujo para cambiar una URL. La propiedad de Firebase seguirá intacta; decidir si se unifica la medición requiere otro alcance, con análisis de eventos e históricos.

Reutilizar una propiedad Search Console existente si se encuentra y su cobertura coincide. Si no existe una accesible, proponer el prefijo exacto `https://coronabingo.com.ar/` para esta intervención: coincide con el hostname observado y permite probar la etiqueta HTML ya publicada. La propiedad de dominio `coronabingo.com.ar` es una alternativa válida si se necesita incluir protocolos o subdominios y se dispone de acceso DNS. Ambas modalidades admiten asociación con Analytics. [Cobertura de propiedades](https://support.google.com/webmasters/answer/34592?hl=en), [soporte de asociaciones de dominio](https://developers.google.com/search/blog/2021/02/search-console-associations).

**Secuencia para una futura implementación autorizada**

1. **Registrar el estado inicial y cerrar la identidad del destino.** Volver a abrir cuenta `161408428`, propiedad `385744187` y flujo `5469366293`. Guardar fecha, capturas de la vinculación, URL del flujo, ID de medición, permisos e informes. Exportar antes del cambio los informes GA4 y Search Console cuyo estado anterior interese conservar, indicando fechas y propiedad. Conservar también la evidencia de la propiedad Firebase. Consultar Nombre de host para los últimos siete días completos y confirmar tráfico de `coronabingo.com.ar`. Observar una visita ordinaria a la portada desde un navegador que permita Analytics, con su consentimiento normal, y registrar sólo destino de medición, hostname, evento y hora, sin identificadores de visitantes. Si no se puede verificar la recepción reciente del flujo elegido o sólo se observa recepción en Firebase, detener el reemplazo y resolver la instrumentación. No cambiar de propiedad silenciosamente. La prueba de red y Tiempo real es distinta de la prueba de importación Search Console.

2. **Resolver acceso y verificación del dominio actual antes de desvincular.** Revisar las cuentas de Google pertinentes y confirmar si existe `sc-domain:coronabingo.com.ar` o `https://coronabingo.com.ar/` con histórico útil. Si otro propietario la administra, obtener acceso y completar verificación propia cuando sea necesario para asociarla desde GA4. Si no se encuentra, agregar el prefijo exacto en Search Console durante la implementación. Esa acción puede crear o incorporar la propiedad y eventualmente verificarla de forma automática: ya es una escritura, por eso no se probó durante esta investigación. Comparar la etiqueta entregada por Google con la publicada. Verificar sin despliegue si coincide; su sola presencia actual no garantiza que sirva para esta cuenta y propiedad. Si hace falta otra etiqueta, conservar las existentes y preparar una modificación mínima. Como alternativa, verificar la propiedad de dominio mediante el TXT que entregue Google. DNS apunta a Vercel, pero el acceso a su administración no fue comprobado. No reemplazar otros registros DNS. Antes de cualquier código, leer las guías locales de Next.js exigidas por `AGENTS.md`. [Métodos y persistencia de verificación](https://support.google.com/webmasters/answer/9008080?hl=en).

3. **Acreditar que el destino está listo.** En Search Console, comprobar que Ajustes → Verificación de la propiedad muestra propietario verificado en la propiedad actual. Abrir Asociaciones y verificar que no haya un vínculo con otra propiedad GA4 que se deba conservar. Revisar Rendimiento con tipo de búsqueda Web, fechas disponibles y tabla Páginas. Registrar cobertura, fecha inicial disponible, últimas fechas consolidadas y dos o tres URLs cuando existan. Si la propiedad es nueva, registrar que todavía no tiene datos; eso no impide vincularla, pero impide declarar comprobada la importación. Si se elige una propiedad de dominio, comprobar que los subdominios incluidos pertenecen al mismo sitio medido. No quitar el vínculo viejo si faltan permisos, la verificación falla o el destino está ocupado. Google requiere Editor en GA4 y propietario verificado en Search Console. [Requisitos de vinculación](https://support.google.com/analytics/answer/10737381?hl=en).

4. **Corregir la URL descriptiva del flujo existente.** En `385744187` → Administrar → Flujos de datos → `5469366293` → Editar configuración del flujo web, cambiar la URL a `https://coronabingo.com.ar/`. Mantener nombre, ID del flujo e ID `G-WYG7FMEWEF`. Registrar el antes y después. Este ajuste aclara la configuración; por sí solo no cambia la propiedad Search Console ni prueba el destino de los eventos. No tocar la propiedad de Firebase, etiquetas, filtros, consentimiento o medición mejorada dentro de este paso.

5. **Reemplazar únicamente la asociación.** En `385744187` → Administrar → Vinculaciones con otros productos → Vinculaciones con Search Console, abrir el vínculo a `https://coronabingo.now.sh/` y eliminar esa vinculación. Luego elegir Vincular, seleccionar la propiedad verificada del dominio actual y el flujo `5469366293`, revisar los identificadores y enviar. Google no permite editar el vínculo y limita a un flujo asociado por propiedad GA4. Eliminar la asociación es distinto de quitar la propiedad de Search Console. Mantener ambas propiedades Search Console, sus usuarios y sus verificaciones. Registrar la hora del cambio y el resultado. [Operación y límites](https://support.google.com/analytics/answer/10737381?hl=en), [asociaciones de Search Console](https://support.google.com/webmasters/answer/9419894?hl=en).

6. **Verificar la configuración inmediatamente.** Reabrir GA4 y comprobar la nueva pareja propiedad Search Console / flujo `5469366293`. En la propiedad nueva de Search Console, comprobar la asociación con GA4 `385744187`. Abrir la propiedad antigua y confirmar que continúa accesible y verificada. Revisar Consultas y Tráfico de búsqueda orgánica de Google; ya están publicados en esta propiedad, por lo que no corresponde publicar una colección nueva salvo que la interfaz haya cambiado. Si desaparecen de navegación, revisar Biblioteca y publicar únicamente la colección existente cuando corresponda. Repetir la comprobación de recepción GA4 y comparar los IDs con la línea de base. [Publicación de colecciones](https://support.google.com/analytics/answer/10460557).

7. **Comprobar la llegada de datos con fechas consolidadas.** Quien ejecute el cambio registrará dos tareas de seguimiento: primera revisión a las 48–72 horas y segunda a los siete días. Son ventanas de trabajo propuestas, no una promesa de disponibilidad. Google documenta una demora de 48 horas desde la recolección de Search Console y un máximo de 16 meses; la primera fecha elegible es la más reciente entre la verificación del sitio y la creación del flujo, dentro de esa ventana. Filas anteriores visibles directamente en Search Console no bastan para diagnosticar un fallo de importación en GA4. Si la propiedad es nueva, puede tardar unos días en acumular información y no hay que prometer recuperar el histórico de `.com.ar`. [Disponibilidad del informe Consultas](https://support.google.com/analytics/answer/13682862), [inicio de recolección](https://support.google.com/webmasters/answer/9008080?hl=en).

8. **Cerrar con evidencia de alcance y recepción.** Comparar un mismo intervalo completo en Search Console y en los dos informes de GA4, con búsqueda Web, país y dispositivo equivalentes. Guardar URLs, fechas, totales y algunas filas representativas. La tabla Páginas de Search Console debe corresponder al dominio actual. Las páginas de destino de GA4 pueden mostrar sólo rutas, por lo que el hostname se acredita adicionalmente con el informe de tecnología y la identidad del vínculo. No exigir que clics y sesiones coincidan: difieren por medición, consentimiento, atribución, URL canónica y zona horaria. [Dimensiones del informe orgánico](https://support.google.com/analytics/answer/13682863), [comparación entre servicios](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console).

**Criterios de aceptación y contingencias**

| Situación | Resultado y siguiente acción |
| --- | --- |
| Propiedad nueva verificada, vínculo correcto y antigua conservada | Configuración terminada; recepción todavía debe comprobarse |
| Search Console tiene datos consolidados y GA4 muestra métricas y páginas compatibles | Importación verificada; cerrar con evidencia |
| Search Console aún no tiene datos | Marcar "configurado, pendiente de datos" y mantener seguimiento; no declarar éxito completo |
| Search Console tiene datos, pero GA4 sigue vacío tras las revisiones | Comprobar IDs, fechas elegibles, asociación activa, cobertura y colección; documentar discrepancia antes de atribuirla a falta de SEO |
| GA4 deja de recibir eventos ordinarios | Investigar etiquetado por separado; no asumir que lo causó Search Console |
| Nueva propiedad no elegible antes del cambio | Mantener vínculo antiguo y resolver el requisito pendiente |
| Creación del vínculo falla después de eliminar el antiguo | Registrar el error y verificar el estado real antes de reintentar; si no se resuelve, recrear el vínculo original con `https://coronabingo.now.sh/` y flujo `5469366293` |

La restitución conserva las propiedades y vuelve a la configuración anterior; no recupera el historial administrativo eliminado de la asociación. Tampoco convierte los informes antiguos en datos del dominio actual. Si se necesita conservar una lectura anterior de GA4, exportarla antes. No prometer que el informe mezclará históricos de las dos propiedades Search Console. [Historial de asociaciones](https://support.google.com/webmasters/answer/9419894?hl=en).

Estimación operativa: 30–60 minutos para configuración y comprobaciones inmediatas si ya hay permisos y sirve la etiqueta existente. DNS o un despliegue agregan una dependencia de duración variable. El seguimiento queda a cargo de quien implemente; este documento no programa tareas ni monitoreo automático.

**Revisión del plan y mejoras incorporadas**

La primera formulación, "cambiar el dominio vinculado", omitía que hay dos propiedades GA4. La revisión fija el destino por ID y explica por qué se conserva el de los informes existentes. Agrega una prueba reciente de recepción para no confundir una URL descriptiva con medición real.

También separa preparar el destino de retirar la asociación antigua. Así, permisos y verificación se resuelven antes del tramo que puede dejar temporalmente a GA4 sin Search Console. Evita asumir que una propiedad no visible no existe, o que una etiqueta presente garantiza verificación.

La colección ya está visible, por lo que publicar informes pasa a ser una contingencia. El cierre distingue configuración correcta de datos importados. La restitución queda preparada con los IDs originales y con su límite histórico explícito.

Quedan fuera de esta intervención la consolidación de las dos propiedades GA4, retirar Universal Analytics, vincular AdSense, modificar Firebase, crear sitemaps, pedir indexación, cambiar redirecciones o usar Cambio de dirección. Ninguna es una condición demostrada para reemplazar esta asociación. Si la prueba de recepción revela que hace falta corregir etiquetas, se debe presentar esa dependencia concreta antes de ampliar el trabajo.

Fuentes de consulta autenticada: [vínculo GA4 actual](https://analytics.google.com/analytics/web/#/a161408428p385744187/admin/integrations/search-console), [flujo GA4 que se conservará](https://analytics.google.com/analytics/web/#/a161408428p385744187/admin/streams/table/5469366293), [integración Firebase](https://console.firebase.google.com/u/0/project/coronabingo-bf16f/settings/integrations/analytics), [flujo Firebase](https://analytics.google.com/analytics/web/#/a161408428p226709381/admin/streams/table/1861645851), [propiedad Search Console antigua](https://search.google.com/search-console/settings?resource_id=https%3A%2F%2Fcoronabingo.now.sh%2F). Estas páginas requieren acceso a la cuenta.

Evidencia de esta consulta: [identificadores y extractos de informes](2026-09-23-search-console-link-evidence.json). Documentación complementaria: [investigación oficial](2026-09-23-search-console-link-official-research.md). Evidencia de código consultada: [`pages/_document.tsx`](../pages/_document.tsx), [`utils/firebase.ts`](../utils/firebase.ts) y [`next.config.js`](../next.config.js). No se leyeron ni modificaron archivos de secretos.
