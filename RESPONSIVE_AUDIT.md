# Responsive Audit — Phase A

**Status:** One-time review record, not a living document. Every number below is measured against a fresh production build (`rm -rf .next && npm run build && npm run start`), not assumed from the CSS alone — this project has repeatedly found real gaps between "the CSS should work" and "it does work" (the original `left: auto` over-constrained-position bug, the horizontal-overflow-from-closed-panels bug, both documented in `ENGINEERING_DECISIONS.md`), so nothing here is reported without a live measurement.

---

## The 10 required breakpoints

| Width | Overflow | Images loaded | Touch targets ≥44px | Notes |
|---|---|---|---|---|
| 1920px | None | 24/24 | N/A (desktop) | Room capped at 1024px by `max-w-5xl`, centered |
| 1600px | None | 24/24 | N/A | Same cap |
| 1440px | None | 24/24 | N/A | Same cap |
| 1280px | None | 24/24 | N/A | Same cap |
| 1024px | None | 24/24 | N/A | Cap boundary — container transitions from fixed 1024px to fluid-minus-padding exactly here |
| 768px | None | 24/24 | Yes (measured, smallest was 74×92px before this pass even started) | |
| 540px | None | 24/24 | **No → Fixed** (see below) | |
| 430px | None | 24/24 | Yes, after fix | |
| 390px | None | 24/24 | Yes, after fix | |
| 360px | None | 24/24 | Yes, after fix | Smallest required width — the room container itself becomes exactly 328px (360 minus 16px padding ×2) |

**Zero horizontal overflow at any of the 10 widths**, checked via `document.documentElement.scrollWidth === clientWidth`, the same reliable, paint-independent signal established earlier in this project's verification history (see `PRODUCTION_VERIFICATION.md`'s methodology note on why per-element `getBoundingClientRect()` reads were treated cautiously this session, while `scrollWidth`/`clientWidth` were trusted throughout).

## A real, measured touch-target defect — found and fixed

At 540px viewport width, six interactive elements measured below the ~44px floor `Requirement 14` sets:

| Element | Before | After |
|---|---|---|
| `LayerPanel` Close button | 48×24px | 44px+ (added `min-h-11`) |
| `LayerPanel` Done button | 351×30px | 44px+ (added `min-h-11`) |
| Gramophone toggle | 46×43px | 44×44px minimum (added `min-width`/`min-height: 44px`) |
| Contact link | 59×26px | 44px+ (added `min-h-11` + more horizontal padding) |
| Resume link | 98×26px | 44px+ (same fix) |
| Desk/Knowledge/Research/Leadership hotspot buttons | as low as 33×41px at 360px | 44×44px minimum floor added to all four |

The four main hotspots weren't caught at 540px (their percentage-based click zones were still comfortably above 44px there) — they only failed once testing reached 360px, the narrowest required width. This is worth naming as a methodology point, not just a result: **testing only the largest few mobile breakpoints would have missed this.** Percentage-sized click zones shrink linearly with the room container, so a zone that's safely oversized at 540px can cross the 44px floor by 360px purely from arithmetic, with no other change. All 10 required widths were tested for exactly this reason.

**Fix pattern**: every affected element already had percentage-based or content-based sizing (correct — it needs to scale with the room/content). The fix adds `min-width`/`min-height: 44px` (via inline style for room sprites tied to `getSpritePlacement`, via Tailwind's `min-h-11` utility for panel/link buttons) as a floor, not a replacement — the percentage sizing still governs at every width where it's already ≥44px, so nothing changed visually at 768px and above. Verified: 0 elements below 44px at any of the 10 breakpoints after the fix, re-measured on a fresh production build, not assumed from the CSS change alone.

## Camera behavior across widths

The camera's math (`cameraTransform()` in `useCamera.ts`) operates entirely in percentages of the room canvas — it has no viewport-width term at all. Zooming to a hotspot produces the identical `scale`/`translate` values regardless of browser width; what changes is only how large the resulting CSS pixels render, which is exactly the intended "room always fills its container, container always fits the viewport" behavior. Confirmed via source reading (no responsive-specific branching exists in the camera code) and cross-checked empirically: the establishing-shot identity transform (`scale(1) translate(0%, 0%)`) was confirmed byte-identical at 1920px and at 360px.

## Panel behavior across widths

`LayerPanel` is `w-96 max-w-full` — a fixed 384px panel down to where `max-w-full` starts binding (any viewport where the room's own outer container is narrower than 384px), at which point it becomes exactly as wide as that container. At 360px specifically, this measured out to a genuinely full-width panel (`360px`, matching the container exactly) — which naturally satisfies "on phones, panels should become modal cards" (Requirement 10) via the *same* CSS mechanism used at every other width, not a separate mobile-specific panel component. Verified live: opening a panel at 360px produces zero horizontal overflow, and the panel's own internal scroll region (see `INTERACTION_FLOW.md`) still correctly isolates content-scrolling from header/footer at this width.

## What wasn't found to be a problem

Sprite collisions, clipped sprites, and layout instability were checked at every breakpoint (image completeness + no-overflow are necessary but not sufficient — also spot-checked hotspot button dimensions stayed proportionate and non-overlapping at the extremes, 1920px and 360px) and none were found. The room's percentage-based sprite system (`getSpritePlacement`, used by every sprite in the codebase) scales every object proportionally by construction — there's no discrete breakpoint logic anywhere that could introduce a width where objects suddenly overlap or clip that wasn't already true at every other width.
