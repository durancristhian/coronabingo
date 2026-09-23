# Firebase Spark o Blaze para Coronabingo

Fecha de consulta: 2026-09-23. Fuentes oficiales de Firebase y Google Cloud.

## Veredicto

Blaze no cobra una suscripcion fija: conserva cuotas sin cargo y factura solamente el excedente. La cantidad de apps registradas no define el costo. Las cuotas y la facturacion se aplican al proyecto completo y se comparten entre todas sus apps ([planes y relacion entre proyecto y apps](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans#relationship_between_projects_apps_and_billing)). En la consola, sin embargo, `coronabingo` ya muestra un costo pequeno pero real de almacenamiento de Firestore: USD 0,42 en septiembre hasta el dia 22 y un pronostico de USD 0,62 para el mes.

No conviene aceptar el cambio a ciegas porque Blaze vincula una cuenta de Cloud Billing con un medio de pago. Pero tampoco es una mala idea por si misma. Desde el 3 de febrero de 2026, Cloud Storage exige Blaze incluso para seguir usando un bucket existente. Si Coronabingo necesita ese bucket, el cambio es necesario. Si Storage ya no se usa, Spark sigue siendo razonable.

## Que cambia

| Tema | Spark | Blaze |
| --- | --- | --- |
| Medio de pago | No requiere | Requiere una cuenta de Cloud Billing con medio de pago |
| Dentro de las cuotas gratuitas | Sin cargo | Sin cargo en general |
| Al superar una cuota | El servicio afectado deja de estar disponible hasta que se renueve la cuota o se cambie de plan | Se factura el excedente segun uso |
| Cloud Storage | No disponible desde el 3 de febrero de 2026 | Disponible, con cuota sin cargo y excedentes pagos |
| Cloud Functions, App Hosting, Phone Auth y servicios pagos de Google Cloud | No disponibles o limitados segun producto | Disponibles con su respectiva cuota y precio |

Firebase explica que Blaze mantiene las cuotas sin cargo y cobra el uso adicional ([comparacion de planes](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans#blaze-pricing-plan)). Vincular una cuenta de Cloud Billing sube el proyecto a Blaze automaticamente. Desvincularla o cerrarla lo baja a Spark y corta los servicios que requieren facturacion ([cambio de plan](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans#switching_between_pricing_plans)). Una misma cuenta de Billing puede pagar varios proyectos, pero cada proyecto que se vincule queda en Blaze ([cuentas de Cloud Billing](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans#cloud-billing-accounts)).

## Las cuotas relevantes

Coronabingo usa Firestore, Authentication, Analytics y carga el SDK de Storage. No hay Cloud Functions en el codigo de la app.

Para la primera base Firestore de un proyecto, Spark y Blaze incluyen sin cargo:

- 1 GiB almacenado.
- 50.000 lecturas por dia.
- 20.000 escrituras por dia.
- 20.000 eliminaciones por dia.
- 10 GiB de transferencia saliente por mes.

Las cuotas diarias se reinician cerca de medianoche del Pacifico. TTL, copias de seguridad, restauraciones, clonacion y PITR no tienen cuota gratuita ([facturacion de Firestore](https://firebase.google.com/docs/firestore/pricing#free-quota)). Authentication con email y contrasena y Analytics no tienen cargo para este caso; Phone Auth se cobra por SMS ([tabla de precios](https://firebase.google.com/pricing)).

Storage ahora requiere Blaze. Para un bucket legado `*.appspot.com`, la cuota sin cargo sigue siendo 5 GB almacenados, 1 GB descargado por dia, 20.000 cargas por dia y 50.000 descargas por dia. Si el proyecto sigue en Spark, las operaciones devuelven 402 o 403 y los datos quedan guardados pero inaccesibles ([cambio de Storage de 2026](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024#pricing-plan-requirements)). Los buckets nuevos `*.firebasestorage.app` tienen otra estructura de cuota y precio; la tabla actual muestra 5 GB-mes, 100 GB descargados por mes, 5.000 cargas y 50.000 descargas por mes sin cargo, sujetos a las condiciones de Cloud Storage ([precios de Storage](https://firebase.google.com/pricing#cloud-storage)).

## Riesgo concreto en este repositorio

El costo por operaciones es bajo segun el uso real de la consola, pero el almacenamiento persistente de Firestore ya supera la cuota gratuita.

- Las partidas usan listeners en tiempo real de Firestore. Cada participante escucha el documento de la sala y su jugador.
- Ademas, `PlayersContextProvider` escucha la coleccion completa de jugadores en cualquier URL con `roomId`, incluso en la pantalla individual. Una sala de 100 jugadores puede producir unas 10.000 lecturas iniciales de esa coleccion si todos entran. Una de 500 puede producir unas 250.000, antes de contar reconexiones y actualizaciones. Firebase cobra una lectura cada vez que un documento entra o se actualiza en un listener ([facturacion de listeners](https://firebase.google.com/docs/firestore/pricing#listening_to_query_results)).
- Aun asi, el precio base publicado para `us-central1` despues de la cuota es USD 0,03 cada 100.000 lecturas. Como ejemplo orientativo, 250.000 lecturas en un dia dejarian 200.000 facturables y costarian cerca de USD 0,06 en esa region. La region real puede tener otra tarifa ([precios de Firestore por ubicacion](https://cloud.google.com/firestore/pricing)).
- El unico uso directo de Storage hallado es la carga de comprobantes en `pages_/eventos/[eventId].tsx`. Ese formulario tiene una fecha de cierre codificada en agosto de 2020, por lo que parece una funcion vieja. Esta conclusion surge del repositorio, no del estado actual del proyecto en Firebase.
- No hay reglas de Firestore o Storage versionadas en este repositorio. Por eso no pude evaluar desde el codigo si una regla demasiado abierta podria permitir consumo ajeno.

Con trafico chico y sin un pico o bucle de lecturas, la estimacion razonable es USD 0. Con partidas grandes puede haber excedente de Firestore, aunque el precio unitario es bajo. El riesgo serio no es tener una sola app. Es una regla de seguridad permisiva, un bot, un listener que se reconecta sin control o habilitar despues otro servicio pago.

## Auditoria del codigo actual

El "realtime" importante para Coronabingo es Cloud Firestore, no Firebase Realtime Database. El archivo de configuracion conserva `databaseURL`, pero el codigo no importa `firebase/database` ni llama a `firebase.database()`. La sincronizacion de las partidas usa `onSnapshot` de Firestore ([inicializacion](../utils/firebase.ts#L1), [sala](../contexts/Room.tsx#L37), [jugador](../contexts/Player.tsx#L38), [lista de jugadores](../contexts/Players.tsx#L37)). Spark admite estos listeners mientras el proyecto se mantenga dentro de la cuota de Firestore.

### Lecturas y listeners

| Pantalla | Listeners que abre |
| --- | --- |
| Inicio y `/admin` | Ninguno de Firestore. La aplicacion si mantiene el observador de sesion de Authentication. |
| `/room/[roomId]` y `/room/[roomId]/admin` | Un documento de sala y la coleccion completa `rooms/{roomId}/players`. |
| `/room/[roomId]/[playerId]` | Un documento de sala, la coleccion completa de jugadores y el documento del jugador actual. La coleccion completa se escucha aunque esta pantalla no usa `usePlayers`, porque todos los providers se montan globalmente ([providers](../contexts/index.tsx#L10)). |
| `/eventos/[eventId]` | Un documento de evento y toda su subcoleccion `registrations`, incluso cuando el formulario ya muestra que las inscripciones cerraron. |
| `/eventos/[eventId]/admin` | Un documento de evento. Despues del login agrega tres colecciones completas: `registrations`, `players` y `tickets` ([admin de evento](../pages_/eventos/%5BeventId%5D/admin.tsx#L24)). |

La parte mas costosa es el listener global de jugadores. Con `N` participantes conectados a sus cartones, la carga inicial minima es aproximadamente `N x (N + 2)` lecturas: cada persona recibe los `N` jugadores, el documento de la sala y su propio documento. Para 100 personas son unas 10.200 lecturas; para 500, unas 251.000. Ademas, cada cambio del documento de sala se envia a todas las pantallas abiertas y cada cambio de un jugador vuelve a aparecer en todos los listeners de la coleccion. Firestore cobra los documentos que el listener entrega al cliente, incluidas las actualizaciones ([facturacion de listeners](https://firebase.google.com/docs/firestore/pricing#listening_to_query_results)).

### Escrituras

- Crear una sala escribe un documento. La configuracion final escribe la sala y un documento por jugador en un batch ([creacion](../models/room.tsx#L21), [configuracion](../pages_/room/%5BroomId%5D/admin.tsx#L87)).
- Durante la partida, sacar o desmarcar una bolilla actualiza el documento de sala. Son hasta 90 escrituras por partida, mas las de sonidos, festejos y reinicio ([partida](../pages_/room/%5BroomId%5D/%5BplayerId%5D.tsx#L98)).
- Marcar numeros del carton se conserva primero en el estado local y `localStorage`. Al volver a montar el carton, el codigo intenta restaurarlos con una actualizacion del documento del jugador ([cartones](../components/Tickets.tsx#L58)).
- El generador de eventos y la aprobacion de inscripciones escriben lotes grandes, pero pertenecen al flujo administrativo viejo ([generador](../components/EventGenerator.tsx#L50), [aprobacion](../components/Registrations.tsx#L52)).

### Storage y productos ausentes

La carga a Storage esta dentro del formulario de inscripcion a un evento. Ese formulario no se renderiza despues del 15 de agosto de 2020, de modo que la UI actual no puede ejecutar `putString` ([fecha de cierre](../pages_/eventos/%5BeventId%5D.tsx#L128), [carga](../pages_/eventos/%5BeventId%5D.tsx#L78)). El historial de Git ubica ese flujo entre junio y agosto de 2020. Storage no esta completamente muerto: el admin autenticado de un evento todavia puede abrir una inscripcion y ejecutar `getDownloadURL` para ver el comprobante ([imagen](../components/FirebaseImage.tsx#L10)). Ninguna pantalla normal del bingo sube o descarga archivos.

No hay `firebase.json`, `.firebaserc`, reglas de Firestore o Storage, indices, carpeta de Functions ni dependencia `firebase-functions`. El repositorio tampoco configura Firebase Hosting. El README apunta al despliegue historico en ZEIT Now. No hay importacion o activacion de App Check. Estas ausencias describen el repositorio, no prueban que esos productos o reglas no existan en la consola.

La falta de reglas versionadas y App Check merece atencion aunque el proyecto siga en Spark. Crear salas y jugar ocurre sin iniciar sesion; solo el generador y el admin de eventos usan email y contrasena. Por eso las reglas desplegadas deben permitir parte del acceso publico o resolverlo de otra forma que no aparece en este codigo. Sin verlas no se puede afirmar que terceros no puedan agotar las cuotas. App Check ayuda a rechazar clientes no autorizados antes de que lleguen a los recursos protegidos, aunque no sustituye las reglas ([App Check para web](https://firebase.google.com/docs/app-check/web/recaptcha-provider)).

### Conclusion del codigo

No hay una dependencia activa de Blaze en el juego principal. Si los comprobantes de 2020 ya no importan, Storage puede permanecer inaccesible: Firestore mantiene las partidas en tiempo real. El costo de esa decision es que la vista administrativa vieja de comprobantes seguira fallando hasta que se retire el codigo o se reactive Storage con Blaze. El repositorio local apunta a `coronabingo-dev`.

## Auditoria en vivo de la consola

Revision de solo lectura realizada el 23 de septiembre de 2026. No se cambiaron planes, reglas, presupuestos ni datos.

| Proyecto | Plan actual | Senal principal | Decision |
| --- | --- | --- | --- |
| `coronabingo` | Blaze | USD 0,42 en septiembre; pronostico USD 0,62. El cargo es almacenamiento de Firestore. | Mantener Blaze por ahora. |
| `coronabingo-dev` | Blaze | USD 0,00; 10 lecturas, 0 escrituras y 2,17 MB en Storage. | Puede bajar a Spark si se acepta perder acceso al Storage viejo. |
| `classTracker` | Spark | Sin actividad visible ni uso de Firestore o Storage en el panel. | Mantener Spark. |
| `garlicphone` | Spark | Sin usuarios activos; 1.200 lecturas, 232 escrituras y 72,2 MB de Storage historico. | Mantener Spark si esos archivos no se necesitan. El aviso de Storage no obliga a subir. |
| `cremona-dev` | Spark | Sin actividad visible; 15,4 MB de Storage historico. | Mantener Spark si esos archivos no se necesitan. |
| `figuritas` | Spark | Sin actividad visible ni uso de Firestore o Storage en el panel. | Mantener Spark. |

Cuatro de los seis proyectos ya estan en Spark. `coronabingo-dev` puede ser el quinto. No es seguro bajar `coronabingo` a Spark antes de reducir y medir el almacenamiento de Firestore.

### Produccion

En las ultimas 24 horas, Firestore mostro 7.000 lecturas, 862 escrituras, 0 eliminaciones, un maximo de 97 listeners y 33 conexiones activas. Las operaciones estan muy por debajo de las cuotas Spark de 50.000 lecturas y 20.000 escrituras diarias. El problema es el almacenamiento: Billing atribuye los USD 0,42 del mes al SKU `Cloud Firestore Storage`. Con el precio publicado para la ubicacion y el pronostico mensual, el tamano medio facturable parece estar alrededor de 5 GiB, incluidos indices. Es una estimacion; la consola no mostro un contador exacto de GiB.

No hay indices manuales o compuestos configurados. Los indices automaticos de campo unico tambien ocupan espacio y Firestore factura datos, indices y metadatos ([precio de almacenamiento](https://cloud.google.com/firestore/pricing)). El codigo no elimina salas antiguas: la comprobacion `isRoomOld` solo mira si falta el codigo de la sala. Es razonable inferir que documentos historicos de salas, jugadores y cartones, junto con sus indices, explican la acumulacion.

El bucket de produccion ocupa solo 31,9 MB y contiene exclusivamente comprobantes del evento solidario de 2020. Por volumen, Storage no explica el cargo actual ni es el bloqueo para Spark; el bloqueo es Firestore. En `coronabingo-dev`, Storage ocupa 2,17 MB y tambien corresponde al flujo viejo.

### Seguridad y riesgo de consumo

Las reglas desplegadas de Firestore en produccion y desarrollo permiten acceso sin autenticacion a salas y a subcolecciones de jugadores, cartones e inscripciones. Las reglas de Storage de produccion permiten lectura y escritura publica de cualquier ruta. No hay App Check configurado. Esto es un riesgo de manipulacion y tambien de consumo inesperado, incluso si el gasto actual es bajo.

El presupuesto existente es de USD 20 mensuales, con alertas al 50%, 90% y 100%, pero se aplica a toda la cuenta de facturacion. No detiene el gasto y no esta limitado al proyecto Coronabingo.

## Si se decide pasar a Blaze

1. Revisar primero `Project settings > Usage and billing` y las pestañas Usage de Firestore y Storage. Confirmar lecturas, escrituras, almacenamiento y descargas de los ultimos 30 dias ([como ver el uso](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills#view-your-usage-and-spending-levels)).
2. Vincular solo este proyecto a la cuenta de Billing.
3. Crear un presupuesto mensual bajo y acotado a este proyecto, por ejemplo USD 5, con alertas de gasto real y pronosticado. Un presupuesto normal solo avisa: no detiene Firestore ni Storage ([presupuestos y alertas](https://docs.cloud.google.com/billing/docs/how-to/budgets)).
4. No contar con un tope automatico para Firestore o Storage. Los spend caps de Firebase solo cubren Firebase AI Logic, App Hosting, Cloud Functions y Extensions ([limites de gasto disponibles](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills#set-up-budgets)).
5. Revisar reglas de Firestore y Storage, y mirar el panel de Billing durante los primeros dias.

## Decision recomendada

Mantener en Spark los cuatro proyectos que ya estan ahi e ignorar el modal de Storage cuando los archivos historicos no importen. Bajar `coronabingo-dev` a Spark es razonable si se acepta que los comprobantes viejos queden inaccesibles.

Mantener `coronabingo` en Blaze temporalmente. El costo previsto es de alrededor de USD 0,62 por mes, que es pequeno frente al riesgo de cortar Firestore al bajar con mas de 1 GiB almacenado. Antes de intentar Spark en produccion: definir que salas y eventos deben conservarse, limpiar o archivar el resto, endurecer reglas y App Check, corregir el listener global de jugadores y verificar durante varios dias que Firestore quede debajo de la cuota. Ninguno de esos cambios se realizo durante esta auditoria.
