# Evidencia de la reverificación funcional

Fecha: 2026-09-26. Revisión probada: `8e35fa47cfafc4e0095dbb6bb3eb5f1123595e8e`.

Dos ejecuciones aisladas reprodujeron CB-01 y CB-03 y verificaron que CB-02 conserva el alta pendiente después de borrar otro participante, confirmar y recargar. `run.log` y `results-first-run.json` registran la primera ejecución; `recheck.log`, `results.json` y `results/` corresponden a la segunda.

El propietario decidió mantener CB-03 como diseño intencional y aceptar CB-01 como limitación fuera del uso previsto de una pestaña por jugador. Las dos aserciones fallidas quedan como evidencia de la hipótesis original del diagnóstico. **No son requisitos aprobados ni pruebas de regresión para CI.** Las decisiones vigentes están en el [informe canónico](../functional-audit-2026-09-23.md#comments).

Los archivos `high-priority.spec.ts` y `probes.config.ts` conservan las reproducciones, fuera de `tests/ui`. Su ejecución deliberada devuelve exit code 1 mientras se mantengan los comportamientos aceptados:

```bash
npm run ui-tests -- --config research/functional-audit-2026-09-26-evidence/probes.config.ts
```

Se usa el emulador desechable `demo-coronabingo-ui` y se bloquean conexiones externas. No se incluyen credenciales, sesiones de navegador, datos de producción ni exportaciones de Firestore. Los registros se normalizaron para quitar secuencias ANSI y espacios finales sin alterar los resultados. El archivo transitorio `.last-run.json` no forma parte de la evidencia conservada.
