# UI-09: shell, enlaces y 404

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir navegación y estados compartidos que aparecen alrededor de todas las páginas.

## Alcance

- Logo y selector de idioma conservando ruta y parámetros.
- Fallback cuando `localStorage` no está disponible.
- Modal de donación y enlaces del pie.
- Uso de la app con recursos externos bloqueados.
- 404 genérica y rutas retiradas `/admin` y `/eventos/...` en ambos idiomas.

## Criterios de aceptación

- [ ] No se navega realmente a redes, formularios o medios de pago; se validan href o llamadas a `window.open`.
- [ ] El cambio de idioma se prueba al menos en una ruta dinámica.
- [ ] El fallback de `localStorage` reemplaza el contenido roto por el mensaje esperado.
- [ ] Las rutas retiradas no renderizan controles históricos.
- [ ] Los casos de 404 permiten encontrar un camino de vuelta al inicio o documentan la limitación actual.
