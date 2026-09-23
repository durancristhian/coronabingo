# Diagnóstico funcional local de Coronabingo

Fecha: 23 de septiembre de 2026. Código auditado: `4f14279d882b67075c2989c041db21e34431b4a0`.

Se encontraron cuatro fallos funcionales y un fallo menor de traducción, reproducidos en navegador. No se implementaron correcciones, no se hizo commit y no se modificaron configuraciones de cuentas ni reglas de Firebase.

## Entorno y alcance

- Node 24.21.0, npm 11.19.0, Next.js 16.3.6 y React 18.3.1.
- Aplicación local en `http://localhost:3124`, inicialmente con `npm run dev -- --port 3124`.
- Firestore remoto de desarrollo, proyecto `coronabingo-dev`, verificado desde la configuración local. No es un emulador ni una prueba de producción.
- Chrome. Anfitrión en `localhost` y jugador en `127.0.0.1`, con almacenamiento de aplicación separado por origen dentro del mismo perfil. Para los conflictos de marcas se usaron dos pestañas del mismo origen.
- Sala sintética creada para esta auditoría: `uw0qk1jIjDnrRKBLzIJz`, nombre `QA bugs 20260923`. Se modificaron exclusivamente sus datos de prueba, incluida la eliminación de Beto al reproducir la baja de participantes. La sala queda conservada.
- Revisión móvil puntual a 375 × 812 y escritorio. En la pantalla de juego medida, `innerWidth` y `scrollWidth` fueron 375; no hubo desborde horizontal en esa comprobación.
- Las capturas y observaciones están en [la carpeta de evidencia](functional-audit-2026-09-23-evidence/observations.json).

## Lo que funcionó

Crear una sala, agregar dos participantes, elegir anfitrión, repartir dos cartones por persona y abrirlos desde la lista. El número 22 sorteado por el anfitrión llegó a la sesión del jugador. Una marca sobrevivió a una recarga simple. Reiniciar llevó al anfitrión a preparación y mostró al jugador que la sala se estaba configurando. La navegación principal al cambiar a inglés conservó la sala y tradujo el contenido revisado. El acceso directo al cartón del anfitrión pidió el código cuando se activó esa opción.

Pasaron `npm run lint:check`, `npm run validate-locales`, `npm run validate-tickets` y `npm run build`. Se revisó también la salida del validador de cartones, que mostró éxito. [Log de compilación](functional-audit-2026-09-23-evidence/build.log).

Al terminar se detuvo el servidor de desarrollo, se compiló y se inició `npm run start -- --port 3124`. Esa versión queda corriendo localmente. Inicio, inglés y enlace de sala con prefijo `/es` respondieron 200; las rutas retiradas `/admin` y `/eventos/qa-nonexistent` respondieron 404. En esta compilación se volvieron a observar el error genérico de sala inexistente y el acceso a preparación sin código. [HTTP](functional-audit-2026-09-23-evidence/production-local-http.json) y [navegador](functional-audit-2026-09-23-evidence/production-local-browser.json).

Estos controles no detectan los fallos de interacción siguientes. No existe actualmente una suite de navegador en el repositorio.

## Hallazgos reproducidos

### CB-03. El código del anfitrión se revela desde la preparación de la sala

Prioridad alta. La protección activada se puede eludir usando la propia interfaz.

**Reproducción**

1. Preparar una sala con al menos dos personas. Presionar siete veces el título `Preparar sala` para mostrar las opciones experimentales.
2. Activar `Activar código para el admin`, guardar con `Jugar` y abrir el cartón del anfitrión desde otro origen de navegador.
3. Comprobar que aparece `Ingrese el código de acceso a la sala`.
4. Sin ingresar el código, abrir `/room/<roomId>/admin` en esa misma sesión.
5. La preparación abre sin pedir el código. Presionar siete veces el título permite leer los emojis del código guardado.
6. Volver al cartón del anfitrión e ingresar esos emojis. Aparece `Próximo número` y el resto de sus controles.

**Resultado observado:** la sesión de `127.0.0.1` obtuvo los controles del anfitrión después de leer el código desde preparación. No fue necesario modificar permisos ni desactivar la protección para demostrarlo.

**Causa:** `pages/room/[roomId]/[playerId].tsx:88` aplica el control solamente al cartón del anfitrión. `pages/room/[roomId]/admin.tsx:45` comprueba carga, errores, antigüedad y bloqueo, pero no autorización. Esa página recibe `room.code` y lo muestra al activar las opciones experimentales. El código se compara del lado del cliente en `components/RoomCode.tsx`.

**Propuesta:** definir una autorización del anfitrión verificable para leer datos privados y realizar cambios. Proteger preparación, sorteo y reinicio, y separar el código de los datos públicos de la sala. Un bloqueo visual adicional en `/admin` no basta como solución completa. Antes de implementarlo hay que revisar las reglas reales de Firestore y decidir cómo conservar el acceso sencillo de jugadores sin cuenta.

**Criterio de cierre:** un participante puede acceder a sus cartones, pero no leer la credencial del anfitrión ni editar la sala o sortear mediante UI o peticiones directas. El anfitrión autorizado conserva esas capacidades. Esta auditoría no verificó las reglas de producción ni intentó una explotación por API.

### CB-01. Se pierden marcas al usar el mismo cartón en dos pestañas

Prioridad alta. Pérdida de progreso durante una partida.

**Reproducción mínima**

1. Abrir el mismo enlace de jugador en dos pestañas A y B del mismo origen. Esperar que ambos cartones terminen de cargar.
2. Marcar un número del primer cartón en A.
3. Marcar otro número del mismo cartón en B.
4. Recargar B y observar A.

**Resultado observado:** las marcas de A desaparecen y se sustituyen por las de B. Se reprodujo con dos jugadores distintos. En la segunda prueba A marcó 5 y B marcó 12. Después de recargar B, A mostró solamente 12.

La aserción ejecutada devolvió `CB-01 FAIL: se perdió la marca 5 al recargar la otra pestaña. Actual: 12`. [Resultado estructurado](functional-audit-2026-09-23-evidence/marks-repro.json), [antes](functional-audit-2026-09-23-evidence/marks-before-reload.png) y [después](functional-audit-2026-09-23-evidence/marks-after-reload.png).

**Causa:** `components/Tickets.tsx:58` llama a `updatePlayer`, que en `contexts/Player.tsx:25` modifica únicamente el estado React. `Tickets.tsx:87` escribe una copia del jugador en la clave compartida `roomValues`. Al montar el componente, `Tickets.tsx:71` envía esa copia a Firestore. La otra pestaña recibe el snapshot y `contexts/Player.tsx:63` reemplaza su estado completo, incluso si contenía marcas posteriores que todavía no se habían guardado remotamente.

Las tres posibilidades consideradas, estado local, almacenamiento compartido y reemplazo por snapshot, forman parte de la misma cadena. La recarga simple de una sola pestaña funcionó; el conflicto entre pestañas fue el desencadenante reproducido.

**Propuesta:** persistir cada operación de marcar o desmarcar, con identidad de sala, partida, jugador y cartón. Evitar enviar una copia vieja completa al montar. Resolver concurrencia por operación y definir la migración del almacenamiento existente. Separar las claves de almacenamiento por jugador y partida como respaldo.

**Criterio de cierre:** dos pestañas y dos orígenes convergen sin perder marcas independientes; marcar y desmarcar el mismo número tiene una resolución definida. Recargar, reconectar y reiniciar no recuperan copias antiguas. Cubrir también el cambio de jugador en el mismo dispositivo.

### CB-02. Eliminar un participante descarta las altas pendientes

Prioridad alta. Se pierde trabajo al volver a preparar una sala.

**Reproducción mínima**

1. Iniciar una sala con Ana y Beto para que ambos estén guardados.
2. Reiniciar la partida y volver a preparación.
3. Agregar a Carla, sin presionar todavía `Jugar`. La lista muestra tres personas.
4. Eliminar a Beto y esperar la actualización.

**Esperado:** quedan Ana y Carla. **Observado:** queda solamente Ana, el contador indica `1 de 720` y `Jugar` está deshabilitado. Carla desaparece sin aviso. La observación está guardada en `observations.json`, entrada `CB-02`.

**Causa:** `components/Players.tsx:49` agrega jugadores únicamente a la lista local. En cambio, `Players.tsx:30` elimina directamente el documento remoto mediante `playerApi.removePlayer`. El listener de `contexts/Players.tsx:45` recibe la colección actualizada y reemplaza toda la lista en la línea 60. Como Carla todavía no tiene documento remoto, queda fuera. Las altas recién se guardan al confirmar la preparación en `pages/room/[roomId]/admin.tsx:104`.

**Propuesta:** mantener un borrador de preparación separado del estado remoto y guardar altas, bajas y cambios juntos al confirmar. Evitar que un snapshot destruya cambios pendientes. Como alternativa, hacer todas las operaciones inmediatas, con confirmación de persistencia y recuperación de errores; hay que elegir una política coherente.

**Criterio de cierre:** agregar C y borrar B conserva A y C antes y después de confirmar y recargar. Cubrir también borrar al anfitrión, cambios remotos concurrentes y fallos de guardado.

### CB-04. Sala inexistente y jugador eliminado terminan en un error genérico irrecuperable

Prioridad media. El usuario recibe una acción que no puede solucionar el problema.

**Reproducción**

- Abrir `http://localhost:3124/room/qa-nonexistent-20260923` y esperar la respuesta de Firestore.
- También ocurre al mantener abierto el cartón de Beto y eliminarlo desde preparación.

**Observado:** `Ocurrió un error` y botón `Recargar`, en ambos casos. Recargar la sala inexistente repite el estado. [Captura](functional-audit-2026-09-23-evidence/missing-room.png).

**Causa:** `contexts/Room.tsx:44` y `contexts/Player.tsx:47` convierten documentos inexistentes en `REMOTE_DATA.FAILURE`. Las páginas evalúan el error antes de los mensajes específicos para sala o jugador inexistente. Por eso esos mensajes no se alcanzan en estos casos. `components/Error.tsx` ofrece una recarga genérica.

**Propuesta:** distinguir documento inexistente de fallo de red o permisos. Mostrar un mensaje específico y un enlace para volver a inicio o a la lista de participantes según corresponda.

**Criterio de cierre:** enlace inválido y jugador eliminado muestran su estado específico; una caída transitoria conserva una opción de reintento. Verificar en español e inglés.

### CB-05. Los emojis del código tienen nombres sin traducir en preparación

Prioridad baja. Afecta la descripción accesible de los emojis.

**Reproducción:** abrir preparación, activar las opciones experimentales y mostrar el código del anfitrión. El DOM expone nombres como `playerId:airplane`, `playerId:basketball` y `playerId:deciduous_tree`. En el formulario de ingreso al cartón se traducen correctamente como Avión, Pelota de Básquet y Árbol.

**Causa:** `components/Emoji.tsx` busca los nombres en `playerId`, pero `i18n.json` carga solamente `common` y `admin` para `/room/[roomId]/admin`. Las traducciones existen; el namespace no se carga en esa página.

**Propuesta:** mover los nombres compartidos a `common` o declarar el namespace necesario en preparación.

**Criterio de cierre:** nombres accesibles traducidos en ambas pantallas y ambos idiomas, sin claves `playerId:*`. El validador actual de locales pasa porque comprueba los archivos, no la disponibilidad del namespace en cada ruta.

## Orden propuesto para corregir uno por uno

| Orden | Trabajo | Prueba que debe quedar pasando |
| --- | --- | --- |
| 1 | CB-03: definir y aplicar autorización del anfitrión | Un jugador no puede obtener el código ni ejecutar operaciones del anfitrión |
| 2 | CB-01: persistencia y concurrencia de marcas | Marcar en A y B, recargar B, conservar ambos cambios |
| 3 | CB-02: borrador coherente de preparación | Agregar C, borrar B, confirmar y conservar A y C |
| 4 | CB-04: estados inexistentes | Sala inexistente y jugador eliminado muestran mensaje y salida adecuados |
| 5 | CB-05: traducciones compartidas | Nombres de emojis correctos en preparación e ingreso |

Cada arreglo debe empezar reproduciendo su fallo, incorporar una comprobación en el punto real de interacción, limitar el cambio a ese problema y repetir el recorrido con dos sesiones cuando corresponda. Después, ejecutar los controles existentes. No conviene mezclar estos arreglos con una actualización general de dependencias.

## Límites y pendientes

- No se certificó producción ni se inspeccionaron sus reglas de Firestore. Los hallazgos describen el código actual ejecutado localmente contra desarrollo.
- No se probaron 720 participantes, conflictos simultáneos entre varios anfitriones, desconexión prolongada ni todos los navegadores.
- No se verificaron en esta auditoría exportación XLSX, reproducción audible, tutorial externo, anuncios servidos, validación de ganadores ni una partida completa de 90 bolillas.
- Hay advertencias de APIs antiguas de React en dependencias. No se contaron como bugs funcionales sin un fallo observado.
- La revisión móvil fue puntual y no certifica todas las pantallas ni accesibilidad completa.
- Queda como hipótesis pendiente la conservación de campos de marcas de partidas anteriores al redistribuir cartones: el guardado mezcla datos previos del jugador. No se cuenta como bug confirmado porque no se reprodujo la reasignación del mismo cartón entre partidas.

La sala sintética y los archivos de evidencia quedan disponibles para continuar. El código de aplicación y los archivos de entorno no fueron editados.
