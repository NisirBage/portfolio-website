# Performance Budget — The Studio

**Status:** Living document, tracked from Milestone 5 onward per your instruction. Every number below is labeled with the Engineering Confidence Scale (Very High / High / Medium / Low / Speculative) — nothing here is presented as more precise than what was actually measured.

---

## Milestone 5 baseline

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | ~689 KB | `du -sh .next/static/chunks` after a production build | **Medium** — this is total build artifacts (React + Next runtime + app code combined), not an isolated "first-load JS" figure; Turbopack's current build output didn't print the per-route breakdown Next.js has historically shown, so I'm reporting the coarser number I could actually measure rather than a more precise one I couldn't |
| Largest image asset | 6,011 bytes (`floors-and-walls.png`) | `ls -la` on `public/assets/` | **Very High** — direct file size |
| Door sprite | 280 bytes | `ls -la` | **Very High** |
| Resume PDF | 98,607 bytes | `ls -la`, cross-checked against the `Content-Length` header on a live fetch (both agree) | **Very High** — loaded only on click, not part of any bundle or preload |
| Camera transition time | 200 / 500 / 700 ms (Fast / Standard / Slow bands) | Read directly from `src/lib/motion.ts` — these are declared constants, not inferred | **Very High** — this is the source of truth, not a measurement of it |
| Layer open / close time | 500 ms open, 200 ms close | Read directly from `LayerPanel.tsx`'s use of `DURATION.standard` / `DURATION.fast` | **Very High** |
| Interaction latency (click → visible response) | Not separately measured this milestone | — | **Unknown** — no profiling tooling available in this session; the Web Vitals hook (`PerfMonitor`) reports page-load metrics (TTFB, etc.), not per-interaction latency |
| Render counts / unnecessary re-renders | Not profiled | — | **Unknown** — would need React DevTools Profiler, not available in this environment |
| Memory growth | Not measured | — | **Unknown** |

## Milestone 6 update

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | ~693 KB (+4 KB from Milestone 5) | `du -sh .next/static/chunks` after a production build | **Medium**, same caveat as above |
| New content added | 3 project summaries + architecture lists, ~1.5 KB of text total | Direct measure of `content/projects.ts` | **Very High** |
| Blueprint reveal animation | 350ms | Read from the `.blueprint-unroll` CSS keyframe declaration | **Very High** |

A 4KB bundle growth for three full project write-ups plus their accordion/reveal logic is not worth optimizing against any budget. Interaction latency, render counts, and memory growth remain **Unknown** — unchanged from Milestone 5, still waiting on real profiling tooling.

## Milestone 7 update

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | ~697 KB (+4 KB from Milestone 6) | `du -sh .next/static/chunks` after a production build | **Medium**, same caveat as Milestone 5 |
| New content added | 2 new hotspots + panels (Knowledge, Research), ~1 KB of text total | Direct measure of `content/knowledge.ts` + `content/research.ts` | **Very High** |

Same conclusion as Milestone 6: a few KB of growth for two full evidence surfaces isn't worth optimizing against any budget. No new asset weight — both hotspots reuse the existing verified `SmallItems.png` sprite category rather than introducing new images.

## What this milestone did *not* need to optimize

Per "avoid premature optimization, but never ignore measurable regressions": nothing above crossed a threshold worth acting on. The full static bundle is well under any reasonable budget for a portfolio site; the pixel-art assets are already tiny (confirmed, not assumed, back in `ASSET_REGISTRY.md`); the resume is fetched on demand only, verified via `Content-Length` matching the source file exactly.

## Milestone 8 update

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | ~701 KB (+4 KB from Milestone 7) | `du -sh .next/static/chunks` after a production build | **Medium**, same caveat as Milestone 5 |
| New content added | 1 new hotspot + panel (Leadership), 4 cluster cards, ~0.5 KB of text total | Direct measure of `content/leadership.ts` | **Very High** |

Same conclusion as Milestones 6–7: a few KB of growth for a full evidence surface isn't worth optimizing against any budget. No new asset weight — the Leadership hotspot reuses the existing verified picture-frame sprite category rather than introducing certificate images (none exist; see `MISSING_CONTENT.md` on why that's a deliberate choice, not an oversight).

## Known gaps, honestly

Interaction latency, render counts, and memory growth are all **Unknown**, not **Low** — there's a real difference, and collapsing "not measured" into "probably fine" would violate Evidence Before Summary. These should be measured with real profiling tools (React DevTools Profiler, Chrome Performance panel) once there's enough real interaction surface (Milestone 6+) to make profiling meaningful — profiling a single hotspot and a five-button test harness wouldn't produce numbers worth trusting yet.

## Production Hardening: Performance Review

**Discipline applied.** Per instruction — only optimize after identifying a measurable opportunity, no speculative changes. What follows is what's actually measurable in this environment (bundle composition, network requests, source-level render/effect analysis) versus what remains genuinely unmeasured (real render counts, interaction latency) without a profiler, which this environment still doesn't have.

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | 709 KB | `du -sh .next/static/chunks` | **Medium**, same caveat as every prior milestone — coarse total, not a per-route breakdown |
| Compiled CSS | 25 KB | Direct file size of the compiled stylesheet | **Very High** |
| Largest 3 JS chunks | 227 KB / 144 KB / 113 KB | `ls -la .next/static/chunks` | **Very High** on the numbers; **Medium** on attribution — not fully decomposed, but their size (largest chunk alone is ~2× the entire app's own source in `src/`) is consistent with React 19 + Next.js 16's client runtime, not app code |
| Total image asset weight | ~22 KB across 9 files | `du -sh` on every file in `public/assets/` | **Very High** |
| Image loading strategy | All 9 images request eagerly on first paint (`priority` on every establishing-shot sprite) | Confirmed via `read_network_requests` on a fresh page load — 9 image requests, no lazy-loading deferral | **Very High** — directly observed, not inferred from the `priority` prop alone |

**Image loading strategy, evaluated, not just observed.** Every sprite in the establishing shot uses `priority`, which disables lazy-loading. This is deliberate and correct, not an oversight to "fix": every sprite is above the fold and visible at first paint in an establishing shot — there is nothing to defer. Lazy-loading would only be appropriate for content below an initial viewport or behind a later interaction, and nothing in this scene qualifies. Total image cost (~22 KB) is trivial regardless.

**Bundle composition, evaluated, not just observed.** The two largest chunks (227 KB, 144 KB) are near-certainly React/Next.js framework runtime, not application code — `src/`'s actual source is roughly 1,400 lines across 26 files, which would not plausibly compile to hundreds of KB on its own. This is fixed framework overhead, not something this app's own code choices can meaningfully reduce without changing framework (out of scope). No code-splitting opportunity identified: the entire app is one continuous interactive scene a visitor engages with immediately, not a multi-page app with genuinely separable routes.

**One real fix applied, source-identified rather than profiled.** `Workspace.tsx`'s `openDesk`/`openKnowledge`/`openResearch`/`openLeadership`/`closeLayer` handlers were plain functions, redefined on every render. `closeLayer` specifically sits in `LayerPanel`'s Escape-key `useEffect` dependency array, so an unmemoized reference caused that effect to tear down and re-add a document-level `keydown` listener on every Workspace render — any camera move or layer change, not just actual panel close events. Wrapped all five in `useCallback`, with the underlying `camera.focus`/`camera.reset`/`layers.open`/`layers.close` functions destructured out first (the hook-returned `camera`/`layers` *objects* are new references every render, so depending on them directly would have silently defeated the memoization — caught via `eslint-plugin-react-hooks`'s `exhaustive-deps` rule, not by inspection alone). This is a real, source-verified fix, not a speculative one — but its actual runtime impact is unmeasured in absolute terms (`addEventListener`/`removeEventListener` are inherently cheap operations); it's correct regardless of whether it's measurable as a perceptible improvement.

**What was deliberately not done.** No `React.memo` applied to hotspot or panel components. No further memoization audit beyond the one effect-dependency issue above. Both would be speculative without render-count profiling evidence this environment can't produce — applying them anyway would violate "avoid speculative optimization," not satisfy it. If a profiler becomes available, this is the first place to point it: does the ~15-element Workspace tree actually re-render expensively enough to matter, or is this already fine (likely, given its small size) and not worth the added complexity of memoization.

**Hydration cost.** The entire interactive tree (`Workspace` and all its children) is client-rendered (`"use client"`); `PersistentActions.tsx` is correctly a server component (no hooks, no event handlers — confirmed by its absence from the `"use client"` grep results, not assumed). No unnecessary client components found — every `"use client"` directive in the codebase is on a component that genuinely needs interactivity (state, effects, or event handlers). Hydration cost itself (time-to-interactive delta) is Unknown — same profiler gap as render counts, not newly discovered here.

**Verification.** `lint` (including `react-hooks/exhaustive-deps`), `tsc --noEmit`, `next build` all clean after the `useCallback` change. Functional regression check: Leadership panel open/close re-verified working correctly post-change via DOM measurement on a production build — no behavior change, only reference stability.

## Final Deployment Audit

Sprite count and bundle composition both grew materially since the last update (Concept Reconciliation's reading-stand asset, Workspace Decoration's 8 generated desk items) — this section re-measures from a clean build rather than assuming the prior numbers still hold.

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total JS chunks | 713 KB across 9 files | `du -sh .next/static/chunks/*.js` after a clean (`rm -rf .next`) production build | **Very High** — direct, per-file |
| Largest 3 JS chunks | 224 KB / 144 KB / 112 KB | Same | **Very High** on the numbers; **Medium** on attribution, same reasoning as the Production Hardening entry — framework runtime, not app code |
| Compiled CSS | 28 KB (1 file) | Direct file size | **Very High** |
| Fonts actually transferred | 2 files, 56 KB combined | Live network request log — Next.js's font subsetting means only 2 of the 11 on-disk `woff2` variants are ever fetched for this page's character set | **Very High** — observed via `read_network_requests`, not inferred from disk contents |
| Image asset weight | 46 KB across 18 files (up from ~22 KB / 9 files) | `du -sh` on every file in `public/assets/` | **Very High** |
| Resume PDF | 98,607 bytes, fetched only on click | `fetch(..., {method:'HEAD'})` → `200`, `content-length: 98607`, cross-checked against the file on disk | **Very High** |
| **Total initial page weight** | **≈843 KB** (JS + CSS + fonts + images, before the resume is requested) | Sum of the above | **Very High** on the components; **Medium** on the total, same "coarse, not per-route" caveat as every prior entry |
| Console warnings / errors / hydration mismatches | Zero | `read_console_messages` on a fresh production page load | **Very High** — directly observed |
| Image loading strategy | Unchanged conclusion from Production Hardening, re-evaluated at 18 images instead of 9 | All 18 still use `priority`; still defensible (whole room visible in one shot) and still backed by evidence of no real cost (46 KB total) — logged as a documented deviation from Next's general guidance, not fixed, since there's no measured problem to fix | **Very High** |

**No optimization applied this pass.** Per explicit instruction not to optimize speculatively: 843 KB total for an illustrated interactive page, zero console noise, and sub-6-second clean builds do not constitute a measured problem. The one candidate (blanket `priority`) is logged with its reasoning rather than changed, since changing it would be adherence-for-its-own-sake, not a response to evidence.

## Phase B update

No new images were added this pass — every visual change (background vignette, panel theme, dividers, buttons, backdrop blur, visited-state badges) is CSS and text-glyph only, per `UI_THEME.md`'s "why CSS tokens, not a cropped frame sprite." Two new source files were added (`src/lib/visited.ts`, `src/hooks/useVisitedHotspots.ts`), both small (localStorage read/write plus a typed id union).

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total JS chunks | 685 KB across the same 9 files | `du -ch .next/static/chunks/*.js` on a clean production build | **Very High** — direct; within normal build-to-build variance of the Final Deployment Audit's 713 KB figure, not a regression |
| Compiled CSS | 32 KB (up from 28 KB) | Direct file size | **Very High** — the `.panel-paper`/`.panel-divider`/`.panel-button` rules, the new color tokens, and the tightened gramophone-glow keyframe account for the growth |
| Image asset weight | Unchanged — 46 KB across 18 files | No new images this pass | **Very High** |
| `localStorage` usage | 2 keys now (`the-studio:ambient-audio`, `the-studio:visited-hotspots`), both small JSON/string values | Read directly from `lib/audio.ts` and `lib/visited.ts` | **Very High** |

**Superseded, not deleted:** the Milestone 5 baseline table above lists `DURATION.standard`/`DURATION.fast` values (500ms/200ms) for camera and panel timing — `src/lib/motion.ts` replaced these with named bands (`DURATION.camera` 350ms, `DURATION.panelOpen` 240ms, `DURATION.panelClose` 200ms) in the Phase B animation-timing pass. See `UI_THEME.md`'s timing table for current values; the Milestone 5 entry is left in place as a historical record rather than rewritten, consistent with this document's own "entries are appended, not rewritten" convention elsewhere in the project's living docs.

**4 KB CSS growth for a full panel-theme redesign is not worth optimizing against any budget**, same conclusion as every prior content-addition milestone in this document.

## Phase C update

No new images this pass either — the lighting layer, paper texture, section markers, and note particles are all CSS/text-glyph, per the same "why CSS tokens, not a cropped asset" reasoning `UI_THEME.md` already established. One new source file (`src/hooks/useHoverState.ts`, small — a state hook and eight `useCallback`-wrapped handlers).

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total JS chunks | 689 KB | `du -ch .next/static/chunks/*.js` on a clean (`rm -rf .next`) production build | **Very High** — direct; within normal build-to-build variance of Phase B's 685 KB figure, not a regression |
| Compiled CSS | 32 KB, unchanged from Phase B's own measurement | Direct file size | **Very High** — the new keyframes/classes (`.sprite-breathe`, `.note-particle`, `.accordion-collapse`, `.section-marker`, the paper-texture gradients) added negligible weight after minification |
| Image asset weight | Unchanged — 46 KB across 18 files | No new images this pass | **Very High** |
| New DOM per interactive object | +1 wrapper `<div>` per furniture sprite (for `.sprite-breathe`, separated from the hover/press-transformed `<Image>` — see `ENGINEERING_DECISIONS.md` for why they can't share one element) | Direct count across `DeskHotspot`/`KnowledgeHotspot`/`ResearchHotspot`(×2)/`LeadershipHotspot`(×2) | **Very High** |

**Animation cost, reasoned through, not profiled** (no profiler available in this environment — an existing, unchanged gap, see "Known gaps, honestly" above). Every Phase C animation targets `transform`/`filter`/`opacity`/`backdrop-filter`, all compositor-friendly properties that don't trigger layout recalculation, with the single deliberate exception of the accordion's `grid-template-rows` transition (a real, intentional height animation, scoped to one collapsing subtree at a time, not the whole page). See `PERFORMANCE_REVIEW.md` for the full breakdown against "no unnecessary rerenders / no layout thrashing / no animation-caused layout shifts."

**Negligible bundle growth for a full microinteraction + lighting + accordion-animation pass is not worth optimizing against any budget**, same conclusion as every prior milestone in this document.

**A production-scaffolding fix, not a performance one, but recorded here since it touched `Workspace.tsx`'s render output.** `CameraTestHarness` (3 debug buttons + Reset) was rendering in production and is now gated behind `NODE_ENV === "development"`. Its removal from the production DOM has no measurable bundle-size effect (a few buttons' worth of markup) — recorded in `ENGINEERING_DECISIONS.md` and `FINAL_DEPLOYMENT_AUDIT.md` as an interaction/accessibility fix, not claimed here as a performance win it isn't.

## Phase H update — Production Launch audit

Re-measured from a fully clean build (`rm -rf .next && npm run build`) rather than trusting the last recorded figures, since three phases' worth of real feature work (F.1/F.2/G) has landed since the Final Deployment Audit's own numbers.

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total JS chunks | 729 KB | `du -ch .next/static/chunks/*.js` on a clean build | **Very High** — direct; up from 713 KB at Final Deployment Audit, consistent with three phases of real feature growth (the intro sequence, `usePlayTime`, `Analytics`, `AppShell`, Contact/Resume panels), not a regression |
| Compiled CSS | 40 KB | Direct file size | **Very High** — up from 28 KB, the largest single-metric growth this document has recorded; consistent with the volume of new CSS across F.1–H (hotspot labels, toast, save-slot entrance, the `.panel-button` bevel restyle, the intro overlay's transitions) |
| Total registered image assets | 351 KB across all files in `public/assets/` (not just the default room view) | `du -ch` | **Very High** — this figure includes every UI icon, narrative asset, and intro-sequence sprite now in the project, not only what's visible on first paint; the default-establishing-shot figure (comparable to the 46 KB tracked in earlier updates) is a subset of this |
| Ambient audio | 1.2 MB (`ambient-piano.mp3`, `popup-open.mp3`, `popup-close.mp3` combined) | `du -ch public/audio/*.mp3` | **Very High** — gated behind the Gramophone toggle and the popup-audio hook; none of this is fetched on initial page load, confirmed by the same "no network request for a file nothing has triggered yet" reasoning verified live back in Phase A |
| Zero unused/orphaned registered assets | Confirmed | Cross-referenced every `src:` path in `assets.ts` against every file actually on disk under `public/assets/` and `public/intro/` — 45 files on disk, 42 referenced; the 3 unreferenced are `paper-stack.png`, `clock.png`, `window.png`, all already-documented historical artifacts from earlier phases' own "corrected, not erased" registry convention, not newly-discovered waste | **Very High** — a real cross-check, not an assumption |
| Console warnings / errors / hydration mismatches | Zero | `read_console_messages` on a fresh production load | **Very High** |

**A real bug found by this phase's mobile audit, not a performance one, but worth recording here since it's the kind of thing a bundle-size number alone would never surface.** `AppShell.tsx`'s wrapper `<div>` had no sizing classes, which — as a flex item of `<main>` with no `flex: 1` — collapsed to 0×0, taking the entire room (including every hotspot) down with it. This was invisible to every check this project had previously relied on (element-presence queries, image `naturalWidth` checks, hotspot *count*) because a 0-sized element is still present in the DOM; only a direct `getBoundingClientRect()` check catches it. Fixed by giving the wrapper the same `flex flex-1 flex-col` shape `main` itself uses. See `ENGINEERING_DECISIONS.md`'s Phase H entry for the full diagnostic trail, and `MOBILE_AUDIT.md` for how it was found.

**No speculative optimization applied.** Per this document's own standing rule, re-applied here: 729 KB JS + 40 KB CSS + a modest, on-demand-only image/audio footprint for a rich, fully-interactive portfolio experience is not a measured problem. Code-splitting individual panels via `next/dynamic` was considered (nine panel components are statically bundled even though a typical visitor opens a handful per session) and not applied — no evidence of a real problem it would fix, and it would trade a small, unmeasured bundle-size benefit for real complexity (loading states, potential layout shift on panel open) in an experience whose entire premise is inviting exploration of multiple panels per visit.

**Interaction latency, render counts, and memory growth remain Unknown**, unchanged from every prior update — still no profiler available in this environment. Not rounded up to "probably fine."
