# Responsive Verification — Phase B, Parts 11 & 12

**Status:** One-time re-audit record, run after this pass's visual changes (warm background, paper/wood panel theme, bottom-sheet mobile panel, visited-state badges). Extends — doesn't replace — Phase A's `RESPONSIVE_BREAKPOINTS.md`, which established the original 10-breakpoint requirement and the touch-target floor fix this re-audit confirms is still in effect.

---

## Method

Live checks on a fresh `next build` production server (not dev-server-specific behavior), at each of the 10 required widths: 1920, 1600, 1440, 1280, 1024, 768, 540, 430, 390, 360px. At each width:

- `document.documentElement.scrollWidth > window.innerWidth` — horizontal overflow check.
- Every `<button>`'s `getBoundingClientRect()` against the 44px touch-target floor (dev-only `CameraTestHarness` buttons excluded — gated to `NODE_ENV === "development"`, never present in what a real visitor loads).
- At one desktop width (1280px) and one mobile width (390/360px), the `LayerPanel`'s own computed `left`/`right`/`top`/`bottom`/`width`/`max-height` — confirming the new responsive side-panel/bottom-sheet split actually resolves to the intended layout, not just that the class names look right.

This pass's live click-interaction testing was constrained by a Browser-pane tool limitation (see `ENGINEERING_DECISIONS.md`'s Phase B "Browser-pane limitation" entry) — panel open/close animation itself wasn't re-verified by actually opening a panel this pass. What's verified below is structural: the panel's responsive *position and sizing* rules, which apply to the DOM regardless of open/closed state, and which are what Part 11/12 actually asked to be re-audited.

## Results

| Width | Horizontal overflow | Touch targets < 44px | Panel layout |
|---|---|---|---|
| 1920 | None | None | — |
| 1600 | None | None | — |
| 1440 | None | None | — |
| 1280 | None | None | Side panel confirmed: `right:0, left:auto, top:0, bottom:0, width:384px, max-height:none` |
| 1024 | None | None | — |
| 768 | None | None | — |
| 540 | None | None | — |
| 430 | None | None | — |
| 390 | None | None | Bottom sheet confirmed: `left:0, right:0, top:auto, bottom:0, width:100%, max-height:717.4px` (= 85% of the 844px test viewport) |
| 360 | None | None | Bottom sheet confirmed: `width:360px, max-height:680px` (= 85% of the 800px test viewport) |

Zero regressions found. The 44px touch-target floor fixed in Phase A (`min-width`/`min-height: 44px`, additive to each hotspot's percentage sizing) still holds at every width after this pass's className changes to those same buttons (adding the conditional `visited`-state border/badge did not touch the sizing styles).

## Part 12 — Mobile as first-class

- **Portrait** (390/360px tested): the panel becomes a bottom sheet at 100% width, capped to 85% of the viewport height so it never fully occludes the room behind it — confirmed via the `max-height` computed values above. Touch targets confirmed ≥44px at the narrowest required width.
- **Landscape**: not a separate code path — the `sm:` breakpoint (640px) is a viewport-width query, not an orientation query, so a phone in landscape (typically ≥640px wide) automatically gets the desktop-style side panel, which is the desired "landscape reads more like desktop" behavior without any additional media query.
- **Browser support**: no feature used in this pass (CSS custom properties, `radial-gradient`, `backdrop-filter` with a `-webkit-` prefix, Tailwind's `sm:` breakpoint) is new or unusually unsupported in Android Chrome, Safari (mobile or desktop), or Edge Mobile — reviewed at the source level, consistent with every prior pass's browser-compatibility methodology (`ASSUMPTIONS.md` A13-A19), not independently tested on real hardware in this environment.

## Honest gap carried forward

Real-device / non-Chromium testing remains untested, unchanged from every prior pass's own admission — this environment provides one Chromium-based automated browser. `backdrop-filter`'s Safari-specific `-webkit-` prefix was included specifically because Safari support was already a known consideration, not newly discovered here.
