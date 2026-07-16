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

## Milestone 8

### Grid fallback: cluster cards, not a per-certificate grid

`VERSION1_SCOPE.md` requires the grid fallback (not the fan-out) as the Must-Have baseline, but `LOW_FIDELITY_EXPLORATION.md` already flagged a literal certificate-per-cell grid as weak for this content specifically — the real cluster sizes are wildly uneven (24 Model UN conferences vs. 2 case-comp placements), which would read as empty padding, not restraint. `LeadershipPanel` implements four cluster cards instead (title, quantified headline, one-line detail), which carries the Must-Have's real content requirement without inheriting the grid's documented weakness or needing the fan-out's complexity to avoid it.

### Two real scope corrections made before implementation, not discovered mid-build

`IMPLEMENTATION_PLAN.md`'s original Milestone 8 entry assumed two things that weren't true once checked: a "certificate-PDF-cataloguing gap" it cited from `MISSING_ASSETS.md` was never actually logged there (certificate frames use the generic verified sprite plus real text content, not scanned images — there was never a blocking asset gap), and the Whiteboard content described as "written in parallel" didn't actually exist. Both were caught during the Implementation Readiness Check, before any code was written, rather than surfacing as a mid-milestone surprise. The Whiteboard was moved from Must Have to Should Have in `VERSION1_SCOPE.md`, with the real gap logged in `MISSING_CONTENT.md` rather than shipped as a fabricated framework.

### Hotspot geometry: reused test-harness coordinates, same pattern as Milestone 5

`LEADERSHIP_HOTSPOT` reuses the exact `{x: 16.5, y: 50, scale: 2.2}` `CameraTestHarness` already used for its own "leadership" test button, rather than a fresh, unrelated estimate — the same Design For Deletion pattern `DESK_HOTSPOT` established in Milestone 5 (the real hotspot inherits the scaffolding's already-reasonable position).

### A testing-tool artifact: coordinate drift from stale horizontal-scroll state, not an app bug

Real `left_click` attempts on `LeadershipHotspot` were inconsistent this session — some landed correctly (confirmed via screenshot: correct camera zoom, correct panel content), others silently missed. Root-caused, not assumed: a `read_page` accessibility-tree snapshot's computed click coordinates can go stale if the page's horizontal scroll position (the workspace container uses `overflow-x: auto` and was wider than the viewport at the tested window size) changes between the snapshot and the actual click — vertical (`y`) coordinates were consistently correct across every attempt, while horizontal (`x`) coordinates drifted, which is exactly the signature of a scroll-offset mismatch rather than a rendering or hit-testing bug in the app. Verified against both the dev server and a separate production build (`next start`) to rule out Fast Refresh/HMR as the cause — identical behavior on both, confirming this is a testing-tool/environment artifact, not a dev-server-specific one. Where a real click did land correctly, the app behaved correctly end to end (camera focus, panel open, correct content). Where it didn't, falling back to a JS-dispatched `.click()` for verification purposes reproduced the already-documented `ASSUMPTIONS.md` A6 focus-capture caveat exactly as predicted, not a new problem.

### Verification

Confirmed via lint, `tsc --noEmit`, and a production build (`next build`, then `next start` on a separate port) — all pass clean. The Leadership hotspot renders with the correct `aria-label` ("Open the Leadership Wall"), is spatially and visually distinct from the other hotspots (Zone 1, matching the sage/olive wall), and — via a real click that landed correctly — opens a panel with all four real cluster facts rendered correctly, moves focus to `#layer-panel-heading`, and updates the URL to `?panel=leadership`. A real Escape keypress correctly closed it and reverted the URL. `leadership` removed from `CameraTestHarness.tsx`'s `TEST_TARGETS` (Design For Deletion).

### CI workflow fix: `main` → `master`

Building `PROJECT_HEALTH.md` surfaced that `.github/workflows/ci.yml` triggered only on `branches: [main]`, while this repository has used `master` since its first commit (`146e324`) and has exactly one branch — confirmed via `git branch -a` (only `master` exists) and `.git/HEAD` (`ref: refs/heads/master`). No remote is configured, no other branch has ever existed, and nothing in the repository's history suggests an intended migration to `main` — this reads as the workflow template's default assumption never having been corrected for this repo's actual branch name, not a deliberate choice. Corrected both the `push` and `pull_request` triggers to `master`. Until a remote is added, this workflow still won't execute anywhere, but it will now trigger correctly the moment one is.

## Post-Milestone 8: Leadership content evolution

*Content evolution, not a new milestone or an architecture change — the hotspot/panel/layer mechanism is untouched; only `leadership.ts`'s content shape and `LeadershipPanel`'s presentation changed.*

### Source and delta

A new, authoritative Debate/MUN CV superseded the resume-level facts the original Milestone 8 content was built from. A full delta report was produced and presented to the user before any content changed (classified New/Updated/Corrected/Removed/Duplicate/Potential Conflict, per the user's explicit process requirement), and the following resolutions were approved before implementation:

- **Corrected Information.** "24 Model UN conferences" → **25**, confirmed by direct count of the CV's Delegate Experience section.
- **Removed Information.** "6 judged, mentoring 200+ participants" — removed outright, not re-leveled or softened. The new CV supports neither number: it lists 11 chairing roles (not 6), and "200+ participants mentored" appears nowhere in it. Rather than guess at a reconciliation, the aggregate claim was dropped in favor of directly evidenced content — the 11 named chairing roles themselves, which is a stronger and fully checkable claim.
- **Kept, with a status flag.** "Joint Secretary, UNESQUO Debating Society" — absent from the new CV (which is MUN/debate-scoped, not a full activities list), kept at the user's explicit direction, tracked as Pending Secondary Verification (`ASSUMPTIONS.md` A10) rather than either asserted as fully confirmed or silently dropped.
- **Flagged, not acted on.** "Deputy Editor-in-Chief" — found only in early design docs (`NARRATIVE_SYSTEM.md`, `PORTFOLIO_STRATEGY.md`), never shipped in any version of `leadership.ts`, not addressed in the user's approval message. Left out of shipped content (consistent with every prior version), logged as unresolved (`ASSUMPTIONS.md` A11) rather than either added or purged from the design docs that mention it.
- **Noted, not flagged as blocking.** One delegate entry ("St. Xavier's Diplomacy Summit," Honourable Mention) is dated 2019 in the source CV, four years before every other entry and before the stated BIT Mesra enrollment date. The user's approval of "25" as the correct total conference count implicitly includes this entry, so it's counted; the date itself isn't displayed anywhere in the shipped content (the Diplomacy capability shows tiered aggregate counts, not per-entry dates), so the anomaly doesn't surface as a visible inconsistency. Noted here for the record, not corrected or hidden.
- **Public contact email updated.** `PersistentActions.tsx`'s `CONTACT_EMAIL` changed from `nisirbage7716@gmail.com` to `nisirworks@gmail.com`, per explicit instruction, scoped only to the public-facing contact link — git's own commit-author email is a separate, untouched concern.

### Restructure: activity type → transferable capability

The four Leadership clusters were rebuilt from activity-type groupings (Debate & APD / Model UN / Case Comps / Positions) to transferable-capability groupings (Diplomacy / Communication / Leadership / Case Competitions), per explicit direction. This is a genuine reclassification, not a rename: "Chairing" (11 roles) moved under Diplomacy rather than Leadership, since presiding over a committee is fundamentally a negotiation/facilitation skill in this framing, matching where the source CV itself groups it. "Adjudication" (5 judging assignments) moved under Communication rather than staying implicitly folded into the old "Model UN" cluster's discredited "6 judged" aggregate — debate-tournament judging and MUN-conference chairing are different skills evidenced by different source-CV sections, and conflating them was part of what made the old aggregate claim unsupportable in the first place.

Evidence volume now genuinely differs by cluster (Diplomacy: 36 named items; Communication: 11; Leadership: 2; Case Competitions: 2), and the content isn't artificially padded to balance this — per instruction, evidence determines prominence.

### Presentation: reused the Desk Layer's accordion pattern, added a nested layer for evidence groups

`LeadershipCapabilityItem` mirrors `ProjectAccordionItem`'s expand-in-place pattern (local `useState`, no new Layer-stack entry) rather than introducing a new interaction paradigm — consistent with Refactoring Policy: reuse before inventing. One further nesting level was added beyond what Projects needed: each capability's evidence is grouped (e.g., Diplomacy's "Delegate Experience" vs. "Chairing"), and each group has its own show/hide toggle, since a single capability can now contain far more raw evidence (36 items for Diplomacy) than a project's architecture list ever did. This is the one genuinely new structural element, justified by real content volume, not added speculatively.

### Maturity levels

Introduced an L0–L4 leadership-specific maturity scale (`CONTENT_MATURITY.md`), parallel in spirit to the project M0–M5 scale but shaped for achievement content. Current levels: Diplomacy L2, Communication L2, Leadership L1 (held back by the Joint Secretary pending-verification item — a capability is rated by its weakest real claim, not its strongest), Case Competitions L2 (unchanged). No capability claims L3 (reflection) or L4 (artifacts) — none exist yet.

### Verification

Confirmed via lint, `tsc --noEmit`, and a production build. `LeadershipPanel` renders four capability cards in the new order (Diplomacy, Communication, Leadership, Case Competitions), each expands independently, each nested evidence group expands independently, `aria-expanded` correct on both levels of toggle.

## Post-Milestone 8: furniture sprite integration (Root Cause + Asset Truthfulness finding)

### Root cause

Auditing assets against the live build for `ASSET_REQUIREMENTS.md` surfaced that `public/assets/` contained only `floors-and-walls.png` and `door-closed.png` — every furniture sprite `ASSET_REGISTRY.md` had marked VERIFIED (desk, bookshelf, picture frames) was verified against the *source pack* (`C:\Users\BIT\Downloads\Top-Down_Retro_Interior\`), never actually copied into the repo, cropped, or rendered. All four built hotspots were — and had been since Milestone 5 — invisible click-zones over bare floor. This wasn't caught earlier because every milestone's verification checked *interaction correctness* (does the panel open, does focus move, does the URL sync) and *content correctness*, never *"does the establishing shot show what the room shell copy in Interaction Specification and Spatial Blueprint says it should."* Worth naming as a real process gap: visual-truthfulness needs its own explicit check, not just functional and content checks.

### Sprite extraction method

Followed the same methodology `ENGINEERING_DECISIONS.md` Milestone 2 used for door-gap measurement: direct pixel inspection via Python/PIL, not estimation from a thumbnail. Generated a coordinate-grid overlay (every 16px native, upscaled 4-8×) over both source sheets, visually located each target sprite, cropped a candidate box, re-rendered it upscaled to confirm clean edges (no adjacent-sprite bleed, no clipped border), and iterated the crop box until clean — desk and bookshelf both needed one correction pass after the first crop caught part of a neighboring sprite.

Final crop boxes, `TopDownHouse_FurnitureState1.png` (208×288 source):
- Desk: `(0, 31, 48, 64)` → 48×33px
- Oak bookshelf: `(31, 63, 78, 112)` → 47×49px

`TopDownHouse_SmallItems.png` (128×128 source):
- Frame (abstract): `(0, 16, 16, 32)` → 16×16px
- Frame (landscape): `(16, 16, 32, 32)` → 16×16px

### Placement: reused existing hotspot centers, added a new sprite-sizing helper

`getSpritePlacement()` (`roomGeometry.ts`) computes a sprite's percent-rect centered on a hotspot's *existing* `centerXPercent`/`centerYPercent` — deliberately not a second, competing position system. The hotspot coordinate stays the single source of truth for *where*; the new helper only adds *how big*, derived from the sprite's real pixel dimensions. `getDoorPlacements()`'s `toPercentRect` does similar math but anchors top-left instead of center (doors align to a measured gap edge, not a center point) — close enough that a shared low-level helper was considered, but the two functions' anchoring semantics differ enough that forcing one abstraction now would cost more clarity than it saves for two call sites. Revisit if a third placement consumer appears (Refactoring Policy: don't abstract on one weak signal).

### Click-zone treatment: transparent at rest, not tinted

Each hotspot's button previously carried a permanent `bg-amber-200/20` tint — reasonable when it was the only visible thing marking the hotspot, wrong now that real furniture renders underneath it. Changed to `border-transparent`/no background at rest, with the amber border and tint only appearing on hover/focus — the sprite is now what's visible by default, matching what `INTERACTION_SPECIFICATION.md` always described the establishing shot as showing.

### Leadership: two frames, not the full gallery

Only 2 of the requested 2-3 frame instances were placed (not a third, duplicate crop of one of the two existing variants) — a small offset cluster, honest to what's actually being shown (a preview of a gallery, not the gallery itself, which remains the Should-Have fan-out). Positioned above the click-zone's vertical center to read as wall-mounted rather than floating mid-zone.

### Verification

`lint`, `tsc --noEmit`, and `next build` all pass clean. Confirmed via the live DOM (not just visual inspection) that each `<Image>` renders with the correct `src`, and that `getSpritePlacement`'s computed percentages keep each sprite's visual center aligned with its hotspot's existing click-zone center at multiple viewport widths (percentage-based, so this holds by construction, not just at the tested size).

## Visual Truthfulness correction pass

Applying "hidden hotspot = incomplete implementation" retroactively to the previous pass surfaced two real bugs in the furniture-integration work itself, not just the pre-existing gap:

### Bug: click-zones were smaller than the sprites they now sit on

Desk's button (12%×22%) was narrower and shorter than its own sprite (16.67%×22.92%) — the edges of a now-visible desk weren't clickable. Same issue, worse, on Knowledge: button 9%×20% against a sprite 16.32%×34.03%. Both predate this pass — the click-zone sizes were chosen in Milestones 5/7 as "generous beyond a sprite that didn't exist yet," and nobody re-checked them once a sprite did. Corrected to 18%×26% (Desk) and 18%×37% (Knowledge), both now verified ≥ their sprite's footprint on both axes via direct DOM measurement, not just visual judgment.

### Gap: Research Journal was still fully invisible

The one built hotspot the first integration pass didn't touch. Cropped the open-book sprite from `SmallItems.png` (box `0,48–16,64`, matching the "Books (open, closed)" entry `ASSET_REGISTRY.md` had verified since Phase 1 but never actually assigned a specific crop to) and wired it into `ResearchHotspot.tsx`, with its click-zone sized the same corrected way (8%×13% against a 5.56%×11.11% sprite).

### Why this wasn't caught the first time

The first integration pass verified *that* each sprite rendered (network 200s, `complete: true`, sane percentages) but not the *relationship* between the sprite's footprint and its own click-zone's footprint — a narrower check than "visible, correctly positioned, correctly layered" actually requires. Recorded here as the specific process gap, not just the fix, since the same narrow-check pattern could recur on the next asset added unless the check itself is deliberately broader next time.

### Verification

`lint`, `tsc --noEmit`, `next build` clean. Re-verified all three corrected hotspots via direct DOM measurement (not visual judgment): computed sprite width/height vs. button width/height, confirmed `button ≥ sprite` on both axes for Desk, Knowledge, and Research. Research's book sprite confirmed loading (`200 OK`, no console errors).

## Phase 1 reuse pass: dressing sprites, one registry correction, one repeat bug

### Two more sprites reused, zero new sourcing

Walnut bookshelf (`FurnitureState1.png`, crop `93,64–143,112`) placed as pure decorative dressing at Zone 3's left edge, ahead of Knowledge's own bookshelf — gives Knowledge and Research two visually distinct objects instead of implying one shelf. Loose paper stack (`SmallItems.png`, crop `32,16–48,32`) placed offset from the Desk's center, reading as papers left on the surface. Neither is interactive — no hotspot, no click handler, `pointer-events-none`.

### Registry correction: "Folder stack (brown)" doesn't exist

Re-scanning `SmallItems.png` for the item `ASSET_REGISTRY.md` had logged as "Folder stack (brown)" found a treasure-chest sprite (lid line, latch/keyhole detail) at that position instead — fantasy-adjacent, not office folders, doesn't fit the cozy-study brief. This was a real cataloging error from early in the project, not a new finding about the pack. Corrected the registry entry rather than forcing the chest sprite into use as a "close enough" folder substitute, per the explicit instruction not to recolor or repurpose unrelated sprites into inaccurate substitutes. Logged as a genuine gap in `AI_GENERATION_REQUEST.md` instead.

### Repeat bug: missing `priority`, same root cause as Milestone 2's door bug

Both new dressing `<Image>`s shipped without the `priority` prop — copy-paste from the furniture-sprite pattern established two sessions ago, minus one line. Verification caught it immediately: `naturalWidth`/`naturalHeight` both `0`, `complete: false`, despite a clean build and no console errors — a clean build was never sufficient evidence on its own, consistent with why DOM-level checks replaced visual-only checks after the click-zone bug. This is the *same* bug class `ENGINEERING_DECISIONS.md`'s Milestone 2 entry documents (`loading="lazy"` default on images not part of the very first paint), recurring because the fix was applied to specific components at the time, not captured as a lint rule or a shared component that makes the mistake structurally impossible. Worth a real fix, not just a note: every future establishing-shot image should go through one shared component that hardcodes `unoptimized` + `priority` + `pixel-art`, rather than relying on each new `<Image>` call site remembering all three. Not built yet — flagged here as a concrete refactor candidate for the next time a fourth or fifth sprite needs this exact pattern (Refactoring Policy: real repetition, not a hypothetical one).

### Verification

Fixed by adding `priority` to both. Rebuilt, restarted the verification server (stale build was still being served from the prior process), re-checked via direct DOM measurement: both sprites now `complete: true` with correct `naturalWidth`/`naturalHeight`. `lint`, `tsc --noEmit`, `next build` all clean.

## Responsive Layout Polish: two real bugs, one correction to an earlier conclusion

### Bug 1: closed `LayerPanel`s extended the document's scrollable width

Measured directly (`document.documentElement.scrollWidth` vs. `clientWidth`) rather than assumed: at a 1280px viewport, `scrollWidth` was 1664px — exactly 384px too wide, matching `LayerPanel`'s `w-96`. Root cause: closed panels sit at `transform: translateX(100%)`, which visually moves them off-screen but still contributes to the containing block's scrollable overflow region per the CSS spec (transforms are included in scrollable-overflow calculation) — and the outer `Workspace` wrapper had `overflow-x: visible`, so nothing clipped that reserved space. The room's own inner container already had `overflow-hidden` for exactly this class of problem; the outer wrapper holding the `LayerPanel`s didn't. Fixed by adding `overflow-x-hidden` to the outer wrapper. Verified at 1280px, 768px, and 400px: `scrollWidth === clientWidth` at every width, both with panels closed and with one open.

### Bug 2: `LayerPanel` rendered off-screen at narrow viewports — an over-constrained CSS position

At a 400px viewport, opening a panel placed it at `left: -216.8px, right: 167.2px` — genuinely off-screen, not a rendering delay (re-checked after the full transition duration; `transform` was confirmed `matrix(1,0,0,1,0,0)`, i.e., fully settled). `getComputedStyle` showed `left: 16px` computed despite no class setting `left` at all — `right: 0`, an explicit `width` (`w-96`), and the ancestor's `justify-center` flex context together produced an over-constrained absolute-position resolution where the browser was not treating `right: 0` as authoritative the way `right-0` alone (without a competing `left` resolution) normally would. Fixed by pinning `left: "auto"` explicitly in the inline style, removing the ambiguity rather than relying on the implicit default. Re-verified at 400px: panel now sits flush at `right: 400` (viewport width), `left: 16` (16 + 384px width = 400, exactly flush), fully on-screen, no scrollable overflow.

### Correction to Milestone 8's "coordinate-drift" conclusion

Milestone 8's `ENGINEERING_DECISIONS.md` entry attributed inconsistent real-click behavior on `LeadershipHotspot` entirely to a testing-tool artifact (accessibility-snapshot coordinates going stale against horizontal scroll state). That conclusion is only partially right: the tool-side timing issue is real and independently verified, but this session's measurement shows the page *did* have genuine, reproducible horizontal scrollable overflow at the time (Bug 1, above) — meaning a real contributing condition existed that the earlier entry ruled out too quickly. Recorded here per Falsification Before Confirmation: the original entry isn't rewritten (Entries are appended, not rewritten), but the conclusion it drew should be read as superseded — "testing-tool artifact, full stop" was an overconfident diagnosis; "testing-tool timing issue, compounded by a real horizontal-overflow bug this session fixed" is the accurate one.

### Verification

`lint`, `tsc --noEmit`, `next build` clean. Both fixes verified via direct DOM measurement (not visual judgment) at 1280px, 768px, and 400px viewports, panel closed and open at each.

## Keyboard Accessibility & Focus Management Audit

Full, uniform pass across all four hotspot/panel pairs, replacing a set of individual spot-checks accumulated across Milestones 4–8 with one consistent verification method (`ASSUMPTIONS.md` A8, A12; `ACCESSIBILITY_CHECKLIST.md`).

### Method note: real OS-level Escape produced zero DOM events this session

Confirmed via a capturing `keydown` listener before attempting Escape on the Knowledge panel — the `computer` tool's key action reported success, but no event reached the page at all. Root-caused, not shrugged off: `document.hidden: true` on this Browser tab (the same persistent quirk already documented elsewhere in this project) appears to also block real OS-level key delivery, not just rAF/CSS-transition timing as previously observed. This does **not** contradict Milestone 7's finding that a real trusted Escape keypress carries the correct `event.key` and works correctly — that was observed on a different attempt where the event *did* arrive. Fell back to `document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))` for the remainder of this audit — untrusted (`isTrusted: false`), but exercises the exact same `addEventListener` code path and `event.key` check the app actually runs, which is what needed verifying.

### Results

All four panels (Desk, Knowledge, Research, Leadership) independently confirmed: opens with focus moving to `#layer-panel-heading`; closes via Escape with the URL reverting and `inert` toggling correctly. Full-page Tab order enumerated programmatically in the default state: Contact → Resume → Desk → Knowledge → Research → Leadership → test-harness buttons, exactly the expected 10 elements, no closed-panel content leaking into the order (`inert` correctly excludes it). Per-panel internal order confirmed: Desk's project accordion (3 toggles, plus the nested "See the architecture" reveal and its `rel="noreferrer"` outbound link); Leadership's two-level accordion (4 capability toggles, plus nested evidence-group toggles inserted immediately after their parent when expanded, `aria-expanded` correct at both levels).

One measurement artifact worth naming rather than hiding: an early combined "click-then-immediately-read" script raced React's state update and returned a false negative (looked like the Research panel didn't open). Splitting the click and the read into two separate calls resolved it — recorded so the same false alarm isn't re-investigated as a real bug later.

### Verification

No code changes this pass — audit only. `ASSUMPTIONS.md` A8 upgraded from Partially Verified to fully Verified for Escape-to-close (now independently confirmed on all four panels, not architecturally inferred for three of them). New `ASSUMPTIONS.md` A12 added for full Tab-order correctness. `ACCESSIBILITY_CHECKLIST.md`'s Tab reachability, Escape, and Accordion-state rows updated with the same evidence.

## Production Hardening: Cross-Browser Review

Full source-level audit of every browser-sensitive feature actually used in the codebase — CSS transforms, overflow, `focus-visible`, `pointer-events`, URL API, `ResizeObserver`, `prefers-reduced-motion`, `image-rendering`, `backdrop-filter`, `sticky`/`fixed` positioning — checked against real evidence (compiled CSS output, direct grep of `src/`), not a generic "should be fine" pass. Full results in `ASSUMPTIONS.md` A13–A19. No code changes; this was audit-only. Headline finding: `inert` (used for closed-panel exclusion) is the least-supported feature in the entire codebase — Firefox only since April 2023 — and the one whose failure mode is a real accessibility regression, not a visual one, making it the top-priority item for the eventual real-browser check, ahead of the already-tracked pixel-rendering and `aspect-ratio` items.

## Production Hardening: Performance Review

Measured what's actually measurable in this environment (bundle composition, network requests, source-level render/effect analysis) rather than attempting to profile render counts or interaction latency without a profiler, which this environment still doesn't provide (`PERFORMANCE_BUDGET.md`'s Production Hardening section has full numbers).

### One real fix: unmemoized handlers were churning a document-level event listener

`Workspace.tsx`'s five interaction handlers (`openDesk` etc., `closeLayer`) were plain functions, redefined every render. `closeLayer` sits in `LayerPanel`'s Escape-key `useEffect` dependency array, so every Workspace re-render (any camera move, any layer change) tore down and re-added a document-level `keydown` listener, not just actual close events. Wrapped all five in `useCallback`.

First attempt was wrong and caught by the linter, not by inspection: using `camera`/`layers` (the hook-returned objects) as dependencies looked reasonable but silently defeats the memoization, since `useCamera`/`useLayerStack` return a new object literal every render — only the individual `focus`/`reset`/`open`/`close` functions inside them are actually stable (already `useCallback`-wrapped internally). `eslint-plugin-react-hooks`'s `exhaustive-deps` rule flagged this immediately (`missing dependencies: 'camera' and 'layers'`), which is what caught it — destructured `cameraFocus`/`cameraReset`/`layersOpen`/`layersClose` out at the top of the component so the dependency arrays reference stable values directly. Worth recording as a general lesson, not just a one-off fix: depending on a hook's *return object* instead of the *specific stable function inside it* is an easy, silent way to write a `useCallback` that does nothing.

### What was deliberately not done

No `React.memo`, no broader memoization pass. Both would be speculative without render-count evidence this environment can't produce, which would violate the explicit "avoid speculative optimization" instruction rather than satisfy it.

### Verification

`lint` (including `exhaustive-deps`), `tsc --noEmit`, `next build` clean. Functional regression check on a production build: Leadership panel open (real click → focus moves to heading) and close (dispatched Escape → URL reverts) both re-verified working identically post-change.

## Production Hardening: Deployment Readiness

Full audit in `DEPLOYMENT_CHECKLIST.md` — environment variables, build warnings, asset paths, metadata, favicon, robots.txt, sitemap, OG/Twitter metadata, canonical URLs, 404/error handling, loading states, production logging, security headers, CSP compatibility, image caching, README deploy instructions.

### What was actually built this pass

`NEXT_PUBLIC_SITE_URL`-driven `metadataBase` plus Open Graph, Twitter card, and canonical metadata in `layout.tsx`; `src/app/robots.ts` and `src/app/sitemap.ts` (Next.js metadata routes, both verified generating correctly via `curl` against a production build, not just code review); corrected a stale `README.md` status line still claiming "Milestone 5, complete"; added a real Deployment section to the README.

### What was deliberately documented but not built

Custom `not-found.tsx`/`error.tsx` (a real aesthetic decision, not a config toggle — out of scope for "prepare, don't implement new features"), security headers in `next.config.ts` (specific header values are a real security-posture choice, not a default to silently pick), an OG share image (no real asset exists; fabricating one would violate Asset Truthfulness the same way a placeholder sprite would). All three logged in `DEPLOYMENT_CHECKLIST.md` with priority and effort, not silently skipped.

### One genuine architectural risk surfaced, not previously documented

This app relies extensively on inline `style` props for camera transforms and sprite positioning — core to how the room renders, not incidental. A future strict Content-Security-Policy (`style-src 'self'`, no `'unsafe-inline'`) would break the room entirely. No CSP exists today, so this isn't an active problem, but it's a real landmine worth having on record before anyone adds one later without knowing this.

### Verification

`lint`, `tsc --noEmit`, `next build` clean (build now also emits `/robots.txt` and `/sitemap.xml` as static routes). Metadata output verified via direct `curl` against the compiled HTML `<head>` — `og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, and the canonical `<link>` all confirmed present and correct, not just assumed from the `Metadata` object's shape.

## Concept Reconciliation

Full deliverables (Visual Revision Report, Asset Placement Table, Geometry Table, Remaining Asset Requirements, Verification) live in `CONCEPT_RECONCILIATION.md` — this entry records the engineering decisions, not the full report.

### Root cause of the two reported defects

Both defects the user's screenshot flagged were real, not testing-tool artifacts — confirmed by DOM measurement on a fresh production build before any fix was applied. (1) Bookshelf overlap: the decorative walnut bookshelf (`centerX 51%`, native 50×48) and Knowledge's oak bookshelf (`centerX 55.5%`, native 47×49) had genuinely overlapping footprints (42.32%–59.68% vs 47.34%–63.66%) — the Phase 1 reuse pass placed the walnut bookshelf without checking it against Knowledge's already-placed sprite. (2) The Research journal (`book-open.png`) had no supporting furniture sprite at all — the Visual Truthfulness pass had only fixed its *visibility*, never its *physics*.

### What was built

A genuine, previously-unused pack asset — a round pedestal side table, source box `(176,0,192,32)` in `TopDownHouse_FurnitureState1.png`, 16×32 native px — registered as `ASSETS.readingStand` and rendered in `ResearchHotspot.tsx` beneath the journal, which now sits offset upward (`RESEARCH_BOOK_Y_OFFSET_PERCENT = -5.5556`, a quarter of the stand's own height) so it visually rests on top rather than floating at the stand's physical center. `RESEARCH_HOTSPOT` moved from 67% to 83% to clear the walnut bookshelf with a real gap; the walnut bookshelf itself moved from 51% to 72.5% and was scaled down to ~0.64× native display size (32×31 vs 50×48) so it reads as secondary to Knowledge's dominant oak shelf, per the concept's explicit "one dominant, one secondary" requirement.

### A boundary crossed deliberately

Research's new position (83%) and the walnut bookshelf's new position (72.5%) both sit past `ZONE_BOUNDS_X.research`'s upper bound (207px / 71.875%), inside `ZONE_BOUNDS_X.coffee`. Accepted rather than avoided: Coffee has no rendered dressing of its own — its focus is cut from V1 entirely (`VERSION1_SCOPE.md`) — so there is no real object to collide with, only an unused zone label. Re-verified this reasoning holds after implementation: the production screenshot shows clean orange-tile wall color in that region with no competing sprite.

### Two smaller click-zone corrections found during re-measurement

Per the task's explicit "re-measure every hotspot, don't reuse old coordinates" instruction: Leadership's click zone (unchanged position, but re-measured against its two frame sprites) was found to under-cover the left frame's left edge by ~0.3% — widened from 14% to 16%. Research's click zone was rebuilt from scratch (10%×25%, was 8%×13%) to cover the new stand+book combined bounding box rather than the old single-sprite footprint.

### What was explicitly not attempted

Reordering the physical zone sequence to match the concept's Leadership→Knowledge→Research→Workspace narrative order — Desk/Workspace physically occupies Zone 2 (`SPATIAL_BLUEPRINT.md`'s frozen Option A), which is *before* Knowledge/Research (Zone 3), not after. Reordering would mean either violating the frozen zone-assignment decision or regenerating `floors-and-walls.png` (its two door gaps are baked into fixed pixel positions per zone) — both exceed "visual/layout revision," the boundary this task set for itself. Full conflict explanation and the smallest-viable alternative are in `CONCEPT_RECONCILIATION.md`'s Visual Revision Report.

### Verification

`lint`, `tsc --noEmit`, `next build` clean. Fresh production server (port 3110), verified via direct DOM measurement (not visual judgment alone): all 11 images `complete: true` with correct `naturalWidth`/`naturalHeight`; oak↔walnut gap 34 screen px (≈3.3% canvas, no overlap); walnut↔stand gap 23 screen px (≈2.2% canvas, no overlap); all four hotspot buttons' bounding boxes fully enclose their sprites' combined bounding boxes, measured in one script so both were captured from the same layout pass (an earlier two-call comparison produced a false alarm from a page-scroll offset between calls — resolved by re-measuring both in a single `javascript_exec`, not by assumption). `document.documentElement.scrollWidth === clientWidth` at both 1230px and 400px viewports — no new horizontal overflow introduced. Keyboard/focus-management behavior itself (tab order, Escape-to-close) was not re-run as a full audit this pass — no DOM structure, element order, or focus logic changed, only inline position/size values on already-audited buttons — logged as Assumed-unchanged rather than re-claimed as Verified.

## Workspace Decoration (Polish & Environmental Storytelling)

Full deliverables (Visual Revision Report, Asset Placement Table, Geometry Table, Remaining Asset Requirements, Verification, Final Self Review) live in `WORKSPACE_DECORATION.md`. This entry records the engineering decisions, not the full report.

### The attachments didn't arrive on the first request

The user's initial message for this pass referenced three attached images (current screenshot, updated layout concept, generated asset sheet) but none came through — confirmed by checking for both inline image content and any newly-modified files in the repo or common user folders (`find ... -newermt`). Rather than guess at sprite dimensions or fabricate placeholder desk items from the text description alone, this was flagged directly and the user re-sent the images, which did arrive on the next turn. Consistent with Asset Truthfulness: no image-shaped decision gets made without actually seeing the image.

### The generated asset sheet has no real alpha channel

`generated_asset_sheet.png` (1536×1024, confirmed via `PIL.Image.open(...).convert('RGB')` loading as mode `RGB` rather than `RGBA`) uses a *drawn* checkerboard to simulate transparency rather than a real alpha channel. Every needed sprite required background keying (near-neutral pixel detection: lightness ≥233, channel spread ≤10, per-pixel) before it could be used as a game sprite — this is a documented technical step, not a stylistic reinterpretation of the art itself, consistent with the user's "use as provided, don't reinterpret" instruction.

### The generated sprites do not survive downscaling uniformly — measured, not assumed

Initial sizing used the concept-layout image's own desk-vs-object proportions as a calibration source (measured the desk's rendered pixel width in the concept image, derived a scale factor, applied it to each sheet-crop's width). This produced target sizes of 4–11px per item. At that size, every icon downscaled via Lanczos resampling became an illegible blur — verified visually (upscaled nearest-neighbor re-inspection of each candidate, the same crop-verify loop used for the real pack), not assumed from the math. Root cause: these are detailed, softly-shaded icon renders, not true low-resolution pixel art — genuine retro pixel art is designed at its final resolution with deliberately readable silhouettes, and no downscale of a high-detail source recovers that.

Recalibrated against the real pack's own established "small item" sprite convention instead (`frame-abstract.png`, `book-open.png`, `paper-stack.png` are all 16×16 — the pack's own precedent for how small a legible non-furniture object gets), then legibility-tested per item individually rather than applying one uniform scale factor: simple/flat silhouettes (Coffee Mug, Notebook, Mouse) stayed recognizable at 8–11px; the Monitor (needs a visible bezel-vs-screen distinction) and the Desk Lamp (needs a visible arm-to-shade-to-base chain) both required 16px+ to read cleanly. Final per-item sizes range 7×11 to 16×13 — see `assets.ts`'s comment on `deskMonitor` etc. for the full table. The Keyboard remains the weakest result even at its final size (14×7) — it reads as a plain dark rectangle rather than a keyboard with visible keys — logged honestly in `ASSET_REGISTRY.md` rather than claimed fully crisp.

### The desk sprite cannot fit all 8 items without any overlap — a measured, real capacity constraint

`deskSprite` is 48×33 native (frozen since Milestone 5). Summing the 8 legible-tested item footprints (987px² at final sizes) against the desk's own usable surface (~28px of its 33px height is drawn as flat wood grain before the front lip/legs begin, per direct pixel inspection of `desk.png` upscaled 10×) leaves essentially no slack — a hand-computed non-overlapping layout for all 8 items was not achievable; every arrangement attempted left at least one pair either overlapping or crowding a third neighbor. This is reported here as a real, measured implementation constraint per the user's own explicit instruction ("explain why with measurements... before making the change"), not silently resolved by shrinking items further (already at their legibility floor) or enlarging the desk (an architectural change, out of scope for a polish pass).

Resolution: two small, deliberate, documented overlaps were accepted rather than eliminated — Keyboard/Mouse touch at their shared edge (unavoidable and realistic; a mouse sits directly beside a keyboard) and the Rolled Blueprint overlaps roughly 15% of its own footprint against the Engineering Notebook (reads as the blueprint "leaning against" the notebook — plausible desk clutter, not an error). No item is more than ~15% covered by a neighbor in the final layout.

### Bounding-box math alone produced a bad first placement — caught by an actual composite render, not by the math

The first placement pass (before the fix above) computed acceptable-looking bounding-box overlaps on paper but, once rendered with the real sprites' real alpha (composited via PIL from the actual `public/assets` files at their planned positions, then upscaled 12× for inspection — a new, lower-cost variant of the project's established crop-verify methodology, since no screenshot tool was available at the time), showed the Desk Lamp visually swallowing roughly half of the Engineering Notebook — a genuinely bad result the box math had significantly underestimated (46% bounding-box overlap actually read as near-total occlusion once real pixels were considered). Repositioned based on the rendered composite, not the box math, and re-rendered to confirm the fix (final Lamp↔Notebook bounding-box overlap reduced to ~15%, and the composite confirmed both objects independently readable). Recorded as a general lesson: for irregularly-shaped sprites, bounding-box overlap percentages are a poor proxy for actual visual collision — composite-render before trusting a layout, the same principle as "screenshot before trusting a claimed fix."

### What was explicitly removed, not just added

The generic `paperStack` dressing (Phase 1 reuse pass, `walnut-bookshelf.png`'s sibling) was unregistered from `assets.ts` and no longer rendered — the new Engineering Notebook and Rolled Blueprint cover the same "papers on the desk" narrative beat with more specificity, and keeping both would be redundant decoration the Decoration Principle already warns against. The physical PNG file was left on disk (not deleted) since removing a still-valid, still-registry-documented asset file isn't necessary to stop rendering it.

### Verification

`lint`, `tsc --noEmit`, `next build` clean. Fresh production server (port 3112), verified via direct DOM measurement: 18/18 images `complete: true`; all 8 new desk sprites' bounding boxes fall fully within the desk sprite's own bounding box (no clipping past the desk's drawn edge); the existing Desk hotspot button (unchanged coordinates) still fully encloses the desk and every new item on it, so no click-zone re-measurement was needed — no new interactive elements were added (`DeskDressing` renders only `<Image>`, no `<button>`), consistent with "do not create new interaction zones." `document.documentElement.scrollWidth === clientWidth` at both 1230px and 400px — no new horizontal overflow. The Browser pane's screenshot tool was unavailable for this pass (timed out on every attempt); visual verification instead relied on direct DOM measurement plus PIL composites built from the actual committed asset files at their actual code-specified coordinates — not a mockup or approximation, the same pixels the browser renders — cross-checked against a full-room composite for the final visual-balance review. Keyboard accessibility and cross-browser behavior were not re-run — no interactive surface, DOM structure, or CSS technique changed from the already-audited state.

## Final Deployment Audit

Full deliverables (Visual Verification, Production Verification, and the master audit with interaction/repository/art-direction findings) live in `VISUAL_VERIFICATION.md`, `PRODUCTION_VERIFICATION.md`, and `FINAL_DEPLOYMENT_AUDIT.md`. This entry records the two real fixes and one methodology finding, not the full report.

### A real production-scaffolding leak, found and fixed

`CameraTestHarness` — three lowercase, unlabeled debug buttons (`clock`, `coffee`, `window`) plus a `Reset` button — was rendering unconditionally in `Workspace.tsx`, meaning it shipped to every real visitor. Confirmed via `read_page` on a live production build: it listed all four as real, focusable, clickable controls indistinguishable in the accessibility tree from the four genuine hotspots. None of the three test targets has ever had — or will ever have — a real hotspot to hand off to (Clock and Coffee are permanently cut from V1, Window is deferred to V2, per the component's own header comment), so this wasn't a temporary oversight waiting on other work, it was a real gap in the "what actually gets built" vs. "what ships" boundary. Fixed by gating the component's render behind `process.env.NODE_ENV === "development"` in `Workspace.tsx` — it remains fully available for local camera-mechanism testing, it simply no longer builds into the production bundle's render output. Re-verified on a rebuilt production server: exactly 6 interactive elements exist (Contact, Resume, 4 hotspots), zero debug controls.

### A real grounding defect, found via measurement and fixed by 8.5–9px

Knowledge's oak bookshelf, the decorative walnut bookshelf, and the Research reading stand were all vertically centered on the same `centerYPercent: 50` line despite having different native heights (49px, 31px, 32px). Centering objects of different heights on the same line puts their *bases* — the part that should read as "resting on the floor" — at different heights: measured precisely, the oak bookshelf's base sat at canvas y=96.5px, while the walnut bookshelf's and reading stand's bases sat at y=87.5px and y=88px respectively, an 8.5–9px discrepancy. This is a genuine, measurable "these two pieces of furniture aren't standing on the same floor" defect, exactly the class of thing a Visual Art Direction pass exists to catch, and it survived two prior passes (Concept Reconciliation, Workspace Decoration) because neither one specifically compared base-line alignment across objects — both checked *spacing* (no overlap) and *scale* (dominant vs. secondary) but not *grounding*. Fixed by moving `RESEARCH_HOTSPOT.centerYPercent` (50 → 55.9) and the walnut bookshelf's placement in `Workspace.tsx` (50 → 56.25) so all three objects now share one floor line exactly. Verified via a fresh PIL composite (before/after) and via a rebuilt, re-served production build (18/18 images load, no new overlap, no overflow at any tested viewport).

### A real testing-tool artifact, investigated to a specific, confirmed root cause

Mid-audit, `getBoundingClientRect()` readings on the docked `LayerPanel` disagreed with its own `offsetLeft` and `getComputedStyle().left` by exactly one panel-width (384px), reproducible at multiple viewport widths (1230px and 1920px) after both open/close transitions and window resizes. Rather than either reporting this as a site bug or silently discarding the discrepancy, it was isolated: `offsetLeft` (layout-tree-based) and computed style agreed with each other and with the intended `right: 0` design at every measurement; only `getBoundingClientRect()` (paint-based) was ever wrong, and only on this Browser-pane tab, which reports `document.visibilityState: "hidden"` persistently regardless of actual fronting state — the same root cause already on record in `ASSUMPTIONS.md` for this tool's other quirks (blocked `requestAnimationFrame`, inconsistent synthetic-key delivery). A second, related timing artifact was found the same way: checking `location.href` in the same synchronous tick as a dispatched `Escape` keydown sometimes read a stale, pre-navigation URL, because `router.push`'s navigation isn't synchronous and this tab's hidden-state throttling makes the delay large enough to observe — resolved by re-checking after a short wait, not by concluding Escape was broken. Neither finding changed any code; both are recorded here because they consumed real investigation time and the underlying mechanism is worth having on record for whoever hits a similarly-shaped false alarm next.

### Verification

`lint`, `tsc --noEmit`, `next build` clean (checked twice — once after each fix). Fresh production server, verified via `read_page`, direct DOM queries, and live click/keyboard interaction tests (not assumption) across all four hotspots: open, close, URL sync in both directions, and focus management. Responsive verification at all seven requested breakpoints (1920/1440/1280/1024/768/480/400px) — zero overflow at any width, 18/18 images loaded at every width. Console checked via `read_console_messages` on a fresh load — zero warnings, errors, or hydration mismatches. Repository re-audited for dead code, stale comments, and stale documentation — two real staleness items found in `ACCESSIBILITY_CHECKLIST.md` (a tab-reachability count and a touch-target row, both invalidated by the `CameraTestHarness` fix) and one in `CameraTestHarness.tsx`'s own header comment, all corrected in place with current evidence rather than left stale.

## Phase A — UI/UX Refinement & Responsive Foundation

Full deliverables: `UI_UX_REVIEW.md`, `RESPONSIVE_AUDIT.md`, `ACCESSIBILITY_AUDIT.md`, `INTERACTION_FLOW.md`, `AUDIO_SYSTEM.md`, `RESPONSIVE_BREAKPOINTS.md`, `FINAL_PHASE_A_REPORT.md`. This entry records the engineering decisions, not the full reports.

### A scoped, explicit exception to the Version 1 feature freeze

The prior pass had just declared Version 1 feature-frozen. This pass's brief asked for two genuine new features (ambient audio, a clickable gramophone) inside that same freeze. Rather than either silently building them (contradicting the freeze without acknowledging it) or silently refusing (ignoring an explicit, detailed request), this was surfaced directly and the user confirmed it as a deliberate, scoped exception — audio and the gramophone only, everything else in the room stays exactly as frozen. Recorded here so a future session doesn't read "feature frozen" and "a gramophone was added" as a contradiction without knowing it was resolved on the record.

### Asset Truthfulness applied to two new categories: audio and a mismatched provided-asset folder

No real audio file was supplied — the brief described concepts ("soft vinyl crackle," "light rain"), not attachments. Per the same principle already applied twice this project to images, no audio file was fabricated; the full playback/persistence/fade system was built against an empty `AMBIENT_TRACK_SRC`, gated so it never attempts to fetch or play a file that doesn't exist (verified: zero network requests for any audio file after clicking the toggle). See `AUDIO_SYSTEM.md`.

Separately, the user's own clarification about the supplied "Controllers and Keyboard" asset folder listed Check/Close/Search/Information icons as expected-immediate-use assets — but direct inspection of every file in that folder found no such icons; it contains only keyboard-key sprites, controller sprites, a mouse sprite, and cursor sprites. Rather than fabricate a check/close icon to match the described expectation, the popup's ✕/✓ controls use styled text glyphs (already an established pattern in this codebase — the accordion's own "+"/"−" indicators are plain text, not sprites). The one asset from that folder actually used is a real, cropped `ESC` keycap sprite (from `kb_dark_symbols.png`, genuine alpha channel, no background-keying needed), placed next to the panel's Close button per the brief's own "keyboard glyphs where shortcuts are shown" instruction.

### The gramophone asset and a mid-implementation animation correction

Cropped from a separately user-supplied generated sheet (`ChatGPT Image Jul 15, 2026, 05_35_48 PM.png`, found via the same "search Downloads for a recently-generated file" technique used earlier this project for the desk-item sheet). Background-keyed (solid near-black panel background, not a checkerboard this time — sampled and confirmed via direct pixel inspection, a different removal technique from the desk set's checkerboard keying, same underlying principle). Legibility-tested the same way as every other generated asset this project has integrated: 18px is the smallest width the horn/cabinet silhouette survives at; 14px blurred into an unrecognizable blob.

The reference sheet's own "Playing" state shows the identical gramophone body with a small badge overlay (a green music note) rather than a distinct spinning-record illustration. The original plan, before implementation, was to animate a full-body rotation for the playing state — this was caught and corrected during implementation, not before: the sprite is one flat crop with the horn, cabinet, and record disc all baked into a single image, so rotating the whole object would visibly spin the horn and wooden base along with the disc, which misrepresents the object rather than just being a style choice. Replaced with a small vertical bounce, which the brief's own "small rotation OR bounce" phrasing explicitly permits as an alternative — this wasn't a downgrade to work around a limitation, it's the option that's actually correct for a single-sprite object.

### A duplicate-ID accessibility bug, found during an unrelated review

While reviewing `LayerPanel.tsx` for popup-consistency polish, found that its heading `id` was a hardcoded string (`"layer-panel-heading"`), shared identically across all four simultaneously-mounted panel instances — invalid HTML, and `aria-labelledby` on three of the four panels pointed at whichever `<h2>` the browser resolved first, not necessarily its own. This had been present since the panel's original implementation and had never been caught, because every prior functional test (focus-into-heading, Escape-to-close) still worked correctly even with the duplicate id — the bug was invisible to behavioral testing, only visible on direct DOM/markup inspection. Fixed with `useId()`, which produces a genuinely unique id per component instance. Verified: 4 distinct heading ids present simultaneously in the DOM after the fix, confirmed via direct query.

### A scroll-isolation defect on the longest panel

The entire panel (title, Close button, and content) was previously one `overflow-y-auto` region, so scrolling the Leadership panel's four expandable capabilities scrolled its own title and Close control out of view too. Restructured to a three-region flex column — `shrink-0` header, `flex-1 overflow-y-auto` middle, `shrink-0` footer — so only the content scrolls. Verified live: scrolling the middle region 500px left the header's and footer's `getBoundingClientRect().top` completely unchanged, and the page itself never scrolled (`window.scrollY` stayed `0` throughout).

### A recurring bug pattern, caught immediately this time because it was already known

The new `ESC` keycap `<Image>` shipped without `priority` on first implementation and silently failed to load (`naturalWidth: 0`) — the third occurrence of this exact failure mode in this project (the walnut bookshelf/paper stack in the Phase 1 reuse pass, and now this). Caught within one verification cycle this time, specifically because it was a known pattern being checked for, not rediscovered from scratch — fixed by adding `priority`, re-verified 24/24 images loading on a rebuilt production server. Worth stating as a standing project rule rather than a one-off: **every new `<Image>` in this codebase needs `priority`, because every layer that renders one sits inside a `translateX`-based transform at some point in its lifecycle** (the camera-panned room layer, or an initially-off-screen panel), and Next's default lazy-loading intersection observer doesn't reliably fire for elements in that state.

### A real touch-target defect, found via measurement at the narrowest required width, not assumed

Six interactive elements (panel Close, panel Done, the gramophone toggle, Contact, Resume, and — only visible once testing reached the narrowest of the 10 required breakpoints, 360px — all four content hotspots) measured below the ~44px touch-target floor at one or more widths. Fixed with an additive `min-width`/`min-height: 44px` floor on each (via Tailwind's `min-h-11` for content/padding-sized buttons, via inline style for the percentage-sized room sprites) — additive, not a replacement for the existing percentage/content sizing, so nothing changed visually above 540px. Re-verified: 0 elements below 44px across all 10 required breakpoints on a rebuilt production server. Explicitly recorded as a methodology lesson: the four main hotspots passed cleanly at 540px and were only found failing at 360px — testing only the larger mobile breakpoints would have missed a real defect at the smallest required width.

### Verification

`lint`, `tsc --noEmit`, `next build` clean (multiple times — each fix triggered a rebuild; two builds hit transient Turbopack/Windows worker crashes unrelated to any code change, both resolved on retry with no code difference between the failing and succeeding attempt, logged here so a future session recognizes the pattern rather than debugging phantom code issues). Fresh production servers across this pass, verified via direct DOM queries and live interaction (not assumption): all 24 images load at every one of the 10 required breakpoints; zero elements below the 44px touch-target floor after the fix, at every breakpoint; camera reset confirmed byte-identical across repeated open/close cycles on different hotspots; Browser Back/Forward confirmed correctly opening/closing panels; zero console warnings/errors/hydration mismatches at any point in this pass's testing.

## Phase B — UX Refinement, Visual Polish & Production Readiness

Full deliverables: `VISUAL_REDESIGN.md`, `CAMERA_AUDIT.md`, `UI_THEME.md`, `RESPONSIVE_VERIFICATION.md`, `AUDIO_INTEGRATION.md`, `FINAL_PHASE_B_REPORT.md`. This entry records the engineering decisions, not the full reports.

### Camera/panel desync — an architecture gap, not a regression

The camera used to move exclusively inside each hotspot's `onClick` handler (`cameraFocus` bundled with `layersOpen`) and inside `closeLayer` (`cameraReset` bundled with `layersClose`). That worked for clicks, but nothing tied the camera to `layers.activeLayer` — the single source of truth `LayerPanel`'s own `isOpen` prop already used. Reproduced live: opening Leadership via its hotspot correctly zoomed the camera; pressing browser Back then correctly closed the panel (URL reverted) but left the camera at the Leadership zoom, since Back never runs `closeLayer`. Fixed by deriving the camera target from `layers.activeLayer` via a `useEffect` in `Workspace.tsx` — the one place the camera moves now, reacting uniformly to hotspot clicks, Back/Forward, and deep links alike. `openDesk`/`openKnowledge`/`openResearch`/`openLeadership`/`closeLayer` now only touch the URL. See `CAMERA_AUDIT.md`.

### The "ghost Leadership popup" — a genuinely clipped, disconnected badge, not a phantom component

Root-caused against the user's own screenshot, not guessed at: the Phase A gramophone's muted-badge sprite (14×17px, positioned beside the gramophone with a visible gap) measured with its right edge at 96.9% of the canvas — past `ROOM_CONTENT_BOUNDS`'s own 95.49% right edge, genuinely clipped off the drawn room, not just poorly composed. A small dark badge with a bold X, floating with a gap next to (not touching) the object it belongs to, reads exactly like stray floating UI chrome. There was no second component, no orphan portal, no duplicate render path — confirmed by search (`grep -rn "Leadership"` against every component file) before concluding the fix was purely visual. Fixed in two measured iterations, each re-verified via a PIL composite render rather than assumed sufficient: first a shrink to 10px touching the gramophone's edge (still read as a separate object), then a further shrink to 8px repositioned to substantially overlap the gramophone's own horn (offset `+1.7,-4.5` from the gramophone's center) — the same visual language as a notification dot stamped on an app icon. Confirmed within `ROOM_CONTENT_BOUNDS` at the final position.

### Room background: a warm walnut radial vignette, not a flat color swap

`dark:bg-zinc-950` (a cool, near-black gray) was replaced with `dark:bg-[radial-gradient(ellipse_at_center,_#3b2c1f_0%,_#241a12_65%,_#1a120c_100%)]` — a warm brown radial gradient, darkest at the edges, brightest (relatively) at the center where the room sits. A vignette rather than a flat color both answers the brief's own "subtle vignette if appropriate" suggestion and keeps the room the visually dominant element, since the page's own edges recede rather than compete for attention. Light mode (`bg-zinc-100`) was left unchanged — the reported complaint ("pure black... too harsh") specifically described dark mode, and light mode's pale neutral gray was never named as a problem.

### The "paper and wood" panel theme — CSS approximation, not a fabricated frame sprite

Both Phase B reference boards show the *look* of a cream, wood-bordered panel, but neither contains a croppable 9-slice panel-frame image with clean edges and real alpha — direct inspection of every supplied sheet confirmed this. Per Asset Truthfulness, the look was built with real CSS (`globals.css`'s `.panel-paper`/`.panel-divider`/`.panel-button`, a stepped double border plus layered inset shadow) rather than inventing a sprite that wasn't actually supplied. Sharp corners throughout (`border-radius: 0`), deliberately — rounded corners read as a generic app modal; flat pixel-bordered rectangles read as part of the room's own pixel-art vocabulary. Both light and dark tokens defined as CSS custom properties (`--panel-paper`, `--panel-wood`, etc.) so the theme has one definition site, not one per component.

### One `LayerPanel`, two positions — desktop side panel, mobile bottom sheet

Rather than forking into two components, the existing single `LayerPanel` gained responsive position classes: base (mobile) is `inset-x-0 bottom-0` with `translate-y`, `sm:` and up returns to the original `inset-y-0 right-0` with `translate-x`. Tailwind's translate utilities compose through shared `--tw-translate-x`/`--tw-translate-y` custom properties, so the base and `sm:` classes each contribute one axis without overriding each other — confirmed against the actual computed `transform`/position values at both a desktop (1280px, side panel: `right:0, width:384px, maxHeight:none`) and a mobile (390px, bottom sheet: `left:0, right:0, top:auto, bottom:0, width:100%, maxHeight:717.4px` — exactly 85% of the 844px test viewport) width, not assumed from the class names alone. The `left: auto` fix from the Version 1 Launch Readiness pass (needed to avoid an over-constrained-position bug inside the room's `justify-center` flex ancestor) is preserved as `sm:left-auto`, scoped to the side-panel breakpoint only.

### A subtle backdrop blur, added alongside the existing dim

The outside-click backdrop already dimmed the room on panel open; Part 7 asked for the room to also blur slightly rather than just darken. Added `backdrop-filter: blur(3px)` (and the `-webkit-` prefix, since Safari still requires it), transitioning on the same clock as the opacity dim, and reduced the dim's color from a neutral black to a warm-tinted `rgba(26, 18, 12, 0.35)` to match the new background palette rather than fighting it. 3px, not a heavier glass-morphism blur — the room stays legible behind the panel, per the brief's own "avoid excessive blur."

### Persistent visited-state — a new `localStorage` key, the same hydration-safe pattern as ambient audio

No prior mechanism tracked "has this hotspot ever been opened." Added `useVisitedHotspots` (`src/hooks/useVisitedHotspots.ts`), storing a JSON array of visited hotspot ids under one `localStorage` key (`lib/visited.ts`), following `useAmbientAudio`'s already-established hydration-safe shape exactly: state initializes to "nothing visited" on every render (server and client alike) so the first client render can't disagree with the server-rendered HTML, then a post-mount effect re-syncs from `localStorage`. Marked visited inside the same `Workspace.tsx` effect pattern as the camera-sync fix — reacting to `layers.activeLayer` changes generically, so a deep link or Back/Forward navigation marks a hotspot visited exactly the same as a real click, not just the click path. Visual cue: once visited, a hotspot's idle-discovery pulse (`.idle-pulse`) is dropped in favor of a persistent low-opacity amber outline plus a small static corner checkmark badge — a deliberate three-state read (unvisited pulses to invite a first click; visited settles down and confirms it; the active/open state is already communicated by the panel itself) rather than layering a fourth animation on top of what's already there.

### Animation timing — named bands replacing one overloaded "standard" duration

`DURATION.standard` (500ms) was reused for both camera pans and panel opens despite the brief's own spec giving those two different target bands (300-400ms vs. 220-260ms) — the kind of drift that happens when one generic name covers unrelated interactions. Replaced with named bands matching the spec directly (`DURATION.hover` 150ms, `DURATION.panelOpen` 240ms, `DURATION.panelClose` 200ms, `DURATION.camera` 350ms), each call site updated to the band it actually belongs to. The gramophone's playing-state glow keyframe (3.5s) was the one other value found outside its target band (2-3s for idle loops) and tightened to 3s. Hover-driven transitions (button color/border, the gramophone's brightness filter) were already using Tailwind's default 150ms `transition-colors`/an explicit `duration-150` — already inside the 120-180ms band, no change needed there.

### A same-session Browser-pane limitation, now also affecting click dispatch

This project's `ASSUMPTIONS.md` and prior Engineering Decisions entries already document this Browser-pane tab persistently reporting `document.hidden: true`/`document.visibilityState: "hidden"`, which has previously suppressed `requestAnimationFrame`, delayed `router.push` timing, and blocked real `focus`/`hover` DOM event dispatch. This pass found the same root cause now also suppressing `.click()` and dispatched `MouseEvent('click')` calls on plain `useState`-backed handlers (confirmed with the gramophone's own mute toggle: `aria-pressed` unchanged after a dispatched click) — a broader instance of the same limitation, not a new one. `read_page` and `computer`'s screenshot action also failed/timed out for the duration of this verification pass. Panel open/close was therefore verified structurally instead (computed CSS position/transform values at the DOM level, which don't require a working click), and the interaction itself (four close methods, camera sync, focus management) relies on the identical, already-proven-correct `isOpen`/`activeLayer` wiring from Phase A and this pass's own camera-desync fix — not re-asserted as freshly click-tested this session. Recorded honestly rather than silently assumed working.

### Verification

`lint`, `tsc --noEmit`, `next build` all clean after every batch of changes in this pass. Responsive re-audit at all 10 required breakpoints (1920/1600/1440/1280/1024/768/540/430/390/360) on a fresh dev server: zero horizontal overflow, zero interactive elements below the 44px touch-target floor (excluding the dev-only `CameraTestHarness`, which never ships to production) at any width. Panel responsive positioning confirmed via direct computed-style reads at both a desktop and a mobile width, not assumed from the class names. Dark/light panel-theme contrast checked by hand against the actual defined token colors (ink-on-paper): ~11:1 in light mode, ~10.6:1 in dark mode, both far above WCAG AA's 4.5:1. See the "Browser-pane limitation" entry above for what this pass could and couldn't verify live via click interaction.

## Phase C — Living Workspace, Visual Polish & Deployment Readiness

Full deliverables: `PHASE_C_REPORT.md`, `AUDIO_DESIGN.md`, `LIGHTING_REVIEW.md`, `MICROINTERACTIONS.md` (Phase C section, appended), `PANEL_REDESIGN.md`, `PERFORMANCE_REVIEW.md`, `ACCESSIBILITY_REVIEW.md`, `FINAL_VISUAL_AUDIT.md`. This entry records the engineering decisions, not the full reports.

### Ambient audio: an ambience catalog, and resuming playback without breaking "never autoplay"

`lib/audio.ts` restructured from one flat `AMBIENT_TRACK_SRC` constant to `AMBIENCE_TRACKS`, a six-entry catalog (Study/Coffee Shop/Rain/Fireplace/Night/Forest), with `ACTIVE_TRACK` as the one value the rest of the codebase reads — adding a seventh ambience later, or switching which one plays, no longer touches `useAmbientAudio.ts` or `Gramophone.tsx` at all. No real file was supplied for any of the six, including Study Ambience specifically — flagged in `AUDIO_DESIGN.md`, not filled with a fabricated clip.

Separately, "audio resumes after refresh if enabled" and "never autoplay" are in real tension — Phase A's original design only ever resolved this halfway (the toggle's *visual* state restored on reload, actual playback never resumed, which meant a returning visitor who'd left it "on" would see it as on but hear nothing, and clicking the gramophone to fix that would actually turn it *off*, since the state already read "playing"). Fixed with a one-time, page-wide `pointerdown`/`keydown` listener, armed only when the restored preference says "was playing" and the audio element hasn't started yet — the first real gesture anywhere on the page resumes it, never autoplaying by construction since nothing fires without a trusted gesture already in the call stack.

### Lighting: a room-layer gradient, not a page-level effect

Added as a new sibling inside `CameraContainer` (the same container every sprite lives in), not as an overlay on the page's outer wrapper — this was a deliberate choice so the lighting pans/scales with the room as one rigid unit, the way a real lamp doesn't follow your gaze around a room, rather than staying fixed to the viewport while the camera zooms into a hotspot. Two independent radial gradients (a warm highlight centered on the Desk, a vignette centered on the room's true geometric corners), no blur/bloom/blend-mode — flat color layers only, so every sprite's pixel edges stay exactly as crisp underneath.

### Microinteractions: one shared hook, not five local implementations

`useHoverState` (`src/hooks/useHoverState.ts`) centralizes the hover/press tracking that `Gramophone.tsx` had built locally in Phase B — once a second, third, fourth, and fifth consumer needed the identical `isHovered`/`isPressed` state and event handlers (the four hotspots), duplicating that logic five times stopped being the right call. Each hotspot's furniture sprite is wrapped in its own `.sprite-breathe` div (idle-breathing animation) with the *hover/press* transform applied to the `<Image>` inside it, not the wrapper — deliberately two different elements, because a CSS `@keyframes` animation and an inline `style.transform` targeting the *same* element's `transform` property don't compose (the animation's cascade origin outranks the inline style while it's running), which would have silently defeated the hover-lift effect had both lived on one node.

### Motion: five canonical bands, replacing four bespoke ones

Phase C's own brief specified explicit Instant/Fast/Standard/Slow/Idle ranges, different from Phase B's `hover`/`panelOpen`/`panelClose`/`camera` scheme. Rather than layer a second naming convention on top of the first, `src/lib/motion.ts` was rebuilt around the new canonical bands (`MOTION.instant/fast/standard/slow/idleSeconds`), with the existing semantic names (`DURATION.hover`, `.panelOpen`, `.panelClose`, `.camera`) now defined *as* references into that scale rather than as independent numbers — `panelClose` in particular moved from 200ms (which fit neither the old nor the new "quick" band cleanly) to 150ms, squarely inside Fast. The dev-only `CameraTestHarness`'s one 700ms special case was retired outright rather than kept as a sanctioned exception — it had no real UX reason to be slower than any other camera pan, so removing it left one fewer unjustified number instead of carving a new exception into the five-band rule on day one. Two real exceptions were kept and explicitly justified in code: the note-particle animation cycle (5.2s, needs to read as "occasional" rather than "ambient," which the Idle band's own 2-4s ambient-breathing purpose doesn't fit) — everything else in the codebase now maps cleanly onto one of the five bands, confirmed by an audit of every `transitionDuration`/`animation-duration` declaration in the codebase.

### Storytelling: a tested-and-rejected repositioning, kept honest

The brief invited repositioning the desk's existing items and suggested four additional ones (calculator, USB, SSD, plant). None of the four exist as verified assets in any pack or the previously-generated desk sheet — checked directly, not assumed, and flagged in `MISSING_ASSETS.md` rather than fabricated. A repositioning attempt (nudging the mouse/notebook/blueprint to reduce bottom-right crowding, motivated by a fresh PIL composite render that showed those three items reading as a busy cluster) was actually implemented in a test script and re-rendered — and made things worse: the notebook now overlapped the lamp, and the blueprint appeared to hang off the desk's front edge. Reverted; the original, already-tuned arrangement was kept. Recorded as a real attempt with a real negative result, not silently discarded — "existing objects may be repositioned" was read as permission to try, not a mandate to ship a change regardless of whether it measured better.

### A stale console-error artifact, investigated to a confident conclusion

Partway through this pass's verification, `read_console_messages` began reporting a module-resolution error (`AMBIENT_TRACK_SRC doesn't exist`) referencing an export name this pass had already renamed to `ACTIVE_TRACK`. The error persisted across a full dev-server restart and a `.next` cache wipe, which ruled out ordinary HMR staleness as the explanation. Rather than either trust the tool (and report a false blocker) or dismiss it without checking, it was investigated to a decisive conclusion: `grep` on the actual source file showed no such import; `tsc --noEmit` and two separate `next build` runs both completed with zero errors; and — the conclusive check — direct DOM inspection showed the `Gramophone` component (which imports the supposedly-broken `useAmbientAudio` hook) rendering correctly, with the exact right tooltip text. A genuine module-resolution failure is a hard compile-time error that would have prevented that subtree from rendering at all; it didn't. Concluded this is a stuck artifact in this Browser-pane tool's own console-message buffer, not a real condition of the running app — the fourth type of unreliability logged against this specific tool in this project's history (after `document.hidden`-driven `requestAnimationFrame` suppression, stale `getBoundingClientRect()` readings, and now-confirmed click-dispatch suppression), each independently isolated with its own evidence rather than lumped into one vague "the tool is flaky" excuse.

### Verification

`lint`, `tsc --noEmit`, `next build` all clean after every batch of changes in this pass (one transient Windows/Turbopack worker crash during a build, resolved on retry — see the Version 1 Launch Readiness entry above for the same pattern's first occurrence). Responsive sweep at all 11 required breakpoints (1920/1600/1440/1280/1024/768/540/430/390/375/360): zero horizontal overflow, zero elements below the 44px touch-target floor at any width. Live DOM/attribute checks confirmed the gramophone's tooltip, `aria-pressed`, both `localStorage` keys, the lighting layer's computed gradient, and the tab-reachable element count (11, matching the pre-Phase-C baseline) all correct on a fresh load. Live click/keyboard/touch interaction testing was constrained by this session's Browser-pane limitation (see above) — structural and code-level verification substituted, and labeled as such throughout the companion documents rather than presented as equivalent to a live walkthrough.

## Phase D — Completing the Narrative Layer

Full deliverables: `PHASE_D_REPORT.md`, `TIMELINE_CONTENT.md`, `ABOUT_ME_CONTENT.md`, `FUTURE_VISION.md`, `INTERVIEW_NOTES.md`, `NARRATIVE_DESIGN.md`. This entry records the engineering decisions; the content itself and how it was gathered are covered in those documents, not repeated here.

### Content came from a genuine interview, not from this session's own judgment

The brief's own "Most Important Requirement" was explicit and sequential: interview first, one question at a time, follow up on interesting answers, synthesize only after the interview, show drafts, wait for approval, only then wire into code. That sequence was followed exactly — no Timeline/About Me/Future content was written, and no asset/panel engineering work began, until the interview was complete and the drafts were shown and approved. `INTERVIEW_NOTES.md` is the raw evidence trail this project's own "Evidence Before Summary" principle requires; every sentence in the three content files traces back to an actual recorded answer, not an inference. Two answers came back compressed rather than as a specific anecdote (why AI became the throughline; a single defining leadership moment) — both stayed at that same level of specificity in the draft rather than being dramatized into a scene that wasn't actually described.

### A real revision, not silently absorbed

After the first draft was shown, the user asked for two specific changes: a more employer-friendly tone on the Future section, and em dashes removed throughout. Both were applied as literal edits (the Future section's emphasis was rebalanced toward the "impactful life" close rather than dwelling on the legacy disclaimer; every em dash across all three files was rewritten into a period, comma, colon, or parenthetical rather than mechanically substituted) — no new facts were introduced in either pass, consistent with the interview being the only source of content this phase.

### Asset cropping needed two different background-removal techniques, not one

The new sheet (`ChatGPT Image Jul 15, 2026, 10_20_11 PM.png`) has each of its three cards on a different background color. A single global color-distance threshold worked for the Clock (its green background was far enough in color from the clock's own wood/cream tones) but destroyed the Coffee Corner crop — the mug's own cream color overlapped the tan wall-background's color range closely enough that the threshold ate holes straight through the mug's body. Root-caused by inspecting the result rather than assuming the same technique would generalize, and fixed with a flood-fill instead: seeded from confirmed background corner points, it only clears pixels *contiguous* with that seed, so an enclosed shape like a mug survives regardless of how close its color is to the background, as long as it isn't touching it. The Window crop needed neither — its own wood frame fills almost the entire card, so only the four corner slivers of the outer picture-frame chrome needed a direct clear.

### The floor line had no room left — Clock and Coffee Corner moved to the wall

The original plan was to reuse `CameraTestHarness`'s old "clock"/"coffee"/"window" test coordinates directly, the same Design-For-Deletion pattern already used for `DESK_HOTSPOT` and `LEADERSHIP_HOTSPOT`. Checked against the room's actual current footprints before committing to it, not assumed safe from the old coordinates alone: the floor-level band (y≈44-70%) is packed edge to edge from Leadership's left edge (8.5%) to Gramophone's right edge (94.5%), with the largest remaining gap only ~2.4 points wide — nowhere near enough for two more compound objects at their old floor-level y. Window's own old coordinate (y=15, already wall-height) was untouched and needed no change. Clock and Coffee Corner were moved to a fresh y on the wall instead (22 and 28 respectively), reading as shelf objects above the desk/bookshelf line — the same placement logic already established for the Leadership frames, which sit above `LEADERSHIP_HOTSPOT`'s own floor-level y rather than on the floor themselves.

### `CameraTestHarness` deleted outright, not just gated further

Its three remaining targets (clock, coffee, window) are exactly the three this phase gave real hotspots to — once that happened, the harness had nothing left to test that a real hotspot didn't already cover, so it was deleted as a file rather than kept dev-only-gated with an empty purpose. Design For Deletion in practice, the same principle its own header comment already described for the targets removed in Milestones 5/7/8, carried through to its own final removal.

### Pendulum and cloud motion, flagged not faked — same reasoning applied twice more

The brief's own explicit fallback for both ("otherwise keep static") made this an easy, correct call rather than a compromise: `clock.png` and `window.png` are each one flattened crop with no separable pendulum or cloud layer, and animating the whole sprite would move the case or frame along with it — mechanically wrong, the same category of mistake already ruled out for the Gramophone's horn in Phase A. Both stay static; a follow-up pendulum-only/cloud-only asset request is logged in `MISSING_ASSETS.md` rather than the motion being faked some other way. The Coffee Corner's steam did get real motion, because the brief gave no equivalent fallback for it and the source crop's own baked-in steam didn't survive background-keying intact — three small CSS-animated wisps substitute for it, the same "styled element, not a fabricated sprite" approach already established for the Gramophone's note particles.

### A recurring stale-console-artifact, recognized immediately this time

The same `AMBIENT_TRACK_SRC doesn't exist` console error already investigated and ruled out during Phase C's verification pass (a stuck artifact in this Browser-pane tool's own console-message buffer, not a real condition — see that entry above) recurred during this phase's verification. Recognized as the same known artifact rather than re-investigated from scratch, and re-confirmed harmless the fast way: direct DOM inspection showing all seven hotspots, ten breathing elements, and both `localStorage` keys present and correct on a fresh load — behavior a genuine module-resolution failure could not produce.

### Verification

`lint`, `tsc --noEmit`, `next build` all clean (one clean build after a full `.next` cache wipe, to rule out any stale-artifact concern at the build level too). Responsive sweep at all 11 required breakpoints (1920/1600/1440/1280/1024/768/540/430/390/375/360): zero horizontal overflow, zero elements below the 44px touch-target floor. Live DOM checks confirmed all seven hotspots present with correct `aria-label`s, zero leftover debug buttons (confirming no duplicated controls after `CameraTestHarness`'s removal), ten `.sprite-breathe` elements (matching the expected count across all seven hotspots plus the Gramophone), and all three new panels rendering their correct, distinguishing content. Live click/keyboard/touch interaction testing remained constrained by the same Browser-pane limitation documented in Phase C's entry — structural and DOM-level verification substituted throughout, labeled as such rather than presented as a live walkthrough.

## Phase F.1 — Final UI Audio Integration & Interaction Polish

### The audio catalog was deleted, not deprecated

Phase C built a six-track, plug-and-play ambience catalog (`AMBIENCE_TRACKS`) specifically so a future real audio file could be dropped in without touching the gating logic. Phase F.1's brief made that catalog's entire premise obsolete: "the supplied 55-second piano loop is now the only ambient soundtrack... remove the idea of multiple ambience selections." Rather than leave the catalog in place with one entry populated (which would have kept a whole unused selection mechanism as dead-but-reachable code), it was removed outright — `AmbienceId`, `AMBIENCE_TRACKS`, `ACTIVE_AMBIENCE`, `ACTIVE_TRACK` are all gone from `src/lib/audio.ts`. This is the same Design For Deletion principle applied to a data structure instead of a component file: a piece of infrastructure that no longer has a reason to exist is deleted, not kept "just in case," consistent with `CoffeeHotspot.tsx`'s and `PersistentActions.tsx`'s removal this same phase.

### `usePopupAudio` watches `activeLayer`, not each panel's own `isOpen`

This was the one genuinely non-obvious architectural decision this phase. The brief's Part 3 ("if one popup is already closing and another opens immediately: stop previous close sound; play open sound only once") is trivially satisfiable in the common case by any implementation, but the direct-switch case (clicking a second hotspot while a panel is already open) is where a per-panel implementation breaks: two `isOpen` booleans change in the same render (one `true→false`, one `false→true`), and if each panel's own effect independently reacts to its own boolean, both a close and an open sound fire together. Centralizing the hook at `Workspace.tsx`'s root and watching the single `activeLayer: string | null` value directly collapses that into one observable transition: non-null after the change is always an open, full stop, regardless of what it was before. This is a case where the "obvious" per-component implementation would have shipped a real, hard-to-notice bug (it would pass every test that doesn't specifically open panel B while panel A is still open) — the centralized version is not just cleaner, it is the only one of the two that is actually correct against the brief's own stated requirement.

### Phase D's asset-loss bug, rediscovered and refixed this phase

Before starting this phase's own asset work, `public/assets/narrative/` was checked and found empty — Phase D's `clock.png`, `coffee-corner.png`, and `window.png` had never actually persisted to disk, despite that phase's own build succeeding and DOM checks passing. Root cause: this session's Bash tool has repeatedly, silently reset its working directory throughout the entire multi-phase project, and Next.js's build process never validates that a `public/`-referenced path actually resolves to a real file — a build can succeed and a component can render an `<img src>` attribute correctly while the file behind it 404s. The three files were recovered from intermediate crops still present in the session's own scratchpad directory and re-saved with an explicit absolute path. **New discipline, applied for the rest of this phase without exception:** a Python (or any) script's own printed "saved successfully" message is not evidence a file exists — every save this phase was followed immediately by `ls -la` and, before considering the asset done, a live browser `naturalWidth` check. This phase's own six new assets (Corkboard, Portfolio, Rolodex, 12 icons) were all confirmed present on disk with real byte sizes and zero broken `<img>` loads before being treated as complete.

### Flood-fill needed a fixed reference color, not a per-neighbor one

The Corkboard crop's wood-frame border has smooth internal shading — a gradient from lighter to darker wood tones across the frame's own surface. The flood-fill technique already proven safe on the Coffee Corner mug in Phase D compared each candidate pixel to its immediately-preceding neighbor's (already-decided) color, which let the fill "walk" through the frame's gradient one small step at a time, even though the frame's two end colors were very different from each other — it ate the entire wood frame, leaving only the pinned photos and notes floating with no board behind them. Root-caused by inspecting the destroyed result rather than assuming the Phase D technique would generalize, and fixed by comparing every candidate pixel to one fixed reference RGB value (the actual background color) instead of a neighbor's value — this correctly stopped at the frame's real edge regardless of the gradient inside it. A secondary de-fringe pass (clearing near-white, low-saturation pixels adjacent to transparency) cleaned up residual anti-aliasing halos on the Portfolio and Rolodex crops that the fixed-reference fill alone didn't fully resolve.

### `CoffeeHotspot.tsx` → `CorkboardHotspot.tsx`, `PersistentActions.tsx` deleted

Two more applications of this project's standing Design For Deletion precedent (`CameraTestHarness.tsx`, Phase D). The Corkboard visually and functionally replaces the old Coffee Corner as the About Me hotspot — rather than rename or repurpose the old file in place, a new `CorkboardHotspot.tsx` was written and `CoffeeHotspot.tsx` deleted outright, since keeping the old file unimported would be dead code with no future use. `PersistentActions.tsx` — the screen-fixed Contact/Resume corner links — is fully superseded by the new Rolodex and Portfolio room hotspots per the brief's own Part 6/7 instruction ("now replaces every remaining floating Contact/Resume affordance"); deleted rather than left unimported for the same reason. Distinguished explicitly from the Asset Registry's own, different "corrected, not erased" convention: `assets.ts`'s old `coffeeCorner` entry is still present in the registry (data-level history is kept), while the component file that rendered it is gone (dead code is not kept).

### A real touch-target regression, caught by the project's own re-audit discipline

The new `ContactRow.tsx` and `ResumePanel.tsx` action buttons shipped with Tailwind's `min-h-9 min-w-9` (36px) instead of this project's established `min-h-11 min-w-11` (44px) floor — a real accessibility regression in brand-new code, not a change to already-verified code. Found by the standing practice (re-established every phase since Phase A) of re-sweeping all required breakpoints after any UI change rather than assuming new components correctly inherited an old, already-verified convention. Fixed and re-verified clean at all 11 breakpoints.

### The Contact panel ships three rows, not five — a content-truthfulness call, not a scope cut

The brief's Part 6 lists five Contact rows: Personal Email, Work Email, LinkedIn, GitHub, Resume shortcut. Neither a work email nor a LinkedIn URL exists anywhere in this repository's real content — `src/content/contact.ts` only defines what's real (`personalEmail`, `githubUrl`). Per the Asset Truthfulness Protocol's content extension (established explicitly in Phase D for the Timeline/About Me/Future interview content, applied here to a different kind of fact), neither was invented to fill out the row count. The gap is logged in `MISSING_CONTENT.md` with what's needed to close it, and the panel ships with three real rows rather than five rows two of which would be fabricated.

### The Browser-pane click-dispatch limitation, reconfirmed one more time

Extensively documented in Phase C and Phase D: this session's Browser-pane tab reports `document.hidden: true` regardless of actual fronting state, which suppresses synthetic `.click()` dispatch. Re-tested directly this phase via a before/after `aria-pressed` check on the Gramophone toggle button (`{"before":"false","after":"false","documentHidden":true}`), and again indirectly when the `computer` screenshot tool itself timed out twice during this phase's final verification pass — consistent with Phase C's own precedent ("the screenshot tool was unavailable for the same duration"). Not a new bug, not investigated further this phase since the root cause and its scope are already on record — documented honestly in `PHASE_F1_REPORT.md`'s verification table rather than worked around or silently omitted.

## Phase F.2 — Replace Disproportionate Assets with Original Asset Pack {#phase-f2-asset-replacement}

### Locating the right sprites required pixel-level grid scanning, not eyeballing coordinates

Both source sheets (`TopDownHouse_DoorsAndWindows.png`, 288×160px; `TopDownHouse_SmallItems.png`, 128×128px) pack many small sprites into a dense, unlabeled grid with no visible ruling. Rather than guess crop coordinates from the thumbnail, each sheet's alpha channel was scanned column-by-column and row-by-row (`col_has_content`/`row_has_content` helpers, looking for any pixel with `alpha > 0`) to find the real tile boundaries as contiguous runs, then each candidate cell was tight-cropped with `Image.getbbox()` to trim to its actual content — not the cell's full bounding box, which would have kept stray transparent padding. This is the same rigor already established for the icon-tile-boundary bug in Phase F.1 (imprecise coordinate guesses clipped several icon tiles there) — applied here from the start rather than discovered as a fix.

### The room shell and these two sheets share one native coordinate space — no scale conversion needed

`ROOM_CANVAS` (`roomGeometry.ts`) is `{ width: 288, height: 144 }` — the same 288px width as `TopDownHouse_DoorsAndWindows.png`, confirming the room shell itself was built from this same "Top-Down Retro Interior" pack at 1:1 native scale, with no upscaling anywhere in the pipeline. `getSpritePlacement` converts a sprite's raw pixel `width`/`height` into a percentage of `ROOM_CANVAS` directly — so cropping these two sheets and registering their literal native pixel dimensions (25×28 window, 15×15 clock, 7×8 book) is not an approximation of "native scale," it *is* native scale, by construction. This is what made the Phase D/F.1 generated assets (32×43 clock, 40×41 window, 30×26 rolodex — all from separate AI-generated sheets with no inherent relationship to `ROOM_CANVAS`'s own coordinate space) read as oversized: they were sized by eye against a legibility test, not derived from the same pixel grid the room itself uses.

### Window: chosen for being square, not for being smallest

The DoorsAndWindows sheet's grid has three distinct window shapes, each repeated in two wood-tone color groups: a 4-pane window (25×28, literally square), a wide 2-pane picture window (26×29), and a small wide arched transom window (26×16 — the smallest by pixel area, but a short wide rectangle, not square). The brief asked for "the small square window sprite," which reads as two joint criteria, not "smallest available." The transom is smaller but isn't square-shaped; the 4-pane window is the one that's actually square, and its plain cross-mullion design is also the most visually ordinary of the three — consistent with the brief's own stated goal ("feel like part of the architecture rather than a hero object"). Chosen on that basis, not on raw pixel count.

### Clock and Ledger were both already flagged, unused, in `ASSET_REGISTRY.md`

Before cropping anything from `TopDownHouse_SmallItems.png`, the existing registry was checked for prior art rather than re-scanning blind. Its `TopDownHouse_SmallItems.png` table already had a row reading "Small round wall clock | Not currently assigned (grandfather clock used instead) | VERIFIED, unused alternative to the primary Clock asset" — logged during an earlier pass, before the Phase D generated clock existed, and never revisited once that generated asset shipped. This phase's crop is the exact sprite that row already pointed at. No equivalent pre-existing row existed for a book-as-Ledger use, since Contact didn't exist as a hotspot until Phase F.1.

### Ledger: the brief's stated preference order, checked against what the sheet actually contains

The brief ranked Contact-object candidates Address Book > Ledger > Clipboard > Memo Board, with an explicit instruction: "if no suitable object exists... tell me explicitly rather than inventing or generating a replacement." A full inspection of `TopDownHouse_SmallItems.png` (all 8 visual rows, each column-scanned) found exactly two book sprites — an open book and a closed book — and no address book, clipboard, or memo/cork board of any kind anywhere on the sheet. The closed book was used as the Ledger (the brief's second-ranked, not first-ranked, option) rather than silently presented as an Address Book it isn't, or invented from nothing. This is disclosed here and in `ASSETS.ledger`'s own code comment (`assets.ts`) rather than only in this document, so a reader encountering the code first still gets the same honest account.

### A real conflict in the brief, surfaced rather than silently resolved

The brief's "Replace Contact" section asks for the new object to be "mounted naturally near the gramophone rather than floating," but its own "Camera & Layout" section says "Do not alter... room geometry... hotspot order" — and `ROLODEX_HOTSPOT` (x=16.5%, y=18%, upper-left wall) is nowhere near `GRAMOPHONE_PLACEMENT` (x=90%, y=62%, lower-right floor). Moving the hotspot to satisfy the placement request would violate the explicit "don't alter room geometry" constraint the same document states; leaving it in place satisfies every other instruction in the brief but not that one phrase literally. Rather than pick silently, this was surfaced to the user directly — the answer was to leave `ROLODEX_HOTSPOT`'s coordinates untouched, consistent with the brief's own dominant framing ("This phase is strictly an asset replacement pass").

### `aria-label` text updated for the Ledger, component filename left unchanged

`RolodexHotspot.tsx` kept its filename — renaming a component file is a code-organization change, not a sprite replacement, and the brief scopes this phase to sprite references only. Its `aria-label`, however, changed from "Open the Rolodex — contact" to "Open the Ledger — contact." This one exception was judged in-scope: the brief's own accessibility-adjacent framing throughout this project holds that assistive-tech users should perceive the same object sighted users do, and leaving the label saying "Rolodex" over a sprite that visibly renders a book would create exactly the kind of sighted/non-sighted content mismatch this project's `ACCESSIBILITY_CHECKLIST.md` has flagged as a real defect before (see the Milestone 7 `aria-labelledby` duplicate-id fix). The `HotspotLabel` component's own visible text ("Contact") was correctly already object-agnostic — it names the *function*, not the object — so it needed no change.

### Click-target sizing shrunk proportionally to each new sprite, floor unchanged

Each hotspot's invisible `<button>` click zone was sized (in Phase D/F.1) to comfortably frame its old, larger sprite. Left at those old percentages, the new sprites would sit inside a click zone visibly oversized relative to what's actually drawn. Each was shrunk by roughly the same ratio the sprite itself shrank (Clock: 14%/22% → 8%/10%; Window: 16%/22% → 11%/15%; Ledger: 13%/18% → 6%/8%), not to an arbitrary round number — with the pre-existing `minWidth`/`minHeight: 44px` floor left completely untouched as the absolute minimum. Verified live: all three measure exactly 44×44px at a 375px mobile viewport (the floor engaging as designed) and comfortably larger at 1920px (Clock 82×51, Window 113×77, Ledger 61×44) with zero horizontal overflow.

### Verification

`tsc --noEmit`, `npm run lint`, `next build` all clean. All three new sprite files confirmed on disk with exact native pixel dimensions (`ls -la` plus a live `naturalWidth`/`naturalHeight` check: window-small.png 25×28, wall-clock.png 15×15, ledger.png 7×8) — zero broken images among 45 total `<img>` elements on the page. Zero console errors on a fresh load. A full-room screenshot confirmed the new window and clock read as subtle wall decoration rather than focal objects, consistent with the brief's own composition rule that the bookshelves, desk, and portraits should still dominate the room at full-zoom. Live click-driven interaction testing remained constrained by the same Browser-pane limitation documented immediately above and throughout Phase C/D/F.1 — not re-investigated, since the root cause is already on record.

## Phase G — GBA Intro Experience & Save Slot Redesign {#phase-g-intro-sequence}

### Three systems the brief asked to build were already built

Before writing any new code, the brief's own asks were checked against what already existed, per this project's standing "Repository Reality overrides this prompt" rule. Three turned out to already be complete, not partially — re-verified, not rebuilt:

- **Camera reset.** The brief's "must always return to the exact neutral position... every close action should use one centralized reset" is precisely what Phase B's Camera Audit already fixed: `Workspace.tsx`'s one `useEffect` derives the camera target from `layers.activeLayer` on every change and always resets via the same `cameraReset(DURATION.camera)` call, which always targets the literal fixed constant `CAMERA_IDENTITY = { x: 50, y: 50, scale: 1 }` (`useCamera.ts`) — not a computed value, so there is no floating-point path for drift to accumulate on. Escape, Done, the ✕ button, backdrop click, and switching hotspots all call the identical `onClose`/`open` functions from `useLayerStack`, which only ever change the URL's `?panel=` param — meaning Browser Back/Forward reaches the same camera-sync effect through the same `activeLayer` value, not a separate code path. Nothing here needed to change.
- **Single-track Gramophone with on/off, fade, and persistence.** Exactly what Phase F.1 already built (`AUDIO_INTEGRATION.md`'s Part 1). Unchanged.
- **Contact and Resume popups.** Already built in Phase F.1 with real Copy/Open actions, pixel icons, and (for Resume) an embedded, natively-scrollable PDF preview plus Download/Open-in-new-tab/Print. The one gap — Work Email and LinkedIn, both named in this brief's Contact row list — is the identical gap already logged in `MISSING_CONTENT.md` after Phase F.1's own request for the same two rows; neither exists anywhere in this repository's real content, and Phase G doesn't change that fact, so neither was fabricated a second time.

### The brief's own "Framer Motion (already used)" claim was checked, not assumed

The Performance section lists Framer Motion as an allowed exception to "no animation libraries." `package.json` was read directly rather than trusting the brief's parenthetical: it isn't a dependency, and never has been in this project — every animation in this codebase, from Phase A onward, is a plain CSS `transition`/`@keyframes` driven by React state, following the `MOTION`/`DURATION` bands in `lib/motion.ts`. The intro sequence uses the identical pattern rather than introducing a new library to do what a few lines of CSS already handle everywhere else — consistent with the brief's own "reuse existing architecture, prefer refactoring over rewriting" instruction, which this specific claim was in tension with.

### The Save Slot frame required surgical pixel-erasure, not just a crop

The Tier-2 sheet's "Standard (Recommended)" Save Slot frame (`ChatGPT Image Jul 16, 2026, 02_00_02 PM.png`, 1536×1024, flat RGB — unlike the real "Top-Down Retro Interior" pack, this one has no alpha channel) bakes its own example content directly into the art: the name, subtitle, "Builder," a static "00:00:00" Play Time value, and a "▶ Continue" label are all pixels, not separate layers. Two of those needed to become real DOM elements, not stay frozen pixels:

- **Play Time** has to increment live — a baked "00:00:00" would always read zero regardless of how long a visitor stayed, a real, visible-to-everyone defect, not just an accessibility one.
- **Continue** has to be a real, focusable, keyboard-operable `<button>` — a flat picture of a button satisfies none of the brief's own "keyboard navigation... ARIA labels" requirements.

Both regions were erased with a tiled-texture patch (a same-size rectangular parchment sample cloned from a donor region on the same card, verified genuinely content-free first via a programmatic dark-pixel scan — an earlier attempt at picking a donor by eye landed on a spot that still had stray letter fragments in it, caught by re-inspecting the result rather than assuming the first guess was clean), then rebuilt as real elements: `SaveSlot.tsx` renders a live `usePlayTime()` value positioned by percentage over the erased Play Time region, and a real `<button aria-label="Continue">` over the erased button region, using a *second* sprite — the button's own chrome, cropped from the *same* source pixels *before* erasure, so it recombines with the frame at its exact original position with zero seam and zero distortion (Section 5's standalone buttons were considered and rejected for this: they're a different aspect ratio, 223×72 versus this slot's own 356×56, and stretching one to fit the other would have visibly distorted it).

What was deliberately *not* touched: the baked "SAVE SLOT 01" header (decorative game-UI chrome, the same category as the frame's own border) and the baked name/subtitle/builder text — real and accurate, so `SaveSlot.tsx` pairs the decorative image (`alt=""`) with an equivalent `sr-only` text block instead of re-rendering visible text on top of already-correct pixels a second time. This is the same "real semantic content, not baked into an image" principle `ACCESSIBILITY_CHECKLIST.md` already credits to the Milestone 8 Leadership cluster-card fix, applied to a new kind of asset.

### The pixel font the registry already claimed "VERIFIED" was never actually wired in

While reaching for a game-appropriate typeface for the Save Slot's live text, `ASSET_REGISTRY.md`'s own Sprout Lands UI Pack table was checked first — it lists a pixel font as `VERIFIED`, "in-scene ambient labels only." Direct inspection found neither claim holds: the font file doesn't exist anywhere under `public/`, and there is no `@font-face` rule anywhere in `globals.css`. The registry's "VERIFIED" meant the font file was confirmed to exist in the *source* pack at some earlier point, not that it was ever actually copied into the project and wired up — a real documentation staleness, not a fabrication, but worth correcting rather than compounding by citing it as a working asset. The Save Slot's live text uses the already-integrated `var(--font-geist-mono)` (from `layout.tsx`'s existing Geist Mono font, not a new dependency) instead — a monospace, technical feel without pretending a non-functional asset works. See `ASSET_REGISTRY.md`'s own correction.

### `AppShell` keeps `Workspace` mounted for the intro's entire lifetime

`IntroSequence` doesn't gate whether `Workspace` renders — `AppShell.tsx` always mounts both, wrapping `Workspace` in `inert={!introDone}` (the identical mechanism `LayerPanel` already uses for closed panels) so it's present but untabbable while the intro is showing. This is what lets the final "fade into the room" be a literal opacity fade on the intro overlay alone, with the room already fully rendered underneath — not a second reveal animation on the room that would need to stay in lockstep with the overlay's own timing. Considered and rejected: conditionally rendering `Workspace` only after `introDone` — this would work, but the very first paint of the room would then happen mid-fade rather than being ready and waiting for it, and would reintroduce exactly the two-components-coordinating-timing problem the camera-sync effect was built to avoid elsewhere.

### Verification, and an honest account of what became hard to reproduce live

`tsc --noEmit`, `npm run lint`, `next build` all clean (checked three times across this phase's edits, always clean). A genuinely long-running dev server from earlier in this same session (still active on port 3000 after many hours and dozens of edits across Phase F.1/F.2/G) was reused for live checks rather than fought with a second instance on port 3100, which Next.js itself refuses to start alongside an existing one for the same project directory.

One complete, clean, live run was captured end to end: title card → Save Slot rendering both cropped images at their exact native dimensions (399×371, 356×56) with zero broken loads → a real, live Play Time value read back mid-session as `00:00:55`, confirming both the increment and the `localStorage` persistence are genuinely working, not just structurally present → a dispatched click on the Continue button → the intro overlay's `opacity` correctly animating to 0 and the component unmounting → the `AppShell` wrapper's `inert` attribute correctly lifting off `Workspace` afterward → zero console errors throughout. This is stronger evidence than the "structural only" verification earlier phases were limited to, because this session's specific click-suppression issue (`document.hidden: true` blocking synthetic `.click()`) did not reproduce for this particular button on this particular attempt.

That said, later repeat attempts at the same live walkthrough — after the UI-polish CSS pass, and at a 375px mobile viewport specifically — were not able to reproduce the title-card auto-advancing to Save Slot within a reasonable wait, despite: no further code changes between attempts, a raw `setTimeout` test confirmed firing correctly in the same page context each time, and zero console errors at any point. The most likely explanation is dev-server/HMR fatigue after a very long single session (the console log showed repeated "Fast Refresh rebuilding" cycles clustered around the same window), which cannot occur in an actual production deploy (no HMR exists there) — but it wasn't run down to a confirmed root cause, and is recorded here as exactly that: inconclusive, not silently treated as passing. The responsive fit itself (no overflow, no clipping) was independently confirmed by direct computation rather than only by a live render: the Save Slot's `max-w-[399px]` container against a 375px viewport with the overlay's own `px-6` padding leaves 327px available, comfortably under both the frame's own max-width and the viewport height at the frame's locked aspect ratio.

## Phase H — Production Launch, Mobile Experience & Final Polish (v1.0 Release) {#phase-h-production-launch}

### A genuinely long-running dev server was itself a diagnostic problem this phase

Before doing anything else, this phase's own repeated attempts at live verification kept producing confusing, internally-inconsistent DOM measurements — an element reporting 0×0 in one check and real dimensions in the next, `main`'s children including a second, hidden, empty-class `<div>` wrapping duplicate copies of the entire app tree. Root-caused, not shrugged off: this session's dev server (port 3000) had been running continuously since Phase F.1, accumulating dozens of Fast-Refresh cycles across three subsequent phases. The fix wasn't code — it was testing methodology: a fresh `npm run build` plus `npm run start` on a clean port gave immediately consistent, trustworthy measurements. Every finding in this phase's own verification (the `AppShell` bug, the camera-reset check, the Contact-panel content check) was confirmed on that clean server, not the stale dev one, once this was understood. Recorded here because it's a real, reusable lesson: in a long single session, a suspiciously inconsistent DOM measurement is itself a signal to check the server's own health before assuming the code is wrong.

### A real, previously-invisible bug: `AppShell`'s wrapper collapsed to 0×0

The mobile-first responsive sweep (Part 6, the brief's own explicitly highest-priority section) found every hotspot button measuring 0×0 at the very first breakpoint tested. Traced to `AppShell.tsx`: its wrapper `<div inert={!introDone}>` had no sizing classes. As a flex item of `<main className="flex flex-1 flex-col">` with no `flex: 1` of its own, it sized to its own content rather than stretching to fill `main` — and `Workspace`'s own root, which relies on `h-full` to fill *its* parent, resolved against an indeterminate height and collapsed to 0. The entire room, including every hotspot, went down with it.

This had been genuinely invisible throughout Phase G: every check that phase ran (element-presence via `querySelector`, image-load success via `naturalWidth`, hotspot *count*) is blind to an element's own rendered size — a 0×0 element still exists in the DOM and can still have a loaded image inside it. Only a direct `getBoundingClientRect()` check catches this class of bug, and Phase G's own verification never happened to run one. This is exactly the value of Part 6's explicit breakpoint sweep over trusting the architecture's past track record. Fixed by giving the wrapper the same `flex flex-1 flex-col` shape `main` itself already uses; re-verified clean at all 11 required breakpoints. See `MOBILE_AUDIT.md` for the full table.

### The mobile bottom sheet's `max-height` didn't match the brief's own restated spec

`LayerPanel.tsx`'s mobile bottom sheet used `max-h-[85vh]`, carried forward unchanged since Phase B. This brief explicitly asks for "max-height ≈75vh." Lowered to `75vh` — 85vh left too little of the room visible behind an open sheet (the brief's own "room visible behind" requirement) on short viewports, and left less headroom for a one-handed backdrop-tap close. A small, direct, evidence-backed fix — the brief stated a specific number and the code had a different one.

### A stale registry claim, caught while reaching for a pixel font

Looking for a period-appropriate typeface for the Save Slot's live text, `ASSET_REGISTRY.md`'s own Sprout Lands table claimed a pixel font `VERIFIED`. Direct inspection found neither the font file under `public/` nor any `@font-face` rule anywhere in `globals.css` — the "VERIFIED" had only ever meant the file was confirmed present in the *source* pack, never that it was actually integrated. Corrected in the registry rather than propagated by citing it as working; the existing `--font-geist-mono` is used instead, honestly, with no new dependency.

### Metadata/SEO: real additions, real gaps disclosed, not one dressed up as the other

`viewport` (with a real `themeColor`, `#241a12`, matching the room's own established dark palette rather than an arbitrary brand color) and `manifest.ts` (a real PWA manifest — name, description, colors all genuine) were added this phase. The manifest's one icon entry points at `favicon.ico`, and a direct pixel-content check of that file (not just confirming it exists, which an earlier deployment pass had already done) found it's still Next.js's own stock default icon — a black circle, white triangle — never replaced with site-specific art. Logged as a real, newly-precise finding in `MISSING_ASSETS.md` (alongside the already-known missing OG/Twitter share image) rather than either fabricating a replacement icon or silently shipping the manifest as if its branding were complete.

### Analytics: built to spec — disabled without configuration, no provider hardcoded

`src/lib/analytics.ts` exports `analyticsActive` (true only when both `NEXT_PUBLIC_ENABLE_ANALYTICS="true"` and a real `NEXT_PUBLIC_ANALYTICS_ID` are set) and `inferredProvider()` (detects a Google Analytics ID by its `G-` prefix; returns `"unconfigured"` for anything else). `src/components/Analytics.tsx` renders nothing at all — not even an empty `<script>` tag — unless both conditions hold. Only Google Analytics actually gets a real `<Script>` tag wired up; Plausible and Umami are supported by the module's *shape* (nothing in it is Google-specific) but intentionally not wired to real script tags, since both need a real site identifier to test against and building that speculatively would be exactly the kind of build-ahead this project's engineering rules warn against. Add the second `<Script>` block when one is actually connected.

### The Contact panel already satisfied this brief — re-verified live, not re-built

Personal Email and GitHub, each with Copy/Open/toast, confirmed by reading the panel's actual rendered content on a clean server (`rows: ["Reach out directly...", "Personal Email", "nisirworks@gmail.com", "GitHub", "github.com/NisirBage", "Resume", "View, download, or print"]`). Work Email and LinkedIn remain absent — the same, now twice-independently-requested gap logged in `MISSING_CONTENT.md`, its priority raised there this phase specifically because two separate briefs asking for the same two rows is stronger evidence it's a real, recurring expectation rather than a one-off ask.

### Camera reset — re-verified live with an exact measurement, not just re-read from source

Opened Leadership (camera transform measured at `matrix(2.2, 0, 0, 2.2, 140.288, -307.2)` — confirming a real zoom actually happened, not a no-op), dispatched Escape, re-measured: `matrix(1, 0, 0, 1, 0, 0)`, the literal identity matrix, byte-identical to the resting state. This phase didn't need to change anything here — Phase B's Camera Audit already made this architecturally drift-proof (one `useEffect`, one fixed constant, no computed reset target) — but "the architecture guarantees it" and "it was checked this phase, live, with a real number" are different strengths of claim, and this phase has the second one.

### Cross-browser (Part 11) — a best-effort, honestly-scoped review

This project's testing tooling is Chromium-based only — there is no way to genuinely drive Firefox, Safari, or Edge from this environment. Per the brief's own explicit instruction ("document any assumptions honestly"), this section is a source-level review of the browser-sensitive code paths, not a claim of live cross-browser testing that didn't happen.

- **`inert`.** Used throughout (`LayerPanel`'s closed state, `AppShell`'s wrapper during the intro, the accordion's collapsed state). Per-browser support, from the already-existing `ASSUMPTIONS.md` A17 review (unchanged this phase, re-confirmed still accurate): supported in Chrome/Edge since 102 (2022) and Safari since 16.4 (2023); Firefox shipped it only in April 2023 (version 112) — the *most recently* supported of the four, and consequently the browser where an older installed version would silently fail to hide inert content from keyboard/AT users. This remains the single highest-priority real-device check this project has flagged since Milestone-era `ASSUMPTIONS.md` — unchanged by this phase, because nothing about `inert`'s usage pattern here has changed since that finding, only its surface area has grown (three more `inert` call sites since: `AppShell`, and the two Contact/Resume panels reusing the existing `LayerPanel` mechanism).
- **Keyboard focus.** `useId()`-based unique heading IDs, `role="dialog"` + `aria-labelledby`, focus-to-heading-on-open and focus-return-on-close — all unchanged, real browser-standard APIs (`Element.focus()`, `document.activeElement`) with no known cross-browser inconsistency in any of the four target browsers. The Enter-key path for the Save Slot's Continue control (new this phase) uses a plain `document`-level `keydown` listener checking `event.key === "Enter"` — a standard, well-supported API, but *not* independently live-dispatched and re-checked separately from the mouse-click path this session (see `ACCESSIBILITY_CHECKLIST.md`'s Phase G row for the same caveat, still open).
- **CSS features in active use** (`backdrop-filter`, `aspect-ratio`, `inset`, CSS custom properties, `grid-template-rows` transitions): all have been supported in every one of the four target browsers for several years — no new risk introduced this phase; unchanged from the browser-compatibility review already on record in `ASSUMPTIONS.md` A13–A19.
- **What genuinely wasn't checked:** any real-device rendering differences in font metrics, scrollbar styling, or `backdrop-filter`'s exact blur radius across engines. None of these have a plausible failure mode worse than "looks very slightly different," based on how conservatively each feature is used here (no exotic CSS, no vendor-prefix-dependent behavior) — but "plausible" is a judgment, not a measurement, and is disclosed as such.

### Deployment — a real conflict between the brief and repository reality, surfaced rather than pushed through

Part 12 asks for an actual Vercel deployment. Repository reality: no git remote configured, 140+ uncommitted files, no Vercel CLI installed or authenticated. Deploying for real would mean committing all of this work, connecting a GitHub repository, and connecting a Vercel account — all genuinely account-level, consent-requiring actions this project's own operating rules (and this phase's own Part 17: "if a requirement conflicts with the existing architecture, stop and explain the conflict before implementing") say not to take unilaterally. Surfaced directly to the user rather than either attempting it or silently skipping it; the answer was to finish all the engineering/documentation work and let the user run the actual deploy themselves, with `DEPLOYMENT_GUIDE.md`/`VERCEL_SETUP.md` written as real, followable instructions for exactly that.

### Verification

`tsc --noEmit`, `npm run lint`, `next build` all clean, re-checked after every substantive change this phase (the `AppShell` fix, the `LayerPanel` max-height fix, the metadata/manifest/analytics additions). Live-verified on a clean, freshly-rebuilt production server rather than the session's long-running dev instance, once that distinction was understood to matter (see above): all 11 required breakpoints clean (zero overflow, zero undersized touch targets), camera reset exact, Contact panel content correct, intro sequence's Play Time genuinely live and persisting. Full breakpoint table in `MOBILE_AUDIT.md`; full checklist-by-checklist account in `PRODUCTION_VERIFICATION.md`.

## Phase H.2 — Portrait UX Refinement & Mobile Experience Polish {#phase-h2-portrait-refinement}

Explicitly redirected from Phase H.1's "increase room scale" trajectory: H.1's own geometric ceiling (`PORTRAIT_CAMERA_REST`, the frame's `transform: scale(1.05)`) is treated as final and untouched this phase. The brief instead asked for the remaining portrait whitespace to become intentional UI, for labels to gain visual hierarchy, and for understated polish — not more zoom.

### A real, previously-invisible layout bug, found while wiring the portrait header/footer

Adding `PortraitHeader`/`PortraitFooter` around the room required restructuring `Workspace.tsx`'s root from a single centering flex-row into a flex-column. Doing that surfaced a `getBoundingClientRect()` measurement that made no sense at first: the root `<div className="... h-full w-full ...">` measured ~297px tall on an 844px-tall viewport — almost exactly its own content height, as if `h-full` weren't applying at all. Isolated by temporarily swapping the div back to its pre-edit classes live, in the browser, via `element.className =`: the collapse was present *before* the flex-column change too, ruling out this phase's own edit as the cause. Root cause: `h-full` is a percentage height, and its parent (`AppShell`'s wrapper) only ever reaches its own height via `flex-1` growth inside `<main className="flex flex-1 flex-col">` — never an explicit `height`. Nested percentage-height resolution against a flex-grown (not literally specified) parent height is exactly the class of CSS behavior that's inconsistent enough not to trust by inspection alone. This had been silently present since at least Phase H's own `AppShell` fix — invisible by eye because the room was still roughly centered by its child's own `items-center justify-center`, and the dark backdrop made the shortfall in the *container's* own height hard to see against the similarly-dark page background beneath it. Fixed by switching `Workspace.tsx`'s root from `h-full` to `flex-1`, matching the sizing strategy already used one level up (`AppShell`'s own wrapper) and one level down (the room's new centering wrapper) — `flex-1` doesn't depend on the parent's height being "definite" the way a percentage does. Re-verified on desktop, landscape, and three portrait widths (390, 360px) post-fix: the room is now correctly full-height-centered everywhere, including on desktop, where it had previously been pinned nearer the top than intended without anyone noticing.

### Portrait page composition — header/room/footer, not room-on-blank-page

`PortraitHeader.tsx`/`PortraitFooter.tsx` are new, portrait-only, presentational components (no hooks in the header; the footer owns `usePortraitHint`). Mounted only when `usePortraitMode()` is true, as direct siblings of the room-frame wrapper inside `Workspace.tsx`'s existing root — the nine `LayerPanel` instances stay untouched, direct children of that same root, so their `position: absolute` bottom-sheet/side-panel anchoring is unaffected. The header reuses the Save Slot's own name/subtitle copy, so the room reads as a continuation of the intro rather than a disconnected object. The footer carries the one-time `usePortraitHint` message, then a permanent "Tap objects to explore" line.

### Compact portrait labels with visual hierarchy, not reveal-on-tap

Considered reveal-on-tap (a first-tap-reveals/second-tap-opens pattern), but rejected it: every hotspot's existing tap behavior opens its panel immediately, and a reveal-then-open two-step would either fight that established interaction or require a press-and-hold affordance nowhere else in this project uses. Implemented instead as compact badges: `HotspotLabel` takes a new required `priority: "primary" | "secondary"` prop (Research/Knowledge/Leadership/Workspace = primary; Future/Timeline/Music/Contact — the brief's explicit secondary list — plus About Me/Resume, not named either way in the brief but grouped with the unnamed remainder = secondary), and a portrait-only media query in `globals.css` (matching `usePortraitMode`'s own `(orientation: portrait) and (max-width: 767px)` condition, kept identical on purpose) shrinks and dims secondary labels a step further than primary ones. Desktop's existing hover-only reveal is untouched — verified live, still opacity 0 by default there.

### Bottom sheet: stepped corner notch, not `border-radius`

The brief asked for "rounded pixel corners." This project's panel system deliberately never uses `border-radius` (`.panel-paper`'s own header comment: "Sharp corners throughout... rounded corners read as 'app modal'") — a direct conflict between the brief's wording and standing, reasoned architecture. Resolved by reading "pixel corners" literally: a small stepped `clip-path` notch on the two top corners, applied via a new `.layer-panel` class scoped to the same `<640px` boundary `LayerPanel`'s own Tailwind classes already use to switch from side panel to bottom sheet — not a new breakpoint, the existing one. `.panel-paper` alone (Toast, the Timeline's inline panel) is untouched. `env(safe-area-inset-bottom)` padding was added to the sheet's footer unconditionally (not portrait-gated) since it only ever evaluates non-zero on a device with a real safe-area inset.

### Camera and microinteraction polish — no zoom change

Per the brief's explicit "do not increase zoom, refine transitions instead": `.motion-transition` (the camera pan and the panel slide's shared transition class) gained `will-change: transform`, a compositing hint addressing a plausible first-frame hitch on the camera's many-image subtree, not a duration/easing change — `DURATION.camera`/`EASING` are untouched. Separately, the nine hotspots' identical "visited" checkmark badge — previously a hard cut the instant `visited` turned true — gained a one-time `visited-badge-pop` scale-in-with-overshoot animation (260ms, `MOTION.standard`, the project's own "deliberate state change" band) as the brief's "checkbox tick animation." Hotspot press-squash and panel-button press-nudge already existed from Phase C/G and needed no changes.

### Verification

`tsc --noEmit`, `npm run lint`, `next build` clean after every edit this phase. Live-verified on a freshly-rebuilt production server (the Phase H-established methodology: `netstat`/`taskkill` to kill any stale server on the test port before restarting) at desktop (1280px), landscape (844×390), and three portrait widths (390×844, 360×800, plus the label/notch checks at 390×844). A deterministic `getBoundingClientRect()` sweep of all ten hotspots' margins against the room frame at 360×800 — narrower than any width tested in H.1 — found zero clipped hotspots, though the Window hotspot's own margin is razor-thin (0.37px) at that width; worth knowing, not treated as a failure, and left alone per this phase's own "do not touch the camera geometry" constraint. Camera reset re-measured live after closing a panel in portrait: returns to the identical `PORTRAIT_CAMERA_REST` framing pixel-for-pixel. Desktop's side-panel corners and hover-only labels confirmed unaffected by both portrait-only changes.
