# Comprobaciones e implementación de Search Console y Analytics

23 de septiembre de 2026. La consulta inicial fue de lectura. Después de autorizaciones específicas del usuario se verificó el prefijo actual y se reemplazó la asociación. Los apartados anteriores a las 19:43 conservan el estado observado en cada momento.

**Reemplazo autorizado, 19:43 hora argentina**

El usuario autorizó el reemplazo y la actualización de URL con "si, adelante". Antes de ejecutarlo se revalidó propietario verificado en ambas propiedades de Search Console, ausencia de asociaciones en el destino y existencia del flujo `5469366293` / `G-WYG7FMEWEF`. GA4 habilitó las operaciones de administración y mostró ambas propiedades como elegibles. Se guardaron las pantallas textuales del vínculo anterior y su fecha original, 13 de agosto de 2026 a las 18:24:56.

Se eliminó únicamente la asociación con `https://coronabingo.now.sh/` y se creó la asociación de `https://coronabingo.com.ar/` con GA4 `385744187`, flujo `5469366293`. Google confirmó "Vinculación creada correctamente". Los detalles registran 23 de septiembre de 2026, 19:43:03. La tabla volvió a comprobarse tras navegar de nuevo y mantiene el destino y el ID correctos. Search Console también muestra la asociación con Coronabingo - GA4, sin solicitud pendiente.

Después se actualizó la URL descriptiva del flujo a `https://coronabingo.com.ar/`. Al volver a abrirlo se confirmó esa URL y se conservaron nombre, ID de flujo y medición `G-WYG7FMEWEF`. La propiedad antigua continúa accesible y verificada, con sus usuarios originales y sin asociación. No hizo falta activar rollback. No se modificaron etiquetas, Firebase, código ni DNS.

Ambos informes Search Console siguen disponibles en GA4 y filtrados al flujo Coronabingo - GA4. En el intervalo predeterminado 26 de agosto a 22 de septiembre, Consultas muestra cero clics e impresiones. Tráfico orgánico conserva métricas de Analytics, pero cero clics e impresiones de Search Console; esas métricas GA4 no demuestran importación. El intervalo es anterior a la incorporación del prefijo actual. En Search Console, Rendimiento indica "Se están procesando los datos; vuelve a comprobar esta sección mañana".

La primera revisión de Tiempo real posterior al cambio mostró dos usuarios en 30 minutos y cero en cinco minutos. Se solicitó al usuario otra recarga normal desde incógnito. Tras su confirmación, a las 19:48 ART, GA4 `385744187` mostró tres usuarios en 30 minutos, uno en cinco minutos y tres `page_view`, frente a dos en la revisión anterior. Al abrir `page_view` → `page_location`, los tres eventos correspondían a `https://coronabingo.com.ar/`. Queda confirmada recepción adicional después del reemplazo, compatible temporalmente con la recarga, sin atribuir identidad individual a los datos agregados. Evidencia: [comprobación posterior a la recarga](search-console-verification-evidence/after-reload-realtime.txt).

Estado: **configuración completada, importación pendiente de datos**. Evidencia en `search-console-verification-evidence/`: archivos `before-replacement-*`, `new-link-*` y `after-replacement-*`. Son registros de las pantallas, no un respaldo reimportable de informes. No se exportó un histórico nuevo de Search Console, que todavía no tiene datos disponibles.

Seguimiento registrado, sin programación automática:

- [ ] 25–26 de septiembre de 2026, después de las 19:43 ART: comprobar Rendimiento de Search Console y Consultas/Tráfico orgánico de GA4 con fechas desde el 23 de septiembre y días ya consolidados. Comparar Web, país y dispositivo equivalentes, y URLs del dominio actual. Si faltan datos en origen, mantener pendiente.
- [ ] 30 de septiembre de 2026: repetir si la importación todavía no pudo verificarse. Si hay datos elegibles en Search Console pero no llegan a GA4, revisar asociación, flujo, fechas y cobertura antes de diagnosticar un fallo.

La restitución documentada continúa disponible como procedimiento manual: quitar sólo el vínculo nuevo si corresponde, recrear `https://coronabingo.now.sh/` con `385744187` / `5469366293` y restituir la URL descriptiva anterior sólo si se busca esa configuración exacta. No recupera el historial administrativo de la asociación eliminada. No se ensayó ni se garantiza éxito sin revalidar permisos y disponibilidad.

**Recepción en Tiempo real, 19:33 hora argentina**

Después de que el usuario informó que había entrado desde incógnito, se consultó Tiempo real en ambas propiedades y se abrió `page_view` → `page_location`.

| Propiedad | Usuarios activos, últimos 5 minutos | `page_view`, últimos 30 minutos | URL recibida |
| --- | ---: | ---: | --- |
| `385744187`, destino elegido | 2 | 3 | Dos eventos en `https://coronabingo.com.ar/` y uno en una sala del mismo dominio |
| `226709381`, Firebase | 2 | 2 | Dos eventos en `https://coronabingo.com.ar/` |

La propiedad elegida recibe eventos actuales del dominio correcto. Junto con su único flujo web identificado como `5469366293` / `G-WYG7FMEWEF`, esto confirma la recepción reciente necesaria para elegir el destino de la asociación. Ambas propiedades siguen recibiendo tráfico; no se suman sus métricas ni se presume que representan públicos diferentes.

Los datos agregados coinciden temporalmente con la prueba del usuario, pero no permiten atribuirle una sesión individual. No se capturó la red de su ventana incógnita ni se demostró el recorrido exacto de la etiqueta heredada. Esa parte de la prueba propuesta permanece sin completar; ya no es necesaria para demostrar recepción reciente, que ahora se observa directamente en Analytics. La investigación de instrumentación sigue separada del reemplazo de Search Console. Tampoco se ha comprobado aún importación de datos de Search Console.

Evidencia: [Tiempo real del destino](search-console-verification-evidence/realtime-ga4.txt) y [Tiempo real de Firebase](search-console-verification-evidence/realtime-firebase.txt), con identificador de sala omitido. No se modificaron ajustes de las cuentas en esa comprobación. A esa hora, el reemplazo del vínculo seguía pendiente de autorización.

**Actualización tras la autorización, 19:28 hora argentina**

Se pulsó Continuar para `https://coronabingo.com.ar/` bajo la cuenta principal. Google confirmó "Propiedad verificada automáticamente" y enumeró "Archivo HTML, Google Analytics" como métodos. Ajustes confirma "Propietario verificado" y fecha de incorporación 23 de septiembre de 2026. No se modificó código ni DNS y no se publicaron tokens.

Asociaciones muestra "No hay ningún servicio asociado" y "No hay ninguna solicitud pendiente". La propiedad está disponible para una futura asociación. La portada de Search Console informa que se están procesando los datos y que se vuelva a comprobar mañana.

Se volvió a abrir la tabla de vinculaciones de GA4 `385744187`: continúa `https://coronabingo.now.sh/` con flujo `5469366293`, fecha de vinculación 13 de agosto de 2026. No se cambió la URL del flujo ni se inició el reemplazo de asociación.

La consola de etiquetas del flujo `G-WYG7FMEWEF`, etiqueta `GT-W6J4R92`, advierte "Está usando etiquetas Universal Analytics antiguas" y "Algunas de sus páginas no están etiquetadas". Esto aporta evidencia de configuración heredada, pero no sustituye la prueba de recepción de una visita concreta. No se modificaron esos ajustes.

A esa hora, la prueba controlada continuaba pendiente: en la consulta previa no se observaron solicitudes de recolección, y el navegador integrado alternativo no estaba disponible. Sólo estaba conectado Chrome. No se desactivaron extensiones ni se alteró consentimiento. La comprobación posterior de Tiempo real figura al principio de este documento.

Evidencia guardada en [search-console-verification-evidence](search-console-verification-evidence/), con confirmación de Google, ajustes, asociaciones, vínculo antiguo, diagnóstico de etiqueta y una captura de los ajustes verificados.

**Registro de la consulta inicial, anterior a la verificación**

| Comprobación | Resultado |
| --- | --- |
| Permisos en GA4 `385744187` | `durancristhian@gmail.com` figura como Administrador |
| Flujo elegido | `5469366293`, medición `G-WYG7FMEWEF`; actividad durante las últimas 48 horas |
| Tráfico del 16 al 22 de septiembre | 430 usuarios activos, 2.641 eventos; único hostname mostrado: `coronabingo.com.ar` |
| Tráfico del 22 de septiembre | 56 usuarios activos, 288 eventos; único hostname mostrado: `coronabingo.com.ar` |
| Search Console, cuenta principal | Selector muestra solamente `https://coronabingo.now.sh/` |
| Acceso directo a `https://coronabingo.com.ar/` en la cuenta principal | Search Console indica que no se puede acceder a esa propiedad y ofrece verificarla |
| Search Console, cuenta de desarrollo conectada | Selector no muestra propiedades |
| Portada de producción | Contiene etiqueta `google-site-verification` y carga explícitamente `UA-161408428-1` |
| Visita controlada en esta sesión | No se observaron solicitudes de recolección de Analytics; no se acredita recepción de esta visita concreta |

La recepción reciente del dominio en la propiedad elegida queda demostrada mediante informes procesados y estado del flujo. Sigue pendiente la prueba de red y Tiempo real prevista en el plan para explicar el envío actual hacia `G-WYG7FMEWEF`. La ausencia de solicitudes observadas en esta sesión no demuestra un fallo general de producción.

En Search Console no se acreditó propiedad verificada de `.com.ar`. Se consultaron las dos cuentas personales conectadas; no se investigó la cuenta de marca ni se puede excluir una propiedad administrada por otra persona. El mensaje de falta de acceso tampoco demuestra inexistencia global de la propiedad.

Se abrió Añadir propiedad → Añadir sitio web → Prefijo de la URL y se escribió `https://coronabingo.com.ar/`. No se pulsó Continuar. El formulario quedó preparado para una autorización específica. Continuar puede incorporar o crear la propiedad y disparar verificación automática, por lo que excede una consulta de lectura.

Después de autorizar esa acción, se intentará verificar con los mecanismos ya publicados. El resultado exigido es la confirmación de Google y, al abrir Ajustes → Verificación de la propiedad, el estado de propietario verificado. Luego se revisará Asociaciones para comprobar que la propiedad esté libre para vincular con `385744187`. Si hace falta DNS o publicar otro token, presentar esa dependencia antes de modificarla.

La visita controlada se completará desde un navegador que permita Analytics, observando una navegación normal y contrastando ID de medición, hostname y evento con Tiempo real. No se generarán eventos manuales ni clics orgánicos artificiales. Si sólo se confirma envío al ID de Firebase `G-PR7XZB4T8W`, se resolverá la diferencia antes de reemplazar el vínculo.

El vínculo antiguo debe permanecer mientras no se cierren las comprobaciones del [plan](2026-09-23-search-console-link-plan.md).

Fuentes: [flujo elegido](https://analytics.google.com/analytics/web/#/a161408428p385744187/admin/streams/table/5469366293), [Search Console del dominio actual](https://search.google.com/search-console?resource_id=https%3A%2F%2Fcoronabingo.com.ar%2F), [permisos exigidos por Google](https://support.google.com/analytics/answer/10737381?hl=es), [métodos de verificación](https://support.google.com/webmasters/answer/9008080?hl=es).
