# Fuentes y decisiones para el anuncio manual adaptable

Consulta de documentación primaria realizada el 23 de septiembre de 2026. Este documento apoya un plan pendiente de aprobación. No implementa cambios ni describe pruebas de anuncios ya realizadas. La inspección del repositorio y las consolas se documenta por separado.

## Recomendación

Evaluar primero un banner con ancho disponible, máximo de 728 px y altura constante de 90 px en móvil y escritorio. Es una propuesta de ingeniería para conservar la altura actual y evitar cambios por breakpoint; no una promesa de inventario para cada ancho. No asumir que existe una creatividad 320 × 90: puede servirse una menor y quedar espacio libre. Los 90 px también excluyen inventario de 100 px de alto; cambiar a 100 px en móvil puede evaluarse luego como otra decisión de producto. Mantener la ubicación actual solo si las mediciones demuestran que no interfiere con controles del juego. Una versión totalmente automática queda como alternativa separada porque su altura móvil puede cambiar.

No alcanza con reemplazar `728px` por `100%` y añadir `data-ad-format="horizontal"`. Google limita el significado de esa forma general a escritorio. El contrato de tamaño, el espacio reservado y la inicialización del anuncio deben diseñarse juntos. [Parámetros responsive](https://support.google.com/adsense/answer/9183460?hl=en).

## Lo documentado por Google

| Tema | Evidencia y consecuencia para el plan |
| --- | --- |
| Unidad fija | No cambia dinámicamente de tamaño ni responde a orientación. Google recomienda responsive cuando el sitio también lo es. Las unidades fijas admiten ancho mínimo de 120 px, alto mínimo de 50 px y máximo de 1200 px por dimensión. Solo una dimensión puede superar 450 px. Son restricciones de unidades fijas, no una garantía de inventario para cualquier medida. [Guía de tamaños fijos](https://support.google.com/adsense/answer/9185043?hl=en). |
| Responsive automático | Calcula tamaño según espacio y pantalla. Tras cambiar orientación puede pedir otra creatividad y guarda la anterior para reutilizarla al volver. La documentación no promete el mismo comportamiento para cada redimensionamiento de ventana de escritorio. Padres sin ancho determinable, unidades ocultas por JavaScript y padres con altura restringida requieren atención específica. [Comportamiento responsive](https://support.google.com/adsense/answer/9183362?hl=en). |
| Forma horizontal | `data-ad-format="horizontal"` especifica una forma general solo en escritorio. No expresa un máximo de altura móvil. [Parámetros responsive](https://support.google.com/adsense/answer/9183460?hl=en). |
| Expansión móvil | `data-full-width-responsive="true"` favorece expandirse al ancho de pantalla; `false` desactiva esa expansión. Omitir el parámetro todavía permite expansión en algunos casos. Google atribuye mayor potencial de ingresos al comportamiento de ancho completo, sin garantizarlo para este sitio. [Parámetros responsive](https://support.google.com/adsense/answer/9183460?hl=en). |
| Variante avanzada | Google permite ancho variable y altura fija, con ejemplo de `width:100%` y alto de 90 px; también permite tamaños por media queries. Sus ejemplos avanzados omiten `data-ad-format="auto"` y `data-full-width-responsive="true"`. Las reglas que fijan el tamaño de la unidad en hojas CSS externas no cuentan con soporte oficial. Preferir estilos inline o un bloque `<style>` presente en el documento para dimensiones. Su ejemplo de `min-width:400px` no debe copiarse a celulares más angostos. [Modificaciones responsive permitidas](https://support.google.com/adsense/answer/9183363?hl=en). |
| Ancho cero | `availableWidth=0` significa que AdSense midió ancho cero. Google indica establecer el ancho del padre o usar tamaño fijo. [Preguntas frecuentes](https://support.google.com/adsense/answer/10734935?hl=en). |
| Unfilled | `data-ad-status` distingue `filled`, `unfilled` y ahora `unfill-optimized`. No es `data-adsbygoogle-status`, que informa procesamiento. AdSense evita colapsar espacios dentro del viewport para no desplazar contenido. Puede observarse el estado con `MutationObserver`. No recomienda ocultar inicialmente el anuncio esperando que cambie su estado. [Estados de llenado](https://support.google.com/adsense/answer/10762946?hl=en). |
| Reserva de espacio | Reservar altura desde el layout inicial reduce desplazamientos. Colapsar un espacio cuando no llega anuncio también puede causar CLS. La referencia de buena experiencia es CLS de hasta 0,1 en el percentil 75 de visitas. Eso es una métrica global y no demuestra por sí sola que el anuncio no desplaza contenido. [Optimización de CLS](https://web.dev/articles/optimize-cls). |
| Optimización global | El ajuste de optimización de tamaño móvil puede adaptar unidades existentes sin crear otras ni editar código, pero tiene límites: no actúa en primera vista y no optimiza padres con dimensiones restringidas. Ofrece la previsualización `#google_responsive_slot_preview`. Es un mecanismo diferente de corregir esta unidad; activarlo cambiaría un alcance mayor. [Optimización de tamaño](https://support.google.com/adsense/answer/9139818?hl=en). |

Los ejemplos avanzados y la regla sobre omitir `data-full-width-responsive` pertenecen a dos modos diferentes. No conviene inventar una mezcla y afirmar que queda oficialmente garantizada. Seguir la variante avanzada de tamaño explícito como paquete, y comprobar contención con la creatividad real antes de aceptarla. Si se elige responsive automático, `false` expresa de forma documentada que no debe expandirse al ancho de pantalla.

## Reutilizar el slot o crear otro

La guía de creación permite elegir responsive o fijo. La guía avanzada parte de una unidad creada como responsive. No encontré una instrucción primaria actual que garantice convertir cualquier unidad fija existente conservando su slot únicamente al cambiar atributos en el sitio. [Crear unidad display](https://support.google.com/adsense/answer/9274025?hl=en).

La inspección de consola realizada por el agente principal encontró la unidad Layout, slot `1185318534`, con snippet fijo de 728 × 90 y un selector editable que ofrece Fijo y Responsivo. No se cambió selección ni se guardó. Esta evidencia permite proponer reutilizar ese slot y convertirlo explícitamente durante una futura implementación autorizada. El snippet responsive definitivo y la conservación del identificador se verificarán después de guardar en esa etapa; no se consideran verificados ahora.

- Si el slot ya es responsive y el sitio lo fija mediante CSS, reutilizarlo evita un cambio de cuenta innecesario.
- Si es fijo y la consola permite conversión, dejar por escrito el cambio de cuenta y el código resultante como paso posterior autorizado.
- Si no puede verificarse la conversión, proponer una nueva unidad responsive, con nombre identificable, como requisito de implementación. Conservar la unidad previa para reversión.

Estos criterios son recomendaciones de ingeniería y medición. Una unidad nueva separa sus informes, pero no convierte un antes/después en experimento causal. No archivar la anterior como parte de una limpieza: desde el 4 de junio de 2026, archivar una unidad detiene su publicación. [Unidades existentes y archivado](https://support.google.com/adsense/answer/9187347?hl=en).

## Ciclo de vida en React y navegación

La explicación original del tag asíncrono de Google indica un script compartido y un `push` que llena el primer espacio sin inicializar. Es una fuente primaria histórica de 2013, útil para ese modelo básico, no una guía moderna de React. [Anatomía del tag](https://developers.googleblog.com/an-async-script-for-adsense-tagging/).

React documenta un ciclo adicional de setup y cleanup de efectos en desarrollo bajo Strict Mode. Por eso la aceptación debe cubrir duplicación de efectos además de navegación. [Strict Mode](https://react.dev/reference/react/StrictMode).

No encontré una integración primaria moderna AdSense/React que prescriba el algoritmo. La propuesta siguiente es ingeniería inferida:

1. Renderizar la reserva y el contenedor antes de solicitar el anuncio, con ancho calculable.
2. Inicializar una sola vez cada nodo `ins` válido. Un rerender del juego no debe producir otra solicitud.
3. Resolver ancho cero mediante espera a que exista layout útil, con observador acotado y cleanup, no con otro segundo arbitrario ni reintentos permanentes.
4. Cancelar timers, listeners y observadores al desmontar. No borrar atributos internos ni vaciar un nodo procesado para reutilizarlo.
5. Una navegación que realmente crea otro nodo puede inicializar ese nuevo nodo. No usar ticks del juego, cambios de estado ni resize como mecanismo de refresh.
6. Eliminar el retraso de un segundo solo cuando el orden de montaje y disponibilidad de ancho quede probado. Reservar desde el primer render, aunque se mantenga inicialmente el retraso, ya permite evaluar estabilidad.

Google prohíbe refrescar páginas o elementos sin que el usuario haya solicitado refrescarlos. La rotación gestionada por el SDK está documentada por separado y no justifica implementar refresh propio. [Política de ubicación y refresh](https://support.google.com/adsense/answer/1346295?hl=en).

## Matriz de validación que debe incluir el plan

Esta es una propuesta de aceptación, todavía no ejecutada.

| Caso | Prueba y condición esperada |
| --- | --- |
| Layout | Anchos 320, 360, 375, 390, 414, 768, 1024 y 1440 px; añadir ambos lados del breakpoint elegido. Medir ancho real del padre, del `ins` y del documento. Sin scroll horizontal nuevo ni recorte de creatividad. |
| Contenedor estrecho | Probar 320 px de pantalla con padding real. El ejemplo oficial de creatividad de 320 px no cabe automáticamente en todo viewport de 320 px. |
| Orientación | Carga inicial vertical y horizontal, rotación en ambos sentidos y retorno. No añadir `push` desde eventos de orientación. Registrar lo que hace el SDK, separando resultado observado de promesa documental. |
| Render y navegación | Recarga directa, navegación interna, atrás/adelante, cambio de idioma si existe, desmontaje antes de cargar script y rerenders de juego. Una inicialización por nodo. |
| Estado de red | Script lento, bloqueado o fallido, ancho inicial cero que luego crece, `filled`, `unfilled` y `unfill-optimized`. No romper interacción ni insistir indefinidamente. |
| Estabilidad | Medir antes de inicialización, durante carga y después de respuesta. Objetivo local propuesto: ningún salto atribuible a la inserción o al colapso del banner dentro del viewport. Además registrar CLS total. |
| Controles | Revisar distancias a jugar, descargar, compartir y acciones repetitivas del juego. Sin superposición y sin empujar un botón bajo el dedo durante carga. |

Para gameplay Google recomienda separar la publicidad al menos 150 px del juego o retirarla de esas páginas, y exige evitar ubicaciones que induzcan clics accidentales. Es una recomendación fuerte de separación, no debe presentarse como un mínimo universal obligatorio para todos los anuncios. [Anuncios en páginas de juego](https://support.google.com/adsense/answer/2768340).

## Cómo probar sin confundir maquetación con entrega real

Automatizar layout y ciclo de vida con un stub local de AdSense y bloquear la red publicitaria. Simular respuestas de tamaño y estado. Esto puede demostrar contención y estabilidad de nuestro código, pero no fill, inventario, orientación real del SDK ni ingresos.

Después de autorizar la implementación, hacer una comprobación manual breve en dominio aprobado, sin clics en anuncios ni recargas repetidas. Google prohíbe inflar impresiones y clics artificialmente, incluyendo pruebas sobre anuncios reales. [Tráfico inválido](https://support.google.com/adsense/answer/2660562).

No basar el plan en `data-adtest="on"` como si fuera un sandbox documentado para display web. No encontré tal garantía en las fuentes primarias consultadas. El `adtest` que Google documenta expresamente corresponde a AdSense for Search y no se puede trasladar sin más al tag display. [Parámetros de anuncios de búsqueda](https://support.google.com/adsense/answer/9055049?hl=en).

Mantener la configuración de Auto ads, optimización global, Fill empty in-page ads y consentimiento registrada e inmóvil durante la evaluación. Es una recomendación metodológica para atribuir resultados al cambio concreto. Un anuncio no servido no demuestra por sí solo un fallo responsive; hay que distinguir ancho, script, consentimiento, cobertura, política y dominio.
