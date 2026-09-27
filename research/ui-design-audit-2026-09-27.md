# Auditoría visual del sistema “Mesa de juego”

Fecha: 2026-09-27

Alcance: `/kitchen-sink`, componentes compartidos y tokens de `public/css/design-system.css`

Estado: `needs-changes` antes de aplicar la identidad final a toda la aplicación

## Resultado ejecutivo

Puntaje: **17/20 — bueno**

| Eje | Puntaje | Resultado |
| --- | ---: | --- |
| Accesibilidad | 2/4 | Cuatro hallazgos prioritarios antes de la migración final |
| Responsive | 4/4 | Sin overflow ni controles cortados a 1440, 390 y 320 px |
| Theming y consistencia | 3/4 | Sistema centralizado y coherente; falta fortalecer el token de foco |
| Rendimiento visual | 4/4 | Fuentes autohospedadas, imports modulares y movimiento reducible |
| Anti-patrones | 4/4 | Lenguaje propio, jerarquía clara y sin recursos visuales genéricos |

La dirección se percibe armónica y distintiva. El peso 500 de Fredoka mejora la lectura de los títulos, Atkinson Hyperlegible Next funciona bien para controles y números, y la combinación de bordes oscuros, superficies cálidas y colores de juego mantiene una identidad consistente. La recomendación es aprobar la dirección visual, pero corregir los cuatro hallazgos P1 antes de migrarla por completo.

## Hallazgos prioritarios

### P1 — Los emojis tienen nombre accesible sobre un elemento sin rol semántico

- Ubicación: `components/Emoji.tsx:219-224`.
- Evidencia: axe reportó 29 instancias de `aria-prohibited-attr` porque `<i aria-label>` no admite ese nombre sin un rol apropiado.
- Impacto: lectores de pantalla pueden ignorar o interpretar de manera inconsistente el significado de los emojis del cartón y del bolillero.
- Recomendación: usar `role="img"` cuando el emoji comunica contenido y `aria-hidden="true"` cuando sea decorativo; conservar la traducción actual como nombre accesible sólo en el primer caso.
- Siguiente comando sugerido: `/harden`.

### P1 — El texto secundario del footer no alcanza contraste AA

- Ubicación: token `--cb-muted` en `public/css/design-system.css:6` sobre el fondo del footer definido en `public/css/design-system.css:86-92`.
- Evidencia: `#5d6474` sobre `#c9bdf4` produce **3.41:1**; el mínimo para texto normal es 4.5:1.
- Impacto: el contenido secundario del pie resulta difícil de leer, especialmente para personas con baja visión.
- Recomendación: crear un color de texto secundario específico para superficies violetas o usar `--cb-ink`; no oscurecer globalmente `--cb-muted` sin revisar el resto de las superficies.
- Siguiente comando sugerido: `/colorize`.

### P1 — El anillo de foco violeta es poco visible sobre las superficies principales

- Ubicación: `public/css/design-system.css:74-79` y `public/css/design-system.css:160-165`.
- Evidencia: `#c9bdf4` contrasta **1.59:1** con el canvas y **1.71:1** con la superficie clara; el objetivo para el cambio visual del foco es 3:1.
- Impacto: una persona que navega con teclado puede perder la posición del foco, aunque el control conserve su borde oscuro.
- Recomendación: introducir `--cb-focus` con al menos 3:1 contra canvas y superficies, manteniendo el violeta actual como color decorativo.
- Siguiente comando sugerido: `/colorize`.

### P1 — La tira horizontal de últimos números no puede desplazarse con teclado

- Ubicación: `components/LastNumbers.tsx:27-35`.
- Evidencia: axe reportó `scrollable-region-focusable`; el contenedor tiene `overflow-x-scroll`, no es enfocable y no contiene elementos enfocables.
- Impacto: usuarios de teclado no pueden acceder a números que quedan fuera del viewport.
- Recomendación: hacer enfocable el contenedor con un nombre accesible y un foco visible, o exponer controles explícitos anterior/siguiente.
- Siguiente comando sugerido: `/harden`.

## Mejoras de pulido

### P2 — Parte del texto auxiliar baja a 12 px en móvil

- Ubicaciones representativas: `components/InputText.tsx:55-58`, `components/Select.tsx:71-74`, badges y ayudas equivalentes.
- Evidencia: la revisión computada encontró ayudas, badges y etiquetas a 12 px.
- Impacto: no es por sí solo un fallo WCAG, pero queda justo para una aplicación lúdica dirigida a público amplio.
- Recomendación: llevar la ayuda esencial a 14 px; reservar 12 px para metadatos no esenciales y etiquetas breves en mayúsculas.
- Siguiente comando sugerido: `/typeset`.

### P2 — Algunos enlaces secundarios tienen poca altura táctil

- Ubicaciones representativas: marca del header y enlaces secundarios del footer.
- Evidencia: se midieron alturas visuales de 21–30 px; los controles primarios y botones de marca sí superan 44 px.
- Impacto: en móvil pueden requerir mayor precisión, en particular para usuarios mayores o con motricidad reducida.
- Recomendación: ampliar el área clickeable mediante padding sin aumentar necesariamente el tamaño visual del texto.
- Siguiente comando sugerido: `/adapt`.

## Fortalezas verificadas

- Contraste principal sólido: tinta sobre canvas **11.92:1**, sobre superficie **12.80:1** y sobre número marcado **6.31:1**.
- Los mensajes combinan texto, icono y color; sus iconos semánticos superan 3:1 respecto del fondo correspondiente.
- La jerarquía se entiende como introducción, escenas reales y componentes; no hay bloques repetitivos decorativos ni “AI slop”.
- Lucide forma un sistema funcional consistente y Simple Icons conserva la identidad de WhatsApp, Telegram, PayPal y X sin mezclar logos con pictogramas.
- No hubo overflow de página a 1440 × 900, 390 × 844 ni 320 × 800; controles, cartón y bolillero permanecieron visibles.
- Las animaciones relevantes usan transformaciones/opacidad y el sistema respeta `prefers-reduced-motion`.
- `next/font` autohospeda Fredoka y Atkinson Hyperlegible Next; no se observó una solicitud externa de fuentes.

## Verificación

- Revisión visual y de estilos computados en Chrome local.
- axe-core estable después de finalizar la animación de entrada: 43 reglas aprobadas y 3 grupos de violaciones serias; el contraste del foco se agregó mediante comprobación manual.
- La medición transitoria de contraste de la bolilla actual desapareció después de su animación y no se considera una violación estable.
- La grilla usa contenido y sombras complejas que axe dejó como revisión manual; las mediciones de sus combinaciones principales superaron AA.
- `npm run lint:check`: pasó.
- `npm run build`: pasó con Next.js 16.3.6 y Webpack.
- `npm run ui-tests`: 16/16 escenarios pasaron en 69,5 s contra Firestore Emulator.
- No se leyó ni escribió Firebase alojado durante esta auditoría.

## Orden recomendado

1. `/colorize` para corregir contraste del footer y del foco.
2. `/harden` para semántica de emojis y desplazamiento de últimos números.
3. `/typeset` para normalizar textos auxiliares.
4. `/adapt` para ampliar áreas táctiles secundarias.
5. `/polish` como revisión final y luego repetir `/audit`.

Podés pedirme que ejecute estos ajustes uno por uno, todos juntos o en el orden que prefieras. Después conviene repetir `/audit` para medir la mejora antes de aplicar el sistema final a toda la app.
