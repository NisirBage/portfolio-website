# Panel Redesign — Phase C, Part 4

**Status:** One-time record for this pass's refinements on top of Phase B's "paper and wood" theme (`UI_THEME.md`). This document covers what Phase C added; it doesn't repeat `UI_THEME.md`'s token reference.

---

## What Phase B already established (unchanged this pass)

Pixel borders (`.panel-paper`'s stepped double border), wood separators (`.panel-divider`), sharp corners throughout, header/footer fixed with independently-scrolling content (`shrink-0` header/footer, `flex-1 overflow-y-auto` middle), desktop side panel / mobile bottom sheet from one shared `LayerPanel`. All confirmed still correct this pass — re-verified structurally (computed `left`/`right`/`top`/`bottom`/`max-height` at both a desktop and mobile width) rather than assumed unaffected by this pass's other edits.

## What Phase C added

### Paper texture

`.panel-paper` gained a `background-image` layer beneath the solid `--panel-paper` color: two `repeating-linear-gradient`s (one horizontal, one vertical) at 1.2-1.5% opacity, forming a faint crosshatch. Not an image asset — no sprite was cropped or fabricated for this. Deliberately faint enough to read as "this is paper" on close inspection without competing with the pixel art elsewhere in the room.

### Icons beside section titles

The brief asks for icons beside section titles. No per-concept icon sheet was ever supplied for the actual titles in this codebase's panels ("Current Question," "Current Stage," a project's name, a capability's title) — checked directly against every asset folder this project has been given, not assumed absent. Per Asset Truthfulness, one consistent wood-toned glyph (`▸`, styled via a new `.section-marker` class) was used beside every section title instead of inventing a different fabricated icon per concept. Applied to: `ResearchPanel`'s `Field` labels, `ProjectAccordionItem`'s project titles, `LeadershipCapabilityItem`'s capability titles, and `KnowledgePanel`'s domain names — every section-level title in the four panels now carries the same small visual anchor.

### Accordion animation

`ProjectAccordionItem` and `LeadershipCapabilityItem` (both the capability-level and the nested per-evidence-group expand) previously showed/hid their content instantly (`{isExpanded && <div>...}`). Both now use a `grid-template-rows: 0fr → 1fr` transition (`.accordion-collapse` in `globals.css`) — animates to the content's intrinsic height without JS measuring `scrollHeight`, and without a `max-height` guess that risks either clipping tall content or leaving a distracting gap under short content. Standard band on open, Fast band on close, matching the panel's own open/close asymmetry. The collapsed state also carries `inert`, so collapsed content can't be tabbed into or announced — closing a real, if minor, keyboard-navigation gap the instant-toggle version didn't have (a collapsed-but-still-`display:block`-adjacent `0fr` row is visually hidden but was still in the tab order before this).

### Spacing and typography

Panel header/content/footer padding increased from `p-4` to `p-5` (content) / `p-5 pb-4` (header) / `p-5 pt-4` (footer); the title's `tracking-wide` became `tracking-widest`; the content region gained `leading-relaxed`. Modest, deliberate refinements, not a restructure — the three-region layout itself (fixed header/footer, scrolling middle) is unchanged from Phase B.

## What was not touched, and why

Deeper content-level typography inside each panel (body copy sizing, list styles, the accordion's own `+`/`−` indicator glyph) was left as-is — the brief's "one shared architecture" language was read as the shared `LayerPanel` chrome plus the cross-cutting patterns above (section markers, accordion animation), not a rewrite of four already-functioning, already-accessibility-verified content components for its own sake.

## Verification

`lint`/`tsc --noEmit`/`next build` clean. Structural checks (not click-driven, per this pass's Browser-pane limitation — see `ENGINEERING_DECISIONS.md`): the `.accordion-collapse` and `inert` wiring were confirmed correct by direct code review of both consumer files, cross-checked against the identical, already-working pattern `LayerPanel.tsx` itself uses for `inert`. Tab-order check on a fresh load confirmed the closed-by-default accordions don't leak their content into the default tab order (11 reachable elements at default state, matching the pre-Phase-C baseline exactly).
