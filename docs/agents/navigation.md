# Source navigation

Use this map to find entry points, then follow their imports. Commands and setup remain in the [development guide](../development.md).

| Task | Start here |
| --- | --- |
| Create a room | [Homepage](../../pages/index.tsx), [CreateRoom](../../components/CreateRoom.tsx), [room model](../../models/room.tsx) |
| Configure a room | [Room setup page](../../pages/room/[roomId]/admin.tsx) |
| Room and player screens | [Room page](../../pages/room/[roomId].tsx), [player page](../../pages/room/[roomId]/[playerId].tsx) |
| Shared state and writes | [Room](../../contexts/Room.tsx), [Player](../../contexts/Player.tsx), [Players](../../contexts/Players.tsx), [room model](../../models/room.tsx), [player model](../../models/player.tsx), [Firestore](../../utils/firebase.ts) |
| Number board | [SelectedNumbers](../../components/SelectedNumbers.tsx), [responsive regression](../../tests/ui/number-board-responsive.spec.ts) |
| Cards and marks | [Tickets](../../components/Tickets.tsx), [Cells](../../components/Cells.tsx), [player state](../../contexts/Player.tsx) |
| Global styles and design | [CSS directory](../../public/css/), [design system](../../public/css/design-system.css), [approved design context](../../.better-web-ui.md) |
| Translations | [Spanish](../../locales/es/), [English](../../locales/en/); use the namespace passed to `t()` to select the file |
| Manual ads | [Ads](../../components/Ads.tsx), [AdScript](../../contexts/AdScript.tsx); [real-ad limits](../development.md#analytics-and-product-references) |
| Analytics | [Event contract](../../interfaces/analytics/Events.ts), [payload construction](../../utils/analyticsEvents.ts), [delivery](../../utils/gtag.ts), [URL context](../../utils/analyticsPageContext.ts) |
| Shared browser-test setup | [Fixtures](../../tests/ui/fixtures.ts), [room setup helpers](../../tests/ui/room-setup.ts) |
| Test runtime and isolation | [Runner](../../scripts/ui-tests.js), [service ownership](../../scripts/ui-test-runtime.js), [config](../../tests/ui/config.js), [environment](../../tests/ui/environment.js), [emulator rules](../../tests/ui/firestore.rules) |
| CI and hooks | [Workflow](../../.github/workflows/push.yml), [package scripts and hooks](../../package.json) |

## Find a file, then read it

Run these examples from the checkout root. For an uncertain path, discover filenames first:

```bash
rg --files models contexts hooks tests/ui .github | rg '(room|Room|player|Player|fixtures|environment|push)'
```

Inspect the returned paths before the next read. Source files use both `.ts` and `.tsx`; runtime configuration includes `.js` files.

For a behavior, identify candidate files before printing their contents:

```bash
rg -l 'createRoom|createPlayer' pages components contexts models hooks utils
```

Search selected files with `rg -n` and limited context. Scope asset or dependency investigations to their own directories so generated catalogs and minified bundles do not fill ordinary source searches.

Find local tasks through the [tracker's discovery procedure](issue-tracker.md#find-and-organize-work). Resolve installed Next.js or skill references using the [development guide](../development.md#installed-references).

## Keep discovery output usable

For tool discovery, return matching names and short descriptions, then inspect the selected tool's full interface. When batching independent reads, budget their combined output as well as each individual result. Recover any truncated required instructions before relying on them, using a separate read for the missing file or section.
