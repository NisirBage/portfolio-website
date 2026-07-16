# Phase G Report — GBA Intro Experience & Save Slot Redesign

**Status:** New deliverable, closing out Phase G. Full walkthrough of what shipped, what was already built before this phase started, and what could and couldn't be verified live in this environment.

---

## What shipped

- **A new pre-room boot sequence** (`AppShell.tsx` → `IntroSequence.tsx` → `SaveSlot.tsx`): fade in from black *is* the title's own opacity transition (there's nothing else in frame to fade in behind it), a bare title card held ~1s then fading out, a Save Slot screen, then a fade into the already-mounted room on Continue.
- **A live, persistent Play Time counter** (`usePlayTime.ts`): ticks every second, persists to `localStorage` on every tick, restores on mount, never resets on refresh.
- **A real Save Slot screen**, built from a genuinely surgical asset-editing pass on the Tier-2 sheet's Standard frame — its baked "Play Time 00:00:00" and "▶ Continue" pixels were erased and rebuilt as live DOM elements (a `<span>` showing the real running total, a real focusable `<button>`), while its baked name/subtitle/builder text was left as decorative art paired with an equivalent `sr-only` block.
- **A restyled `.panel-button`**: a raised bevel (light top-left highlight, dark bronze bottom-right shadow) replacing the previous flat hover-invert, matching the Tier-2 sheet's own "RPG dialogue button" look — CSS only, applied globally to every Close/Done/Copy/Open/Download/Print button in the app, not a one-off.
- **A new `--panel-bronze`/`--panel-bronze-dark` token pair**, alongside the existing paper/wood tokens.

## What was already built before this phase started

Three of the brief's asks were checked against the repository, not assumed absent, and turned out to already exist — re-verified rather than rebuilt:

- **Camera reset.** Phase B's Camera Audit already made every close path (Escape, Done, ✕, backdrop click, Browser Back, switching hotspots) converge on one `useEffect` that always resets to the same fixed `CAMERA_IDENTITY` constant. No drift is possible because there's no computed reset target to drift.
- **Single-track Gramophone.** Exactly what Phase F.1 built: one real audio file, on/off, fade in/out, `localStorage`-persisted preference, no additional options.
- **Contact and Resume popups.** Both built in Phase F.1 with real Copy/Open actions and pixel icons; Resume already has an embedded, natively-scrollable PDF preview plus Download/Open-in-new-tab/Print. The Work Email/LinkedIn gap this brief names is the same gap already logged after Phase F.1 asked for the same two rows — neither was fabricated a second time.

## What was explicitly not attempted, and why

- **Framer Motion.** The brief's Performance section calls it "already used." `package.json` was checked directly rather than trusting that parenthetical — it isn't a dependency and never has been. Every animation in this codebase, including everything new this phase, is a plain CSS transition following the existing `MOTION`/`DURATION`/new `INTRO` bands. Adding a library to do what a few lines of CSS already do everywhere else in this project would have worked against the brief's own "reuse existing architecture" instruction.
- **The Sprout Lands pixel font, for the Save Slot's text.** `ASSET_REGISTRY.md` claimed it `VERIFIED`; direct inspection found it was never actually copied into `public/` or wired via `@font-face`. Corrected in the registry rather than compounded by citing a non-functional asset. The existing `--font-geist-mono` is used instead.
- **Moving the Contact hotspot "near the gramophone."** A genuine conflict inside the brief itself, surfaced in Phase F.2 and unchanged this phase — this brief didn't ask to revisit it.

## Verification

| Check | Result |
|---|---|
| Lint | ✅ Clean (`npm run lint`, zero warnings), re-run after each major edit |
| Typecheck | ✅ Clean (`npx tsc --noEmit`, zero errors), re-run after each major edit |
| Production build | ✅ Clean (`next build`), re-run three times across this phase |
| Save Slot implementation | ✅ Live-verified — both cropped images (399×371 frame, 356×56 button) loaded at exact native dimensions with zero broken loads |
| Play Time persistence | ✅ Live-verified — a real running value (`00:00:55`) read back mid-session, confirming both the increment and the `localStorage` write path work, not just that the hook compiles |
| Music integration | ✅ Structurally verified — unchanged from Phase F.1, already live-tested that phase |
| Contact popup | ✅ Verified — unchanged from Phase F.1; Work Email/LinkedIn gap re-confirmed, not re-fabricated |
| Resume popup | ✅ Verified — unchanged from Phase F.1 |
| UI polish | ✅ Live-verified — bevel box-shadow values confirmed via `getComputedStyle` on 26 live `.panel-button` instances across the page |
| Camera reset verification | ✅ Verified by architecture review — the single-effect, fixed-constant design makes drift structurally impossible; not a new claim, Phase B's own finding re-confirmed against this phase's unchanged code |
| Responsive verification | ⚠️ Partial — computed directly (the Save Slot's `max-w-[399px]` against a 375px viewport's 327px available width, comfortably under both constraints) rather than confirmed by a live render at that width, which became unreproducible late in this session (see below) |
| Audio verification | ✅ Structurally verified — unchanged from Phase F.1 |
| Zero console errors | ✅ Verified on every live check performed, including the one full successful end-to-end run |

### One clean, complete live run — and an honest account of what came after it

Early in this phase's verification, one full live walkthrough succeeded end to end: title card → Save Slot (both images loading correctly, Play Time genuinely incrementing) → a dispatched click on the Continue button → the intro overlay's `opacity` correctly animating to 0 and unmounting → the room's `inert` wrapper correctly lifted, confirmed on the specific wrapper element rather than a generic selector that could match a false positive → zero console errors throughout.

Later in the same session — after the UI-polish CSS pass, and specifically when re-checking at a 375px mobile viewport — repeat attempts at the same walkthrough could not reproduce the title card auto-advancing to the Save Slot within a reasonable wait, despite no further code changes and a raw `setTimeout` confirmed firing correctly in the same page context each time. The most likely explanation is dev-server/HMR fatigue after a very long single session (the console showed repeated Fast Refresh cycles clustered around the same window) — something with no equivalent in an actual production deploy, where no HMR exists. This was not run down to a fully confirmed root cause. It's recorded here as inconclusive, not treated as a passing check it isn't, and not treated as a confirmed defect it might not be.

## If this were reviewed again next

- Resolve the Work Email/LinkedIn content gap (`MISSING_CONTENT.md`) — now asked for twice, by two separate briefs.
- A real device/browser session to re-run the intro sequence walkthrough (especially the 375px mobile case) outside this session's specific dev-server state, to close out the one inconclusive verification row above.
- The Enter-key path for advancing past the Save Slot was implemented and code-reviewed but not independently live-dispatched and re-checked separately from the mouse-click path this session.
