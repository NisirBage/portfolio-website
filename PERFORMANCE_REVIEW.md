# Performance Review — Phase C

**Status:** One-time review for this pass's changes. `PERFORMANCE_BUDGET.md` remains the living, cumulative bundle/asset-weight tracker — this document is scoped to Phase C's specific "no unnecessary rerenders, no layout thrashing, no animation causing layout shifts, 60fps target" requirements.

**Note on this filename:** a `PERFORMANCE_REVIEW.md` was also named as Phase 5 of the much earlier Version 1 Launch Readiness audit (task-tracked, never delivered — that audit was superseded mid-stream by later requests before Phase 5 was reached). This document fulfills Phase C's own request under that name; it is not a retroactive delivery of that older, broader-scoped hiring-manager-perspective review, which — if still wanted — remains a separate, not-yet-written piece of work.

---

## No unnecessary rerenders

Every new piece of state this pass (`useHoverState`'s `isHovered`/`isPressed`, `useAmbientAudio`'s unchanged `isPlaying`) is local to the component that owns it — `DeskHotspot`, `KnowledgeHotspot`, `ResearchHotspot`, `LeadershipHotspot`, and `Gramophone` each hold their own hover/press state independently. Hovering one hotspot re-renders only that hotspot's own subtree, not its siblings or `Workspace` itself — confirmed by code inspection: `useHoverState` returns a new object per call (not memoized, deliberately — each consumer is a leaf component with cheap render cost, and memoizing a hook return value used by exactly one consumer each would be complexity without a measurable benefit, consistent with this project's standing "no speculative optimization" rule from `PERFORMANCE_BUDGET.md`).

`useHoverState`'s handler functions are wrapped in `useCallback` with empty dependency arrays — stable references across renders, so passing `{...handlers}` to a button doesn't create new event-handler props every render.

## No unnecessary layout thrashing

Every Phase C animation targets `transform`, `filter`, or `opacity` — properties the browser can composite without triggering a layout recalculation (`reflow`). None target `width`, `height`, `top`, `left`, or `margin` directly during an animation:
- Hover lift/press-squash: `transform` only.
- Idle breathing: `transform: scale()` only, on a wrapper element separate from the one carrying hover/press transforms (see `MICROINTERACTIONS.md`'s Phase C section for why — avoiding two `transform`-animating mechanisms fighting on the *same* element was itself a layout-thrash/visual-conflict risk this pass specifically designed around, not an incidental choice).
- Backdrop dim/blur: `opacity` and `backdrop-filter`, both compositor-friendly.
- Accordion open/close: `grid-template-rows` is the one exception — it does affect layout by definition (that's the point, it's animating a height), but it's scoped to the one collapsing element's own row track, not the whole document, and was chosen specifically over a `height: auto` transition (which doesn't animate in CSS at all) or a `max-height` guess (which either clips content or leaves a gap).
- Lighting layer: a static `background-image`, no animation at all.
- Note particles: `transform`/`opacity` only.

## No animation causing layout shifts (CLS)

Every new visual element occupies pre-allocated space or is purely an overlay:
- The lighting layer is `position: absolute; inset: 0` — zero layout contribution, it paints over already-sized content.
- Note particles are `position: absolute`, `pointer-events: none` — don't participate in document flow at all.
- The paper-texture `background-image` and `.section-marker` glyphs don't change any element's box size (the marker is inline text before existing label text, not a separately-sized icon box).
- The accordion's `grid-template-rows` animation is the one intentional exception (see above) — it's a deliberate, user-triggered height change (expanding a section the visitor asked to see), not an unexpected shift; Core Web Vitals' CLS metric explicitly excludes user-initiated layout changes from its scoring for this reason.

## 60fps target

Not independently profiled — this environment has no React DevTools Profiler or Chrome Performance panel available, a gap already on record in `PERFORMANCE_BUDGET.md` since Milestone 5 and unchanged by this pass. What can be said with evidence: every animation is compositor-only-property-driven (see above), which is the standard precondition for 60fps on modern browsers without needing a profiler to confirm it frame-by-frame; the one non-compositor animation (`grid-template-rows`) is scoped to a single small DOM subtree (one accordion item's content), not the whole page.

## Bundle impact

See `PERFORMANCE_BUDGET.md`'s Phase C update for exact figures — no new images, two new small source files (`lib/visited.ts` predates this pass; this pass added `hooks/useHoverState.ts` and restructured `lib/audio.ts` without growing it materially), CSS growth for the new keyframes/classes.

## Verification

`lint`, `tsc --noEmit`, `next build` clean (one transient Windows/Turbopack worker crash during this pass's build, resolved on retry — see `ENGINEERING_DECISIONS.md`, consistent with the same pattern already logged twice in this project's history). Live DOM checks across 11 breakpoints found zero horizontal overflow and zero touch targets under 44px, both of which would be the most likely *symptom* of a real layout-thrashing bug if one existed (a thrashing animation fighting the room's own percentage-based sizing would show up as exactly this kind of overflow). No such symptom was found.
