# Engineering Decisions — The Studio

**Status:** Living document, implementation-side counterpart to the frozen design documents. Design docs explain *what* and *why* at the product level; this explains *how* and why that specific technical approach, and evolves as milestones ship. Entries are appended, not rewritten, so later decisions can be understood in context of what came before.

---

## Milestone 2

### Rendering approach: CSS transforms on flat DOM/images, not PixiJS/WebGL

`NARRATIVE_SYSTEM.md`'s Camera Philosophy already made this call, and you explicitly approved it ("CSS-based cinematic camera instead of WebGL for Version 1"). It's restated here because Milestone 2's brief referenced "PixiJS configuration" as an example decision to document — flagged in the Implementation Readiness Check as likely a generic template example, not a deliberate reversal, and confirmed by proceeding without objection.

Concretely: the room is a plain `<img>` (via `next/image`) inside absolutely-positioned `<div>`s, not a `<canvas>` or WebGL context. A future camera pan is a CSS `transform` on `CameraContainer`, not a render-loop redraw. This keeps the whole scene inspectable in browser dev tools, keeps the screen-reader parallel path (a plain DOM tree) trivially achievable rather than fought for, and avoids a render-loop, texture-loading, and canvas-accessibility story that a WebGL engine would require — all real costs `IMPLEMENTATION_RISKS.md` already priced the camera system at Medium-High complexity for; a canvas engine would move that to High-Very High for no capability Milestone 2 through the current Version 1 scope actually needs.

### Layer order: room shell, then door dressing, nothing above yet

Two DOM layers inside `CameraContainer`, bottom to top: the room shell image, then two door-dressing images absolutely positioned on top. This is the minimum layer count that proves the *ordering mechanism* works (later milestones will insert furniture and hotspot layers between or above these without restructuring the container) without building layers Milestone 2 explicitly excludes.

### Scaling strategy: canvas-ratio container + percentage-based child placement, not fixed pixel positions

The room's outer wrapper locks to the room shell's native aspect ratio (288:144) via CSS `aspect-ratio`, and scales fluidly within `max-w-5xl`. Door sprites are positioned as percentages of that same canvas (computed in `roomGeometry.ts`'s `getDoorPlacements`), not fixed pixel offsets — so they track the room shell's scale at any viewport width instead of drifting off-position as the container resizes. This is what "responsive scaling strategy" required beyond just "the image doesn't stretch": every child layer has to scale in lockstep with the base layer, not just the base layer itself.

### Pixel-perfect rendering: `image-rendering: pixelated` + `unoptimized` on `next/image`

Two parts, both necessary. First, a small custom `.pixel-art` utility class (Tailwind has no built-in one) sets `image-rendering: pixelated` with a `crisp-edges` fallback for older Firefox. Second — and easy to miss — `next/image`'s default optimization pipeline resizes images server-side to match likely display sizes, which for pixel art means the blur happens *before* the browser ever gets to apply `image-rendering`, defeating it entirely. Every pixel-art sprite in this project uses `unoptimized` on `next/image` for that reason. This is scoped specifically to pixel-art sprites — photographic content (certificate scans, project screenshots, arriving in later milestones) should keep Next's normal optimization, since blur isn't a risk for those and the bandwidth savings are real.

### Asset pipeline: a typed registry (`src/lib/assets.ts`) mirroring `ASSET_REGISTRY.md`

Every sprite referenced in code goes through one typed object, not ad hoc path strings scattered across components. This exists specifically to prevent the registry markdown and the actual code from drifting apart — a change to a file path has exactly one place to update, and TypeScript's `satisfies` constraint means a malformed entry fails to compile rather than fails silently at runtime.

### Asset Truthfulness correction: the front-wall door gap is in Zone 2, not at the Zone 1/2 boundary

`SPATIAL_BLUEPRINT.md` described the second door-shaped gap as "near the boundary between Zone 1 and Zone 2," based on visual inspection alone. Direct pixel measurement during this milestone (scanning for the gap's semi-transparent lavender fill color, then confirming alpha values to rule out false positives from fully-transparent canvas padding that happened to share the same RGB channels) placed it at x≈88–135 in the 288-wide canvas — solidly inside Zone 2 (x 80–143, the Desk zone), not at its boundary with Zone 1. `SPATIAL_BLUEPRINT.md` and `ASSET_REGISTRY.md` are corrected accordingly. This is exactly the kind of revision the Asset Truthfulness Protocol exists for: a claim made from a screenshot, corrected once real measurement was possible.

### `CameraContainer` is structural only

It renders with an explicit identity transform (`translate(0px, 0px) scale(1)`) and takes no props beyond `children`. No event handlers, no state, no easing — Milestone 2's brief was explicit that camera *movement* is Milestone 3's job. The component exists now so Milestone 3 adds behavior to an already-correct structure instead of restructuring the DOM tree while also trying to get animation right at the same time.

### Performance instrumentation: `useReportWebVitals`, console-only, dev-only

Next.js ships a built-in Web Vitals hook; using it is near-zero marginal cost and gives a real, standard metric (LCP, CLS, INP) rather than a bespoke measurement. It logs to console only in development — no analytics backend exists yet, and building one isn't in Milestone 2's scope (or arguably any milestone's scope until `VERSION1_SCOPE.md` explicitly schedules `PORTFOLIO_STRATEGY.md`'s Section 12 metrics work).

---

## Milestone 3

### Content-agnostic API: `focus(target, durationMs)` and nothing else

`useCamera` exposes exactly two functions — `focus` and `reset` — operating on a `CameraTarget` of `{x, y, scale}`. No `CameraTarget` ever mentions a zone name, a project, or a layer. The six SPATIAL_BLUEPRINT.md anchor coordinates used to exercise the camera live in `CameraTestHarness.tsx`, a component the camera hook has no knowledge of and no import relationship with — the dependency points one way (harness → camera), never the other. This is the concrete test of Milestone 3's stated success criterion: a future hotspot component can call `focus()` with its own coordinates without the camera implementation changing at all.

### Interrupting a transition: no queue, because CSS already does this

`focus()` simply replaces the stored target — no cancellation flag, no promise queue, no "is animating" check. A CSS `transition` on `transform` interpolates from whatever value is *currently rendered* to a new target the instant the target changes, which is exactly the "cancel gracefully and redirect" behavior specified. This directly resolves `DESIGN_DEBT.md` Finding #4 (camera timing vs. the 90-second recruiter priority): a fast visitor clicking through several targets in succession never waits for one transition to finish before the next begins — each click immediately redirects the in-flight animation rather than queuing behind it.

### Transform math: derivation, then empirical verification — not derivation alone

To center canvas point `(x%, y%)` in the viewport at a given scale, with `transform-origin: 0 0`: `transform: scale(S) translate(tx%, ty%)` where `tx = 50/S − x` and `ty = 50/S − y` (percentages resolve against the element's own box regardless of the scale applied to the result). The derivation is easy to get subtly wrong, so per the new Evidence Before Summary rule this wasn't trusted on paper — it was measured: after focusing the "clock" test target, the actual on-screen position of that canvas point was computed from `getBoundingClientRect()` and compared to the stage's true center. **Verified**, not assumed: the measured offset was 0.00006px in x and exactly 0 in y — sub-pixel, i.e. correct.

### Reduced motion: one CSS rule, not a JS branch

`@media (prefers-reduced-motion: reduce) { .camera-transition { transition-duration: 0ms !important; } }`. No JavaScript reads `matchMedia` — the browser's own cascade handles it, which means it's correct even before React hydrates. Functionally verified by injecting an equivalent always-on override rule and confirming the target transform applied instantly with no interpolation, since this test environment has no way to toggle a real OS-level reduced-motion setting (see testing notes below).

### Testing environment limitations discovered this milestone — recorded for future milestones' benefit

Two genuine automation-tool quirks surfaced while verifying this milestone, both confirmed to be environment artifacts rather than code defects, and both worth knowing before debugging future milestones against the same tooling:

1. **CSS transitions stall on a tab the browser considers hidden.** `document.visibilityState` reported `"hidden"` for the preview tab throughout testing (regardless of which tab was "fronted" in the tool), and Chromium throttles/pauses `transition`-driven `getComputedStyle` updates on hidden documents. The *specified* style (`element.style.transform`, `getAttribute('style')`) was correct throughout; only the *live interpolated computed value* was unreliable to sample directly. Worked around by forcing `transition-duration: 0ms` to observe the settled end-state instead of the animation mid-flight.
2. **Synthetic Enter/Space key presses from this tool's `key` action don't populate `event.key`.** A raw `keydown` listener confirmed the event reaches the correctly-focused element (`isTrusted: true`, correct target), but with `key: ""` instead of `"Enter"`/`" "`. Browsers' native button-activation logic checks that property, so it doesn't fire — not because of anything in this project's markup (plain semantic `<button>` elements, zero custom keyboard handling), but because the tool's synthetic event is malformed for this specific purpose. Mouse-driven activation was verified working correctly and precisely (matrix values matched the target formula exactly) for all six targets.

Both are logged here rather than in `DESIGN_DEBT.md` or `IMPLEMENTATION_RISKS.md` because they're facts about the test harness, not about the product.

---

## Milestone 4

### State Manager: single `activeLayer`, URL-synced via push (not `router.back()`) on both open and close

`useLayerStack` exposes `activeLayer`, `open(id)`, `close()`. Deliberately not a stack of arbitrary depth — see `ASSUMPTIONS.md` A5. `close()` pushes an explicit "no panel" URL rather than calling `router.back()`, because `back()` is unsafe for a visitor who arrived at `?panel=dummy` as a deep link — there's no guarantee "back" leads anywhere sensible for them. The cost is one extra history entry per close; recorded as a deliberate tradeoff, not an oversight.

### Layer Engine: presentational only, `inert` (not just `aria-hidden`) while closed

`LayerPanel` renders from `isOpen` alone and has no reference to what opened it. `inert` is used specifically because `aria-hidden` alone doesn't remove a closed-but-mounted panel from the Tab order — a real, easy-to-miss gap if only screen-reader hiding is considered and keyboard reachability isn't checked separately.

### `LayerPanel` renders as a sibling of the camera stage, not nested inside it

Per the Layer Responsibilities rule, the Layer engine and Camera engine are separate concerns — the panel has no reason to sit inside the stage's `overflow-hidden` container built for the zoomed pixel-art scene. This was originally going to be a "nice to have" architectural cleanup; it became load-bearing once a real rendering bug (below) needed a genuine architectural boundary, not a CSS patch, to be ruled out as a contributing factor.

### A real browser rendering bug, root-caused properly rather than patched blindly

**Observed behaviour.** After the dummy layer's open transition completed, the (unrelated) camera-test-harness buttons — siblings elsewhere in the document — rendered 384px to the left of their correct position. `document.activeElement`/URL/panel state were all otherwise correct.

**Possible causes considered.** (1) A CSS class conflict (`w-full` vs `max-w-sm`) on the panel. (2) Shared `overflow-hidden` ancestry between the panel and the harness. (3) Interaction between the panel's `inert` toggle and its `transform` transition. (4) Next.js router-navigation side effects. (5) A dev-server/Fast-Refresh artifact.

**Experiments.** Each cause was tested in isolation, not assumed: swapped the width classes (no effect once retested cleanly); removed the panel from the DOM entirely (fixed it — confirmed the panel's presence was necessary); restructured the DOM so the panel and the harness no longer share an `overflow-hidden` ancestor (did **not** fix it — ruled out shared-ancestry as the mechanism); reproduced against a production build on a separate port, not just the dev server (identical result — ruled out Fast Refresh/Turbopack); triggered the exact same state change via raw `history.pushState` with no camera interaction at all (still reproduced — ruled out the camera system entirely); compared `offsetLeft` (0, correct) against `getBoundingClientRect()` (wrong) with zero `transform` anywhere in the affected element's ancestor chain (a genuine layout/paint desync, not a CSS misconfiguration); tried `will-change: transform` on the panel (no effect); confirmed that *any* unrelated forced reflow (`document.body.style.display` toggled off and back) reliably corrected the paint state.

**Root cause.** A Chromium paint-invalidation bug triggered by toggling the `inert` attribute on an element in the same update as a `transform` transition, which leaves unrelated absolutely-positioned siblings elsewhere in the document with a stale painted position that even a forced synchronous layout read doesn't correct. Category, per the Test Environment Matrix: **Browser**, not Application, Framework, or Testing Tool — confirmed by ruling out each of those alternatives with a specific experiment, not by default.

**Fix.** A `requestAnimationFrame`-scheduled forced reflow (toggle `document.body.style.display` off and back) runs once whenever the panel opens. This is a workaround for a confirmed external bug, not a design choice — commented in `LayerPanel.tsx` with the full reasoning so a future reader doesn't mistake it for dead code and delete it, and so it's easy to remove later if a browser update fixes the underlying issue.

**Verification.** Re-tested through the actual React-driven open/close/back-forward flow (not manual DOM patching) against a fresh production build: harness position correct (136px) through open, close, and browser-back; panel position, URL sync, and focus-on-open all still correct.

**What's still Assumed, not Verified.** Focus-return-to-trigger on close was tested via a JS-dispatched `.click()`, which — per the DOM spec — does not necessarily focus an element the way a real mouse click does. `previouslyFocused.current` may have captured `document.body` rather than the actual trigger button in this specific test, which would explain why focus landed on `<body>` after close rather than back on "Open dummy layer." This needs re-verification with a real click before Version 1 ships; logged in `ASSUMPTIONS.md` rather than treated as confirmed.

---

## Milestone 5

### Content: the first real "Content" layer artifact

`src/content/projects.ts` — three `ProjectSummary` records, Level 1 only (headline + one-liner), matching `CONTENT_HIERARCHY.md`'s Critical tier. Deliberately has no fields for architecture/tradeoffs/source links yet — Milestone 6 adds those when it builds the depth that needs them, rather than this file carrying empty placeholder fields now.

### API Review — new public surfaces introduced this milestone

| API | Consumer | Responsibility | Lifetime | Replacement strategy |
|---|---|---|---|---|
| `DESK_HOTSPOT` (`roomGeometry.ts`) | `Workspace.tsx`, `DeskHotspot.tsx` | Desk's fixed position/scale constants | Until Milestone 6 potentially needs per-project sub-positions | Extend in place; no consumer outside this module needs to change |
| `DeskHotspot` component | `Workspace.tsx` only | Render + idle-animate the one real hotspot that exists | Through Milestone 7 or so, until enough hotspots exist to justify a generic `<Hotspot>` component | Generalize only once a second, third real hotspot (Bookshelf, Leadership) shows the actual shared shape — not before |
| `PROJECTS` (`content/projects.ts`) | `DeskPanel.tsx` | The three flagship projects' Level 1 content | Grows fields in Milestone 6, not replaced | Additive — new fields, not a new shape |
| `PersistentActions` | `Workspace.tsx` only | Resume + Contact, always-reachable | Indefinite — this is the permanent home for both, not scaffolding | N/A — this is intended to be stable |

### Design For Deletion, applied twice this milestone

1. Removed `"desk"` from `CameraTestHarness.TEST_TARGETS` now that `DeskHotspot` is real — the harness got smaller, confirming it was genuinely temporary rather than becoming permanent scaffolding by inertia.
2. Removed the Milestone 4 "dummy layer" proof-of-concept button and its wiring entirely, now that `LayerPanel` has a real consumer (Desk) proving the same mechanism. Keeping both would have been exactly the kind of code that "if deleted six months from now, the architecture gets simpler" — so it was deleted now instead of waiting.

### Coupling Review

- **More coupled:** `Workspace.tsx` now imports `DESK_HOTSPOT` from `roomGeometry.ts` and coordinates `camera.focus()` + `layers.open()` together for one real interaction — an increase from Milestone 4's inline coordination of one *dummy* interaction to one *real* one. Same shape, real content now.
- **Less coupled:** `CameraTestHarness` no longer needs to know about Desk at all — one less concern in a component explicitly documented as temporary.
- **Dependencies that disappeared:** the dummy-layer button's direct coupling to `DUMMY_TARGET` and the hardcoded dummy content string in `Workspace.tsx`.
- **New dependencies:** `DeskPanel.tsx` → `content/projects.ts` (Layer content depending on Content — the intended direction per Layer Responsibilities, not an accident); `PersistentActions.tsx` → `lib/assets.ts`'s new `DOCUMENTS` export.

### A real bug, root-caused with Falsification Before Confirmation — not just "the M4 fix"

**Observation.** Reopening the (now real) Desk layer reproduced the exact Milestone 4 paint bug — despite the M4 fix still being present, unchanged, in the code.

**Interpretation, held provisionally.** My first instinct was "the fix regressed somehow." I did not accept that — per Falsification Before Confirmation, the question was "what would prove the fix is still correct," not "how do I explain it broke."

**Hypothesis.** The M4 fix depends on `requestAnimationFrame`, which is scheduled but the test tab reports `document.hidden: true` throughout this session (already known from Milestone 3). If Chromium suspends rAF callbacks entirely on hidden documents — not just throttles them — the fix's callback simply never runs here, independent of whether the fix itself is correct.

**Experiment.** Scheduled a bare `requestAnimationFrame` with no relation to `LayerPanel` at all, and checked whether it fired after 2 seconds on the same hidden tab.

**Evidence.** It did not fire. Confidence: **Very High** — a single clean, isolated experiment with an unambiguous result (a boolean flag either flips or it doesn't).

**Conclusion.** The Milestone 4 fix was never unreliable — the mechanism it relied on (`requestAnimationFrame`) is unreliable specifically under conditions (`document.hidden`) that this test environment reproduces reliably but a real user's foregrounded browser tab would not. Re-classified `ASSUMPTIONS.md` A7 accordingly rather than left as originally written.

**Fix.** Replaced `requestAnimationFrame` with `setTimeout(fn, 0)`, which is not visibility-gated. Re-verified: correct position immediately after the real click-driven open, on the same hidden tab, where the rAF version failed.

### Postmortem — why this took longer than a "wire up a hotspot" milestone should have

**Why it happened.** The Milestone 4 fix was verified once, under conditions that happened to let a throttled-but-not-fully-blocked rAF sneak in before the check ran. It looked solid because the *symptom* was gone, not because the *mechanism* had been stress-tested.

**Why it looked reasonable at the time.** "Force a reflow shortly after the transition starts" is a legitimate, well-known pattern — the specific choice of *which* deferred-execution API to use looked like an implementation detail, not a load-bearing decision.

**How the investigation evolved.** Reproducing the bug on a real content-bearing interaction (not the disposable dummy one) surfaced that the earlier fix's verification had a hidden dependency on timing that hadn't been isolated. Falsifying the rAF-fires assumption directly, in under a minute, resolved it — the expensive part was Milestone 4's original bug hunt, not this one.

**How future engineers can avoid repeating it.** When a workaround depends on a browser API with its own scheduling semantics (`requestAnimationFrame`, `IntersectionObserver`, etc.), test that API's actual firing behavior in isolation under the same test conditions before trusting a workaround built on top of it — don't just test the workaround's end-to-end symptom once and move on.

**Confidence in the current fix:** **High** — verified through the real interaction flow on a production build, on the exact tab condition (`document.hidden`) that broke the previous version, but not yet cross-browser or on a real foregrounded tab (`ASSUMPTIONS.md` A7, updated).

---

## Milestone 6

### Content Truthfulness, applied as a real constraint, not a slogan

Before writing any Level 2-4 content, `PROJECT_CONTENT_REVIEW.md` audited all three flagship projects the way an interviewer would, using only verifiable evidence. The result changed the implementation plan: the Neonatal Simulator's own repository README (read directly — real architecture, a design-pattern table with stated rationale, 41 real tests, a real GitHub URL) supports genuine Level 3 depth. The Industrial Safety Platform and Spam/Phishing Detector have resume-bullet-only evidence, and their Level 3 content is deliberately thinner rather than padded to match — inventing tradeoff narratives neither project has documented would have been exactly the "inflated language" this milestone was scoped to eliminate. Gaps are tracked in `MISSING_CONTENT.md`, not silently filled.

### Accordion state stays local to `DeskPanel`, not promoted to `useLayerStack`

Confirms `ASSUMPTIONS.md` A5: expanding a project to Level 2/3 is `useState` inside `DeskPanel`/`ProjectAccordionItem`, not a second Layer-stack entry. One project's expand state doesn't need URL sync or browser back/forward of its own — only the Desk Layer itself does. Building this the simple way first, and only promoting it to the Layer Engine if a real future need shows up, is Small Surface Area in practice, not just in principle.

### The Blueprint reveal is a second, independent trigger inside Level 2 — not automatic

Per `INTERACTION_SPECIFICATION.md`, "See the architecture" is its own click, distinct from expanding the accordion item. This matters for Progressive Disclosure: a visitor who only wants the one-paragraph summary never has architecture-list content forced into view, and the outbound link only appears once Level 3 is actually opened, not the moment the project expands.

### Verification

Tested through the real click flow on a production build (not manual DOM patching): all three projects expand and collapse correctly; the accordion is mutually exclusive (opening a second project closes the first — confirmed via `aria-expanded` on both, not assumed from one); the Neonatal project's Blueprint reveal shows all four architecture points and links to the real, verified repository URL; the Milestone 5 paint-bug fix (`setTimeout`) still holds under the same `document.hidden` condition, confirming Milestone 5's fix generalizes to real content, not just the one interaction it was verified against.

## Milestone 7

### Splitting one hotspot into two, not adding a sub-panel

`NARRATIVE_SYSTEM.md`'s World Rules previously had the Bookshelf stand for both "Knowledge" and "Research," with a Research Journal reachable as a Level 3 sub-interaction inside it. This was a user-directed architectural revision, not a bug fix: Knowledge (where his thinking comes from) and Research (how he contributes new thinking) are different claims requiring different kinds of evidence, and `EVIDENCE_SURFACES_REVIEW.md`'s content review confirmed this concretely — the Research content earned a High confidence rating (primary, current-status, self-reported) while the Knowledge content only reached Medium (domain-level, cross-referenced, no named sources yet). Collapsing them into one panel would have forced the weaker evidence to set the ceiling for both. `KnowledgeHotspot` and `ResearchHotspot` are two independent, identically-structured components (mirroring `DeskHotspot`), not a shared component with a mode flag — each has its own `aria-label`, its own geometry constant, and its own panel, since nothing about them varies parametrically enough to justify a shared abstraction yet.

### Hotspot geometry: reasonable-effort placement, not new pixel measurement

`KNOWLEDGE_HOTSPOT` and `RESEARCH_HOTSPOT` in `roomGeometry.ts` are placed within the already-measured `ZONE_BOUNDS_X.research` range, at two distinct x-positions, rather than being independently pixel-verified against specific furniture sprite sub-positions. This follows the same honesty pattern `DESK_HOTSPOT` already established: real, measured zone bounds, reasonable-effort placement within them, explicitly not claimed as sub-pixel-verified. No new pixel inspection was performed this milestone.

### Asset reuse: no new sprite for the Research Journal

The Research Journal's visual is the same VERIFIED book sprite category in `SmallItems.png` already used for the Bookshelf's animation, rendered as a distinct, smaller hotspot rather than sourcing a dedicated "notebook" asset that isn't confirmed to exist. `ASSET_REGISTRY.md` updated to reflect this dual usage of one verified asset rather than implying two separate sprites.

### Verification

Confirmed via the production build and a real click-through in the browser preview (not just a code read): both new hotspots render with correct `aria-label`s (`"Open the Bookshelf — knowledge"`, `"Open the Research Journal"`), are spatially distinct in the establishing shot (visually confirmed via screenshot — two separate bordered regions within Zone 3, not one), open their own panel with the correct content, and move focus to `#layer-panel-heading` on open (`document.activeElement.id === "layer-panel-heading"`, same check used in Milestones 4-5). The Research Journal's "● Active" status was confirmed to render its text label independently of the dot, per `ASSUMPTIONS.md` A9. `lint`, `tsc --noEmit`, and `next build` all pass clean. `research` removed from `CameraTestHarness.tsx`'s `TEST_TARGETS` (Design For Deletion) now that both real hotspots exist.

### A testing-environment note, not a project bug

While starting the dev server for this milestone's verification, a manually-run `npm run dev -- --port 3100` reported `Another next dev server is already running` (PID on port 3000) — a leftover dev server from earlier in the session, not a code issue. Verification proceeded against the already-running instance on port 3000 instead. Logged here only because it's the kind of environment-state confusion `ASSUMPTIONS.md`/Test Environment Matrix discipline exists to catch and attribute correctly, not because it reflects anything about the shipped code.
