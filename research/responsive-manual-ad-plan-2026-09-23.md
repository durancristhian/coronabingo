# Plan del anuncio manual adaptable

Fecha: 23 de septiembre de 2026. Estado: propuesta revisada, implementación no autorizada. Su inclusión en la primera etapa sigue pendiente de decisión.

Recomiendo una mejora acotada del bloque manual: ancho disponible hasta 728 px, altura constante de 90 px y espacio reservado desde el primer render. El objetivo inicial es que el anuncio tenga un tamaño previsible y no mueva el contenido. La mejora de ingresos se evalúa después; no está demostrada.

Este documento define trabajo futuro. Durante la investigación se consultaron código, documentación oficial, AdSense, Google Analytics, Firebase y la página pública. Solo se escribieron documentos de investigación. No se cambió código de producto, configuración de cuentas ni datos del juego; tampoco se desplegó ni se hizo commit.

## Evidencia y alcance de la investigación

Base de código observada: commit `4f14279`, Next.js 16.3.6, React 18.3.1, Pages Router. Las rutas actuales están en `pages/`; referencias antiguas a `pages_/`, eventos y administradores retirados no describen el árbol actual.

| Hallazgo verificado | Consecuencia |
| --- | --- |
| `components/Ads.tsx` inserta el bloque a los 1.000 ms, con ancho declarado de 728 px y alto de 90 px. Antes devuelve `null`. | No reserva su espacio inicialmente. El riesgo de desplazamiento surge del código; no se midió un valor de CLS en esta investigación. |
| `components/Layout.tsx` coloca el anuncio debajo de Header y antes del contenido. `Container` limita el ancho general a 1.152 px y el envoltorio agrega 16 px por lado. | El tamaño debe depender del ancho interior real, no de asumir que todo el viewport está disponible. |
| AdSense muestra la unidad gráfica `Layout`, slot `1185318534`, fija en 728 × 90; última modificación 7 de octubre de 2020. | No es simplemente una unidad responsive con CSS equivocado. Hay un paso de cuenta que planificar. |
| El editor de esa misma unidad ofrece `Responsivo` y `Fijo`. Se abrió el selector y se canceló sin cambiarlo. | Se puede proponer la conversión del slot existente. La conservación del ID y el snippet resultante se comprobarán al ejecutarla. |
| Auto ads está activado, con cero exclusiones de páginas. La optimización automática del sitio está desactivada. La optimización global de tamaño móvil también está desactivada. | Son tres ajustes distintos. No activarlos como parte de esta prueba. |
| `@ctrl/react-adsense` agrega por defecto `data-ad-format="auto"` y `data-full-width-responsive="false"`, hace un `push` por montaje y silencia errores. | Cambiar solamente `style.width` dejaría implícitos parámetros y comportamiento relevantes. |

Fuentes locales: [Ads](../components/Ads.tsx), [Layout](../components/Layout.tsx), [Container](../components/Container.tsx), [Document](../pages/_document.tsx), [App](../pages/_app.tsx), [paquete instalado](../node_modules/@ctrl/react-adsense/dist/adsense.js). Consola: [unidades y sitio de AdSense](https://adsense.google.com/adsense/u/0/pub-6231280485856921/myads/sites). Evidencia capturada: [JSON de esta investigación](responsive-manual-ad-evidence-2026-09-23.json).

### Qué se vio en el sitio público

Se abrió la portada y se redimensionó la misma página, sin cambiar su DOM ni su CSS.

| Viewport | Ancho interior medido del padre | Tamaño medido del `ins` | Creatividad |
| --- | ---: | --- | --- |
| 360 × 800 | 313 px | 313 × 90 px | Sin iframe; `data-ad-status` ausente |
| 1280 × 900 | 1.152 px | 728 × 90 px | Sin iframe; `data-ad-status` ausente |

En esta sesión había 15 px de scrollbar: los 360 px de viewport dejaron 345 px para el documento y 313 px después del padding. Sin scrollbar, ese mismo cálculo daría 328 px. El diseño debe admitir ambas situaciones.

Aunque el estilo declarado sigue siendo 728 px, flex reduce el elemento vacío en móvil. No se observó desborde del bloque vacío. Esto no demuestra que una creatividad fija servida por Google respete el espacio, ni permite afirmar que hoy existe un recorte reproducido. No se identificó la causa de la ausencia de creatividad. Tampoco se hizo una carga fría móvil independiente ni se midieron orientación real o CLS. Esos puntos quedan como aceptación futura, no como pruebas aprobadas.

### Línea base de ingresos y dispositivos

AdSense, filtro exclusivo de la unidad Layout, opción “Últimos 30 días”, consultada el 23 de septiembre. La captura conserva la selección relativa; antes de implementar debe exportarse con fechas absolutas y zona horaria de la cuenta.

| Plataforma | Impresiones | Ingresos estimados | RPM de impresiones | Visibilidad |
| --- | ---: | ---: | ---: | ---: |
| Móvil | 2.412 | USD 0,13 | USD 0,05 | 73,83% |
| Escritorio | 1.472 | USD 0,24 | USD 0,16 | 60,37% |
| Tablet | 35 | USD 0,00 redondeado | USD 0,13 | 74,07% |
| Total | 3.919 | USD 0,37 | USD 0,09 | 68,65% |

Esto corresponde al anuncio manual, no a los ingresos totales del sitio. El móvil tiene menor RPM pero mayor visibilidad: los datos no prueban que un desborde explique su menor rendimiento. País, demanda e inventario también pueden influir. [Informe de unidad y plataforma](https://adsense.google.com/adsense/u/0/pub-6231280485856921/reporting/?d=last30days&ag=adunit%2Cplatform&dd=1YadunitY1Yca-pub-6231280485856921%3A1185318534YLayout&gm=earnings&m=monetizableImpressions%2Cclicks%2CmonetizableImpressionsRpm%2CactiveViewViewability%2Cearnings&oc=earnings&oo=descending&ct=td).

GA4, propiedad `385744187`, del 25 de junio al 22 de septiembre de 2026: 1.821 usuarios activos móviles, 51,41%; 1.694 de escritorio, 47,83%; y 30 de tablet, 0,85%. Un usuario puede aparecer en más de una categoría. Ambos dispositivos principales necesitan aceptación propia. Estos 90 días contextualizan uso; no se cruzan como si fueran el mismo período de la tabla de AdSense.

### La medición tiene dos propiedades

Firebase `coronabingo-bf16f` está vinculado a la propiedad `226709381`, flujo `1861645851`. La propiedad de tráfico `385744187` no tiene vinculaciones de AdSense. En esta última solo aparecen `page_view`, `session_start`, `user_engagement` y `first_visit` durante los 90 días consultados.

El código registra `room_created` mediante Firebase Analytics, pero su ausencia en la otra propiedad no demuestra que el evento nunca se envíe. Hay que comprobar su destino. Actualmente no hay evidencia suficiente para usar “partidas completadas” como métrica lista para este cambio.

Fuentes: [integraciones de Firebase](https://console.firebase.google.com/u/0/project/coronabingo-bf16f/settings/integrations), [vinculaciones de AdSense en GA4](https://analytics.google.com/analytics/web/#/a161408428p385744187/admin/integrations/google-adsense), [contexto de Analytics](../contexts/Analytics.tsx), [creación de sala](../components/CreateRoom.tsx). No hace falta cambiar Firestore, facturación o reglas para adaptar el anuncio.

## Decisión técnica propuesta

| Alternativa | Evaluación |
| --- | --- |
| Responsive automático con `format="auto"` y expansión móvil | Puede aprovechar más tamaños, pero no ofrece la altura previsible que queremos encima del juego. Evaluarlo como experimento posterior. |
| Forma `horizontal` | No resuelve por sí sola la altura móvil: ese parámetro orienta la forma en escritorio. |
| Ancho variable y altura explícita | Recomendación para esta etapa: conservar 90 px de alto y un máximo de 728 px de ancho. |
| Tamaños distintos por breakpoint | Válido, pero agrega cambios de altura y combinaciones que no necesitamos para esta primera corrección. |

Google permite la variante avanzada de ancho variable y altura fija. La propuesta adapta ese patrón a `display:block`, `width:100%`, `max-width:728px` y `height:90px`, sin copiar el mínimo de 400 px de su ejemplo. Las dimensiones del `ins` irían inline. El marcado seguiría el ejemplo avanzado, sin mezclarlo con `data-ad-format="auto"`, `horizontal` ni `data-full-width-responsive="true"`. [Modificaciones permitidas](https://support.google.com/adsense/answer/9183363?hl=en).

La ausencia de `data-full-width-responsive` no equivale por sí sola a desactivar expansión en el modo automático. La contención de la variante avanzada debe verificarse con el SDK real; si no respeta el contrato, se rechaza esa implementación y se revisa el tamaño, sin ocultar o recortar la creatividad. [Parámetros responsive](https://support.google.com/adsense/answer/9183460?hl=en).

Esta elección conserva la altura actual y simplifica orientación. No garantiza inventario para un anuncio de 313 × 90 o 328 × 90. Puede mostrarse una creatividad menor o quedar sin llenar. También excluye anuncios de 100 px de alto. Si la cobertura resulta pobre, evaluar 100 px móviles como una segunda propuesta con su propia comparación.

## Secuencia de implementación futura

### 1. Cerrar el alcance de publicación

La decisión pendiente es si este paquete entra en la primera etapa. Mi recomendación es mantenerlo como entrega independiente, por detrás de consentimiento y elegibilidad de páginas si esos trabajos siguen pendientes. Su beneficio inmediato es estabilidad de interfaz; el volumen económico actual no justifica convertirlo en un proyecto grande.

Este paquete incluye el tamaño de la unidad, la reserva de espacio, la inicialización y las pruebas. La ubicación bajo Header se conserva solo en estados aptos para publicidad. No incorpora nuevos emplazamientos, aumento de densidad, una plataforma de experimentación ni reconfiguración general de Analytics.

Antes de publicar, el trabajo de elegibilidad debe definir explícitamente cuándo se permite el anuncio. Hoy `Layout` también lo monta en carga, errores, sala inexistente, sala antigua, sala aún no lista y solicitud de código. No clasificar por la palabra `/admin`: el administrador de sala actual es parte del flujo del juego. Si ese trabajo no está resuelto, no presentar esta adaptación de tamaño como lista para desplegar globalmente. Puede completarse y revisarse localmente mientras tanto.

Revisar especialmente gameplay. Google recomienda una separación de al menos 150 px respecto del juego o retirar anuncios de esas páginas. Es una recomendación fuerte, no un mínimo universal aplicable a toda página. Medir la distancia real, incluida la vista del organizador y streamer. Si la ubicación actual exige rediseño, plantear su exclusión o nueva ubicación como decisión explícita. [Guía de páginas de juego](https://support.google.com/adsense/answer/2768340?hl=en).

Consentimiento queda como dependencia de la entrega publicitaria, no se implementa dentro del componente responsive. El antecedente del mensaje europeo en borrador procede de la auditoría anterior y debe revalidarse; esta investigación no volvió a inspeccionar la CMP. No usar un temporizador como sustituto de las condiciones reales de consentimiento.

Entregable de esta fase: lista de estados elegibles, alcance aprobado y registro de dependencias todavía abiertas.

### 2. Preparar la reversión y la línea base

Registrar el commit y despliegue estables que existan al comenzar, el snippet actual y la configuración fija del slot. No asumir que `4f14279` seguirá siendo la base. Preservar trabajos concurrentes y verificar las guías locales de Next.js antes de escribir código.

Exportar 28 días completos del slot por dispositivo, con ingresos, impresiones, solicitudes/cobertura si el informe las ofrece y visibilidad. Anotar zona horaria y países principales. Registrar Auto ads, optimización móvil, consentimiento y elegibilidad. Si cualquiera de estos cambia en paralelo, la comparación posterior debe reconocerlo.

No usar Firebase A/B Testing o Remote Config para esta entrega. Un antes/después descriptivo alcanza para evaluar una corrección de interfaz; no permite atribución causal de ingresos.

### 3. Implementar el componente de tamaño controlado

Modificar `components/Ads.tsx` para renderizar una reserva de 90 px desde el primer render elegible, con 16 px de separación inferior como hoy. Centrar un contenedor de ancho completo con máximo 728 px dentro del espacio disponible. Evitar depender de que flex achique un elemento declarado más ancho que su padre.

Reemplazar el uso de `@ctrl/react-adsense` en este componente por un `ins` y un adaptador pequeño de inicialización. La razón es concreta: el wrapper actual introduce `format="auto"` y oculta errores, y no permite expresar naturalmente la omisión de esos atributos mediante sus valores por defecto. No modificar `node_modules`. Retirar la dependencia del manifiesto y lockfile solo tras confirmar que no tiene otros usos; hacerlo en el mismo cambio, sin actualizar paquetes ajenos.

Eliminar el temporizador de 1.000 ms. Inicializar después de montar, cuando el nodo esté conectado, visible por layout, permitido para publicidad, tenga ancho interior positivo y el loader haya confirmado que el SDK terminó de cargar. La espera local debe poder cancelarse al desmontar. No basta que exista `window.adsbygoogle`: puede ser solamente una cola todavía pendiente.

El adaptador debe respetar estas condiciones, que son decisiones de ingeniería a verificar:

- Un `push` por nodo DOM elegible, incluso con rerenders o repetición de efectos en desarrollo. Registrar localmente si ese nodo ya se solicitó; el estado de llenado no sirve para deduplicar una solicitud pendiente. La deduplicación pertenece a la identidad del nodo, no a una ejecución individual del efecto.
- Si el ancho comienza en cero, observar el cambio de tamaño hasta que sea utilizable. Desconectar al inicializar o desmontar; evitar polling, reintentos tras errores y observadores persistentes sin necesidad.
- No encolar nodos de rutas o estados no elegibles. Evitar crear el `ins` solicitante hasta satisfacer las condiciones; la reserva puede existir antes si ese estado tendrá contenido elegible.
- No refrescar por bolillas, marcas del cartón, resize, giro o cambios de props. La respuesta a orientación que haga Google se observa, no se reemplaza con refresh propio.
- Al navegar, un nodo nuevo puede inicializarse una vez. Un nodo conservado mantiene su anuncio. No agregar `key` por URL o por idioma para forzar nuevas impresiones.
- Si el nodo A se desmonta antes de que cargue el script y luego se monta B, cancelar la espera de A y solicitar solamente B. Justo antes del `push`, revalidar conexión, ancho, elegibilidad e identidad. No enviar entradas tempranas a la cola global ni vaciarla para intentar cancelarlas: `push({})` no identifica explícitamente a A o B.
- Los errores del anuncio no deben interrumpir el juego. Registrarlos durante QA y, si se usa la monitorización existente, una vez por instancia y sin datos de salas o jugadores.

Mantener la reserva si no llega anuncio, si está bloqueado o si el estado es `unfilled`; así no suben los controles de golpe. No crear un spinner ni un falso anuncio. Distinguir `unfill-optimized` de `unfilled` y no desmontar contenido que Google esté usando. [Estados documentados](https://support.google.com/adsense/answer/10762946?hl=en).

Entregable: componente con dimensiones y ciclo de vida explícitos, sin cambios en datos del juego.

### 4. Resolver la disponibilidad del script como cambio identificable

`pages/_document.tsx` ya carga AdSense una vez, pero no publica una señal cliente de disponibilidad para el adaptador. La opción propuesta es un pequeño proveedor de estado en `pages/_app.tsx` con un único `next/script`, `strategy="afterInteractive"`, `onReady` y `onError`. Quitar el script anterior de `_document` al introducir este loader. `onReady` habilita las instancias elegibles; `onError` deja la reserva sin solicitudes ni reintentos automáticos. Next.js documenta que `onReady` también se invoca al remontar el componente, por lo que no debe solicitar anuncios directamente desde ese callback.

Este cambio altera el momento de carga global y debe tener diff y validación propios. Conservar inicialmente la URL y los atributos actuales; agregar `?client=...` y `crossOrigin` como normalización simultánea sumaría otra variable y queda fuera de esta adaptación salvo necesidad demostrada. Validar Auto ads tanto en páginas con unidad manual como en páginas sin ella. Si otra entrega de consentimiento ya provee un loader con disponibilidad explícita, reutilizarla y evitar una segunda migración. La línea base comercial deberá anotar la fecha de cualquier cambio de loader; si se entrega antes, recoger la línea base después de estabilizarlo.

`_document` se renderiza en servidor; no colocar allí efectos ni callbacks React cliente. Se leyeron las guías instaladas de Custom Document, Custom App y la API de Script de Next.js 16.3.6. Antes de implementar, verificar otra vez la guía local si cambió la versión. El traslado a `_app` resuelve la espera cancelable; no implica migrar a App Router ni autoriza cambiar consentimiento o Auto ads.

`NODE_ENV=production` también ocurre con `next build`/`next start` local y previews. Por eso no basta como protección de QA: impedir tráfico publicitario real antes de navegar. En los casos exitosos, interceptar la URL del script y responder con un script stub local que permita disparar `onReady`; sustituir solo la cola y abortar el script dejaría el adaptador deshabilitado. Usar abort/bloqueo para el caso específico de `onError` y mantener bloqueado el resto de la red publicitaria. No enviar eventos de QA a las propiedades de producción. Esto es configuración del entorno de prueba, no una modificación de cuentas.

### 5. Verificar localmente antes del cambio de cuenta

Probar con el slot existente como identificador y un stub que simule carga lenta, éxito, ausencia de inventario y error. El stub puede contar llamadas y simular geometría/atributos; no certifica que Google vaya a servir esos tamaños.

| Grupo | Casos | Criterio de aceptación |
| --- | --- | --- |
| Pantallas | 320, 360, 375, 390, 414, 768, 1024, 1280 y 1440 px. Añadir 759/760/761 px alrededor del ancho teórico 728 + 32, y comprobar el efecto del scrollbar. | Ancho de unidad menor o igual al espacio disponible y a 728 px; 90 px de altura reservada. Sin desborde horizontal atribuible al bloque. |
| Idiomas y páginas | Español e inglés; portada, entrada de sala, configuración, jugador, organizador y streamer. | Una unidad manual como máximo en cada estado autorizado. El anuncio no altera los controles ni la estructura del juego. |
| Estados sin contenido | Carga, error, sala/jugador inexistente, sala antigua, no lista, código pendiente y falta de localStorage. | Aplicar la elegibilidad acordada; no solicitar anuncios solo por haber montado Layout. |
| Carga y estabilidad | Antes de hidratar, antes de resolver anuncio, después de `filled`, `unfilled`, bloqueo y fallo. | La coordenada del contenido siguiente permanece estable por efecto del banner. Medir diferencia en px y entradas de layout shift. |
| Ciclo de vida | Script antes/después del componente; ancho cero a positivo; desmontaje temprano; efectos repetidos; navegación interna; atrás/adelante; idioma. | Una inicialización por nodo solicitado, ninguna por rerender, ningún bucle o error no controlado. |
| Giro y redimensionamiento | Vertical a horizontal y vuelta; ventana ancha a angosta después de llenar. | Sin recortar ni escalar con CSS el iframe. Sin refresh propio. El comportamiento del SDK real queda pendiente del smoke posterior. |
| Juego | Crear, configurar, entrar, marcar y desmarcar, sacar bolilla y abrir opciones con fixtures o proyecto de desarrollo. | Flujos operables, ningún botón desplazado bajo el dedo durante carga, distancias documentadas respecto del anuncio. |

La reserva debe reducir los saltos propios del banner a cero en QA. El CLS total de la página se registra por separado; Auto ads y otros elementos también pueden moverla. La referencia de campo de Google es CLS ≤ 0,1 en el percentil 75, que no se puede demostrar con una sola visita local. [Guía de CLS](https://web.dev/articles/optimize-cls).

Usar pruebas enfocadas del adaptador y una comprobación de navegador con stub. No reinstalar Cypress ni crear una suite general del juego solo para esta entrega. Verificaciones del repo: `npm run lint:check`, `npm run validate-locales` y `npm run build`. `lint:check` ya incluye typecheck; el build también valida locales. Ejecutar cada gate exigido sin repetirlos si no hubo cambios. No usar `npm run lint`, porque contiene `--fix`.

Entregable: diff revisable, resultados de checks, capturas móvil/escritorio y registro de medidas/solicitudes. Ninguno de estos checks fue ejecutado para una implementación en esta investigación.

### 6. Convertir la unidad y publicar, si se autoriza

Solo después del diff y QA local, preparar el cambio concreto de cuenta y despliegue. En AdSense, editar Layout y seleccionar Responsivo, conservar el nombre y comprobar que el slot siga siendo `1185318534`. Guardar el nuevo snippet como evidencia. No copiar ciegamente sus parámetros automáticos sobre la variante avanzada propuesta.

Si el editor no conserva el ID o la conversión no queda clara, detener ese paso y usar como alternativa explícita una unidad nueva, por ejemplo `Layout responsive`, dejando la anterior intacta. No crear ambas ni alternarlas por dispositivo dentro de esta primera versión.

La conversión de la unidad es un cambio de cuenta que afecta al slot existente; no queda aislada por una rama Git. Coordinarla con una ventana corta de publicación, con el candidato probado listo y reversión preparada. Verificar su efecto sobre las páginas todavía cargadas y sobre el código anterior durante esa transición. Si se exige aislamiento completo o despliegue gradual, preferir una unidad nueva antes de empezar.

Realizar un smoke breve en el dominio aprobado: Android/Chrome, iPhone/Safari y escritorio. Revisar carga fría móvil y de escritorio, una navegación interna, un giro real y el paso de ventana de escritorio ancha a estrecha con creatividad servida. Google documenta la respuesta a orientación; no se debe asumir que todo resize de escritorio tendrá el mismo comportamiento. Si ese último caso no puede observarse, dejarlo pendiente, no aprobarlo solo con el stub. Capturar geometría exterior de la unidad/iframe, estados, ausencia de errores y convivencia con Auto ads. No intentar leer contenido de un iframe de otro origen.

No hacer clic en anuncios ni ejecutar bucles de recarga con anuncios reales. Si no hay creatividad, registrar el resultado como inconcluso para entrega y diagnosticar script, consentimiento, dominio, políticas y cobertura. No declarar éxito por ver solo el contenedor. [Tráfico inválido](https://support.google.com/adsense/answer/2660562?hl=en).

### 7. Seguir resultados y revertir si hace falta

Revisar funcionamiento a las 24–72 horas y comparar 28 días completos antes/después. Mantener la misma definición de estados elegibles, dispositivos y países. Anotar todo cambio simultáneo de consentimiento, anuncios automáticos o tráfico.

Prioridad de evaluación: juego operable y banner estable; solicitudes sin errores; luego cobertura, visibilidad, impresiones e ingresos del slot por dispositivo. Mirar también ingresos totales de AdSense, porque la unidad manual puede afectar la distribución de Auto ads. RPM de impresión y RPM de página no son intercambiables.

Los USD 0,37 mensuales observados son demasiado pequeños para fijar una meta de ingresos concluyente en una semana. Duplicarlos equivaldría a unos USD 0,37 adicionales en un período similar, bajo tráfico constante; es aritmética ilustrativa, no una previsión. Si los datos no distinguen un cambio, conservar la evaluación técnica y declarar inconclusa la comercial.

La reparación de GA4/AdSense y el destino de eventos de Firebase queda como trabajo separado. Coordinar con el [plan específico de vinculación](2026-09-23-adsense-ga4-link-plan.md), sin cambiar la asociación de Firebase para adaptar este banner. Si se aprueba medir impacto sobre el juego, primero verificar `room_created` y definir eventos de configuración/entrada sin nombres ni códigos de sala. Después construir una línea base. Hasta entonces, no afirmar mejoras o regresiones de “partidas completadas” usando eventos que no están disponibles.

Revertir de inmediato ante creatividad recortada, superposición, bloqueo de controles, refresh repetido o errores persistentes de ancho cero. Revertir el cambio de código de esta entrega, preservando cambios ajenos, y restaurar la configuración fija guardada del slot si se convirtió. Revertir Git solamente no deshace AdSense. Si se usó otra unidad, volver al slot anterior. No archivar el slot de respaldo.

## Archivos previstos y límites del cambio

| Archivo/superficie | Trabajo previsto |
| --- | --- |
| `components/Ads.tsx` | Dimensiones, reserva, marcado y adaptador de inicialización. |
| `pages/_document.tsx`, `pages/_app.tsx` y proveedor pequeño de disponibilidad | Traslado identificado del único loader a una superficie cliente con `onReady`/`onError`, o reutilización del loader que entregue consentimiento. Preservar URL y atributos. |
| `components/Layout.tsx` y rutas consumidoras | Solo integración con la elegibilidad ya acordada. Si no existe, debe presupuestarse como dependencia aparte antes de publicar globalmente. |
| `package.json` y lockfile | Retirar el wrapper únicamente si queda sin uso. |
| Evidencia y prueba enfocada | Medidas, estados, navegación y conteo de solicitudes con stub; ubicación según las convenciones vigentes al implementar. |
| AdSense | Conversión explícita de la unidad o alternativa nueva; sin cambiar Auto ads ni optimizaciones globales. |
| Firebase/Analytics | Ninguna modificación necesaria para maquetación. Medición comercial avanzada pendiente de su propio alcance. |

No se propone CSS global de recorte, `overflow:hidden`, transformaciones para achicar anuncios ni un listener que refresque publicidad con cada cambio de ventana. Tampoco cambios en reglas, billing, partidas existentes o migraciones de framework.

## Revisión del plan y mejoras incorporadas

La primera aproximación era convertir el bloque a responsive, quitar la espera y comprobar móvil/escritorio. La revisión con código, consolas y fuentes cambió el plan en estos puntos:

| Problema de la aproximación inicial | Mejora incorporada |
| --- | --- |
| Suponer que 728 px implica desborde móvil ya demostrado | Separar ancho CSS declarado, reducción por flex y creatividad servida. La reproducción sin iframe no prueba el fallo final. |
| Proponer `horizontal` como solución móvil | Usar ancho variable con altura explícita; `horizontal` no limita móvil. |
| Cambiar solo atributos del componente | Confirmar unidad fija en consola y planificar su conversión y reversión. |
| Dejar un segundo de espera como mecanismo de sincronización | Reservar desde el render inicial y solicitar con ancho válido, sin temporizador arbitrario. |
| Conservar un wrapper sin revisar sus defaults | Inspeccionar el paquete instalado y controlar atributos, deduplicación y errores en el adaptador. |
| Encolar antes de cargar Google y tratar de cancelar luego | Espera local cancelable, disponibilidad explícita del loader y revalidación justo antes de solicitar. |
| Normalizar el script global como si fuera neutral | Separar disponibilidad de normalización, conservar URL/atributos y verificar también Auto ads. |
| Probar masivamente contra publicidad real | Stub y red bloqueada para QA; entrega real mediante smoke breve posterior. |
| Dar por lista la medición de partidas e ingresos en GA4 | Documentar propiedades distintas, ausencia de vínculo y de eventos del juego en la propiedad consultada. |
| Mezclar exclusiones, CMP, Auto ads y tamaño en un único antes/después | Mantener entregas y fechas identificables; registrar dependencias y cambios simultáneos. |
| Revertir solo código | Incluir reversión de AdSense y preservar el slot anterior. |
| Dar por terminado con una captura del hueco | Exigir evidencia de una creatividad servida o declarar entrega inconclusa. |
| Dar por cubierto el resize de escritorio con un giro móvil | Incluir ventana ancha a estrecha con creatividad real en el smoke. |

## Decisiones que permanecen abiertas

La inclusión en la primera etapa sigue sin aprobarse. El contrato recomendado es 90 px de alto y máximo 728 px; una altura móvil mayor sería una alternativa nueva, no una mejora asumida. La publicación en gameplay depende de validar separación y elegibilidad. La entrega real y el efecto económico no pueden conocerse sin una implementación futura y tráfico posterior.

La opción por defecto del plan es reutilizar el slot mediante conversión coordinada. Una unidad nueva queda como alternativa si se prioriza aislamiento completo de la cuenta o si la conversión no conserva el ID. No es necesario elegir otras preferencias para terminar esta propuesta.

Documentación oficial adicional y distinción entre comportamiento documentado y decisiones de ingeniería: [investigación de fuentes](responsive-manual-ad-sources-2026-09-23.md).
