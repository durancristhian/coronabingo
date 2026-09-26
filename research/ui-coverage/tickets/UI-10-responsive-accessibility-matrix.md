# UI-10: matriz responsive, idioma, teclado y navegador

Status: needs-triage

Work status: open

Type: task

## Objetivo

Agregar una matriz chica sobre los recorridos existentes. No duplicar todos los escenarios en cada combinación.

## Alcance

- Un smoke de las cuatro páginas activas en ancho móvil.
- Un recorrido corto en inglés.
- Teclado en formularios, tabs y modales.
- Entrada, contención y retorno de foco en modales.
- Evaluación de un segundo motor, Firefox o WebKit, basada en uso real.
- Baselines visuales deterministas de una pantalla por ruta y breakpoint.

## Criterios de aceptación

- [ ] Ninguna acción esencial desaparece en móvil.
- [ ] El recorrido en inglés verifica textos clave y `html[lang="en"]`.
- [ ] Los controles importantes se alcanzan y activan sin mouse, con foco visible.
- [ ] Escape cierra cada modal y el foco vuelve al disparador.
- [ ] Las capturas congelan datos aleatorios, fuentes y animaciones; excluyen anuncios y embeds.
- [ ] La elección de Firefox o WebKit y el costo adicional de CI quedan registrados antes de ampliar la matriz.

## Límite

Playwright puede cubrir teclado y semántica observable, pero no reemplaza un smoke manual con lector de pantalla ni una auditoría completa de contraste.
