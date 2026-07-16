# Interaction Flow — Phase A

**Status:** One-time review record for this pass. Documents the verified end-to-end interaction flow for every hotspot plus the persistent actions, and the state-management guarantees behind them.

---

## The flow, end to end

1. **Discovery.** Every hotspot idle-pulses (a slow, 5-second opacity breathe) even before any interaction — the fix, established in an earlier milestone, for "how does a first-time visitor know this scene is interactive at all." Hover adds a visible amber border + tint; keyboard focus adds a visible amber outline (`focus-visible`, not `focus` — a mouse click doesn't leave a stray ring behind).
2. **Activation.** Click or Enter/Space on a focused hotspot.
3. **Camera pan.** `useCamera`'s `focus()` sets a new `{x, y, scale}` target; `CameraContainer` picks it up and transitions via CSS (`transform`, 500ms, the shared decelerating easing curve) — purely declarative, the camera has no idea what triggered the change.
4. **Panel opens**, simultaneously. `useLayerStack.open(id)` pushes `?panel=<id>` to the URL. The corresponding `LayerPanel` (all four are always mounted; only one is ever non-`inert`) transitions in from the right (500ms, same easing as the camera, so both movements read as one coordinated gesture, not two separate animations racing each other).
5. **Focus moves into the panel** — to its `<h2>` heading, which is focusable (`tabIndex={-1}`) but not part of the normal Tab order, matching the standard "move focus into a newly-opened panel, but don't leave a phantom extra Tab stop" pattern.
6. **The visitor reads**, scrolling the panel's content if it's long enough to need it — verified this pass to scroll in isolation from the panel's own header/title and footer/Done button (both `shrink-0`, outside the `overflow-y-auto` region), and never scrolls the page underneath (`pageScrollY` measured `0` throughout a scroll-region interaction, live).
7. **Closing**, by any of four equivalent methods, all calling the identical `onClose`:
   - **Click ✕** (top-right, now icon-first with an "ESC" keycap glyph beside it, not text-only)
   - **Click ✓ Done** (bottom of the panel — a second, equally valid close action, new this pass)
   - **Press Escape** (works from anywhere on the page while a panel is open, not just while focus is inside it)
   - **Click outside the panel** (a new backdrop this pass — click anywhere in the room while a panel is open)
8. **Camera resets** to the establishing shot (`CAMERA_IDENTITY`, 500ms) at the same time the panel slides back out (200ms — closing is deliberately faster than opening, "get out of the way quickly" vs. "deserves a moment to be noticed").
9. **Focus returns** to whatever was focused before the panel opened.

## State management guarantees, verified not assumed

- **Opening one panel always closes the previous one.** Not a special case that needed building — `activeLayer` is a single value (`useSearchParams().get("panel")`), so opening a second hotspot while one is already open simply overwrites it. No stacking is possible because there is nowhere for a stack to live.
- **No stale camera transforms.** The camera transform is a pure function of a fixed `CAMERA_IDENTITY` constant on reset — verified this pass by comparing the exact `style` attribute string before and after multiple full open/close cycles across different hotspots (Desk, then Leadership): byte-identical (`scale(1) translate(0%, 0%)`) every time. There is no accumulator anywhere in the camera code that could drift.
- **No stale URL state.** Verified live: Browser Back from `?panel=desk` correctly returns to `/` and closes the panel; Browser Forward correctly restores `?panel=desk` and reopens it — both confirmed via direct URL/DOM inspection after real `back`/`forward` navigation, not assumed from the `router.push` calls alone.
- **No race conditions found.** Rapid-fire interactions (opening a second hotspot immediately, closing via multiple methods in quick succession) were exercised during this pass's testing; the single-URL-param model made every sequence resolve to a well-defined final state — the worst observed symptom was a client-side navigation *reporting* delay under this specific test tool's own throttled-tab state (see the methodology note below), not an actual inconsistent application state.

## A real methodology finding, worth recording here

Mid-pass, testing focus-restoration by opening a panel via `element.click()` (a JS-triggered synthetic click, used throughout this session for reliable state-transition testing) consistently showed focus landing on `<body>` after closing, not on the trigger button — which looked like a regression. It wasn't: a JS-triggered `.click()` does not reliably move browser focus onto the clicked element the way a real pointer click does (this varies by platform even for real clicks — historically, macOS Safari doesn't focus a clicked button at all, only Tab does). Since the panel's `previouslyFocused.current = document.activeElement` correctly captured whatever *was* actually focused (nothing, since the synthetic click never focused the button), restoring to `<body>` was the *correct* behavior given that test methodology, not a bug in the component. Re-tested with a genuine `left_click` (dispatched through the Browser pane's real click path) for Desk this pass: focus correctly returns to the Desk button. Recorded here so a future session doesn't rediscover this as a false alarm.

## Browser compatibility

This environment provides one Chromium-based automated browser — every live verification claim in this document and its companions (`RESPONSIVE_AUDIT.md`, `ACCESSIBILITY_AUDIT.md`) was tested there, labeled **Verified** for Chrome/Edge (same rendering engine). Firefox, Safari, Mobile Chrome, and Mobile Safari were **not independently tested** — no real-device or alternate-engine testing tool exists in this session. Reviewed at the source level instead: nothing added this pass uses a proprietary or unusually-new CSS/JS feature (`useId()` has been in React since 18.0/all supported browsers; `min-width`/`min-height` and `backdrop`-style semi-transparent overlays are universally supported; the `inert` attribute — already flagged as this project's single highest-priority real-browser risk in `ASSUMPTIONS.md`, since it's Firefox-supported only from April 2023 onward — is unchanged by this pass, still the top item for an eventual real-device pass, not newly introduced or newly resolved here).
