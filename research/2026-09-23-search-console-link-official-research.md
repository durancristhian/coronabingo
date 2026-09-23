# Vinculación de Search Console con GA4: documentación oficial

Consultado el 23 de septiembre de 2026. Investigación de documentación pública. Este documento no confirma el estado de las cuentas de Coronabingo ni ejecuta cambios.

## Requisitos y reemplazo

La guía específica de Analytics exige rol Editor en la propiedad GA4 y ser propietario verificado de Search Console para crear la vinculación. Editor basta para eliminarla. Cada flujo web admite una propiedad Search Console y viceversa; una propiedad GA4 solo puede tener un flujo vinculado a Search Console. No se puede editar la vinculación: debe eliminarse y crearse otra. GA4 y Search Console deben cubrir las mismas páginas. El recorrido documentado es Administrar → Vinculaciones con productos → Vinculaciones con Search Console → Vincular → elegir propiedad → elegir flujo web → revisar y enviar. [Google Analytics: conectar Search Console](https://support.google.com/analytics/answer/10737381?hl=en).

Search Console distingue propietario verificado, propietario delegado y usuario con acceso completo. Este último no puede vincular Analytics. Para comprobar la situación del usuario actual, consultar Configuración → Verificación de la propiedad. En Usuarios y permisos, "Owner" sin "Verified" indica propietario delegado. [Google Search Console: propietarios y permisos](https://support.google.com/webmasters/answer/7687615?hl=en).

Existe una diferencia de redacción entre documentos oficiales: la ayuda de Asociaciones exige "propietario" y permiso de edición, sin aclarar "verificado". Para el plan desde GA4 conviene aplicar el requisito explícito de su guía y comprobar la elegibilidad antes de eliminar el vínculo anterior. Search Console no guarda el historial de asociaciones eliminadas. Por eso se recomienda conservar una captura del vínculo original. [Google Search Console: asociaciones](https://support.google.com/webmasters/answer/9419894?hl=en).

## Propiedad de dominio o de prefijo

Google admite vincular propiedades de dominio con Analytics desde febrero de 2021. No corresponde exigir una propiedad de prefijo por una limitación histórica de Universal Analytics. [Anuncio oficial de asociaciones](https://developers.google.com/search/blog/2021/02/search-console-associations).

Una propiedad `coronabingo.com.ar` incluye todos sus protocolos y subdominios. Una propiedad `https://coronabingo.com.ar/` cubre solo ese prefijo: no incluye `http://` ni `https://www.`. La propiedad de dominio requiere DNS; la de prefijo admite otros métodos. Crear una propiedad permite observar el sitio y no cambia su presencia en Google. Search Console empieza a recolectar cuando alguien agrega la propiedad, incluso antes de verificarla. [Google Search Console: agregar una propiedad](https://support.google.com/webmasters/answer/34592?hl=en).

Decisión recomendada para Coronabingo, sujeta a evidencia de las cuentas: reutilizar una propiedad verificada existente que cubra las páginas realmente medidas. Si existe una propiedad de dominio con historial útil y todas sus variantes corresponden al mismo sitio, es una candidata válida. Si incluye otros sitios o subdominios ajenos al flujo, elegir un prefijo exacto puede dar una comparación más limpia. Esta selección es una recomendación de implementación, no una obligación de Google.

Si falta verificación, resolverla antes del reemplazo. Los tokens deben seguir presentes para conservarla; Search Console los revisa periódicamente. No borrar tokens del dominio anterior. Los hijos de una propiedad verificada que se agreguen se verifican automáticamente mediante el método de la propiedad padre. [Google Search Console: verificar la propiedad](https://support.google.com/webmasters/answer/9008080?hl=en).

## Informes, historial y espera

El informe Consultas usa las consultas y métricas de la propiedad Search Console vinculada. Google documenta un máximo de 16 meses, disponibilidad 48 horas después de la recolección y un inicio efectivo limitado por la fecha más reciente entre verificación del sitio y creación del flujo web. La colección Search Console está sin publicar por defecto. Sus métricas requieren un vínculo activo. [Google Analytics: informe Consultas](https://support.google.com/analytics/answer/13682862).

El informe Tráfico de búsqueda orgánica de Google reúne métricas Search Console y Analytics por página de destino. Solo combina métricas Search Console con las dimensiones compatibles: página de destino, país y dispositivo. Si al recrear el vínculo se selecciona otro flujo, todos los períodos de esos informes usarán el nuevo flujo. La dimensión "Página de destino + cadena de consulta" es una ruta, por lo que verla sola no demuestra qué hostname la originó. [Google Analytics: tráfico de búsqueda orgánica](https://support.google.com/analytics/answer/13682863).

Publicar la colección requiere Editor o Administrador: Informes → Biblioteca → tarjeta de la colección → Más → Publicar. Si falta un informe en la navegación, revisar primero la Biblioteca. Publicar o editar la navegación es un cambio de configuración y debe quedar para la implementación autorizada. [Google Analytics: personalizar la navegación](https://support.google.com/analytics/answer/10460557).

No prometer que los informes GA4 conservarán una serie combinada del dominio viejo y el nuevo. La documentación consultada no garantiza ese comportamiento al cambiar únicamente la propiedad Search Console. Conservar ambas propiedades y exportar una línea de base antes del cambio permite seguir consultando el sitio antiguo por separado. Eliminar una asociación es una operación distinta de eliminar una propiedad; la ayuda de Asociaciones describe específicamente esa operación. [Google Search Console: asociaciones](https://support.google.com/webmasters/answer/9419894?hl=en).

## Criterios de comprobación propuestos

1. Antes del reemplazo, guardar IDs de GA4, flujo, Measurement ID, propiedad Search Console actual y destino. Confirmar propietario verificado, permisos GA4, cobertura de URLs, asociación disponible y presencia de datos en la propiedad nueva.
2. Registrar el intervalo de referencia y unas páginas o consultas de la propiedad actual. Exportar el histórico del dominio viejo si importa conservarlo fuera de la consola.
3. Tras el cambio autorizado, comprobar la pareja exacta de propiedad y flujo en GA4 y en Asociaciones de Search Console. Verificar que la propiedad antigua sigue accesible.
4. Comprobar por separado recepción de eventos GA4 en producción y datos orgánicos importados. Un evento en Tiempo real demuestra recepción de Analytics, pero no demuestra funcionamiento de la importación Search Console.
5. Revisar Consultas y Tráfico de búsqueda orgánica con un intervalo ya consolidado. Proponer primera revisión a las 48–72 horas y otra a los siete días. Son ventanas operativas sugeridas, no garantías del proveedor. Si Search Console tiene datos consolidados y GA4 sigue vacío, revisar vínculo, flujo, permisos, cobertura, fechas y publicación.
6. Si Search Console tampoco tiene datos, registrar "vinculación configurada; recepción pendiente". No inventar un resultado positivo ni generar clics artificiales para cumplir una prueba.

Al comparar, igualar fechas, país, dispositivo y tráfico de Google orgánico. Clics de Search Console y sesiones de GA4 no son equivalentes: intervienen consentimiento, implementación del tag, zona horaria, atribución y URL canónica. Search Console usa la hora del Pacífico y atribuye a la canónica de Google; Analytics mide las URLs con tag. La aceptación debe exigir dominio correcto, datos cuando existan y tendencias razonables, no igualdad exacta entre clics y sesiones. [Google Search Central: comparar Analytics y Search Console](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console).

## Riesgos que debe resolver el plan

- No retirar el vínculo viejo hasta confirmar que la propiedad destino es elegible y no está ocupada por otra asociación que se deba preservar.
- Distinguir el nombre o URL configurada del flujo del Measurement ID que recibe tráfico real. Renombrar un flujo no demuestra recepción.
- Conservar el flujo de producción cuando sea el correcto. Crear otro solo para cambiar de dominio introduce una nueva fecha de inicio y fragmenta la medición.
- Preparar restitución del vínculo anterior con sus identificadores y permisos. La restitución requiere volver a crear la asociación y no recupera su historial administrativo eliminado.
- No incluir Firebase, AdSense, DNS, despliegues ni cambios de tracking como pasos automáticos. Solo pasarían a formar parte del plan si la investigación muestra una dependencia concreta.

Las recomendaciones anteriores son una revisión operativa basada en las restricciones citadas; las cuentas reales deben resolver qué rama aplica.
