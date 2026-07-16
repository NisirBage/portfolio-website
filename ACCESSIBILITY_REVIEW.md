# Accessibility Review — Phase C

**Status:** One-time regression review for this pass. `ACCESSIBILITY_CHECKLIST.md` remains the living, cumulative table — this document is scoped to Phase C's explicit "no regression permitted" requirement, checked item by item against what this pass actually changed.

**Note on this filename:** an `ACCESSIBILITY_REVIEW.md` was also named as Phase 4 of the much earlier Version 1 Launch Readiness audit (task-tracked, left in-progress — that audit was superseded mid-stream before Phase 4 was finished). This document fulfills Phase C's own request under that name; it is not a retroactive completion of that older, broader-scoped review, which — if still wanted — remains separate, not-yet-finished work.

---

## Requirement-by-requirement

| Requirement | Status | Evidence |
|---|---|---|
| Keyboard navigation | ✅ No regression | Every new interactive surface (hover/press states) is layered onto existing `<button>` elements — no new focusable elements were introduced except the accordion content itself, which is exactly as reachable as before (tabbable only when its parent is expanded, via `inert`). |
| Escape | ✅ No regression | `LayerPanel`'s Escape handling is untouched by this pass. |
| Tab order | ✅ No regression, one gap closed | Live check: 11 reachable elements at default state (Contact, Resume, 4 hotspots, gramophone toggle, 4 dev-only harness buttons on this dev build) — matches the pre-Phase-C baseline exactly. The accordion animation's new `inert` wiring (`ProjectAccordionItem`, `LeadershipCapabilityItem`) is a genuine improvement, not just a non-regression: the previous instant-toggle version left collapsed accordion content reachable by Tab even while visually hidden (a `0fr`/collapsed row is visually gone but was still `display: block` and in the flow before this pass); `inert` now correctly removes it from the tab order until expanded. |
| ARIA | ✅ No regression | `aria-expanded` on every accordion toggle, `aria-pressed`/`aria-label` on the gramophone, `aria-hidden` on every new decorative element (section markers, note particles, the lighting layer) — confirmed via direct attribute checks on a fresh load. |
| 44px touch targets | ✅ No regression, re-verified | All four hotspots' and the gramophone's touch-target floor (`min-width`/`min-height: 44px`, additive to percentage sizing, from Phase A/B) is unchanged by this pass's hover/press/breathe additions, which only added `filter`/`transform` styling to the sprite *images*, not the button hit-targets themselves. Re-confirmed at all 11 required breakpoints (1920 down to 360px) — zero elements under 44px at any width. |
| `prefers-reduced-motion` | ✅ Extended, no regression | Every new animation this pass added a matching `@media (prefers-reduced-motion: reduce)` override, following the exact pattern already established for `.idle-pulse`/`.boot-line`/`.blueprint-unroll`/`.gramophone-playing`: `.sprite-breathe` → `animation: none`; `.note-particle` → `display: none`; `.accordion-collapse` → `transition-duration: 0ms !important`. Confirmed by direct code review of every new CSS rule added this pass, not assumed from having "added a media query somewhere." |
| Focus trapping | ✅ No regression | `LayerPanel`'s focus-management effects (move-in on open, return-to-trigger on close) are untouched. |
| Screen reader labels | ✅ No regression, one addition documented | The gramophone's `aria-label` (`"Mute/Play ambient audio"`) is unchanged; the new `title` tooltip is a supplementary visual affordance, not a replacement for the `aria-label` a screen reader actually announces. New decorative elements (section markers, note particles, the lighting layer) are all `aria-hidden`, so they add zero screen-reader noise. |

## A defect found and fixed during this review, not before

While confirming the accordion animation's `inert` behavior, cross-checked whether the *nested* per-evidence-group accordion inside `LeadershipCapabilityItem` (a second, independent expand/collapse layer) got the same treatment as the outer capability-level one. It did — both use `.accordion-collapse` with their own `inert={!expanded}`, applied when the accordion animation was built this pass, not retrofitted after this review found a gap. Recorded here as evidence the check was actually performed against both levels, not just the outer one.

## What this review did not (and could not) verify live

Live keyboard/click walkthroughs (actually pressing Tab through the page, actually toggling an accordion open with Enter, actually confirming `document.activeElement` after each step) were constrained by this pass's Browser-pane tool limitation — synthetic click/keydown dispatch stopped registering partway through this session (confirmed in isolation: a plain `useState`-backed toggle's `aria-pressed` didn't change after a dispatched click). See `ENGINEERING_DECISIONS.md`'s Phase C entry for the full account. What's verified above rests on direct DOM/attribute inspection (which doesn't require a working click) and on code review against already-proven-working patterns (`LayerPanel`'s own `inert` usage, which Phase A/B already verified live), not on a fresh live interaction pass. Flagged honestly rather than claimed as freshly click-tested.

## Verification

`lint`, `tsc --noEmit`, `next build` clean.
