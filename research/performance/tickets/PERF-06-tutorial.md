# PERF-06: cargar el reproductor al abrir el tutorial

Estado: diagnosticado, pendiente de implementación. Prioridad media a baja. Esfuerzo: 0,5 día. Riesgo bajo. Puede ejecutarse después de PERF-01 para medir la nueva distribución de chunks.

Status: ready-for-agent
Work status: resolved

## Diagnóstico

`pages/index.tsx` importa `react-youtube` estáticamente aunque `showModal` comienza en falso. El conjunto inicial de scripts contiene el chunk `573`, de 7.808 bytes gzip, con `react-youtube` y `youtube-player`. Esto demuestra carga de la biblioteca, no que el video o iframe se descarguen con el modal cerrado. [Baseline](../baseline-2026-09-23.json).

Esperado: diferir hasta aproximadamente 7,8 KB, alrededor de 2% del JS de portada. El chunk puede contener dependencias compartidas; no se promete eliminarlo completo.

## Alcance

Diferir el reproductor hasta intención de apertura y conservar el modal, videos por idioma, tamaños y accesibilidad. Si se precarga al foco/hover, documentar ese disparador. No reemplazar YouTube ni cambiar contenido.

## Aceptación

- Sin intención de apertura, no se descarga el código específico del reproductor; capturar requests para distinguir biblioteca, SDK remoto e iframe.
- Apertura en español e inglés con caché fría y conexión limitada funciona; cierre detiene reproducción y restaura foco; reapertura no crea reproductores duplicados.
- Error de carga muestra salida/reintento utilizable. No agregar una precarga global que anule el ahorro.
- Medir entrada y apertura por separado; checks comunes del [índice](../README.md).

Rollback: restaurar import estático del reproductor. [Next: carga diferida](https://nextjs.org/docs/pages/guides/lazy-loading).

## Comments

- 2026-09-24: el usuario autorizó la implementación y pidió agregar una regresión Playwright que compruebe que el video sigue apareciendo y que el modal abre, cierra y reabre correctamente.
- 2026-09-24: [PR #190](https://github.com/durancristhian/coronabingo/pull/190) quedó abierto contra `main`. En el commit de implementación `0a33c99`, [GitHub Actions](https://github.com/durancristhian/coronabingo/actions/runs/36057434259) pasó instalación, lint/tipos, build, análisis de bundles y las cinco pruebas Playwright en 1 minuto 47 segundos. Vercel marcó el deployment como Ready y se verificó el Preview: sin recursos del reproductor antes de abrir, chunk/SDK/iframe después, videos correctos en ES/EN, cierre con desmontaje y foco restaurado, y reapertura española sin duplicados. No se hizo merge ni despliegue a Production.

## Answer

Implementado el 24 de septiembre de 2026. `react-youtube` ahora se carga con `next/dynamic` solo mientras el modal está abierto. El modal conserva los videos por idioma, muestra estado de carga y, si YouTube falla, ofrece un enlace directo y localizable al video correcto.

En el build comparable, la portada bajó de 230.605 a 226.627 bytes gzip: 3.978 bytes menos, 1,72%. El código del reproductor dejó el manifiesto inicial y quedó en un chunk diferido de 5.784 bytes gzip. El test de red verifica que ese código no llega con el modal cerrado y sí llega al abrirlo.

La nueva regresión Playwright cubre carga del iframe, ID español, apertura, Escape, botón de cierre, restauración de foco, desmontaje, reapertura sin duplicados, fallback por error y variante inglesa. Las cuatro pruebas enfocadas pasaron contra el build de producción aislado y Firestore Emulator. También se comprobó en navegador con YouTube real el iframe correcto para ambos idiomas y el modal a 390 × 844 px. Método, resultados y límites están en [la evidencia de PERF-06](../perf06-evidence/README.md).

Pasaron `npm run lint:check`, `npm run validate-tickets`, `ANALYZE_BUNDLE=1 npm run ui-tests:production` y `git diff --check`. El gate final regeneró el build, validó idiomas y pasó las cinco pruebas Playwright, incluida la regresión completa de anfitrión/jugador, en 12,7 segundos. El PR y sus checks se agregarán a este registro antes del handoff. No se hizo merge ni despliegue a Production.
