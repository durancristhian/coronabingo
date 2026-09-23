# Fuentes oficiales para el plan de consentimiento europeo

Investigación realizada el 23 de septiembre de 2026. Este documento aporta documentación y recomendaciones al plan. No acredita configuración de las cuentas ni pruebas del sitio, y no ejecuta cambios de producto, publicación ni consola.

## Conclusiones que cambian el diseño

La CMP de Google puede recoger consentimiento para publicidad y Analytics. En Privacy & messaging hay dos opciones distintas. Primero se habilita Consent mode for advertising purposes; después aparece Consent mode for analytics purposes. La segunda incorpora la finalidad analytics_storage. Estos ajustes alcanzan todos los sitios y apps con mensajes europeos configurados en esa cuenta. Revisar ese alcance antes de cambiarlos. [Google, configuración de Consent Mode](https://support.google.com/adsense/answer/16053245).

Un borrador antiguo con cero mensajes no demuestra por sí solo ausencia de CMP en producción. Google anunció el 11 de septiembre de 2026 un control de cuenta, Maximize message coverage, que puede crear mensajes y recoger consentimiento de respaldo cuando faltan señales TCF. En muchos casos tanto este control como Optimize my consent message vienen activados. El respaldo utiliza optimización aunque un mensaje particular la tenga desactivada. Son dos controles que deben incorporarse al inventario de consola. [Google, anuncio de cobertura y optimización](https://support.google.com/adsense/answer/18189118).

Consent Mode y el consentimiento publicitario de AdSense necesitan pruebas separadas. Google documenta Consent Mode para Google tag, Analytics/Firebase, Google Ads y Floodlight. La CMP publicitaria transmite preferencias TCF a proveedores. No alcanza con ver cuatro valores granted/denied en dataLayer para dar por probado AdSense. [Google, productos y tipos de Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Google, mensajes europeos](https://support.google.com/adsense/answer/10961068).

## Requisitos de mensaje y política

Google exige una CMP certificada e integrada con TCF en su política publicitaria para EEE, Reino Unido y Suiza; su CMP es una opción certificada. La documentación actual de mensajes europeos indica compatibilidad con TCF v2.3. No diseñar una integración nueva alrededor de TCF 2.1 ni limitar cobertura a España. [Google, requisitos de CMP](https://support.google.com/adsense/answer/13554116), [Google, mensajes europeos](https://support.google.com/adsense/answer/10961068).

La AEPD exige ofrecer rechazo y aceptación simultáneamente, al mismo nivel y con la misma visibilidad. Recomiendo activar No consentir en la primera pantalla para toda la región objetivo, junto con Consentir y Gestionar opciones, y comprobar tamaño, contraste, teclado y móvil. La opción de rechazo configurable de Google puede restringirse por país, por eso hay que inspeccionar también esa selección. [AEPD, cookies](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos), [Google, creación del mensaje](https://support.google.com/adsense/answer/10960768).

El idioma de la CMP se selecciona según el dispositivo y los idiomas habilitados, con un idioma por defecto cuando no hay coincidencia. No asumir sincronización con el selector de idioma del sitio. Google trata English en y English en-GB como traducciones diferentes. Recomiendo español por defecto y los idiomas reales del producto; revisar todos antes de publicar, incluidos enlaces y texto de Analytics. [Google, creación del mensaje](https://support.google.com/adsense/answer/10960768).

La política debe describir datos recogidos, compartidos y usados por Google y terceros, tecnologías de almacenamiento, identificadores e IP. Debe explicar que terceros pueden leer o escribir cookies a raíz de los anuncios, y puede enlazar la explicación oficial de Google sobre sitios asociados. Actualizar la política del sitio exige contrastarla con el inventario real de tecnologías. [Google, obligaciones de información](https://support.google.com/publisherpolicies/answer/10437794).

La URL de privacidad guardada para el sitio se reutiliza en mensajes existentes y futuros. Comprobar que la página es pública, está disponible sin aceptar y tiene una versión comprensible en los idiomas ofrecidos. [Google, URL de privacidad](https://support.google.com/adsense/answer/10961370).

## Analytics y Firebase web

| Señal | Qué controla |
| --- | --- |
| ad_storage | Almacenamiento publicitario |
| analytics_storage | Almacenamiento de medición |
| ad_user_data | Uso/envío de datos del usuario a Google para publicidad |
| ad_personalization | Personalización publicitaria |

En Advanced Consent Mode, denied permite mediciones sin cookies. En Basic, las etiquetas de medición permanecen bloqueadas sin consentimiento. Recomiendo Basic para esta primera entrega si el resultado acordado es que rechazar no envíe medición a GA4. La elección no resuelve automáticamente el comportamiento de AdSense. [Google, tipos y variantes de Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).

Los defaults deben ejecutarse antes de config/event en cada documento. Consent Mode no persiste por sí mismo la elección; la CMP debe restaurarla. Los cambios deben aplicarse antes de navegar. wait_for_update concede una espera finita a la CMP asíncrona; no reemplaza un bloqueo hasta aceptar. No tomar su valor de ejemplo de 500 ms como garantía de privacidad. [Google, implementación web](https://developers.google.com/tag-platform/security/guides/consent).

La CMP de Google solo actualiza decisiones de usuarios a quienes muestra el mensaje europeo. Por eso un default global denied sin tratamiento del resto del mundo puede dejar Analytics bloqueado fuera de Europa. El plan debe definir una política regional explícita y probar Argentina. No decidir región por idioma, zona horaria o navigator.language. [Google, alcance de actualizaciones](https://support.google.com/adsense/answer/10961068).

Firebase JS documenta que setConsent aplica a todas las referencias gtag una vez inicializado Analytics y que el estado por defecto es granted. getAnalytics/initializeAnalytics y cualquier import que los dispare requieren auditoría de orden. isSupported comprueba soporte del navegador, no consentimiento. Recomiendo conservar un único propietario de los updates para que el SDK y la CMP no se sobrescriban. [Firebase, API de Analytics web](https://firebase.google.com/docs/reference/js/analytics).

Decisiones propuestas para la implementación posterior:

- Separar Firebase necesario para el juego de Firebase Analytics. Rechazar medición no debe impedir autenticarse, crear una partida, recibir actualizaciones o generar cartones.
- Centralizar el envío de eventos. No guardar para reproducir después de aceptar eventos producidos mientras se rechazaba la medición.
- Inicializar Analytics una sola vez. Evitar duplicar gtag o page_view al convivir el SDK, navegación cliente y CMP.
- Ante UNKNOWN, error o finalidad Analytics sin configurar, mantener medición bloqueada para usuarios europeos; informar un fallo de integración en pruebas. No interpretar un error como aceptación.
- Diferenciar sin respuesta, rechazo, aceptación parcial, aceptación total y fuera de alcance. Un booleano hasConsent no expresa esas situaciones.

Estas son recomendaciones de diseño a verificar contra el código, no comportamientos ya observados.

## API, revocación y eventos

La API actual ofrece CONSENT_MODE_DATA_READY y getGoogleConsentModeValues. Sus estados incluyen UNKNOWN, GRANTED, DENIED, NOT_APPLICABLE y NOT_CONFIGURED. El ejemplo general de Google permite cargar etiquetas con NOT_CONFIGURED; para este proyecto propongo tratarlo como fallo si se esperaba Analytics configurado. googlefc.showRevocationMessage borra el registro europeo y reabre la elección. Invocar funciones mediante callbackQueue. CONSENT_API_READY solo acredita API disponible, no decisión lista. Los métodos antiguos getConsentStatus/getConsentedProviderIds están obsoletos. [Google, Privacy & Messaging API](https://developers.google.com/funding-choices/fc-api-docs).

TCF recomienda addEventListener; getTCData está obsoleto. El listener puede dispararse inmediatamente con datos incompletos y luego volver a ejecutarse al cambiar la elección. tcloaded representa una decisión válida previa; useractioncomplete una elección confirmada. cmpuishown indica apertura de interfaz, no aceptación. Conservar y retirar listenerId según el ciclo de vida evita duplicados. El número de versión de la API no debe confundirse con la versión comercial TCF 2.3; los ejemplos del estándar utilizan versión 2. [IAB Tech Lab, CMP API](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md).

Recomendación: incorporar un control visible de Privacidad y cookies en el sitio y dentro de la política. Probar rechazar, luego aceptar, y aceptar, luego rechazar, sin recargar y después de recargar. En Basic, desactivar también la colección ya inicializada y cortar futuros eventos; borrar un script del DOM no detiene un SDK ejecutándose. La prueba debe demostrar qué ocurre con cookies existentes, nuevas escrituras y envíos posteriores. No prometer que retirar consentimiento elimina datos históricos de Google ni cookies de terceros que JavaScript del sitio no puede borrar.

La callback de consentimiento inicial no sustituye una suscripción de cambios. La implementación deberá probar el orden entre el evento TCF, el update de Consent Mode y la lectura del estado de Analytics. No inventar una traducción casera del propósito TCF 1 a analytics_storage: la CMP ofrece una finalidad de Analytics específica.

## Anuncios tras rechazar

Los anuncios no personalizados NPA siguen utilizando cookies para limitar frecuencia y generar informes agregados. No son equivalentes a anuncios sin consentimiento. [Google, anuncios personalizados y no personalizados](https://support.google.com/adsense/answer/9007336).

Los anuncios limitados desactivan personalización, pero necesitan IP para entrega y pueden cachear contenido. Con programmatic limited ads habilitado se usan cookies, localStorage y Shared Storage destinados a tráfico inválido. AdSense dispone de un control en Brand safety, Blocking controls, Ad serving. La cadena TCF decide la elegibilidad del modo de anuncios; Google documenta transparencia para Special Purposes 1 y 2 y Google como proveedor. [Google, anuncios limitados](https://support.google.com/adsense/answer/14210870).

El plan debe elegir una de estas políticas, y declarar su alcance:

1. Rechazo sin nuevos anuncios. Reduce complejidad, pero requiere verificar que Auto ads no crea solicitudes fuera del control del componente manual.
2. Rechazo con anuncios limitados elegibles. Mantiene una vía de ingresos, pero exige documentar y verificar almacenamiento antifraude, transparencia y ajustes concretos.

No recomiendo cambiar ese control de cuenta como parte de una implementación estrecha sin inventariar los otros sitios afectados. Tampoco conviene prometer que rechazar deja el navegador sin ninguna cookie: puede persistir la preferencia de consentimiento y funcionar almacenamiento necesario del juego.

## Optimización, publicación y pruebas

Optimize my consent message puede alternar un mensaje estándar con uno limitado no bloqueante. El segundo busca monetizar con anuncios limitados y se puede previsualizar con fctype=gdpr_limited. Google no lo muestra si se deshabilitan los controles de interés legítimo. Recomiendo primera entrega con mensaje determinista y optimización desactivada; evaluar esa optimización en otro trabajo, después de tener pruebas y métricas. [Google, optimización del consentimiento](https://support.google.com/adsense/answer/16878447).

El tag AdSense existente puede desplegar la CMP al publicar el mensaje. No bloquear ese bootstrap esperando una decisión de la CMP que todavía no pudo cargar. El preview en el sitio con ?fc=alwaysshow&fctype=gdpr requiere mensaje publicado; no demuestra que un borrador sirva en producción. [Google, Privacy & Messaging API](https://developers.google.com/funding-choices/fc-api-docs).

Google informa que publicar o despublicar puede tardar hasta 10 minutos. Despublicar vuelve a los defaults del sistema de anuncios; por eso no debe ser el único rollback de un fallo de privacidad. La página genérica de publicación menciona GPT, mientras que la documentación específica de AdSense y de la API confirma el tag AdSense para este caso. [Google, publicación](https://support.google.com/adsense/answer/13651178), [Google, creación del mensaje](https://support.google.com/adsense/answer/10960768).

Los mensajes publicados en un dominio se heredan en sus subdominios; uno más específico prevalece. Incluso mensajes de otro tipo en un subdominio pueden afectar el emparejamiento. Una URL temporal de Vercel no debe darse por válida como sitio de pruebas de una configuración publicada para coronabingo.com.ar. [Google, sitios y subsitios](https://support.google.com/adsense/answer/14113511).

Tag Assistant permite verificar default, updates y comportamiento de etiquetas. Repetir las pruebas por región y comprobar las cuatro señales. El estado visual del banner no acredita comportamiento de red. Para Basic, una conexión inicial fallida de Tag Assistant puede deberse al bloqueo correcto de Google tag. [Google, depuración](https://developers.google.com/tag-platform/security/guides/consent-debugging).

Matriz propuesta de aceptación posterior:

| Caso | Evidencia requerida |
| --- | --- |
| España, navegador limpio, antes de decidir | Un mensaje; estados denegados; ausencia de GA en Basic; anuncios según la política acordada |
| Rechazar todo | Elección TCF y cuatro señales coherentes; ninguna nueva medición GA en Basic |
| Aceptar todo | Analytics arranca una vez; señales y anuncios compatibles con permisos |
| Aceptación parcial | Analytics puede tener una elección distinta a publicidad; cada etiqueta respeta la suya |
| Rechazar y después aceptar | El control de privacidad permite cambiar; Analytics arranca sin duplicados |
| Aceptar y después rechazar | Se detienen eventos; el próximo evento y la siguiente navegación respetan la retirada |
| Recarga y navegación SPA | Preferencia persistida; sin parpadeo de granted ni listeners duplicados |
| Argentina | Comportamiento regional explícito; no quedar bloqueado por falta de mensaje europeo |
| Reino Unido y Suiza | Cobertura y elección equivalentes a la región objetivo |
| Móvil, teclado, ES/EN, bloqueador y CMP lenta | Acceso al juego; alternativa de privacidad comprensible; ningún timeout concede permiso |

Usar salida real desde la región objetivo para acreditar entrega regional. El override del banner acredita interfaz y flujo forzado, no por sí solo geolocalización de producción. Las pruebas se hacen sin clicar anuncios reales.

GA4 expone Admin, Data collection and modification, Consent settings, con detalle por flujo y diagnósticos de ad_user_data/ad_personalization según vinculaciones. Revisarlo como evidencia complementaria, junto a Tag Assistant y red, no como única prueba de que cada visita obedece la decisión. [Google Analytics, verificar consentimiento](https://support.google.com/analytics/answer/14275483).

## Qué queda por cerrar con la auditoría del proyecto

- Si existe otra CMP o un mensaje automático sirviendo actualmente.
- Estado de los dos switches de Consent Mode, cobertura automática, optimización, controles de interés legítimo y anuncios limitados.
- Propiedad GA4 y flujo efectivos; relación con Firebase; integraciones Ads/AdSense y Analytics paralelas.
- Países, idiomas, proveedores, política y dominios asignados al mensaje viejo.
- Política elegida para datos sin consentimiento, publicidad limitada y usuarios fuera de la región.
- Host de prueba disponible y secuencia de publicación que evite probar por primera vez sobre todo el tráfico.

El porcentaje de ingresos de España debe verificarse en AdSense con periodo y denominador definidos. No inferir ganancia futura del consentimiento a partir de esa cuota. Comparar después tasas de mensajes, elecciones, anuncios, RPM e ingresos del mismo país y tipo de dispositivo; una caída de usuarios medidos por GA4 puede reflejar consentimiento correcto y no pérdida real de visitas.
