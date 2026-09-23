# Plan de consentimiento europeo de Coronabingo

Fecha: 23 de septiembre de 2026. Estado: propuesta investigada y revisada; pendiente de aprobación para implementar.

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
