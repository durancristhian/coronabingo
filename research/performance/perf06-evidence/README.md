# Evidencia de PERF-06

Verificación local del 24 de septiembre de 2026 sobre la base `2ec2fb6`, en la rama `t3code/analyze-perf-06` y este worktree. Base y candidato usaron Node 24.21.0, npm 11.19.0, Webpack y la configuración aislada de pruebas de UI.

## Resultado

La portada ya no incluye `react-youtube` ni `youtube-player` en su manifiesto inicial. El reproductor quedó en un chunk diferido que se solicita al abrir el tutorial.

| Medida de portada | Antes | Después | Diferencia |
| --- | ---: | ---: | ---: |
| JavaScript sin comprimir | 780.117 B | 768.688 B | -11.429 B |
| JavaScript gzip nivel 9 | 230.605 B | 226.627 B | -3.978 B (-1,72%) |
| Código del reproductor en el manifiesto inicial | 5.879 B gzip | 0 B | diferido |

El chunk diferido del reproductor mide 5.784 bytes gzip en el candidato. No se suma como ahorro permanente: se descarga cuando la persona abre el modal. La diferencia total de portada es menor porque el reparto de módulos y el runtime de carga dinámica también cambiaron. [El JSON de comparación](bundle-comparison.json) conserva las cifras y [el medidor](measure-build.py) reproduce la inspección de un build.

## Comportamiento

El test Playwright de `tests/ui/tutorial.spec.ts` prueba cuatro condiciones:

- con el modal cerrado, no se piden el chunk del reproductor, el SDK remoto ni el iframe; al abrirlo se registran por separado y aparecen una vez;
- con una API de YouTube controlada y el chunk demorado 500 ms, se ve el estado de carga; el iframe español usa `XJpKBegq5GY`, carga contenido interactivo, se desmonta al cerrar con Escape o con el botón, devuelve el foco y reaparece una sola vez;
- si YouTube no carga, el modal español ofrece un enlace directo al video, se puede cerrar y reabrir sin un reproductor atascado;
- la portada inglesa abre correctamente el video `iP0732WuS5E`.

La simulación reemplaza solo los dos recursos externos de YouTube; el componente, la carga dinámica y el modal son los de la aplicación. El iframe simulado se abre y responde a una interacción de reproducción controlada, sin depender de la red de YouTube en CI. Además, se abrió el build local real en `http://127.0.0.1:3139`: los iframes reales de YouTube aparecieron en español e inglés, el cierre desmontó el iframe, el foco volvió a `#watch-tutorial`, la reapertura dejó un único iframe y el modal se revisó a 390 × 844 px. No se certificó audio/video real ni se interactuó con Firebase alojado.

## Comprobaciones locales

- `npm run typecheck`
- `npm run validate-locales`
- `npm run build`
- `npm run ui-tests:ci -- tests/ui/tutorial.spec.ts`: 4 pruebas pasaron contra el build de producción aislado y Firestore Emulator.
- `npm run lint:check`
- `npm run validate-tickets`: informó `There are no tickets with 10 or more`; se inspeccionó la salida además del código de salida.
- `ANALYZE_BUNDLE=1 npm run ui-tests:production`: regeneró el build, validó locales y pasó las 5 pruebas, incluida la regresión completa de anfitrión/jugador, en 12,7 segundos.
- `git diff --check`

## PR y Preview

[PR #190](https://github.com/durancristhian/coronabingo/pull/190) quedó abierto contra `main`. En el commit de implementación `0a33c99f0d529d32456748c0e3cb2be53a34e156`, [GitHub Actions](https://github.com/durancristhian/coronabingo/actions/runs/36057434259) completó instalación, lint/tipos, build, análisis de bundles y las cinco pruebas Playwright. El job pasó en 1 minuto 47 segundos; Playwright informó 5 pruebas pasadas en 9,3 segundos.

Vercel marcó el deployment como Ready. En su [Preview](https://coronabingo-git-t3cod-26fc32-cristhian-durans-projects-3ace6550.vercel.app), la entrada a `/` y `/en` no tenía recursos del reproductor ni iframe. Al abrir cada modal aparecieron, en ese orden lógico, el chunk `818`, `youtube.com/iframe_api` y el iframe del video correcto. El botón de cierre desmontó el iframe y devolvió el foco; el flujo español reabrió con un único reproductor. Esto verifica el Preview, no Production ni la reproducción audiovisual completa.
