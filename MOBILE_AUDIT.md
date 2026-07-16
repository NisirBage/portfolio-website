# Mobile Audit — Phase H, Part 6

**Status:** New deliverable. Mobile is this phase's own stated highest priority — this document is the full evidence trail, not just a pass/fail summary.

---

## Breakpoints swept

All 8 required portrait/standard widths plus all 3 required phone-landscape sizes, live on a clean, freshly-rebuilt production server (not the long-running dev session, which was independently found to accumulate stale Suspense/HMR state — see `ENGINEERING_DECISIONS.md`'s Phase H entry for why a clean server was used instead):

| Breakpoint | Horizontal overflow | Undersized touch targets (<44px) |
|---|---|---|
| 360×640 | None | 0 of 10 hotspots |
| 390×844 | None | 0 of 10 |
| 430×932 | None | 0 of 10 |
| 540×960 | None | 0 of 10 |
| 768×1024 | None | 0 of 10 |
| 1024×768 | None | 0 of 10 |
| 1440×900 | None | 0 of 10 |
| 1920×1080 | None | 0 of 10 |
| 667×375 (landscape) | None | 0 of 10 |
| 844×390 (landscape) | None | 0 of 10 |
| 932×430 (landscape) | None | 0 of 10 |

All 11 required sizes: zero horizontal overflow, zero undersized touch targets, measured via `getBoundingClientRect()` on every hotspot button (Leadership, Knowledge, Research, Workspace, Timeline, About Me, Future, Contact, Resume, Music), not inferred from CSS alone.

## A real bug this sweep found and fixed

The very first check, at 360×640, returned every hotspot at 0×0 — not "small," genuinely zero. Traced (not assumed) to `AppShell.tsx`: its wrapper `<div inert={!introDone}>` had no sizing classes. As a flex item of `<main className="flex flex-1 flex-col">` with no `flex: 1` of its own, it sized to its own content instead of stretching to fill `main` — and since `Workspace`'s own root relies on `h-full` (which only resolves against a *definite* parent height), the whole tree, including the room's own aspect-ratio box, collapsed to 0 height.

This had been invisible to every check this project ran throughout Phase G, because every one of those checks confirmed element *presence* (`querySelector` still finds a 0-sized element) or image *loading* (`naturalWidth` is independent of the element's own CSS layout) — never `getBoundingClientRect()`. This is exactly why Part 6 asks for a real breakpoint sweep rather than trusting the architecture's own past track record: a regression can hide behind every check except the one that actually measures rendered size.

**Fixed** by giving the wrapper the same `flex flex-1 flex-col` shape `main` itself already uses. Re-verified clean at all 11 breakpoints afterward (the table above reflects the fixed state).

## Mobile Panels (bottom sheet vs. side panel)

`LayerPanel.tsx` already implements the required split — mobile (`<640px`) gets a bottom sheet (`inset-x-0 bottom-0`, slides up via `translate-y`), `sm:` and up gets the original docked side panel (`sm:right-0`, slides in via `translate-x`) — one shared component, two CSS-driven positions, not two components (Phase B, Part 4).

**One real discrepancy found and fixed.** The bottom sheet's `max-height` was `85vh`; the brief specifies "max-height ≈75vh." Lowered to `75vh` — 85vh left too little of the room visible behind an open sheet on short mobile viewports (the brief's own "room visible behind" requirement) and gave less headroom above the sheet for a one-handed backdrop-tap close.

- **Internal scrolling only.** `LayerPanel`'s content region is `overflow-y-auto` with the header/footer `shrink-0` outside it — confirmed structurally unchanged since Phase A's own fix for exactly this (a long panel like Leadership previously scrolled its own title out of view).
- **Room visible behind.** The backdrop is a semi-transparent, blurred overlay (`rgb(26 18 12 / 0.35)`, `backdrop-filter: blur(3px)`), not opaque — the room stays visible and legible behind an open sheet, unchanged from Phase B.
- **Smooth transitions.** `DURATION.panelOpen`/`panelClose` (260ms/150ms) with the project's standard decelerate easing — unchanged, already verified working across every prior phase's live interaction tests.

## Camera

Re-verified live, not just re-read from source: opened the Leadership panel (camera transform measured at `matrix(2.2, 0, 0, 2.2, 140.288, -307.2)` — a real zoom, not a no-op), then dispatched Escape, then re-measured — the camera's transform returned to exactly `matrix(1, 0, 0, 1, 0, 0)`, the literal identity matrix, byte-identical to the resting state before the interaction. No drift, because there is no accumulated math to drift: `useCamera.ts`'s `reset()` always calls `focus(CAMERA_IDENTITY, ...)`, and `CAMERA_IDENTITY` is one fixed constant object, never recomputed. This holds across every close path (Escape, Done, ✕, backdrop click, Browser Back, switching hotspots) because all of them funnel through the same `activeLayer`-driven `useEffect` in `Workspace.tsx` — see `ENGINEERING_DECISIONS.md`'s Phase G entry for the full architectural trail; this phase re-confirmed it live rather than re-deriving it.

## Labels

All 10 hotspot labels (Leadership, Knowledge, Research, Workspace, Timeline, About Me, Future, Contact, Resume, Music) confirmed present and correctly text-matching on mobile, always visible (no hover-gating below the `640px` breakpoint) per the existing Phase F.1 implementation.

**One real, minor visual issue found, not fixed this pass.** At the narrowest *and* shortest combination tested (390×844, portrait), a screenshot showed the "✓ Future" visited-badge label visually overlapping the adjacent "Timeline" label — both hotspots sit close together in the room's compressed letterboxed layout at that aspect ratio, and their labels (positioned directly below each hotspot) collide when the hotspots themselves are close together in screen-space. This is a real instance of exactly what Part 6 asks to prevent ("no overlap, no edge collisions"), found by direct visual inspection, not claimed as absent without having looked.

**Not fixed this pass, and why:** the room's letterboxing (fitting a fixed 2:1 aspect-ratio illustration into a tall, narrow portrait viewport) is inherent to the existing establishing-shot architecture, not new to Phase H — a full fix would mean building genuine collision-aware label repositioning (detecting overlap and offsetting one label, or switching label anchor points based on available space), which is a real feature addition, not the CSS-value-level polish this phase's other fixes were. Logged here rather than silently shipped as if it weren't seen. A pragmatic follow-up, if this becomes a priority: at the narrowest breakpoints only, shrink the label font size slightly or stagger label vertical offset by hotspot to reduce collision likelihood, without building full dynamic repositioning.

## Buttons

Contact, Resume, Music (Gramophone), and the Save Slot's Continue button were all re-confirmed at or above the 44px floor across every breakpoint in the sweep table above — Continue specifically measured well above the floor at every size tested (its own CSS-locked aspect ratio keeps it comfortably large). Done/Close (every `LayerPanel` instance) already carry the same `min-h-11` (44px) floor verified in every prior phase.

**Thumb reachability, reasoned about, not separately re-measured.** Room hotspots are positioned by the room's own illustrated layout (not something this phase's brief asked to rearrange), so "thumb reachable" here means the room's own bottom-anchored panel/button chrome (Continue, Done, Close) sits within comfortable reach on a real phone — all three are positioned at the bottom of their respective containers by design, not floating at the top.

**Safe-area overlap.** No `env(safe-area-inset-*)` handling exists in this codebase. Not fabricated as "verified" here — flagged honestly: on a real notched device (iPhone with a home indicator), the bottom sheet's own bottom edge could sit flush against the safe-area boundary rather than respecting it. This wasn't testable in this environment (no real device, and the Browser-pane's viewport emulation doesn't simulate safe-area insets). Logged as a real, unverified gap rather than assumed fine.

## Typography

No font-size-only "shrink to fit" was applied anywhere — the project's existing type scale (Tailwind's default `text-sm`/`text-xs`/etc., used consistently across panels) already reads at a legible size on mobile without special-casing, confirmed by the same breakpoint sweep finding zero horizontal overflow (text wrapping, not truncating or overflowing, at every width tested). Line height, reading width, and hierarchy are inherited from the existing `.panel-paper`/Tailwind prose defaults, unchanged this phase — no typography-specific regression was found or introduced.

## Flex container audit

20 files in `src/` use `flex` somewhere. Rather than manually re-justify each of the dozens of individual flex containers in isolation, this phase's evidence is the live sweep itself: if a flex container's `flex-direction`, wrapping, gap, alignment, or spacing were wrong, it would show up as horizontal overflow, undersized targets, or visibly broken layout at one of the 11 measured breakpoints — none did, except the one real bug (`AppShell`'s wrapper) already covered above, which was a *missing* flex property, not a misconfigured one. No additional flex-specific issues were found.

## Verification

`tsc --noEmit`, `npm run lint`, `next build` all clean after both fixes (`AppShell.tsx`, `LayerPanel.tsx`). Live-verified on a clean, freshly-built production server rather than the session's long-running dev server — see `ENGINEERING_DECISIONS.md`'s Phase H entry for why that distinction mattered this phase specifically.
