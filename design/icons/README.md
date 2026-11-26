# Functional icons

Coronabingo draws its own functional icons with the [draw-icons](https://skills.ronykax.com/draw-icons) agent skill. Brand logos are separate; see [`components/BrandIcons.tsx`](../../components/BrandIcons.tsx).

- [`icons.yaml`](icons.yaml) holds the set's DNA: outline style, 2-unit stroke on a 24-unit grid, round caps and joins, and circular corners. Changing anything except `stroke` means redrawing every icon.
- `source/` holds the editable geometry, one SVG per icon. Names describe the picture; `data-aliases` lists what the app uses it for.
- The SVGs next to this file are build output. Do not edit them.
- [`components/icons/index.tsx`](../../components/icons/index.tsx) is generated from those SVGs. Icons render at `1em` in `currentColor` and are hidden from assistive technology, so icon-only buttons need an `aria-label`.

## Add or change an icon

1. Install the draw-icons skill for your agent, then follow its drawing steps. Run its CLI from the repository root with `--config design/icons/icons.yaml`, for example `lint all`, `render <name>`, `sheet all` and `build`.
2. Run `npm run generate-icons` to regenerate the components.
3. Import the icon from `~/components/icons` and check it at the size where it appears.
