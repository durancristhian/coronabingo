# PERF-11: investigar cómo reducir el peso de los assets

Status: ready-for-agent

Work status: open

Type: research

Blocked by: None (puede investigarse sin esperar PERF-09, PERF-10 ni PERF-03).

Estado: ticket de investigación aprobado para su registro el 26/09/2026. No iniciado. La prioridad de las conversiones se decidirá con los resultados.

## What to build

Un diagnóstico que permita decidir qué imágenes, animaciones y audios conviene aligerar para que la persona descargue menos datos al usar la app, conservando la calidad y el comportamiento. La entrega incluye un inventario actualizado, alternativas comparadas y recomendaciones verificables; no reemplaza automáticamente recursos de producto.

## Contexto y alcance

La [revisión del 26/09](../revalidation-2026-09-26/README.md) confirmó recursos pesados, pero no probó conversiones ni estableció cuánto se usan. El peso total del repositorio no equivale al peso de una visita. Algunos recursos se descargan al abrir opciones o reproducir un sonido.

1. Inventariar los assets locales servidos por la app y localizar sus consumidores. Registrar tipo, tamaño, dimensiones o duración cuando corresponda, y distinguir recursos activos, duplicados y candidatos sin uso verificable. No borrar archivos durante el diagnóstico.
2. Identificar qué se descarga en portada, entrada a sala, cartones, selector de fondos y reproducción de sonidos. Separar primera visita, caché caliente y carga optativa, y registrar si cada afirmación proviene del código o de una traza de navegador.
3. Elegir los candidatos con mayor ahorro útil y comparar alternativas temporales de dimensiones, formatos o compresión. Conservar los originales y comprobar calidad visual o mediante escucha, duración, loop, transparencia, canales y volumen según el recurso.
4. Revisar compatibilidad, coste de decodificación y consecuencias sobre preferencias guardadas y URLs compartidas. La investigación puede usar candidatos aislados sin esperar que exista el mecanismo de versionado.
5. Entregar una recomendación por candidato: convertir, mantener o investigar más, con bytes actuales y propuestos, ahorro porcentual del recurso, recorrido beneficiado, esfuerzo, riesgos y comprobaciones pendientes.

El JavaScript de Firebase se trata en PERF-10. No modificar contenido remoto elegido por usuarios, configuración de Vercel, datos de salas, dependencias ni assets publicados para completar esta investigación. Usar datos aislados si hace falta recorrer una partida y seguir las reglas vigentes del repositorio.

## Aceptación

- [ ] Inventario fechado y reproducible, con revisión de código, alcance y consumidores de los recursos. Distinguir tamaño en disco, bytes transferidos y reutilización desde caché.
- [ ] Evidencia de los recorridos que descargan los candidatos elegidos; no sumar todo el catálogo como si se cargara al entrar ni multiplicar bytes por las celdas que reutilizan la misma URL.
- [ ] Comparación de alternativas para los recursos con mayor margen. Incluir al menos un candidato de animación o imagen y uno de audio si siguen activos; justificar cualquier exclusión. Documentar parámetros, tamaños y muestras recuperables.
- [ ] Revisión visual y auditiva según corresponda, con resultados de compatibilidad y límites explícitos. No recomendar solo por tamaño ni llamar equivalente a una alternativa cuya calidad no se comprobó.
- [ ] Separar ahorro por archivo, ahorro por recorrido y ahorro condicionado a caché. No prometer mejora de carga o sincronización basándose únicamente en la compresión.
- [ ] Actualizar las recomendaciones y evidencia de PERF-03, PERF-07 y PERF-08 donde corresponda. Proponer tickets adicionales solo para oportunidades distintas, sin duplicar los existentes ni iniciar sus implementaciones.
- [ ] Registrar comandos, herramientas, revisión, entorno y resultados en la evidencia vinculada. Concluir también si algún recurso debe mantenerse igual. El cierre exige recomendaciones sustentadas, no alcanzar un porcentaje predeterminado.

## Relación con otros tickets

- [PERF-03: caché de assets versionados](PERF-03-cache-assets.md): coordinar estrategia de URLs y caché para una implementación futura; no bloquea medir o comparar candidatos.
- [PERF-07: GIF de coronavirus](PERF-07-gif.md): reutilizar el ticket para la animación si sigue siendo candidata y actualizar su estimación con conversiones reales.
- [PERF-08: audios grandes](PERF-08-audios.md): reutilizar el ticket para las recomendaciones de audio, conservando compatibilidad de reproducción y enlaces.

## Comments

### 2026-09-26: desglose aprobado con to-tickets

El usuario pidió un ticket específico para investigar la reducción de peso de assets y aprobó su independencia de las mejoras de Firestore y anuncios. Se registra como investigación; todavía no se realizaron conversiones, mediciones nuevas ni cambios de producto dentro de este ticket.
