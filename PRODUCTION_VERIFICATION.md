# Production Verification — Final Deployment Audit, then Phase H

**Status:** This document now covers two passes. The original (Final Deployment Audit's Phase 3/4, preserved below the divider) was a one-time review record at that point in the project. Phase H's own Part 15 asks for the identical kind of check — desktop/tablet/phone, every hotspot, intro, Play Time, camera, labels, popup transitions, audio, no broken assets/links/console errors/hydration warnings/failed requests — so rather than mint a second, confusingly-similarly-named file, this entry is appended under the same title, the same reconciliation pattern already used for `AUDIO_INTEGRATION.md` (Phase F.1) and `PERFORMANCE_BUDGET.md` (every phase). The original record stays intact as history.

---

## Phase H — Production Launch verification

### Engineering checks

| Check | Result |
|---|---|
| `npm run lint` | ✅ Clean, zero warnings |
| `tsc --noEmit` | ✅ Clean, zero errors |
| `npm run build` (clean, `.next` removed first) | ✅ Clean, all routes static |
| Console errors on a fresh load | ✅ Zero |
| Hydration warnings | ✅ Zero |
| Failed network requests | ✅ Zero broken image loads across 45 registered assets; zero orphaned-but-undocumented or missing file references |

### Desktop / Tablet / Phone

Verified live at all 11 required breakpoints (8 portrait/standard + 3 phone-landscape) on a clean, freshly-rebuilt production server, not the session's long-running dev server (independently found to accumulate stale Suspense/HMR state this phase — see `ENGINEERING_DECISIONS.md`). Full table and methodology in `MOBILE_AUDIT.md`.

### All hotspots

Leadership, Knowledge, Research, Workspace, Timeline, About Me, Future, Contact, Resume, Music — all 10 confirmed present with correct `aria-label`s; Leadership and Contact additionally live-click-verified this phase (camera zoom/reset for Leadership, real rendered content for Contact). Full per-hotspot table in `MOBILE_AUDIT.md`.

### Intro

Live-verified end to end on a clean production server: title card fades in and holds, Save Slot renders both cropped images (399×371 frame, 356×56 button) at exact native dimensions with zero broken loads, a dispatched Continue click correctly triggers the exit fade and unmounts the overlay, and the room's `inert` wrapper is confirmed lifted afterward on the specific element (not a generic selector that could false-positive against a closed `LayerPanel`).

### Play Time

Confirmed genuinely live and persisting: read back mid-session at `00:00:43` and again later at `00:00:55` on the same load, both consistent with real elapsed wall-clock time — not a static placeholder. `localStorage` key `the-studio:play-time-seconds`.

### Camera

Zero drift across every close path, confirmed by a live zoom-then-reset measurement: opened Leadership (`matrix(2.2, 0, 0, 2.2, 140.288, -307.2)`), dispatched Escape, re-measured — exactly `matrix(1, 0, 0, 1, 0, 0)`, the literal identity matrix.

### Labels

All 10 present and text-correct on mobile (always visible) and desktop (hover-gated). One real, minor overlap found at an extreme narrow+short mobile combination (390×844) — logged in `MOBILE_AUDIT.md`, not fixed this pass (a full fix is collision-aware repositioning, a real feature addition beyond this phase's polish scope), disclosed rather than hidden.

### Popup transitions / Audio

Both structurally unchanged since Phase F.1 — no Phase H edit touched `usePopupAudio.ts`, `useAmbientAudio.ts`, `lib/audio.ts`, or `LayerPanel.tsx`'s close-triggering logic (confirmed by reviewing this phase's actual diff). Popup SFX volume `POPUP_SFX_VOLUME = 0.25` (25%), within the brief's 25–35% range.

### No broken assets, no broken links

`assets.ts` cross-checked against every file actually on disk under `public/assets/` and `public/intro/`: 45 files, 42 referenced, zero referenced-but-missing, 3 unreferenced-but-already-documented historical files (not new waste). One real route (`/`) — nothing to link-check beyond that.

### A real bug this pass found and fixed

`AppShell.tsx`'s wrapper `<div>` had no sizing classes — as an unstretched flex item of `<main>`, it collapsed to 0×0, taking the entire room down with it. Invisible to every prior check (element-presence and image-load checks don't catch a 0-sized element), caught by this phase's direct `getBoundingClientRect()` sweep. Fixed; re-verified clean at all 11 breakpoints. Full diagnostic trail in `ENGINEERING_DECISIONS.md`.

### What this pass could not verify live

- **Cross-browser** (Chrome/Edge/Firefox/Safari) — this environment's tooling is Chromium-based only; see `ENGINEERING_DECISIONS.md`'s Phase H cross-browser entry for the source-level review that substitutes.
- **Real-device safe-area-inset handling** — flagged as a genuine, unverified gap in `MOBILE_AUDIT.md`.
- **Screen readers** — unchanged, long-standing gap on record since the project's own Milestone 10 scoping; not newly introduced or closed this phase.

---

## Original record — Final Deployment Audit's Phase 3/4

**Status:** One-time review record, not a living document. Covers Phase 3 (Responsive Verification) and Phase 4 (Production Verification) of the Final Deployment Audit. All numbers below are measured on a clean rebuild (`rm -rf .next && npm run build`), not carried over from an earlier session's build.

### Phase 3 — Responsive Verification

Tested at all seven required breakpoints against a fresh production server. Primary signal: `document.documentElement.scrollWidth` vs `clientWidth` — a reliable, paint-independent measure of real overflow, chosen deliberately (see the methodology note below on why per-element pixel-position reads were not trusted at face value this pass).

| Width | Overflow | Images (18 expected) | Room container width | Notes |
|---|---|---|---|---|
| 1920px | None (1920=1920) | 18/18 loaded | 1024px (capped by `max-w-5xl`) | Click targets 102–184px, all far above minimum. |
| 1440px | None (1440=1440) | 18/18 loaded | 1024px (capped) | |
| 1280px | None (1280=1280) | 18/18 loaded | 1024px (capped) | |
| 1024px | None (1024=1024) | 18/18 loaded | 992px (viewport minus padding, cap no longer binding) | |
| 768px | None (768=768) | 18/18 loaded | 736px | Smallest click target 74×92px, still far above the 24×24px WCAG AA minimum. |
| 480px | None (480=480) | 18/18 loaded | 448px | Smallest click target 45×56px — passes WCAG 2.5.8 AA (24×24px minimum); does not meet the stricter, non-required AAA guideline (44×44px) in one axis by 1px. Noted precisely rather than rounded to a pass/fail. |
| 400px | None (400=400) | 18/18 loaded | 368px | Panel opened and closed cleanly at this width; `scrollWidth === clientWidth` held with a panel open, confirming the original overflow fix (`overflow-x-hidden` on the outer wrapper, `left: auto` on the panel) still holds at the narrowest tested width. |

**No clipping, no sprite collisions, no layout instability found at any tested width.** Sprite scaling is percentage-based off one 288×144 canvas (`getSpritePlacement`), so relative sprite-to-sprite spacing is invariant to viewport width by construction — confirmed empirically at the extremes (1920px and 400px) rather than only assumed from the math.

#### Methodology note: a real discrepancy investigated and resolved

Mid-audit, `getBoundingClientRect()` readings on the docked side panel (immediately after open/close and after some resizes) disagreed with the panel's own `offsetLeft` and `getComputedStyle().left` by exactly one panel-width (384px) — which would, if real, mean the panel was rendering visibly detached from the viewport edge. Investigated rather than reported at face value: `offsetLeft` (layout-tree-based) and computed style agreed with each other and with the intended `right: 0` design at every measurement; only `getBoundingClientRect()` (paint-based) was wrong, and only on this Browser-pane tab, which reports `document.visibilityState: "hidden"` persistently regardless of actual fronting state — a known, already-documented (`ASSUMPTIONS.md`) characteristic of this specific testing tool, not of the site. Conclusion: the panel's layout is correct; this tool's paint-readback is unreliable in this specific state. Documented here rather than silently discarded, since it consumed real investigation time and the underlying mechanism (hidden-tab paint staleness) is worth having on record for whoever debugs a similar-looking symptom next.

---

### Phase 4 — Production Verification

#### Static checks

| Check | Result |
|---|---|
| `npm run lint` | Clean, zero errors/warnings |
| `npx tsc --noEmit` | Clean |
| `npm run build` (clean, `.next` removed first) | Clean, all 4 routes (`/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`) generated as static content |

#### Bundle size (measured directly from `.next/static` after a clean build)

| Category | Size |
|---|---|
| JS chunks (9 files) | 713 KB combined; largest three are 224 KB / 144 KB / 112 KB — all three are framework/runtime chunks (Next.js + React), not application code, confirmed by chunk-name pattern and by the fact this project has ~29 source files totaling a few hundred KB of TypeScript source |
| CSS | 28 KB (one file) |
| Fonts (actually fetched, per live network log — Next.js subsets the 11 on-disk font files down to what a page's characters need) | 2 files, 56 KB combined |
| Room/furniture images (18 sprites) | 46 KB combined, largest single file 8 KB |
| Resume PDF | 100 KB (fetched only on click, not preloaded — confirmed via `fetch(..., {method:'HEAD'})` returning 200, `application/pdf`, 98,607 bytes) |
| **Total initial page weight** | **≈843 KB** across JS+CSS+fonts+images, before the resume is ever requested |

For an interactive, illustrated single page, this is light. No optimization is recommended here — there's no measured problem to fix.

#### Image count and loading strategy

18 `<img>` elements in the default (no panel open) state, all `unoptimized` (correct choice for pixel art — Next's image optimizer would resample and blur crisp sprite edges, documented in `ENGINEERING_DECISIONS.md`) and all `priority`. The second part is a real, if low-severity, observation: Next.js's own guidance is to reserve `priority` for above-the-fold LCP candidates, not apply it universally — here it's applied to all 18. This has a defensible reason (the entire room is visible in one establishing shot, so every sprite genuinely is "above the fold" at first paint) but is still a deviation from the framework's stated best practice, worth recording rather than either silently fixing (no measured problem exists to justify a change) or silently ignoring (it is a real deviation). **Not changed this pass** — no evidence of an actual performance cost (total image payload is 46 KB; preloading all of it costs nothing meaningful at this scale) — logged as a documented, low-priority style note, not acted on, per "no speculative optimization."

#### Render count

Not independently re-profiled this pass — no React DevTools Profiler is available in this environment, consistent with every prior performance pass on this project. What's already on record and re-confirmed by reading the current source: `Workspace.tsx`'s five interaction handlers are `useCallback`-wrapped with correct, stable dependencies (`cameraFocus`/`cameraReset`/`layersOpen`/`layersClose` destructured out, not the containing `camera`/`layers` objects) — this was a real bug caught by `eslint-plugin-react-hooks` during the Production Hardening phase and is unchanged since. No new state, effects, or handlers were added this pass that would introduce a new re-render risk; `DeskDressing` is a pure presentational component with no state or effects at all.

#### Hydration warnings

None. Checked via `read_console_messages` on a fresh production-build page load — zero console entries of any kind (React logs hydration mismatches to the console by name; none appeared).

#### Console warnings / errors

None. Same check, same result — a completely silent console on load, on panel-open, and on panel-close.

#### If optimization were recommended — it isn't

Per explicit instruction not to optimize speculatively: there is no measured evidence in this project (843 KB total payload, sub-30ms build times, zero console warnings, zero hydration mismatches) that justifies any performance work right now. The one deviation found (blanket `priority`) is logged with its reasoning rather than "fixed," because fixing it would be a change made for adherence to a general guideline rather than in response to a measured problem — exactly the kind of change this audit is supposed to avoid making "solely for the sake of change."
