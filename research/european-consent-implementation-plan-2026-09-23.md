# Plan de consentimiento europeo de Coronabingo

Fecha de la investigación original: 23 de septiembre de 2026.

**Estado vigente al 24/09/2026:** alcance acordado con el usuario para implementación posterior; ejecución no iniciada. El [acuerdo de alcance](#acuerdo-de-alcance-para-implementación-posterior) registra lo aprobado y los pendientes. Esta solicitud autoriza dejarlo documentado; no iniciar la implementación ni publicar cambios.

**Revalidación del 23/09/2026, 23:50 ART:** Search Console y AdSense ya están vinculados con GA4 según sus registros de ejecución; producción ya carga G-WYG7FMEWEF directamente. La [revisión vigente y recuperación](#revalidación-tras-vincular-search-console-y-adsense-con-ga4) al final reemplaza los pasos pendientes que dependían de UA o de crear esas asociaciones. Los apartados originales se conservan como historial de la investigación. No ejecutar esos pasos antiguos de nuevo.

Se inspeccionaron el repositorio, HTML y bundles públicos, AdSense, Firebase y las dos propiedades de Analytics. No se modificó código de producto, no se guardaron ajustes ni se publicó el mensaje. Los únicos archivos creados para este trabajo son este plan, la investigación de fuentes y la evidencia de lectura.

Recomiendo usar la CMP de Google, incorporar consentimiento de Analytics y bloquear su medición hasta obtener permiso en Europa. La implementación debe conservar el juego cuando se rechaza. Publicar el borrador actual, por sí solo, no resuelve el problema.

## 1. Qué quedó comprobado

Las observaciones de consola están en [consoles.json](european-consent-2026-09-23-evidence/consoles.json). Las del sitio público están en [public-tags.json](european-consent-2026-09-23-evidence/public-tags.json). La [investigación oficial](european-consent-official-sources-2026-09.md) desarrolla las referencias y sus límites.

| Área | Estado observado | Consecuencia para el plan |
| --- | --- | --- |
| Otra CMP instalada por el proyecto | No se encontraron integraciones CMP en dependencias, código ni bundles iniciales públicos inspeccionados | Usar Google como opción inicial. Esta búsqueda no descarta inyección regional por un proveedor |
| Mensaje europeo | Un borrador para coronabingo.com.ar, última modificación 26/09/2022; 0 mensajes mostrados | El borrador no está publicado |
| Cobertura automática | "Permitir que Google maximice la cobertura de los mensajes" activado | Puede haber un aviso automático aunque el borrador no se publique |
| Botones del borrador | Consentir, No consentir y Gestionar opciones activados; cerrar sin consentir desactivado | Conservar las tres opciones principales y comprobar igualdad de visibilidad |
| Idiomas | Español predeterminado; 0 idiomas adicionales | Agregar inglés y revisar las variantes necesarias para Reino Unido |
| Política del sitio en AdSense | "Agregar Política de Privacidad", sin URL | Es un prerrequisito de publicación |
| Optimización del mensaje | Activada en el editor | Puede alternar mensaje estándar y mensaje limitado |
| Consent Mode | Finalidad publicitaria desactivada; finalidad Analytics no visible | Habilitar ambas posteriormente, en ese orden, verificando alcance de cuenta |
| Socios e interés legítimo | 198 socios frecuentes en configuración; preview menciona 210 partners; interés legítimo y selección predeterminada activados; 0 propósitos propios | Revisar lista efectiva y diferencias del preview antes de aprobar el texto |
| Otras propiedades de AdSense | El selector también muestra figuritas.vercel.app | Los cambios globales requieren considerar ese sitio; no modificarlo por accidente |
| Anuncios limitados | Permitidos, con cookies de detección de tráfico no válido | Rechazar no puede describirse automáticamente como "cero cookies" |
| Etiquetas públicas | AdSense y UA-161408428-1 en HTML; G-PR7XZB4T8W en bundle Firebase | Hay dos vías de medición que controlar |
| Política y revocación en el producto | No hay página de privacidad en las rutas del repo ni control de revocación en el footer | Crear ambos y hacerlos accesibles desde todas las pantallas |
| Terceros adicionales | Tweets se cargan en el footer; tutorial usa YouTube; Sentry se inicializa en producción si tiene DSN | El consentimiento de Google no acredita control de esos terceros |

La cobertura automática es una corrección importante respecto del diagnóstico inicial. Google documenta un respaldo que puede recoger consentimiento cuando falta una cadena TCF. Por tanto, la conclusión es "no se encontró una CMP externa y falta completar la integración", no "Europa nunca ve un mensaje". [Google, cobertura y optimización](https://support.google.com/adsense/answer/18189118).

### Las dos propiedades de Analytics

| Uso | Propiedad | Flujo | ID de medición | Evidencia |
| --- | --- | --- | --- | --- |
| Informes habituales "Coronabingo - GA4" | 385744187 | 5469366293 | G-WYG7FMEWEF | Consola; URL del flujo todavía coronabingo.now.sh; tráfico en últimas 48 h |
| Firebase, proyecto coronabingo-bf16f | 226709381 | 1861645851 | G-PR7XZB4T8W | Integración Firebase, consola del flujo y bundle público; tráfico en últimas 48 h |

La respuesta pública de Google para `gtag/js?id=UA-161408428-1` contiene G-WYG7FMEWEF. Esto respalda una relación entre el cargador heredado y el flujo habitual, pero no sustituye observar los envíos `collect` efectivos. No eliminar UA suponiendo que no hace nada y no cambiar MEASUREMENT_ID a ciegas.

Ambas propiedades muestran advertencias por señales de consentimiento de analítica y publicidad inactivas. Google Signals aparece sin activar. La pantalla de conservación muestra 2 meses para datos de eventos y 14 meses para datos de usuario en ambas. Firebase muestra además una cuenta de Google Ads vinculada. No se modificaron estas integraciones ni se auditó la configuración de esa cuenta Ads.

El SDK instalado expone `setAnalyticsCollectionEnabled`, pero no `setConsent` en sus tipos. No se debe copiar una solución para Firebase moderno dentro de `firebase@7.15.x` sin verificar compatibilidad.

### Límites de esta investigación

- No se probó una visita limpia con salida real desde España, Reino Unido o Suiza. La ausencia de banner en la sesión disponible no demuestra ausencia regional.
- No se inspeccionaron cookies ni almacenamiento del navegador personal. La prueba posterior deberá usar un entorno de QA aislado con inspección permitida.
- No se verificaron aceptación, rechazo o retirada sobre una implementación nueva, porque todavía no existe y el usuario pidió no ejecutarla.
- No se guardó ni publicó el borrador para probarlo. El preview web de Google requiere un mensaje publicado; el editor solo permite revisar presentación. [Google, pruebas de la CMP](https://developers.google.com/funding-choices/fc-api-docs).
- La cuota de España procede del informe local del 23/09: USD 1,84 de USD 5,35 entre 25/06 y 22/09/2026, aproximadamente 34,4%. No se rehízo el informe de ingresos en esta investigación. [Informe y período](2026-09-23-traffic-revenue-review.md).

## 2. Decisiones propuestas

| Decisión | Recomendación | Motivo y condición |
| --- | --- | --- |
| CMP | Google Privacy & messaging | Ya está disponible; evita agregar un segundo gestor sin necesidad |
| Región | EEE, Reino Unido y Suiza | No limitar el tratamiento a España ni inferir región por idioma |
| Analytics | Consent Mode básico | En región aplicable, no cargar ni enviar medición antes de permiso; el avanzado permite envíos sin cookies |
| Publicidad al rechazar | Permitir únicamente anuncios limitados elegibles, si su tratamiento y transparencia quedan validados | Respeta el modelo actual sin prometer ausencia total de almacenamiento; si no pasa las pruebas, detener publicidad afectada |
| Mensaje propio | Español e inglés, con aceptar, rechazar y gestionar visibles | El producto ya tiene ES/EN; rechazo tan accesible como aceptación |
| Optimización del mensaje propio | Desactivarla durante la primera puesta en marcha | Facilita pruebas reproducibles y evita mezclar optimización comercial con corrección |
| Cobertura automática de cuenta | Conservarla inicialmente | Protege también otro sitio; su variante automática/limitada debe incluirse en QA |
| Fuera de la región | Conservar comportamiento actual solo cuando se confirme que el consentimiento europeo no aplica | UNKNOWN, ausencia de API y timeout no conceden permiso |
| Propiedades GA4 | Conservar temporalmente ambas y controlar las dos | La consolidación de medición es otro cambio; no perder histórico ni eventos por resolver consentimiento |

Estas son decisiones para aprobar con el plan, no configuraciones ya aplicadas. El modo básico sacrifica medición de quienes rechazan. Esa caída de usuarios medidos será esperable y no prueba una caída real de uso. [Google, básico y avanzado](https://developers.google.com/tag-platform/security/concepts/consent-mode).

Los anuncios no personalizados siguen requiriendo consentimiento para cookies; no son el reemplazo automático tras rechazar. Los limitados son una categoría distinta y pueden usar almacenamiento antifraude. Antes de habilitar la entrega propuesta se debe documentar la base y transparencia aplicables, incluida la oposición a interés legítimo. [Google, NPA](https://support.google.com/adsense/answer/9007336), [Google, anuncios limitados](https://support.google.com/adsense/answer/14210870).

## 3. Secuencia de implementación posterior

### Fase 0. Cerrar los pocos datos que faltan

1. Confirmar nombre del responsable, canal público de privacidad y datos de contacto que se van a publicar. No asumir que el correo privado de Google debe aparecer en la política.
2. Acordar la recomendación de Analytics básico y el tratamiento de anuncios limitados. Si se requiere "rechazar = ningún anuncio", cambiar la arquitectura de carga de publicidad, incluyendo Auto ads, y verificar bootstrap CMP independiente.
3. Confirmar que figuritas.vercel.app sigue siendo un sitio utilizado. Inventariar sus mensajes antes de habilitar opciones que afectan la cuenta. Evitar cambios en cobertura o publicidad limitada de toda la cuenta dentro de esta entrega.
4. Coordinar con cualquier trabajo de vinculación AdSense/GA4: ambos deben usar el mapa de propiedades anterior. Elegir una propiedad única no es un requisito para bloquear correctamente las dos.
5. Definir un subdominio de QA controlado y un navegador aislado con salida europea para la aceptación regional. Un preview aleatorio de Vercel no hereda necesariamente el mensaje del dominio principal.

Salida: decisiones registradas y lista exacta de sitios, etiquetas y destinatarios. No es necesario esperar estas respuestas para preparar el código local; sí para publicar texto legal y cambiar la cuenta.

### Fase 1. Política de privacidad y cookies

Crear una página pública en ES y EN, por ejemplo `/privacy` y `/en/privacy`, y sus enlaces en el footer. Debe abrirse sin aceptar cookies, sin anuncios y sin embeds externos. La CMP debe seguir siendo accesible desde allí.

El texto debe cubrir, contrastado contra el código y la configuración real:

- Responsable y canal para ejercer derechos o hacer consultas.
- Datos necesarios del juego en Firebase/Firestore, nombres de salas/jugadores y persistencia local de cartones y preferencias.
- Medición con Google Analytics, las finalidades publicitarias de AdSense, proveedores y tecnologías utilizadas.
- Cookies de consentimiento, medición, publicidad y mecanismos antifraude que realmente permanezcan habilitados. Completar nombres y duraciones con un inventario de QA; no inventarlos a partir de ejemplos.
- Servicios de alojamiento y errores, transferencias, destinatarios, conservación y procedimiento de eliminación. Los valores observados de GA4 no describen la retención de Firestore ni todos los datos agregados.
- Cómo aceptar, rechazar, gestionar y retirar la elección, y qué procesamiento necesario puede continuar.
- Enlaces a la explicación de Google sobre datos en sitios asociados y a la gestión de preferencias.

Registrar la URL real de privacidad para coronabingo.com.ar en AdSense después de que exista y responda 200. La URL configurada se reutiliza en sus mensajes. [Google, información obligatoria](https://support.google.com/publisherpolicies/answer/10437794), [Google, política del sitio](https://support.google.com/adsense/answer/10961370).

No enviar nombres de sala como Analytics `description`: hoy `components/CreateRoom.tsx` lo hace. Conservar el evento `room_created` con parámetros no personales. Normalizar también `page_location`, `page_path`, referencias y parámetros de rutas de sala/jugador para evitar transmitir identificadores y enlaces privados del juego. Cambiar solo `page_path` no basta si otra propiedad sigue enviando la URL completa.

### Fase 2. Separar el juego de la medición

| Archivo o área | Cambio previsto |
| --- | --- |
| `pages/_document.tsx` | Defaults de consentimiento antes de cualquier config/event; separar bootstrap CMP de carga de Analytics; revisar script AdSense actual |
| `utils/firebase.ts` | Mantener Firestore operativo; quitar inicialización inmediata de Analytics al importar |
| Nuevo módulo de Analytics | Inicialización diferida, una vez; control de colección; envío por destino; descarte de eventos sin permiso |
| `contexts/Analytics.tsx` | Mantener contrato de `useAnalytics`; el wrapper no lanza errores ni acumula eventos mientras está bloqueado |
| `utils/gtag.ts`, `pages/_app.tsx` | Aplicar el mismo control a pageviews y navegación cliente; evitar doble registro al aceptar o cambiar idioma |
| Nuevo módulo/contexto de consentimiento | Estado inicial, región aplicable, finalidades separadas, lectura CMP y transiciones |
| `components/Footer.tsx` | Enlaces persistentes de privacidad y cambio de elección |
| `components/Ads.tsx`, `components/Layout.tsx` | Esperar disponibilidad del estado publicitario y respetar TCF; excluir anuncios de la política; probar también Auto ads |
| `components/CreateRoom.tsx` | Quitar texto libre de eventos de Analytics |
| `locales/es`, `locales/en`, `i18n.json` | Textos y rutas localizados |

Leer las guías correspondientes de `node_modules/next/dist/docs/` antes de escribir código, como exige `AGENTS.md`. El proyecto usa Pages Router. No copiar una integración de App Router sin adaptación.

Primera opción técnica: conservar el SDK Firebase instalado para Firestore y diferir su Analytics, usando la integración web de Consent Mode y el control de colección existente. Separar los defaults tempranos del SDK. No convertir esta tarea en una migración completa de Firebase.

El cargador UA se reemplazará por el destino GA4 explícito G-WYG7FMEWEF solo después de confirmar equivalencia con red/Tag Assistant. Firebase conserva G-PR7XZB4T8W. Debe haber un único control de consentimiento para ambos, aunque temporalmente existan dos destinos. Documentar qué eventos van a cada uno y comprobar un `page_view` por navegación y por destino previsto. Si la compatibilidad del SDK impide ese control, resolverlo con un cambio acotado de la capa Analytics antes de publicar.

Coordinar este cambio con el [plan de vinculación AdSense/GA4](2026-09-23-adsense-ga4-link-plan.md), que también propone carga directa a G-WYG7FMEWEF. Implementar esa sustitución una sola vez y revalidar el código si el otro trabajo se ejecutó primero. La disponibilidad de Analytics para conciliar ingresos queda subordinada al consentimiento: no cargarlo antes de tiempo para igualar AdSense. Los anuncios limitados sin medición consentida pueden explicar diferencias legítimas entre informes.

No basta con aplicar `setAnalyticsCollectionEnabled(false)` después de inicializar: podría llegar tarde para la primera solicitud. No reproducir tras aceptar eventos generados durante el rechazo. Un error de medición no puede hacer fallar la creación de una sala.

### Fase 3. Estados y coordinación con Google

Separar "decisión pendiente", "rechazo", "aceptación parcial", "aceptación total", "no aplica" y "error de CMP". Mantener por separado `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization`.

1. En cada carga de documento, establecer un estado seguro antes de las etiquetas de medición. En región todavía desconocida, mantener Analytics bloqueado.
2. Cargar la CMP sin esperar a que ella misma conceda permiso. Evitar la dependencia circular de bloquear el script AdSense que sirve el mensaje.
3. Usar las APIs oficiales de Google para leer las finalidades y TCF para observar decisiones y cambios. No deducir permiso de Analytics de un propósito publicitario o de la existencia de una cookie.
4. La CMP mantiene la elección; el código gobierna cuándo arrancan o se detienen las etiquetas. Evitar dos módulos que escriban valores de consentimiento contradictorios.
5. Para una región no aplicable confirmada, activar la política prevista para ese territorio. `NOT_CONFIGURED` es un error si se esperaba Analytics; no convertirlo en aceptación. Probar específicamente Argentina.
6. Si la CMP falla o no responde, mantener bloqueado lo opcional. El juego y la política siguen disponibles. Un temporizador no concede permiso.

La API expone `CONSENT_MODE_DATA_READY` y `getGoogleConsentModeValues`. El listener TCF debe contemplar cambios posteriores, no solo el primer callback. `CONSENT_API_READY` solo informa disponibilidad de API. La documentación ampliada y la comprobación de los estados están en la nota de fuentes. [Google, API](https://developers.google.com/funding-choices/fc-api-docs), [IAB, CMP API](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md).

Antes de cerrar el diseño, hacer una prueba técnica acotada de aceptación parcial: comprobar qué controles ofrece efectivamente Google al habilitar Analytics y qué devuelve cada finalidad. Las combinaciones de la matriz son requisitos propuestos, no prestaciones ya comprobadas del borrador. Si no pueden expresarse con Google CMP, decidir entre adaptar las finalidades explicadas al usuario o elegir otra CMP certificada que las soporte; no simular granularidad con un booleano propio.

### Fase 4. Preparar la consola y el mensaje

1. Guardar evidencia previa de sitios, switches, socios, idiomas, preview y publicación. La evidencia actual sirve como punto de comparación, pero volver a leer antes del cambio.
2. Completar la política del sitio; español por defecto y traducciones de inglés. Comprobar selección por idioma del navegador y fallback. No asumir que la CMP sigue el idioma elegido dentro de Next.js.
3. Mantener aceptar, rechazar y gestionar en la primera capa, con igual facilidad de acceso. Probar móvil y teclado. La AEPD requiere rechazo y aceptación al mismo nivel y con la misma visibilidad. [AEPD, cookies](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos).
4. Habilitar Consent Mode publicitario y luego Analytics. La segunda opción solo aparece tras activar la primera. Registrar que son cambios que alcanzan los mensajes europeos de la cuenta, incluido el posible impacto en figuritas.vercel.app. [Google, ajustes](https://support.google.com/adsense/answer/16053245).
5. Desactivar optimización del mensaje propio para la primera entrega. Conservar inicialmente cobertura automática global y probar su fallback, que puede seguir siendo optimizado. Si impide garantizar los criterios acordados, resolver ese comportamiento antes del lanzamiento, con un cambio explícito que contemple ambos sitios.
6. Revisar proveedores, finalidades propias e interés legítimo. Resolver la diferencia 198/210 y el texto de geolocalización del preview. No autorizar propósitos solo para mejorar ingresos ni afirmar que el juego necesita geolocalización precisa.
7. El editor muestra "Original: No hay mensajes" y "Variación: Borrador", junto con un control de experimento. Antes de publicar, confirmar qué entidad se está editando y que el resultado será un mensaje activo normal. No pulsar "Descartar experimento" sin evaluar qué elimina.

### Fase 5. Cambiar la elección y cubrir otros terceros

El footer y la política tendrán "Privacidad y cookies" y una acción para cambiar la elección, presente también en salas y vistas de error. Usar el mecanismo oficial de revocación de Google, con estado comprensible mientras carga o si no está disponible. La API no disponible nunca debe producir una aceptación local ficticia.

Al retirar consentimiento, detener inmediatamente nuevas emisiones propias, deshabilitar la colección ya iniciada y actualizar las señales antes de otra navegación. Verificar también eventos automáticos y de cierre de página en ambos destinos. Eliminar un `<script>` no detiene el SDK. Comprobar cookies propias existentes y futuras escrituras en QA; no borrar preferencias o cartones necesarios. No prometer eliminación de histórico de Google o cookies de terceros inaccesibles al sitio.

Para el alcance inicial recomiendo reemplazar los tweets incrustados por contenido/enlaces estáticos y ofrecer el tutorial mediante enlace externo. Así no hace falta inventar permisos de X/YouTube a partir de la aceptación de anuncios. Si se conservan embeds, requieren una elección específica y bloqueo probado. Inventariar Sentry y minimizar datos; decidir su tratamiento como diagnóstico necesario o bloquearlo si no se justifica. Esa decisión debe coincidir con la política.

## 4. Pruebas y criterios de aceptación

No dar por finalizada la tarea por ver el banner. Se necesitan pruebas de interfaz, orden de inicialización, señales, solicitudes y persistencia en un navegador de QA aislado.

| Caso | Resultado obligatorio |
| --- | --- |
| España, primera visita sin elección | Mensaje correcto; ninguna solicitud de medición GA en modo básico; publicidad solo conforme a la política limitada validada |
| Aceptar todo | Estados concedidos correspondientes; Analytics arranca una vez; anuncios con señales válidas |
| Rechazar todo | Analytics bloqueado en ambos destinos; sin personalización; TCF y comportamiento de anuncios coherentes con rechazo/oposición |
| Solo analítica | Medición permitida; publicidad respeta su denegación |
| Solo publicidad | Ningún evento GA por habilitar anuncios |
| Aceptar y luego rechazar | Se detienen envíos posteriores en la misma página, navegación cliente y recarga; no alcanza con el siguiente reload |
| Rechazar y luego aceptar | Arranque único; no se reenvía actividad anterior sin permiso |
| Reabrir y cancelar sin guardar | No aparece un permiso nuevo; comprobar semántica real de revocación de Google y estado seguro |
| Volver a visitar | Decisión restaurada; sin instante inicial de medición concedida |
| CMP lenta, bloqueada o con error | Juego utilizable; medición bloqueada; ningún timeout activa etiquetas |
| Reino Unido, Suiza y otro país EEE | Mensaje y decisiones efectivos, además de España |
| Argentina | No queda bloqueada la medición indefinidamente por esperar un mensaje que no corresponde |
| ES/EN, navegador en otro idioma | Traducción y fallback correctos, incluida política |
| Móvil 375 px y escritorio | Botones visibles, foco y teclado, sin superposición con anuncios o modales del juego |
| Salas, anfitrión, jugador y errores | Privacidad accesible; aceptar/rechazar no rompe juego ni persistencia necesaria |
| Auto ads, anuncio manual y fallback limitado | Los tres caminos respetan las decisiones; bloquear `<Ads />` solo no acredita Auto ads |
| Figuritas | No se deteriora su consentimiento por los cambios de cuenta compartidos |

Guardar para cada caso región, navegador, versión de código, hora, capturas, estado TCF, señales y solicitudes relevantes sin identificadores personales. Comparar `collect`, parámetros de consentimiento y solicitudes publicitarias. No clicar anuncios reales. Usar Tag Assistant como evidencia complementaria, no como único veredicto. [Google, depuración](https://developers.google.com/tag-platform/security/guides/consent-debugging).

Pruebas de código concretas: transición pendiente/rechazo/aceptación/revocación; no emisión antes del permiso; una sola inicialización; error CMP; independencia de Firestore; ausencia de repetición de eventos al consentir. Ejecutar `npm run validate-locales`, `npm run lint:check` y `npm run build`. Usar el comando sin autofix para verificar. No se corrieron ahora porque no se implementó código.

## 5. Publicación y seguimiento

1. Preparar y revisar política, integración y pruebas locales con CMP simulada. Esa simulación valida el adaptador, no el servicio real de Google.
2. Desplegar en un subdominio controlado con configuración de QA explícita. Revisar herencia de mensajes del dominio. Usar datos de juego de prueba, sin registrar actividad de QA como tráfico real cuando pueda evitarse. El subdominio aísla el mensaje de prueba, pero no convierte Consent Mode en un ajuste por sitio.
3. Antes de activar los switches globales para la prueba real, desplegar política y código con bloqueo seguro en Coronabingo y verificar el impacto previsto en el otro sitio. Registrar esta ventana de cambio: las pruebas reales de Analytics requieren habilitar opciones de cuenta que también alcanzan producción. No llamarla prueba totalmente aislada. Si ese impacto no es aceptable, necesitar un entorno de cuenta de pruebas autorizado o pasar a la alternativa de lanzamiento controlado.
4. Publicar el mensaje únicamente para el entorno de prueba aprobado y realizar la matriz real. Luego publicar el mensaje de producción tras confirmar los criterios y los defaults seguros. Un dominio temporal de Vercel y el preview del editor no bastan. Si Google no permite el aislamiento necesario, documentar una ventana de lanzamiento controlada como alternativa, con publicidad y medición desactivables, antes de autorizarla.
5. Google indica hasta 10 minutos para propagar publicación/despublicación. Usar los parámetros de prueba oficiales solo después de publicar. Una prueba forzada no acredita geolocalización; completar visita real europea. [Google, publicación](https://support.google.com/adsense/answer/13651178), [Google, dominios y subsitios](https://support.google.com/adsense/answer/14113511).
6. Verificar inmediatamente rechazo, aceptación y retirada en producción. Al día siguiente y a los 7 días revisar diagnóstico de ambas propiedades, mensajes mostrados, errores TCF, anuncios y uso del juego. Evaluar ingresos a 28 días por país/dispositivo, con la misma definición y período comparable.

El rollback debe mantener política y control de privacidad, y detener medición/publicidad opcional ante un fallo. Preparar antes del despliegue una forma de apagar por separado medición y publicidad, conservando la CMP. No restaurar como rollback el código que medía antes de la elección. Despublicar el mensaje solo no corrige un fallo de privacidad y la cobertura automática podría seguir activa.

Un descenso en GA4 tras bloquear usuarios que rechazan es un cambio de medición. No prometer recuperación de ingresos ni atribuir cualquier variación al consentimiento con este volumen.

## 6. Segunda revisión del plan

La revisión posterior a la investigación corrigió estos puntos de una propuesta inicial demasiado simple:

| Hueco detectado | Mejora incorporada |
| --- | --- |
| Borrador interpretado como ausencia de CMP | Separación entre mensaje propio y cobertura automática |
| Analytics tratado como un solo flujo | Mapa de las dos propiedades y vínculo observado del cargador UA |
| Publicar banner considerado suficiente | Bloqueo temprano, control de eventos y revocación sin recarga |
| Rechazo equiparado a cero cookies o anuncios NPA | Decisión explícita sobre anuncios limitados y almacenamiento antifraude |
| Control del componente manual considerado control de todos los anuncios | Pruebas separadas para Auto ads y fallback |
| Cambios de cuenta asumidos exclusivos de Coronabingo | Inclusión de figuritas.vercel.app y alcance de Consent Mode |
| QA prometido antes de publicar cualquier mensaje | Separación entre simulación, mensaje publicado en QA y aceptación regional real |
| Subdominio confundido con aislamiento de cuenta | Código seguro antes de activar switches globales y ventana explícita de cambio |
| Firebase moderno asumido compatible | Verificación de la API instalada y alternativa acotada de Analytics |
| Granularidad de Analytics dada por comprobada | Prueba técnica previa de los controles reales y alternativa si no expresan las elecciones |
| Europa resuelta con defaults globales permanentes | Tratamiento confirmado de región no aplicable y prueba de Argentina |
| Otros terceros omitidos | Tweets, tutorial, Sentry y datos libres de eventos incorporados al inventario |
| Rollback limitado a despublicar | Corte seguro de etiquetas sin volver a medición sin permiso |
| Plan de vinculación con cambios superpuestos | Sustitución UA compartida una sola vez; consentimiento prevalece sobre conciliación de ingresos |

La implementación queda lista para dividir en tres entregas: código/política y pruebas locales; integración real en QA; configuración/publicación y aceptación de producción. La aprobación futura debe abarcar explícitamente los cambios de cuenta identificados. Este documento no autoriza ni ejecuta esas entregas.

## Comments

### Revalidación tras vincular Search Console y AdSense con GA4

23 de septiembre de 2026, 23:50 ART. Solicitada por el usuario antes de proceder, con explicación clara de rollback. Sigue siendo una revisión de propuesta: no autoriza implementación, despliegue, cambios en cuentas ni un ensayo de rollback de producción.

**Veredicto:** el objetivo y la elección de Google CMP siguen teniendo sentido. El plan requiere actualizar su punto de partida y hacer concreta la recuperación antes de publicarlo. Las vinculaciones mejoran los informes; no recogen ni aplican el consentimiento del visitante. No hay que esperar a que aparezcan ingresos o datos de Search Console para preparar esta corrección.

#### Estado actualizado y alcance de esta revisión

Base inspeccionada: `/Users/durancristhian/Repos/coronabingo`, rama `main`, commit `6ddd4d2`. Checkout inicialmente limpio. Se consultaron código, registros de implementación, HTML público actual y documentación oficial. No se volvieron a abrir las consolas autenticadas en esta revisión: los estados de cuenta proceden de los registros citados y de la confirmación del usuario, y deben releerse antes de ejecutar cambios.

| Elemento | Evidencia disponible | Qué cambia en el plan |
| --- | --- | --- |
| Search Console | Registro del reemplazo a las 19:43 ART: `https://coronabingo.com.ar/` asociado a GA4 `385744187`, flujo `5469366293`; URL del flujo actualizada | Conservar asociación y métodos de verificación; no recrear ni deshacer este trabajo |
| AdSense y GA4 | Registro del vínculo a las 23:26:46 ART: `pub-6231280485856921` con `385744187` | Conservar el vínculo; no eliminarlo como respuesta a un fallo de consentimiento |
| Etiqueta principal | HTML público consultado ahora carga/configura `G-WYG7FMEWEF`, sin cargador UA | Retirar la migración UA de esta tarea; adaptar el código ya corregido |
| Recepción de Analytics | Evidencia final del trabajo anterior registra HTTP 204 de ambas propiedades y navegación ES/EN | Reutilizar como línea de base; no presentarla como prueba de consentimiento |
| Inicio de medición | `_document.tsx` configura GA antes de los anuncios; `utils/firebase.ts` todavía inicia Analytics al importar en navegador | Interponer consentimiento antes de ambos arranques |
| Informes nuevos | Ingresos/impresiones AdSense en GA4 e importación Search Console aún pendientes en sus registros | Seguirlos por separado; no condicionar el consentimiento a un informe positivo |

Fuentes locales: [Search Console ejecutado](2026-09-23-search-console-preflight.md), [AdSense/GA4 ejecutado](2026-09-23-adsense-ga4-link-plan.md#ejecución-autorizada-y-seguimiento), [recepción en producción](2026-09-23-adsense-ga4-final-verification.json).

La configuración de CMP, cobertura automática, Figuritas y anuncios limitados sigue siendo la observada en la auditoría inicial, no una lectura nueva. El HTML actual no contiene un default de Consent Mode; eso no descarta mensajes automáticos inyectados por Google.

#### Alcance ajustado

1. Mantener Google CMP, ES/EN, política pública, rechazo accesible y revocación.
2. Controlar las dos vías de Analytics con modo básico. Conservar las correcciones recientes de título, referencia, navegación y ausencia de duplicados. No volver a UA ni unificar propiedades en esta entrega.
3. Separar Firestore de Analytics sin cambiar reglas, datos de salas, proyecto Firebase, facturación ni autenticación.
4. Verificar anuncios manuales, Auto ads y mensaje automático. La opción de anuncios limitados continúa pendiente de aprobación de su tratamiento; no prometer rechazo sin cookies si permanecen cookies antifraude.
5. Mantener la revisión de terceros, pero decidir expresamente si se conservan los embeds con un control propio o se sustituyen por enlaces. No convertir esa alternativa del plan en una eliminación de funciones ya aprobada.
6. Registrar la hora del cambio de consentimiento en el seguimiento de GA4. La reducción de medición de quienes rechazan puede afectar la conciliación de ingresos; no activar Analytics sin permiso para conseguir números iguales.

Antes de publicar siguen faltando: contacto público de privacidad, comportamiento al rechazar publicidad, revisión del alcance sobre Figuritas y prueba real del mensaje y de la granularidad de Analytics. No son razones para rehacer Search Console ni las vinculaciones GA4.

#### Qué significa poder volver atrás

Hay recuperación posible, pero son operaciones separadas. No existe un único botón que devuelva sitio, cuentas, navegadores y datos a su estado anterior.

| Parte | Recuperación prevista | Límite |
| --- | --- | --- |
| Código publicado | Volver a un despliegue de recuperación verificado o publicar una corrección/reversión acotada | Volver al código anterior a consentimiento reactivaría el problema de medición inicial |
| Mensaje y ajustes AdSense | Restaurar únicamente valores modificados, a partir de un registro previo | Vercel no revierte AdSense; despublicar puede tardar hasta 10 minutos y deja actuar defaults/cobertura automática |
| Variables de entorno | Restaurar solo variables nuevas o modificadas de esta tarea, en su ámbito exacto | Cambiar una variable compilada no modifica el JavaScript ya publicado ni las pestañas abiertas |
| Search Console, vínculos GA4 y Firebase | Preservarlos durante la recuperación | No son parte del cambio de consentimiento y no necesitan deshacerse |
| Decisiones de visitantes | Conservar rechazo y elección guardada; volver a pedir permiso si no puede interpretarse | No convertir una decisión desconocida o una versión antigua en aceptación |
| Eventos o ingresos del intervalo | Registrar la incidencia y retomar la medición permitida al corregirla | No reconstruye eventos no enviados ni borra automáticamente los ya recogidos; los ingresos perdidos no se recuperan con rollback |

Vercel permite recuperar un despliegue anterior. En Hobby, el rollback inmediato alcanza el despliegue anterior elegible; un preview no publicado no basta. El registro de la tarea GA4 identifica Hobby, pero plan y elegibilidad deben comprobarse de nuevo al preparar el lanzamiento. El rollback usa el build anterior y no incorpora variables cambiadas después; además suspende la asignación automática de dominios hasta promover una versión nuevamente. [Vercel, Instant Rollback](https://vercel.com/docs/instant-rollback).

Google permite despublicar el mensaje, con hasta 10 minutos de propagación. Eso no garantiza detener todo aviso ni toda publicidad: vuelve a aplicar la configuración del sistema publicitario. [Google, publicar y despublicar](https://support.google.com/adsense/answer/13651178?hl=en). Los switches de Consent Mode afectan a los sitios/apps con mensajes europeos de la cuenta, así que su recuperación debe contemplar ese alcance. [Google, alcance de Consent Mode](https://support.google.com/adsense/answer/16053245?hl=en).

#### Recuperación que recomiendo preparar y probar

1. Construir y validar una versión de recuperación que conserve el juego y la política, con Analytics y publicidad opcional detenidos. No basta con ocultar el componente manual: debe impedir también Auto ads. Si la CMP necesita el script publicitario, comprobar un bootstrap independiente; si no puede garantizarse, la recuperación puede dejar temporalmente esa CMP sin cargar, sin ejecutar etiquetas opcionales ni conceder permiso, con información de privacidad accesible.
2. Guardar el commit, despliegue, configuración y resultados de esa versión. Probar en entorno de desarrollo la creación, unión y sincronización de una sala, recarga, y ausencia de solicitudes de Analytics/publicidad. La recuperación no debe requerir modificar Firestore ni borrar preferencias.
3. Si se quiere rollback inmediato en Hobby, hacer que esa versión segura sea la anterior elegible de producción y verificarlo antes de publicar la versión completa. Esto implica una ventana explícita sin medición/anuncios durante la preparación. Coordinar otras publicaciones para que no desplacen ese punto. No ejecutar esa ventana sin autorización de despliegue.
4. Si no se acepta esa ventana o el despliegue deja de ser elegible, mantener una corrección de recuperación lista para publicar. Esa alternativa requiere despliegue y verificación; no debe llamarse instantánea. Un flag compilado en Next.js tampoco es un interruptor remoto inmediato.
5. Ante una incidencia: priorizar recuperación si se rompe el juego, si se envía Analytics tras rechazar/retirar, o si anuncios y preferencias dejan de corresponderse. Una reducción esperable de usuarios medidos o un informe todavía procesándose no dispara rollback por sí sola.
6. Activar la recuperación del sitio y después corregir o restaurar exclusivamente los ajustes de cuenta afectados. No despublicar primero y dejar el sitio midiendo sin controles. Guardar los estados previos y posteriores, incluida cobertura automática; no desactivar globalmente Consent Mode sin considerar Figuritas.
7. Comprobar el dominio público, juego, ausencia de envíos opcionales y asociaciones preservadas. Las pestañas abiertas pueden seguir ejecutando la versión anterior hasta recargar: registrar este límite, comprobar retirada también en una pestaña abierta y no afirmar que el cambio de despliegue detuvo retroactivamente todos los clientes.
8. Registrar intervalo, causa, pérdida de medición y resultado. Corregir en una rama aislada y volver a pasar aceptación antes de reactivar. Si se usó Instant Rollback, restablecer deliberadamente las publicaciones normales cuando la versión corregida esté verificada.

La futura autorización de publicación debe identificar quién ejecuta esta recuperación y si incluye esos pasos de emergencia. La revisión actual no ejecuta ni ensaya un rollback de producción. **Hay un procedimiento viable; todavía no hay un rollback de consentimiento implementado y probado.**

#### Orden recomendado para seguir

Preparación local en rama/worktree propio desde `origin/main` actualizado; prueba de consentimiento y recuperación; revisión del resultado; luego ventana de publicación y ajustes Google. Revalidar scripts y suite de pruebas al iniciar: hay trabajo concurrente de Playwright y su plan no debe contarse como una suite ya disponible.

La preparación debe producir un diff revisable, pruebas ES/EN, evidencia de ambos destinos y una recuperación reproducible. La configuración/publicación posterior requiere cubrir el alcance de cuenta definido. No hace falta rehacer las vinculaciones existentes.

Validación de esta revisión documental: contenido contrastado con `6ddd4d2`, scripts y evidencia enlazada; HTML de producción leído de nuevo; referencias oficiales de rollback y propagación consultadas; enlaces locales y `git diff --check` verificados. No se ejecutaron pruebas de aplicación porque no cambió código. Documento sin commit y sin cambios de consola.

### Acuerdo de alcance para implementación posterior

Fecha: 24/09/2026. El usuario acuerda el siguiente alcance y solicita dejarlo documentado para implementarlo luego. Este acuerdo actualiza el estado de la propuesta; las observaciones anteriores se conservan como evidencia histórica y deberán revalidarse al iniciar el trabajo.

#### Cambios acordados

1. **Política de privacidad:** crearla en español e inglés y enlazarla desde el sitio. Describir el uso efectivo de Analytics, AdSense y las preferencias de consentimiento.
2. **Mensaje de Google:** completar el mensaje europeo con la política, ambos idiomas y opciones visibles para aceptar, rechazar y gestionar preferencias. Antes de activarlo, volver a comprobar si existe otra solución de consentimiento y evitar avisos o controles duplicados.
3. **Etiquetas y decisión del visitante:** hacer que Analytics espere el permiso correspondiente donde se exige consentimiento y que AdSense respete por separado los permisos publicitarios. Evaluar y probar anuncios limitados cuando sean admisibles; no prometer que siempre habrá anuncios tras un rechazo.
4. **Cambio de elección:** agregar un acceso permanente «Privacidad y cookies» que permita revisar o retirar preferencias y actualizar el comportamiento de las etiquetas.
5. **Pruebas y recuperación:** verificar aceptar, rechazar, consentimiento parcial, cambiar la elección y recargar; comprobar solicitudes y almacenamiento, además de la apariencia del mensaje. Cubrir español/inglés y móvil/escritorio, y asegurar que el bingo funciona al rechazar. Preparar y verificar la recuperación descrita en la revisión anterior antes de publicar.

**Separación acordada:** Analytics sirve para medir y no paga ingresos publicitarios. Rechazar únicamente Analytics no debe apagar automáticamente AdSense. Rechazar permisos publicitarios sí puede cambiar los anuncios disponibles y los ingresos. La recuperación de emergencia que detiene temporalmente ambas etiquetas es un procedimiento excepcional, no el comportamiento normal ante un rechazo.

#### Secuencia y límites

Cuando el usuario retome y autorice la ejecución, preparar primero el código y las pruebas en una rama y worktree propios, sin publicar ni cambiar consolas. Presentar el resultado y las comprobaciones pendientes antes de la activación en producción. Las pruebas que dependan de publicar el mensaje se completarán en esa etapa autorizada; no se presentarán como verificadas con pruebas locales solamente.

Conservar las vinculaciones existentes de Search Console, AdSense y GA4. Antes de cambiar ajustes Google, revalidar el alcance de cuenta y su posible efecto sobre Figuritas. Este acuerdo no autoriza cambios en otros sitios, retirada de integraciones ajenas al alcance ni una ventana de producción sin anuncios.

La publicación y los cambios de consola quedan para una autorización posterior sobre el resultado concreto. El procedimiento de recuperación debe quedar probado y con un responsable definido; revertir el sitio no revierte automáticamente los ajustes de Google ni recupera datos o ingresos perdidos.

#### Pendientes para implementar

- Nombre o razón social y correo que el usuario quiere publicar como contacto de privacidad.
- Revalidación del estado técnico y de las consolas al iniciar, incluidos ambos destinos de Analytics, la CMP efectiva y la elegibilidad de anuncios limitados.
- Elección y prueba del mecanismo de recuperación antes de autorizar la publicación.

Registro de este acuerdo: actualización documental únicamente. No se implementó código, no se modificaron consolas y no se publicó el mensaje.
