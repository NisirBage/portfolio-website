# Implementation Plan — The Studio

**Status:** The final planning document before code. Every milestone produces a *working, deployed application* — not a component in isolation — and is independently testable before the next one starts. Accessibility and performance checks are built into every milestone's Definition of Done, not bolted on as a separate late-stage pass — treating accessibility as a final audit rather than a continuous requirement was itself one of the risks `DESIGN_DEBT.md` flagged (Finding #6), and this plan is written to not repeat that mistake on itself.

Scope per milestone is drawn directly from `VERSION1_SCOPE.md`'s Must Have list. Should/Nice-to-Have items appear only where explicitly marked as stretch goals within a milestone, never as blocking requirements.

---

## Milestone 1 — Repository

**Produces.** An empty deployed page, reachable at a real URL.
- **Acceptance criteria.** Build tooling configured, lint/format rules in place, CI runs on push, a placeholder page deploys successfully.
- **Manual tests.** Load the deployed URL on desktop and mobile; confirm no console errors.
- **Edge cases.** Build fails gracefully with a readable error, not a silent failure.
- **Accessibility checks.** Base HTML has correct `lang`, a real `<title>`, one `<h1>`.
- **Performance checks.** Baseline Lighthouse score recorded now, as the comparison point for every later milestone.
- **Regression risks.** None yet — this is the floor everything else builds on.

## Milestone 2 — Workspace Rendering

**Produces.** The static establishing shot, matching `SPATIAL_BLUEPRINT.md`'s Option A, correctly composited from the real room asset.
- **Acceptance criteria.** All four zones render in the correct order and proportion; the two door-gaps are dressed per the Spatial Blueprint's resolution; `image-rendering: pixelated` (or equivalent) is applied and verified at multiple zoom levels — addressing the risk named in `IMPLEMENTATION_RISKS.md`.
- **Manual tests.** Visual comparison against the Low-Fidelity Exploration's establishing-shot sketch at three viewport widths.
- **Edge cases.** Very narrow (< 320px) and very wide (ultra-wide) viewports don't distort zone proportions.
- **Accessibility checks.** The scene has an `alt`/`aria-hidden` treatment appropriate to its decorative-from-AT-standpoint role (per `DESIGN_DEBT.md` Finding #6 — this is where that stated tradeoff first becomes real code, so name it in the markup, not just the docs).
- **Performance checks.** Room asset loads without layout shift; Lighthouse score doesn't regress from Milestone 1's baseline by more than a defined threshold.
- **Regression risks.** Low — nothing yet depends on this beyond itself.

## Milestone 3 — Camera System

**Produces.** Six placeholder hotspots (unstyled boxes are fine) that pan/zoom the viewport to their `SPATIAL_BLUEPRINT.md` anchor points on click.
- **Acceptance criteria.** All six anchors reachable; `Microinteractions.md`'s timing scale (Fast/Standard/Slow bands) implemented and measured, not eyeballed; `prefers-reduced-motion` produces instant cuts, verified with the OS setting actually toggled, not assumed.
- **Manual tests.** Click each hotspot in sequence rapidly — this is where `DESIGN_DEBT.md` Finding #4 (camera timing vs. 90-second recruiter priority) gets resolved in code: does a fourth rapid click wait for the third transition to finish, or cancel into it? Decide and verify here, not later.
- **Edge cases.** Clicking a hotspot mid-transition to a different hotspot.
- **Accessibility checks.** Every hotspot keyboard-reachable and activatable via Enter/Space; focus ring visible against the pixel background at every zoom level.
- **Performance checks.** Transitions stay on the GPU-accelerated path (verified via browser dev tools, not assumed) — the specific risk named in Implementation Risks.
- **Regression risks.** Medium — every future milestone depends on this system's timing decisions.

## Milestone 4 — Interaction / Layer Engine

**Produces.** One fully working dummy Focus state with placeholder content, proving the reusable Layer-stacking engine before any real content exists.
- **Acceptance criteria.** Layers open/close per `MICROINTERACTIONS.md`'s specified behavior; browser back/forward navigates the layer stack correctly; URL reflects the current layer state, addressing the deep-linking gap identified in `IMPLEMENTATION_RISKS.md` — built in now, not retrofitted later.
- **Manual tests.** Open a layer three levels deep, use browser back three times, confirm it unwinds correctly; copy the URL at Level 3, open in a new tab, confirm it lands at the same state.
- **Edge cases.** Opening a new Focus state while a different one's Layer is still open; refreshing the page mid-Layer.
- **Accessibility checks.** Focus moves into the panel on open and returns to the triggering hotspot on close — the specific behavior flagged as previously assumed-but-unspecified in `IMPLEMENTATION_RISKS.md`.
- **Performance checks.** No layout thrash when layers stack/unstack rapidly.
- **Regression risks.** High — this is the piece every content milestone depends on; a change here after Milestone 5 risks touching every subsequent milestone.

## Milestone 5 — Desk Focus (hub content)

**Produces.** The real Desk hotspot, Resume and Contact persistent affordances, and the boot-line reveal — plus the first-paint idle animation added in this review to address the discovery-mechanism risk (`DESIGN_DEBT.md` Finding #2).
- **Acceptance criteria.** Resume downloads a real PDF; Contact affordance works from any state, not just Desk Focus; the idle animation is visible without any interaction, verified by loading the page and doing nothing for 5 seconds.
- **Manual tests.** Download the resume on a slow network throttle; confirm the file that downloads matches the one in the repo.
- **Edge cases.** Resume PDF fails to load — per `DESIGN_DEBT.md`'s finding that no failure-mode UX exists anywhere in the design yet, this milestone is where that gap gets closed for the first real asset.
- **Accessibility checks.** Resume link has a real, descriptive accessible name, not "click here" or a bare icon.
- **Performance checks.** Resume PDF isn't loaded until requested (no unnecessary preload).
- **Regression risks.** Medium — Contact/Resume being reachable from every state means later milestones must not accidentally break that global reachability.

## Milestone 6 — Projects Layer

**Produces.** All three flagship projects, real content, to Level 4, with the Blueprint unroll animation.
- **Acceptance criteria.** Matches `LOW_FIDELITY_EXPLORATION.md`'s Option C accordion behavior; each project reaches Level 4 with a real outbound GitHub link.
- **Manual tests.** Open each project to Level 4 independently; confirm opening a second project collapses (not deletes) the first, per the accordion spec.
- **Edge cases.** GitHub link target is unreachable (404, repo renamed) — define what happens, don't leave it undefined.
- **Accessibility checks.** Accordion state (expanded/collapsed) announced correctly to screen readers.
- **Performance checks.** Blueprint diagrams (likely the heaviest images in this milestone) lazy-load, not bundled into initial page weight.
- **Regression risks.** Low, contained to this Layer.

## Milestone 7 — Knowledge and Research Focus

*Revised, Milestone 7: this milestone was originally scoped as a single "Research / Bookshelf Focus" producing Level 2 advisor/domain/direction content. Per the Knowledge ≠ Research architectural split (`NARRATIVE_SYSTEM.md`), it now produces two peer evidence surfaces instead. `VERSION1_SCOPE.md`'s "Research Journal at Level 3" Should-Have is folded into this milestone's Must-Have scope rather than deferred, since the real research content the user provided is inherently a "current status" artifact, not a Level 2 summary that could be shipped separately from its detail.*

**Produces.** Real, honestly-scoped content for two objects: the Bookshelf (Knowledge — foundational learning, real influences) and the Research Journal (Research — a live "alive" status: Current Question, Current Stage, Latest Progress, Next Milestone, Unknowns, Pending Decisions).
- **Acceptance criteria.** Matches `INTERACTION_SPECIFICATION.md`'s Bookshelf (Knowledge) and Research Journal entries; both pass the Evidence Surfaces review before implementation; content is honestly scoped to what's real today (no fabricated Level 4 source link, per `INFORMATION_BLUEPRINT.md`'s existing honesty note).
- **Manual tests.** Content review against the actual real-world facts for each surface, not just against the design docs; confirm the two hotspots are spatially distinct and independently reachable.
- **Edge cases.** None significant — still a low-complexity milestone by design, now with two small surfaces instead of one.
- **Accessibility checks.** Standard panel checks, same pattern as Milestone 6, doubled across two panels.
- **Performance checks.** None beyond baseline.
- **Regression risks.** Low, though `CameraTestHarness.tsx`'s stale "research" test target needs deletion (Design For Deletion) now that a real hotspot replaces it.

## Milestone 8 — Leadership Focus (grid fallback)

*Revised, Milestone 8: two corrections to this entry's original assumptions, both made before implementation rather than discovered mid-build. First, `MISSING_ASSETS.md` never actually contained a certificate-PDF-cataloguing gap — that cross-reference was stale; certificate frames use the generic verified sprite plus real text content, not scanned images, so there was never a blocking asset gap here. Second, the Whiteboard content described as "written in parallel" was not, in fact, available — `VERSION1_SCOPE.md` moved it to Should Have rather than shipping a fabricated framework; see `MISSING_CONTENT.md`.*

**Produces.** The Leadership cluster content at the **grid** fidelity (Low-Fi Option A, implemented as cluster cards rather than per-certificate cells — see `INTERACTION_SPECIFICATION.md`), per `VERSION1_SCOPE.md`'s Must-Have baseline — the fan-out is an explicit later upgrade, not part of this milestone's Definition of Done.
- **Acceptance criteria.** Four clusters with quantified headlines visible without opening any individual item. The Whiteboard is out of scope for this milestone (see revision note above).
- **Manual tests.** Verify cluster counts match the real resume figures — *revised, post-Milestone 8: updated from an authoritative source to 25 conferences as delegate and 11 as chair, replacing the earlier "24 conferences, 6 judged" figures; see `ENGINEERING_DECISIONS.md`.*
- **Edge cases.** A cluster with only one item (Case Comps, the smallest) doesn't look broken or sparse at grid scale — resolved by cluster cards carrying equal visual weight regardless of the count inside them.
- **Accessibility checks.** Cluster cards keyboard-navigable in a predictable, linear order via standard panel `Tab` behaviour.
- **Performance checks.** No certificate images exist to lazy-load (see revision note above) — content is plain text, negligible weight.
- **Regression risks.** Low — no blocking asset gap, no fabricated content standing in for the Whiteboard.

## Milestone 9 — Mobile Fallback

**Produces.** The plain-list mobile experience, Must-Have baseline per `VERSION1_SCOPE.md`.
- **Acceptance criteria.** All content from Milestones 5–8 reachable in linear, scrollable form on a real mobile viewport, no spatial/camera metaphor attempted.
- **Manual tests.** On an actual phone, not just a resized desktop browser window.
- **Edge cases.** Orientation change mid-session.
- **Accessibility checks.** Touch targets meet the 44×44px minimum already specified project-wide.
- **Performance checks.** Mobile-specific Lighthouse run — separate from desktop's, since the two experiences are now genuinely different builds, not just a responsive resize.
- **Regression risks.** Low, since this is intentionally a simpler, separate code path rather than a responsive variant of the desktop one.

## Milestone 10 — Cross-Cutting Accessibility & Performance Audit

*Revised, post-Milestone-8: a "Production Hardening" pass (cross-browser review, performance review, deployment readiness, repository review — see `PROJECT_HEALTH.md` and `ENGINEERING_DECISIONS.md`) already covers real ground originally scoped here: the full 4-panel keyboard/focus audit, the source-level cross-browser compatibility review, and a genuine performance review. What that pass could **not** do — real non-Chromium browser testing, real screen-reader testing, a full-site Lighthouse run, and the specifically-*after-Mobile-Fallback* holistic walkthrough this milestone's brief calls for — remains this milestone's actual job. Treat Production Hardening as having front-loaded this milestone's source-level and single-browser work, not as having replaced it.*

**Produces.** The same application as Milestone 9, verified holistically rather than milestone-by-milestone — this catches integration issues no single milestone's checks could see (e.g., focus order across the *whole* six-state system, not just within one state).
- **Acceptance criteria.** Full keyboard-only walkthrough of every Must-Have state; actual screen-reader testing (VoiceOver or NVDA, not just automated tooling) per the maintenance-cost warning in `IMPLEMENTATION_RISKS.md`; full-site Lighthouse run.
- **Manual tests.** A complete session using only a keyboard, start to finish, no mouse.
- **Edge cases.** Rapid tabbing through all six states in sequence — does focus ever get lost or trapped anywhere in the whole system, not just within one Layer.
- **Accessibility checks.** This milestone *is* the accessibility check — the outcome, not an input.
- **Performance checks.** Full-site bundle size review; confirm no Should/Nice-to-Have feature accidentally shipped and inflated the Must-Have bundle.
- **Regression risks.** This milestone exists specifically to surface regressions accumulated across Milestones 2–9 — expect to find some, and treat that as the milestone succeeding, not failing.

## Milestone 11 — Launch Readiness

**Produces.** Version 1, shippable.
- **Acceptance criteria.** Every Must-Have item from `VERSION1_SCOPE.md` verified present; the real recruiter/user testing recommended in `DESIGN_DEBT.md` Finding #1 has happened at least once against this build, with findings triaged (fixed, or explicitly deferred to Version 2 with a reason).
- **Manual tests.** A cold-start session by someone who has never seen any of the eighteen design documents — the actual test the discovery-mechanism risk (Finding #2) can finally be checked against.
- **Edge cases.** Whatever the Milestone 10 audit surfaced, resolved or explicitly deferred.
- **Accessibility checks.** Final pass against WCAG AA, not just the project's own internal checklist.
- **Performance checks.** Production Lighthouse score meets a defined minimum (to be set once Milestone 1's baseline and subsequent trend are known).
- **Regression risks.** None beyond normal launch risk — this milestone is the finish line, not a place new scope enters.
