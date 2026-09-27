# Donaciones directas a Cafecito

Status: ready-for-agent
Work status: resolved

## Alcance y resultado

El enlace del footer conserva «Doname un café» en español y «Buy me a coffee» en inglés. Ahora abre directamente `https://cafecito.app/durancristhian` en otra pestaña mediante el componente compartido `Anchor`, con `noopener noreferrer`.

Se eliminaron el modal de donaciones, PayPal, las tres traducciones exclusivas del modal en ambos idiomas, los estilos de sus botones y la imagen de Cafecito que quedó sin uso. Los documentos históricos conservan sus referencias a la interfaz anterior.

## Verificación local, 2026-09-27

- Base verificada tras `git fetch origin`: `0ea2fb454a6e603d04709a3f7a093408cfb21b48`.
- Rama: `codex/remove-paypal`.
- Worktree: `/Users/durancristhian/Repos/coronabingo-worktrees/remove-paypal`.
- Revisión comprobada: cambios incluidos en el mismo commit que este registro.
- Preparación: copia local autorizada de `.env`, Node `24.21.0`, npm `11.19.0` y `npm ci` satisfactorio.
- `npm run lint:check`: correcto, incluido TypeScript.
- `npm run build`: correcto, incluida la validación de traducciones de `prebuild`.
- `git diff --check`: correcto.
- Servidor del build local: `npm run start -- --port 3129`, después de comprobar disponibilidad del puerto. URL `http://localhost:3129`; proceso de esta tarea `70257`, sesión `17880`, detenido al terminar.
- Comprobación puntual con Chromium y `@playwright/test`, ejecutada mediante `node` desde este worktree: `/` y `/en`, a 1440 × 900 y 390 × 844. En los cuatro casos se verificaron etiqueta, destino, atributos del enlace, foco visible para automatización, apertura de nueva pestaña, ausencia de PayPal y del modal, y ausencia de desbordamiento horizontal. Activación mediante Enter en escritorio y clic en móvil.
- Las solicitudes externas se bloquearon; el destino de Cafecito se interceptó con una respuesta HTML de prueba para comprobar la navegación sin iniciar una donación. No se crearon datos en Firebase.

No se ejecutó la suite de gameplay porque el cambio afecta únicamente al enlace del footer. La validación no cubre el sitio externo de Cafecito, CI, Preview ni Production. No quedan servidores ni datos de prueba de esta tarea.

## Comments

- 2026-09-27: el usuario pidió eliminar PayPal y conservar solo Cafecito. Luego precisó que el enlace del footer debía llevar directamente a Cafecito, eliminando el modal. Implementación local autorizada; publicación pendiente.
