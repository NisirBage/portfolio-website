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

- **Evidence.** `LOW_FIDELITY_EXPLORATION.md`'s accordion decision (Option C) for the Projects Layer expands *within* a single open layer, not by pushing additional layers on top of it — so project-detail depth is local state inside one Layer's content, not a second layer-stack entry. Reasoned from the frozen design docs, not yet built against.
- **Confidence.** Medium-High.
- **Risk.** Medium — if wrong, Milestone 6 would need to either extend `useLayerStack` to real multi-depth stacking or introduce a second, incompatible state shape, which `IMPLEMENTATION_RISKS.md`-style thinking would call a real (if contained) cost.
- **Validation plan.** Confirm when Milestone 6 (Projects Layer) is actually implemented.
- **Status.** Pending.

### A6 — `LayerPanel` correctly returns focus to the element that opened it

- **Assumption.** On close, focus returns to the actual trigger element (e.g., "Open dummy layer"), not to `document.body`.
- **Evidence.** Tested via a JS-dispatched `.click()`, which does not necessarily focus an element first the way a real mouse click does — `previouslyFocused.current` may have captured `document.body` instead of the real trigger in that specific test, which matches the observed result (focus landed on `<body>` after close). Not yet tested with a real click.
- **Confidence.** Low-Medium.
- **Risk.** Medium — a real accessibility regression if it turns out real clicks have the same problem, not just this test methodology.
- **Validation plan.** Re-test with an actual mouse click (or the Enter-key path once A1 is validated with real hardware) before Version 1 ships.
- **Status.** Pending.

### A7 — The forced-reflow workaround for the Chromium `inert` + `transform` paint bug (Milestone 4) continues to work across browser updates

- **Assumption.** The `document.body.style.display` toggle in `LayerPanel.tsx` reliably prevents the paint-invalidation bug documented in `ENGINEERING_DECISIONS.md` Milestone 4, not just in the Chromium build tested this session.
- **Evidence.** Root-caused with a full elimination trail (dev vs. production build, DOM restructuring, CSS class changes, camera-system involvement all ruled out individually) and verified fixed through the real React-driven interaction flow, not just manual DOM patching. Not tested against other browser engines (Firefox, Safari/WebKit) or future Chromium versions where the underlying bug may already be fixed or may manifest differently.
- **Confidence.** Medium — the workaround is evidenced, not guessed, but its durability outside the tested environment is unverified.
- **Risk.** Low — if the underlying browser bug is later fixed, this workaround becomes a harmless no-op, not a new bug; if it's present differently in another engine, worst case the visual glitch returns, not a crash.
- **Validation plan.** Re-test on Firefox and Safari before Version 1 ships; revisit if a future Chromium update changes behavior.
- **Status.** Pending.
