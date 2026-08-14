# Web UI conventions

> For contributors changing `apps/web`. This documents the conventions the codebase already follows so hand-rolled elements don't quietly drift from the shared primitives. When a rule here fights the task in front of you, say so and get a maintainer sign-off — same as any rule in AGENTS.md.

The source of truth is `apps/web/src/components/ui/` plus the token blocks at the top of `apps/web/src/index.css`. Prefer composing those primitives over hand-rolling an element; every rule below exists because a hand-rolled copy drifted.

## Interactive elements

- **Cursor.** Tailwind v4 preflight leaves native buttons at `cursor: default`. Every clickable element needs `cursor-pointer` — either via a primitive (`Button`, `MenuItem`, `Toggle`, … all carry it) or explicitly on raw `<button>`/clickable elements. Pair with `disabled:cursor-not-allowed` (or `data-disabled:cursor-not-allowed` for Base UI) when the control can disable. Elements that are conditionally clickable set both branches: `isClickable ? "cursor-pointer" : "cursor-default"`.
- **Focus.** Never `outline-none`/`outline-hidden` without a visible replacement. The standard ring is `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background` (`ui/button.tsx`). Full-bleed rows that would clip an offset ring use the inset form instead: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/70` (message timeline rows). Controls that sit on a surface with its own inset ring (theme tiles) bump to `ring-offset-2` with the surface's color.
- **Hover.** If a sibling of the same role has hover feedback, the new element gets the same token — not a slightly different one (`hover:bg-accent/20` vs `/50` on adjacent timeline rows was a bug). Hover-revealed controls (`opacity-0 group-hover:opacity-100`) also reveal on keyboard focus (`focus-visible:opacity-100` or `focus-within:opacity-100`).
- **Disabled.** `disabled:pointer-events-none disabled:opacity-64`. 64 is the codebase-wide value; 30/40/45/50/55/60/80 were all drift. Semantically-disabled elements that aren't `disabled` attributes (locked rows, pending cards) use plain `opacity-64` + `cursor-not-allowed`.

## Geometry tokens

Defined in `:root` in `index.css`; the comment there says why: so sidebar, palette, tooltip, and toolbar controls cannot quietly drift apart.

- `--control-radius` — radius for buttons, toggles, sidebar rows, and anything that joins them in a `Group`. Don't substitute `rounded-lg`/`rounded-md` on control-shaped elements; a 2px corner mismatch is visible at group seams.
- `--sidebar-content-inset`, `--sidebar-row-content-inset`, `--sidebar-control-gap` — sidebar paddings. Write `px-[var(--sidebar-row-content-inset)]`, not `px-2.5`, even though the values currently match.
- `--command-shell-inset`, `--command-content-inset` — command palette geometry.
- `--floating-content-inset` — padding inside floating tooltips/cards (`p-[var(--floating-content-inset)]`, not `p-3`).
- `--fade-size` — scroll-fade depth, defaulted in `:root`; don't re-declare `[--fade-size:1.5rem]` inline.
- Settings rows use `ITEM_ROW_CLASSNAME` (`settings/itemRows.ts`): `rounded-xl px-3 py-3 sm:px-4`. Heading/description recipes live in `settingsLayout.tsx` (`text-sm font-medium tracking-[-0.005em]` for row titles, `text-[13px] leading-[1.45] text-muted-foreground/80` for descriptions). Don't invent a third heading scale.

## Glass surfaces

All translucent chrome routes through the classes in `index.css` so the Appearance opacity/blur settings reach it:

- `dropdown-glass` — menus, selects, popovers, comboboxes, autocomplete popups, tooltips, toasts.
- `dialog-glass` / `dialog-backdrop` — dialogs and sheets (sheet backdrops included).
- `chat-composer-glass` — floating pills and toolbars over content.
- `alert-glass` — banner stack.

Don't paint `bg-popover` on a child that fills a glass popup (it cancels the glass), and don't stack a Tailwind `shadow-*` utility on a glass class without meaning to — utilities beat the `@layer components` shadow silently.

## Motion

- Color-only hovers use `transition-colors`, never bare `transition` (which animates transform/filter too). Opacity reveals use `transition-opacity`. State a duration when siblings do.
- The duration scale is 150ms (small controls, dropdown scale/fade, list FLIP) and 200ms (dialogs, sheets, switches, cross-fades). Anything else needs a reason.
- Popups animate **both directions**: `data-starting-style:*` and `data-ending-style:*` (see `ui/tooltip.tsx` for the canonical block). An enter-only popup that vanishes on close is a bug, not a style.
- No continuously repainting animations (AGENTS.md rule). Looping indicators are duty-cycled with `steps()` holds — see the `status-pulse`/`ghost-pulse` keyframes and their comments in `index.css`. New looping animations join the `prefers-reduced-motion: reduce` block there.
- Bulk list changes (shelf expand/collapse) suspend `auto-animate` for the update; per-row transitions keep it (see `toggleShelfWithoutListAnimation` in `Sidebar.tsx`).

## Text

- Never combine `leading-none` (or any line-height ≤ 1em) with `truncate`, `line-clamp-*`, or `overflow-hidden` on a text container — descenders (g, y, p, q, j) clip at the box edge. Truncating labels keep the size's default line-height or `leading-snug`.
- Secondary metadata labels are `text-[11px]`; don't drop to `text-[10px]` for the same role in the same surface.

## Before you ship UI

- If you hand-patched a convention onto a call site (adding `cursor-pointer` to work around a primitive), fix the primitive instead — three palette files carried the same local patch for one wrong base class.
- Diff your new element against its nearest sibling of the same role; matching that sibling's exact class tokens is the review bar.
- PRs with UI changes need before/after images; motion changes need a short video (CONTRIBUTING.md).
