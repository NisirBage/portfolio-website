# Responsive Breakpoints — Reference

**Status:** Living document — update this if the room's layout strategy ever changes. Describes *how* this app is responsive, for whoever next needs to touch layout code.

---

## There are no CSS breakpoints in this codebase

This is worth stating plainly, since "breakpoints" is in the title: a `grep -rn "@media" src/` finds exactly two media queries in the entire codebase, and both are `prefers-reduced-motion`/`prefers-color-scheme`, not width-based. There is no `@media (min-width: 768px)` anywhere. The layout is **fluid by construction**, not breakpoint-switched:

- The room container is `w-full max-w-5xl` with a locked `aspect-ratio: 288 / 144` — it fills available width up to 1024px, then stays centered and fixed at 1024px beyond that.
- Every sprite inside the room is positioned with `getSpritePlacement()`, which returns percentages of the 288×144 canvas — every object scales proportionally with the container at every width, continuously, not at discrete steps.
- The camera's pan/zoom math (`cameraTransform()`) operates entirely in percentages of that same canvas — it has no width term.
- `LayerPanel` is `w-96 max-w-full` — a fixed 384px panel that becomes fluid (capped to its container's width) once the container itself is narrower than 384px.

The 10 widths below are **verification checkpoints**, not places where the CSS branches. They were chosen (by the brief that requested this audit) to span real device classes; testing them confirms the fluid strategy holds continuously between them, not that something different happens at each one.

## The 10 verified widths

| Width | Represents | Room container width | Panel width |
|---|---|---|---|
| 1920px | Large desktop | 1024px (capped) | 384px |
| 1600px | Desktop | 1024px (capped) | 384px |
| 1440px | Laptop | 1024px (capped) | 384px |
| 1280px | Small laptop | 1024px (capped) | 384px |
| 1024px | Cap boundary | 1024px (exactly at the cap) | 384px |
| 768px | Tablet | 736px (fluid) | 384px |
| 540px | Large phone (landscape-ish / phablet) | 508px (fluid) | 384px |
| 430px | Large phone | 398px (fluid) | 384px |
| 390px | Standard phone | 358px (fluid) | 384px |
| 360px | Small phone | 328px (fluid) | 360px (`max-w-full` now binding) |

Full measured results (overflow, image loading, touch targets) are in `RESPONSIVE_AUDIT.md` — this file is the reference table, that one is the audit narrative.

## Touch-target floor

Every click target in the room (the 4 content hotspots, the gramophone toggle) and every persistent/panel control (Contact, Resume, panel Close, panel Done) carries an explicit `min-width`/`min-height: 44px` (or Tailwind's `min-h-11`) floor, added during Phase A after live measurement found several dropping below it at narrow widths (see `RESPONSIVE_AUDIT.md`). This floor is additive to the existing percentage/content-based sizing — it only ever makes a target *larger* than the percentage math alone would, never smaller, so nothing changed visually above 540px.

## If a new interactive element is added later

Give it the same treatment: percentage or content-based sizing for proportionality, plus an explicit `min-width`/`min-height: 44px` floor if it's a click target. Verify at 360px specifically — it's the width every touch-target failure this pass surfaced at, and the narrowest of the 10 required widths.
