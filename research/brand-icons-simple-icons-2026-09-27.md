# Logos de marca para el rediseño

Fecha de revisión: 2026-09-27

## Recomendación

Usar [`simple-icons`](https://www.npmjs.com/package/simple-icons) para WhatsApp, Telegram, PayPal y X. Es la alternativa que la propia documentación de [Lucide recomienda para logos de marca](https://github.com/lucide-icons/lucide/blob/main/BRAND_LOGOS_STATEMENT.md). Mantendría `lucide-react` para los pictogramas funcionales y reservaría Simple Icons para estos cuatro logos.

Conviene depender del paquete oficial `simple-icons`, no de un wrapper React mantenido por terceros. La versión revisada, `16.33.0`, publica ESM, tipos TypeScript y `sideEffects: false`. Su documentación recomienda imports ESM con nombre para que Webpack elimine los iconos no usados. Esto encaja con Next.js Pages Router y el Webpack actual del proyecto. [Manifiesto del paquete](https://github.com/simple-icons/simple-icons/blob/develop/package.json) y [uso oficial](https://github.com/simple-icons/simple-icons#node-usage).

## Cobertura y color

Los cuatro recursos existen como SVG monocromos con `viewBox="0 0 24 24"`. Cada export incluye `path`, `title` y un color de marca en `hex`. La [fuente de datos oficial](https://github.com/simple-icons/simple-icons/blob/develop/data/simple-icons.json) registra:

| Marca | Export ESM | Slug SVG | Hex de Simple Icons |
| --- | --- | --- | --- |
| WhatsApp | `siWhatsapp` | `whatsapp` | `#25D366` |
| Telegram | `siTelegram` | `telegram` | `#26A5E4` |
| PayPal | `siPaypal` | `paypal` | `#002991` |
| X | `siX` | `x` | `#000000` |

El mismo `path` puede renderizarse con `fill="currentColor"` para la variante monocroma o con `fill={'#' + icon.hex}` para la variante de marca. Simple Icons también permite descargar los SVG y cambiar su color, pero usar los objetos del paquete evita duplicar assets y mantiene el origen explícito. [API y formatos oficiales](https://github.com/simple-icons/simple-icons#node-usage).

Patrón propuesto para React:

```tsx
import type { SimpleIcon } from 'simple-icons'
import { siPaypal, siTelegram, siWhatsapp, siX } from 'simple-icons'

const BrandIcon = ({ icon }: { icon: SimpleIcon }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d={icon.path} />
  </svg>
)
```

El import debe permanecer estático y nombrado. `import * as icons` incluiría el catálogo completo en el módulo y perdería la ventaja de limitar la salida a cuatro recursos.

## Licencia y marcas

El código y los recursos propios de Simple Icons se publican bajo [CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md), pero esto no concede derechos sobre las marcas. La licencia excluye expresamente derechos de marca y permisos de terceros. El [disclaimer de Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) aclara además que CC0 del proyecto no implica que cada logo lo sea y pide comprobar las reglas de cada empresa.

En los datos revisados, los cuatro iconos tienen el campo de licencia individual vacío. No hay que interpretar esa ausencia como permiso irrestricto. Las referencias oficiales disponibles son:

- [WhatsApp Brand Resources](https://about.meta.com/brand/resources/whatsapp/whatsapp-brand/), enlazada por Simple Icons como fuente y guía.
- [Telegram Logos](https://telegram.org/tour/screenshots), que permite el uso en ilustraciones, gráficos y botones de reenvío siempre que no parezca una representación oficial de Telegram.
- [PayPal Media Resources](https://newsroom.paypal-corp.com/media-resources), que distribuye logos oficiales en blanco y negro.
- [X Brand Toolkit](https://about.x.com/en/who-we-are/brand-toolkit), que condiciona el uso a sus reglas de marca y demás políticas.

Para la kitchen sink mostraría cada logo en dos muestras: `currentColor` y el hex registrado por Simple Icons. La app final debería usar color de marca sólo donde refuerce el destino, por ejemplo en acciones de compartir o donar, y conservar la versión monocroma cuando los cuatro logos aparezcan juntos. No modificaría proporciones ni trazados.
