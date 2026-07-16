# Assumptions Register — The Studio

**Status:** Living document. Entries are never deleted, only updated as evidence changes. Statuses: **Verified**, **Pending**, **Rejected**, **Invalidated**.

---

### A1 — Real Enter/Space key presses activate the camera test buttons

- **Assumption.** Native `<button>` elements in the camera test harness respond to real keyboard Enter/Space the same way they respond to mouse clicks.
- **Evidence.** Traced a failed synthetic-key test to the automation tool's key event carrying `key: ""` instead of `"Enter"`/`" "` (confirmed via a raw `keydown` listener: `isTrusted: true`, correct target, empty `key`). The buttons have zero custom keyboard handling — activation is entirely native browser behavior specified by the HTML standard for `<button>` elements.
- **Confidence.** High.
- **Risk.** Low — if wrong, it's a fundamental browser behavior failure, not something specific to this codebase.
- **Validation plan.** Manual test with a real keyboard on a real device before Version 1 ships.
- **Status.** Pending.

### A2 — The CSS-transition interrupt/redirect (camera and layers) looks visually smooth to a real viewer

- **Assumption.** When a new camera target or layer state arrives mid-transition, the browser's native transition interpolation produces a smooth visual redirect, not a jump or stutter.
- **Evidence.** Well-established CSS platform behavior (changing a transitioning property's target value redirects the interpolation from the current value). Verified that the *specified* style values are correct at each step; could not directly observe the *live animated* result because the test browser tab reports `document.visibilityState: "hidden"` throughout testing, which throttles transition rendering.
- **Confidence.** Medium-High — the mechanism is standard, but genuinely unobserved.
- **Risk.** Low-Medium.
- **Validation plan.** Visual check in a real, foregrounded browser tab before Version 1 ships.
- **Status.** Pending.

### A3 — `next/image` with `unoptimized` + `image-rendering: pixelated` renders crisply across major browsers, not just the tested Chromium build

- **Evidence.** `pixelated` is the modern standard value; `crisp-edges` fallback covers older Firefox. Only tested in one Chromium-based automation browser so far.
- **Confidence.** Medium.
- **Risk.** Low — worst case is a graceful degrade to smoothed (blurry) pixel art on an unusual browser, not breakage.
- **Validation plan.** Cross-browser visual check (Firefox, Safari) before Version 1 ships.
- **Status.** Pending.

### A4 — Door dressing placement (centered on the measured gap) will read as visually correct once real composition polish happens

- **Evidence.** Placement is geometrically reasonable (centered on measured gap coordinates) but was never validated against a finished visual design — `ENGINEERING_DECISIONS.md` Milestone 2 already flags this as "reasonable-effort," not a formal spec.
- **Confidence.** Medium.
- **Risk.** Low-Medium — a visual-polish miss, not a functional one.
- **Validation plan.** Revisit during a dedicated visual-design pass (Phase 4 in the original design roadmap, not yet scheduled against implementation milestones).
- **Status.** Pending.

### A5 — Milestone 4's Layer state (single `activeLayer: string | null`) is sufficient through Milestone 6, without needing a generalized multi-depth stack

- **Evidence.** `LOW_FIDELITY_EXPLORATION.md`'s accordion decision (Option C) for the Projects Layer expands *within* a single open layer, not by pushing additional layers on top of it — so project-detail depth is local state inside one Layer's content, not a second layer-stack entry. **Built and verified in Milestone 6:** `DeskPanel`'s accordion state is plain `useState`, confirmed mutually exclusive across all three projects via `aria-expanded` checks on a production build, with zero changes needed to `useLayerStack`.
- **Confidence.** **Very High** (raised from Medium-High) — no longer reasoned from design docs alone, built and tested.
- **Risk.** None remaining for the current scope.
- **Validation plan.** Complete.
- **Status.** **Verified.**

### A6 — `LayerPanel` correctly returns focus to the element that opened it

- **Assumption.** On close, focus returns to the actual trigger element (e.g., "Open dummy layer"), not to `document.body`.
- **Evidence, original.** Tested via a JS-dispatched `.click()`, which does not necessarily focus an element first the way a real mouse click does — `previouslyFocused.current` may have captured `document.body` instead of the real trigger in that specific test, which matches the observed result (focus landed on `<body>` after close).
- **Evidence, resolved — Milestone 7.** Re-tested with a genuine `left_click` (not `.click()`) opening the Research Journal hotspot, followed by a real Escape keypress to close: focus landed correctly back on the "Open the Research Journal" trigger button, not `<body>`. This confirms the hypothesis in the original evidence exactly — the earlier failure was the test methodology (`.click()` not focusing first), not the component's `previouslyFocused.current` logic, which works correctly when the precondition (something real focused the trigger) actually holds.
- **Milestone 8 note.** Re-attempting this on `LeadershipHotspot` in this session hit the browser tool's coordinate-drift issue (see A8), forcing a fallback to `.click()`, which reproduced the exact `<body>`-focus artifact this entry already explains — expected, not new information, and not a regression in `LayerPanel` itself.
- **Confidence.** **High** (raised from Low-Medium) — the mechanism is understood and was directly confirmed with a real click on real code, on at least one of the four real hotspots sharing this exact component.
- **Risk.** Low, down from Medium.
- **Validation plan.** Complete for the mechanism; a real-device spot-check remains worthwhile before Version 1 ships, same session as A1/A8's Enter/Space check, but this is no longer an open question about correctness.
- **Status.** **Verified.**

### A7 — The forced-reflow workaround for the Chromium `inert` + `transform` paint bug continues to work across browser updates

- **Assumption.** The `document.body.style.display` toggle in `LayerPanel.tsx` reliably prevents the paint-invalidation bug documented in `ENGINEERING_DECISIONS.md`, not just in the Chromium build tested this session.
- **Evidence.** Root-caused with a full elimination trail (dev vs. production build, DOM restructuring, CSS class changes, camera-system involvement all ruled out individually). **Updated in Milestone 5:** the original `requestAnimationFrame`-scheduled version of this fix was re-tested on a real content-bearing interaction and failed — traced, via a clean isolated experiment, to rAF never firing at all on a `document.hidden` tab (not merely throttled). Replaced with `setTimeout(fn, 0)`, which is not visibility-gated, and re-verified working under the exact condition that broke the rAF version. Still not tested against other browser engines or future Chromium versions.
- **Confidence.** **High** (raised from Medium) — the mechanism itself was stress-tested this milestone, not just its end-to-end symptom; durability outside Chromium remains the open question.
- **Risk.** Low — unchanged reasoning: a fixed browser bug makes this a harmless no-op; a differently-behaving engine at worst brings back the visual glitch, not a crash.
- **Validation plan.** Re-test on Firefox and Safari before Version 1 ships; revisit if a future Chromium update changes behavior.
- **Status.** Pending.

### A8 — Real hotspot keyboard activation and Escape-to-close work correctly for real users

- **Assumption.** A real keyboard user can reach and activate a world hotspot with Enter/Space, and close the resulting panel with Escape.
- **Evidence, original.** Same reasoning as A1 — plain semantic elements, zero custom keyboard code for activation. Escape is handled via a `keydown` listener in `LayerPanel.tsx` (real code, not native-only).
- **Evidence, corrected — Milestone 7/8 (Falsification Before Confirmation).** The earlier blanket claim that "the tool's synthetic key events are confirmed malformed" was imprecise and is corrected here rather than repeated. Direct testing this session found the actual behavior is key-specific, not uniformly broken: a synthetic Escape keypress carries the **correct** `event.key: "Escape"` (`isTrusted: true`), and — when the panel was opened via a real `left_click`, not a JS `.click()` — pressing Escape genuinely closed the panel (URL reverted, `inert` flipped correctly) **and** returned focus to the real trigger button, both directly observed on the Research Journal hotspot. A synthetic Return/Enter keypress, by contrast, carries an **empty** `event.key` and `event.code` despite `isTrusted: true` — this specific key is what fails, not synthetic key events generally. So: **Escape-to-close is Verified** for the code path exercised (Research Journal, real click to open); **Enter/Space activation remains genuinely unverified**, now with a precise root cause instead of a vague one.
- **Milestone 8 addendum.** `LeadershipHotspot` is structurally identical to the other three (same component shape, no custom keyboard code), so the Escape/focus-return Verified finding above generalizes architecturally. It was not re-observed directly on Leadership in this session — a real click on the Leadership hotspot proved unreliable to reproduce in this particular tool/window configuration (coordinate drift traced to horizontal-scroll-offset staleness between the accessibility-tree snapshot and the click, not an app bug — see `ENGINEERING_DECISIONS.md` Milestone 8), so the open action for Leadership was exercised via `.click()` instead, which reproduced the already-documented A6 caveat (focus lands wherever had it before, not the trigger) rather than adding new information.
- **Full 4-panel audit, post-Milestone-8.** A dedicated keyboard/focus audit exercised all four panels (Desk, Knowledge, Research, Leadership) uniformly: each opens with focus moving to `#layer-panel-heading`; each closes via a dispatched `KeyboardEvent('keydown', {key: 'Escape'})`, correctly reverting the URL and toggling `inert`. New tool-environment finding in the process: the `computer` tool's real OS-level Escape keypress produced **zero** DOM events on this attempt (confirmed via a capturing listener) — traced to `document.hidden: true` on this Browser pane tab, the same persistent quirk already documented elsewhere in this project, not a regression of the Milestone 7 finding that real Escape keypresses work when they *do* arrive. A dispatched `KeyboardEvent` with the correct `key: "Escape"` property remains the reliable way to exercise the app's own `keydown` handler in this environment, and is what confirmed correctness on Knowledge, Research, and Leadership. This tests the application's logic correctly; it does not substitute for real-hardware confirmation that OS-level key events reach the page at all, which remains the open item below.
- **Confidence.** Low for Enter/Space activation (precise root cause, still unverified in effect). **High** for Escape-to-close on all four panels (raised from Medium on Leadership specifically) — each independently exercised this session, not just architecturally inferred.
- **Risk.** Low for Escape (Verified independently on all four panels now). Medium for Enter/Space, unchanged.
- **Validation plan.** Real-device test for Enter/Space specifically before Version 1 ships, same session ideally confirming real OS-level Escape delivery too (this session's `document.hidden` tool quirk prevented that specific confirmation, though the app-logic path is now verified four times over).
- **Status.** **Verified** (Escape-to-close, all four panels); Enter/Space remains Pending.

### A12 — Full keyboard Tab order across the whole page is correct and complete

- **Assumption.** Every interactive element is reachable via Tab, in a sensible order, with no element skipped or wrongly included.
- **Evidence.** Enumerated the full focusable-element set programmatically (respecting `inert`, `disabled`, and explicit `tabindex`) in the default (all-panels-closed) state: Contact → Resume → Desk → Knowledge → Research → Leadership → Clock/Coffee/Window/Reset (test harness) — 10 elements, matching exactly what should be reachable, no closed-panel content leaking into Tab order. Re-verified per-panel: each panel's internal focusable set is exactly Close plus that panel's own real interactive content (DeskPanel's 3 project toggles plus, once expanded, the "See the architecture" link and outbound GitHub link with `rel="noreferrer"`; LeadershipPanel's 4 capability toggles plus, once expanded, that capability's nested evidence-group toggles, correctly ordered immediately after their parent).
- **Confidence.** High — directly enumerated, not inferred from markup review alone.
- **Risk.** Low.
- **Validation plan.** None outstanding for structural correctness; real-device confirmation folds into the existing Enter/Space item above.
- **Status.** **Verified.**

### A9 — The Research Journal's status indicator reads correctly for a screen-reader user

- **Assumption.** The "● Active" status is understood by assistive technology, not just by sighted users who can see the colored dot.
- **Evidence.** **Verified structurally, not just visually:** the dot (`aria-hidden`) and the "Active" text label are both rendered, and the text label carries the actual information — a screen reader announces "Active" regardless of whether the dot renders or its color is distinguishable, satisfying `INTERACTION_SPECIFICATION.md`'s Research Journal accessibility requirement that status is "never conveyed by color alone." Not yet tested with a real screen reader, consistent with the broader Screen Reader gap already logged in `ACCESSIBILITY_CHECKLIST.md`.
- **Confidence.** High for the markup being correct; unchanged Unknown for real screen-reader behavior (inherits the existing, already-logged gap rather than introducing a new one).
- **Risk.** Low.
- **Validation plan.** Folded into the existing Milestone 10 screen-reader audit already scoped in `IMPLEMENTATION_PLAN.md` — not a new validation task.
- **Status.** Pending.

### A10 — "Joint Secretary, UNESQUO Debating Society" is accurate and current

- **Assumption.** This title, carried in the portfolio's Leadership content since before Milestone 8, correctly describes a real, current or held role.
- **Evidence.** Does not appear in the updated, authoritative Debate/MUN CV used to rebuild Leadership content post-Milestone 8 — that CV's absence of a claim isn't proof the claim is false (the CV is scoped to MUN/debate achievements specifically, not society positions generally), but it's also not independent confirmation. Kept in the shipped content at the user's explicit direction ("Keep. Mark internally as Pending Secondary Verification. Do not remove it simply because it is absent from the MUN CV") rather than removed or independently corroborated.
- **Confidence.** Low-Medium — real in the sense that it wasn't invented by Claude (it predates this session's work), but not verified against any source checked this session.
- **Risk.** Low — a wrong title on a portfolio is embarrassing if caught, not consequential otherwise; explicitly the user's informed call to keep it pending verification rather than an oversight.
- **Validation plan.** User to confirm directly, on their own timeline — this is a personal-fact verification, not something further tool investigation can resolve.
- **Status.** Pending Secondary Verification (explicit user-directed status, distinct from the project's usual Pending/Verified pair).

### A11 — "Deputy Editor-in-Chief" is a real, current title

- **Assumption.** `NARRATIVE_SYSTEM.md` (pre-Milestone-8 draft) and `PORTFOLIO_STRATEGY.md`/`CONTENT_HIERARCHY.md` (Phase 1 research) all mention this title, but it was never carried into `leadership.ts`'s shipped content at any point, including the original Milestone 8 build.
- **Evidence.** Absent from the updated MUN CV (expected — that CV doesn't cover editorial roles either). Never independently confirmed by any source this session has had access to, and — unlike Joint Secretary — the user's most recent Leadership-content approval message didn't mention it at all, so there's no explicit instruction to keep, verify, or drop it.
- **Confidence.** Low — real in the sense that it predates this session (not invented here), but genuinely unaddressed.
- **Risk.** Low.
- **Validation plan.** Ask the user directly whether this is still current before it's added to any shipped content — it currently isn't shown anywhere on the site, so there's no live claim to correct, only a dormant one in early design docs.
- **Status.** Unresolved — flagged, not acted on.

---

## Cross-Browser Compatibility Review (Production Hardening)

Source-level audit of every browser-sensitive feature actually used in the codebase, checked against real evidence (compiled CSS output, direct grep of `src/`) rather than assumed from a mental list of "things that are usually fine." Only Chromium is directly testable in this environment — every row below is explicit about what's Verified (works, observed) vs. Assumed (should work per spec/caniuse, not directly observed) vs. Not Applicable (feature isn't used at all, so there's nothing to verify).

### A13 — CSS transforms, overflow, pointer-events, URL API: safe by construction

- **Assumption.** These four categories need no further verification beyond what's already been done.
- **Evidence.** `transform: translate()/scale()` (camera, panels) is baseline CSS with universal support, including legacy browsers — no vendor prefix needed for years. `overflow: hidden/auto/visible` is equally universal. `pointer-events: none/auto` (Tailwind's `pointer-events-none/auto`) has been supported in every evergreen browser for a decade+. The URL state (`useLayerStack.ts`) uses `URLSearchParams` via Next.js's own `useRouter`/`useSearchParams` — Next.js abstracts the actual navigation API, and `URLSearchParams` itself has universal modern support.
- **Confidence.** High.
- **Risk.** None realistically.
- **Status.** Verified (by construction — these features have no meaningful compatibility surface left to test).

### A14 — `ResizeObserver` and `position: sticky`/`fixed`: not applicable

- **Assumption.** N/A — checking whether these are used at all.
- **Evidence.** Grepped the full `src/` tree: zero uses of `ResizeObserver`, `position: sticky`, or `position: fixed` (one comment mentions "a fixed pixel offset" in prose, not CSS). The room's responsive behavior is entirely `aspect-ratio` + percentage-based sizing (see A16 below), not JS-measured. All positioning in the app is `relative`/`absolute`.
- **Confidence.** High.
- **Risk.** None — nothing to break.
- **Status.** Not Applicable.

### A15 — `focus-visible:` — real native pseudo-class, not a polyfill

- **Assumption.** The `:focus-visible` CSS pseudo-class (used throughout for keyboard-focus rings) renders correctly.
- **Evidence.** Confirmed via the compiled production CSS: Tailwind emits real `:focus-visible` selectors (`focus-visible\:outline:focus-visible{...}`), not a JS-based polyfill. `:focus-visible` has been supported in Chrome since 86 (2020), Firefox since 85 (2021), Safari since 15.4 (March 2022). This is the one modern-CSS feature in the app with the *most* recent baseline support date among everything checked.
- **Confidence.** High that it works in any browser released in the last ~4 years; genuinely unverified on anything older.
- **Risk.** Low for the target audience (a technical portfolio's visitors are unlikely to be running a 4+ year old browser), but not zero — worth naming rather than assuming away.
- **Validation plan.** None planned beyond noting the baseline; not worth engineering effort for pre-2022 browser support on this project.
- **Status.** Assumed (Verified for output correctness; Assumed for the actual browsers visitors will use).

### A16 — `aspect-ratio` CSS property (the room's core responsive mechanism)

- **Assumption.** The room container's `aspectRatio: "288 / 144"` inline style correctly locks the establishing shot's proportions at every viewport width.
- **Evidence.** Directly observed working correctly at 1280px, 768px, and 400px viewports during the Responsive Layout Polish pass (`ENGINEERING_DECISIONS.md`) — but only in Chromium. `aspect-ratio` has been supported in Chrome/Edge since 88 (2021), Firefox since 89 (2021), Safari since 15 (2021) — a similar baseline to `focus-visible`.
- **Confidence.** High in Chromium (directly observed); Assumed elsewhere per spec support tables.
- **Risk.** Low-Medium if wrong — no `aspect-ratio` support would mean the room either doesn't maintain its proportions or (more likely, since there's no explicit fallback height) collapses to zero height, which would be a real, visible failure, not a subtle degradation. Worth a real cross-browser check before Version 1, not just a spec-table assumption.
- **Validation plan.** Firefox/Safari visual check before Version 1 ships (folds into the existing A3/A7 cross-browser validation plan already on record).
- **Status.** Assumed.

### A17 — `inert` attribute (closed-panel exclusion from Tab/AT) — the least-supported feature in the codebase

- **Assumption.** The `inert` HTML attribute (`<div inert={!isOpen}>` in `LayerPanel.tsx`) correctly removes closed panels from Tab order and assistive-technology traversal in every browser a visitor might use.
- **Evidence.** Functionally verified extensively in Chromium this session (the full keyboard/focus audit). `inert` is the **most recently baseline-supported** feature in this entire codebase: Chrome since 102 (May 2022), Firefox since 112 (April 2023), Safari since 15.5 (May 2022) — meaningfully newer than `focus-visible` or `aspect-ratio`. React 19 passes the attribute through natively (no polyfill in this codebase).
- **Confidence.** High in Chromium. Genuinely the **lowest** confidence of any browser-support item in this review for older-but-still-recent browsers, specifically Firefox versions before April 2023 — a real, non-trivial population two-plus years ago, less so now but not zero.
- **Risk.** Medium — if `inert` silently fails to apply in an unsupported browser, closed panels' content would remain keyboard/AT-reachable, a real accessibility regression, not just a cosmetic one. This is the single highest-priority item in this whole cross-browser review to verify on a real non-Chromium browser before Version 1 ships.
- **Validation plan.** Explicit real-browser check (not just visual — verify `inert` content is genuinely excluded from Tab) on Firefox and Safari before Version 1. Flagging this as higher-priority than the other Assumed rows here, specifically because it's an accessibility mechanism, not a visual one — a silent failure here is worse than a silent visual imperfection.
- **Status.** Assumed — and the most important one in this review to resolve with real hardware.

### A18 — `backdrop-filter` (panel blur) — correctly vendor-prefixed

- **Assumption.** `LayerPanel`'s `backdrop-blur-sm` renders a blur effect in Safari, which historically required a `-webkit-` prefix.
- **Evidence.** Checked the actual compiled production CSS, not assumed: Tailwind v4 emits both `-webkit-backdrop-filter` and unprefixed `backdrop-filter` for this utility. Safari has required (and still accepts) the prefixed form for longer than most engines; both being present means this isn't a real risk.
- **Confidence.** High.
- **Risk.** Low — worst case if a browser supports neither form, the panel simply loses its blur and shows a plain translucent background (`bg-white/95` still applies), a graceful degradation, not a breakage.
- **Status.** Verified (compiled output confirmed correctly prefixed).

### A19 — `image-rendering: pixelated` — status unchanged, cross-referenced here for completeness

- Already tracked as A3 (this review didn't find new evidence, just confirmed the existing entry is still accurate and belongs in this consolidated review). See A3 above.

### A20 — Resume PDF preview (`ResumePanel.tsx`'s `<iframe>`) depends on the visitor's browser having a working native PDF viewer

- **Assumption.** `<iframe src={DOCUMENTS.resume.src}>` renders the resume inline in every browser a visitor might use, per the original brief's explicit "allow visitors to preview first" requirement.
- **Evidence.** Reported blank/black in the user's own Claude Desktop browser pane, then independently reproduced in this project's own testing browser (also Electron-based). Root-caused, not guessed: `iframe.contentDocument` reached `readyState: "complete"` with the correct `contentType: "application/pdf"`, and Chrome's real PDF-viewer extension (`mhjfbmdgcfjbbpaeojofohoefgiehjai`, confirmed present in `navigator.plugins`) had injected its own `pdf_embedder.css` link into the iframe's `<head>` — but never finished creating the actual `<embed>` viewer element, leaving the body empty. A direct top-level navigation to the raw PDF URL (bypassing the iframe, this component, and all app code entirely) produced the identical result: a forced "download instead of display" outcome. That isolates the cause to the embedding browser itself intercepting/redirecting PDF content at the application level, not to anything in this codebase — confirmed to be a genuine environment behavior, not assumed.
- **Confidence.** High that this specific failure is a Claude-Desktop-embedded-browser (Electron webview) behavior, not a code defect — the top-level-navigation test isolates it cleanly. Low-to-moderate confidence about whether it also affects other embedded/in-app browser contexts a real visitor might use (LinkedIn's, Slack's, or a corporate-managed browser's in-app webview) — genuinely unknown without testing one directly, and none is available in this environment.
- **Risk.** Low for the primary audience (an employer opening the portfolio link in their own regular desktop Chrome/Firefox/Safari/Edge — all of which render PDF iframes natively by default for real user profiles, unlike automation/embedded-webview profiles). Non-zero for visitors arriving via an in-app browser. Fully mitigated either way by the panel's existing Download/Open-in-new-tab/Print controls, which don't depend on inline rendering at all.
- **User decision, recorded rather than acted on unilaterally.** Presented three options — leave as-is, add a zero-dependency fallback message for when the native viewer fails to render, or add a `pdfjs-dist` canvas-based renderer for guaranteed cross-context rendering. **Chose to leave it as-is**, trusting that real visitors' standard browsers handle this natively (the normal, unremarkable case) rather than adding complexity for an environment-specific limitation of the tool used to test it.
- **Status.** Assumed, by explicit user decision — not silently accepted, not fixed. Revisit if a real visitor (not an embedded testing/preview browser) ever reports the same symptom.

### Summary: what actually needs a real non-Chromium check before Version 1

In priority order: **A17 (`inert`) first** — the only item with real accessibility-regression risk, not just visual risk. Then A16 (`aspect-ratio`) and A3/A19 (`pixelated`) together, since both are visual-correctness checks best done in the same real-browser session. A15 (`focus-visible`) and A18 (`backdrop-filter`) don't need dedicated verification — their compiled-output evidence is already strong enough.
