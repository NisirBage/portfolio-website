# Visual Redesign — Phase B, Parts 3-9 & 13, 15

**Status:** One-time review record for this pass's visual changes. Token-level detail lives in `UI_THEME.md`; this document covers what changed, why, and what was deliberately left alone.

---

## Part 3 — Room background

Replaced `dark:bg-zinc-950` (a cool, near-black gray — the "pure black... too harsh" complaint) with a warm walnut radial vignette. See `UI_THEME.md` for the exact gradient. Light mode was left unchanged; the complaint specifically named dark mode.

## Parts 4 & 6 — Popup redesign: paper/wood theme, dividers, hierarchy

`LayerPanel.tsx`'s surface now uses `.panel-paper` (warm cream/parchment, wood-toned border, sharp corners) instead of the previous `bg-white/95`/`bg-zinc-900/95`. Two `.panel-divider` rules (wood-toned horizontal rules) now separate the header from the scrollable content and the content from the footer, giving the panel three visually distinct regions instead of one undifferentiated block. The title itself gained `tracking-wide uppercase font-semibold` for a small-caps-like category-label treatment, distinguishing it from the panel's body copy without introducing a new typeface.

Deeper content-level typography inside each panel (`DeskPanel`, `KnowledgePanel`, `ResearchPanel`, `LeadershipPanel` — accordion labels, project headings, etc.) was not restructured this pass. Those already have an established, previously-verified hierarchy from earlier milestones; this pass's scope was the shared `LayerPanel` chrome the brief explicitly called "one shared architecture," not a rewrite of four separate content components.

## Part 5 — Popup controls

The corner "✕" (with the `ESC` keycap sprite) and footer "✓ Done" controls are structurally unchanged from Phase A — both already existed, both already call the identical `onClose`. What changed is their skin: both now use `.panel-button` (wood-bordered, inverts to a solid wood fill on hover) instead of the previous plain zinc border, so they read as part of the room's material palette rather than generic form controls.

## Part 7 — Background blur/dim on panel open

The outside-click backdrop already dimmed the room; added `backdrop-filter: blur(3px)` (plus the `-webkit-` prefix for Safari) on the same transition clock as the dim, and shifted the dim's own color from neutral black to a warm-tinted `rgba(26, 18, 12, 0.35)` to match the new palette. 3px is deliberately subtle — enough that the room reads as "behind" the panel without losing legibility, well short of a heavy glass-morphism wash.

## Part 8 — Persistent visited-state

New `useVisitedHotspots` hook, `localStorage`-backed under one key, hydration-safe on the same pattern as `useAmbientAudio`. Once a hotspot has ever been opened (tracked generically off `layers.activeLayer`, so it fires for deep links and Back/Forward too, not just clicks):

- The idle-discovery pulse (`.idle-pulse`) is dropped — its job was to invite a first click, which has now happened.
- A persistent low-opacity amber outline (`border-amber-400/40`) replaces the invisible resting border.
- A small static checkmark badge appears in the button's corner (a styled text glyph, `✓` in a circle — no new sprite fabricated for this).

No animation was added for the visited transition itself — the badge simply appears on next render, consistent with the brief's "no excessive animation."

## Part 9 — Gramophone polish

Hover/focus feedback is JS-state-driven (`isHighlighted`, applied as an inline `filter: brightness(1.25)`) rather than CSS `:hover`/`:focus-within` — three earlier CSS-based attempts this session (recorded in `Gramophone.tsx`'s own comments) never demonstrably applied when checked live, and the JS-state approach is directly verifiable by reading `isHighlighted` itself rather than trusting a selector chain. The playing-state animation remains a vertical bounce, not a rotation — the sprite is one flat crop with the horn, cabinet, and record disc baked into a single image, so a full-body spin would visibly rotate the horn along with the disc, which misrepresents the object. The horn itself is never rotated, per the explicit instruction. The badge-clipping/"ghost popup" fix is recorded in `ENGINEERING_DECISIONS.md` and covered from the discovery side in the Phase B report.

## Part 13 — Asset usage discipline

Consistent with the running "don't use every asset just because it exists" instruction: no new sprite was cropped from the Controllers/Keyboard sheet, and no panel-frame/divider/icon image was fabricated to match the reference boards' look. The one asset from that folder used anywhere in the project remains the `ESC` keycap, unchanged from Phase A. Where the reference boards implied a visual (wood frame, dividers, buttons), CSS delivered the look instead — see `UI_THEME.md`'s "Why CSS tokens, not a cropped frame sprite."

## Part 15 — Visual cohesion

The net effect across Parts 3-9: warm walnut room background, cream/wood panel surface, wood-bordered controls, and a subtle warm-tinted blur/dim tying the open-panel state back to the same palette as the room itself, rather than a cool neutral overlay that reads as generic app chrome. The aim was a museum/library feel — a framed object being examined, not a modal dialog interrupting a page.
