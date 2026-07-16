# Accessibility Audit — Phase A

**Status:** One-time review record for this pass — the living, ongoing accessibility record remains `ACCESSIBILITY_CHECKLIST.md`, updated in parallel with this document, not superseded by it. Everything below was verified against a fresh production build; anything not verified is labeled as such, not rounded up.

---

## Keyboard navigation

**Verified.** Every interactive element in the app is a real `<button>` or `<a>` — confirmed by source grep, zero `<div onClick>` patterns exist anywhere in the codebase. Native elements get correct keyboard behavior (Tab reachability, Enter/Space activation, native focus) without any custom handling required, and this project deliberately never adds custom keydown handling that would need to reimplement what the browser already does correctly — the only custom `keydown` listener in the app is the panel's `Escape` handler, which is additive, not a replacement for native Tab/Enter/Space.

**Real gap closed this pass, not previously caught:** the panel heading `id` was a hardcoded string shared across all four simultaneously-mounted `LayerPanel` instances — invalid HTML (duplicate IDs), and `aria-labelledby` on three of the four panels pointed at the wrong element. Found while reviewing the panel for this audit, fixed with `useId()`. See `ENGINEERING_DECISIONS.md` for the full story.

## Tab order / Shift+Tab / keyboard traps

**Verified, no traps possible by construction.** `grep -rn "'Tab'|\"Tab\"" src/` returns zero matches — there is no code anywhere that intercepts, redirects, or reacts to the Tab key. Since nothing in the codebase touches Tab handling, Shift+Tab is guaranteed to work identically to native browser behavior (there's no custom logic that could special-case forward-Tab without also handling backward-Tab correctly, because there's no custom logic at all). The only focus manipulation in the codebase is two one-shot `.focus()` calls (move to heading on panel open, restore to prior element on close) — neither loops, neither re-triggers on subsequent Tab presses, so neither can trap focus.

## Escape

**Verified live**, all four panels, this pass: dispatching a real `Escape` keydown event while a panel is open closes it (URL reverts, `inert` re-applied) — confirmed via direct DOM inspection after the event, not assumed from the listener's presence. Re-confirms a prior session's finding (`ACCESSIBILITY_CHECKLIST.md`), not a first-time check.

## Focus restoration

**Verified for Desk this pass, via a genuine `left_click`** (not a JS-triggered `.click()`, which was found mid-audit to not reliably move focus onto the clicked button the way a real click does — see `INTERACTION_FLOW.md`'s methodology note): opening moves focus to the panel heading, closing returns it to the Desk hotspot button, not to `<body>`. Research's equivalent was verified via a real click in a prior session (`ACCESSIBILITY_CHECKLIST.md`) and re-confirmed structurally sound here — `LayerPanel` has zero per-hotspot branching, so the mechanism that works for Desk and was previously verified for Research necessarily works identically for Knowledge and Leadership.

## Screen reader labels / ARIA / semantics

**Verified.** Every hotspot has a descriptive `aria-label` beyond its visual affordance (e.g., "Open the Desk — projects"). The gramophone's label changes with its actual state (`"Play ambient audio"` / `"Mute ambient audio"`) and carries `aria-pressed`, correct toggle-button semantics — confirmed live after clicking it, not just read from source. The panel's Close button now has an explicit `aria-label="Close"` (previously relied on visible "Close" text alone, which worked but wasn't as robust once the visible label became an icon-first "✕" this pass). The outside-click backdrop is `aria-hidden="true"` with no `tabIndex` — deliberately invisible to assistive tech, since it's a pure convenience click target with a fully-equivalent alternative (the Close/Done buttons, Escape) already available.

## Reduced motion

**Verified in code**, consistent with every prior pass on this project: `.motion-transition`, `.idle-pulse`, `.boot-line`, `.blueprint-unroll` all collapse under `prefers-reduced-motion: reduce`. The two new animations this pass — the panel's backdrop fade and the gramophone's playing-state bounce/glow — both follow the identical pattern: the backdrop's fade shares the `.motion-transition` class (same reduction as every other transition in the app), and `.gramophone-playing`'s own reduced-motion block removes the bounce/glow-pulse entirely, leaving a static (non-animated) glow — the same "remove the motion, keep a static equivalent" approach already used everywhere else. Not verified against a real OS-level reduced-motion toggle in this environment (no such control is exposed to this test tool) — logged as Verified-in-code, not Verified-in-effect, an honest distinction this project has drawn before (`ACCESSIBILITY_CHECKLIST.md`).

## High contrast compatibility

**Not separately tested** — this environment has no OS-level "forced colors"/high-contrast-mode toggle available to test against. What's verifiable from the code: no information in this app is conveyed by color alone (the gramophone's state uses a badge sprite *and* an aria-pressed/aria-label pair *and* an animation class, not color alone; the panel's focus rings use `outline`, which forced-colors mode generally preserves rather than overrides). Logged as Unknown-in-effect, Reasonable-by-design — not claimed as Verified.

## Touch targets

**A real defect found and fixed** — see `RESPONSIVE_AUDIT.md` for the full measured before/after. Six elements (panel Close, panel Done, the gramophone toggle, Contact, Resume, and — at the narrowest required width — all four content hotspots) measured below the ~44px floor at one or more of the 10 required breakpoints. All six now carry an explicit `min-width`/`min-height: 44px` floor, re-verified at 0 failures across all 10 widths on a fresh production build.

## Semantic HTML

**Verified**, unchanged conclusion from prior passes: `role="dialog"` + (now per-instance-unique) `aria-labelledby` on panels, real heading elements (`<h1 class="sr-only">`, `<h2>` per panel), real `<button>`/`<a>` throughout.

## Color contrast

Already measured this project's most recent prior pass (`FINAL_DEPLOYMENT_AUDIT.md` / `ACCESSIBILITY_CHECKLIST.md`): 0 real-content contrast failures in either light or dark mode, measured via canvas-based color compositing across 23 text nodes. Not re-measured this pass since no text color, background color, or panel chrome color changed — the new UI (Close/Done buttons, ESC glyph) reuses the exact same `zinc`/`amber` palette and border/hover treatment already measured clean.

## Browser compatibility

See `INTERACTION_FLOW.md`'s Browser Compatibility section — Chromium-verified this pass (the only rendering engine available in this environment), source-reviewed for Firefox/Safari/mobile browser compatibility, with the one already-known real risk (`inert` attribute support) still the top pre-launch real-device item, unchanged from prior audits.
