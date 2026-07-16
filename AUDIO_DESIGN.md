# Audio Design — Phase C, Part 1

**Status:** One-time design/implementation record for this pass. `AUDIO_SYSTEM.md` (Phase A) and `AUDIO_INTEGRATION.md` (Phase B) remain the history of how the system got here; this document covers what Phase C added on top of both.

---

## What changed

### 1. A plug-and-play ambience catalog, not a single hardcoded track

`src/lib/audio.ts` now exports `AMBIENCE_TRACKS`, a typed record of six named ambiences — Study Ambience, Coffee Shop, Rain, Fireplace, Night, Forest — each just `{ label, src }`. `ACTIVE_AMBIENCE` picks which one the gramophone currently controls (`"study"`); `ACTIVE_TRACK` is the single value `useAmbientAudio.ts` and `Gramophone.tsx` actually read. Adding a seventh ambience later is one new catalog entry; switching which one plays is changing `ACTIVE_AMBIENCE`. No other file needs to change.

**Honest gap, not silently filled:** no audio clip was supplied with this request, same as Phase A's. Every `src` in the catalog is empty, including Study Ambience's — the one this pass was specifically asked to wire. Per Asset Truthfulness, none was fabricated. The full toggle/persistence/fade/resume system below is built and fully functional regardless, and activates the instant a real file is added — this is now true for any of the six catalog entries, not just Study.

### 2. Resuming after refresh without breaking "never autoplay"

The brief asks for two things that are in real tension: "audio resumes after refresh if enabled" and "never autoplay." Phase A's original design resolved this by restoring only the toggle's *visual* state on reload, never actual playback — which satisfied "never autoplay" but didn't actually satisfy "resumes... if enabled," since nothing ever made the sound come back without the visitor specifically clicking the gramophone again (and if they did, since the toggle already displayed "on," that click would have turned it *off*).

Phase C resolves this properly: `useAmbientAudio.ts` now arms a one-time, page-wide `pointerdown`/`keydown` listener whenever the restored preference says "was playing" and the audio element hasn't actually started yet. The first genuine interaction anywhere on the page — not necessarily the gramophone — resumes playback and removes the listener for the rest of the session. This still never autoplays by construction: nothing calls `.play()` without a real, trusted gesture already in the same call stack.

**A reasoned-through edge case, not special-cased away:** if the visitor's first interaction after reload happens to be clicking the gramophone to turn it *off*, both the resume listener and the button's own `toggle()` react to that one gesture — the resume fires, then the toggle immediately fades it back out. The audible result is a brief resume-then-fade rather than silence, which isn't wrong: the stored state genuinely was "on," so it dutifully came back, and the explicit click genuinely turned it back off.

### 3. The gramophone becomes the audio control, fully

- **Tooltip.** A native `title` attribute reading exactly "Ambient Audio: On" / "Ambient Audio: Off," per the brief's specified copy.
- **OFF-state desaturation.** `grayscale(65%)` applied only while muted, confirmed as a real, checkable style difference (not just a described intention) via the component's own inline `filter` logic — lifted to `brightness(1.15) grayscale(20%)` on hover so the muted object still gives hover feedback rather than reading as inert.
- **Hover glow, click, fade-in sequence.** Unchanged mechanically from Phase A/B (`useAmbientAudio`'s `toggle` → `fadeTo` → `audio.play()`), now using the shared `useHoverState` hook for the glow (see `MICROINTERACTIONS.md`'s Phase C section).
- **Musical note particles.** Two styled text glyphs (♪/♫ — not a fabricated sprite, matching this codebase's existing ✕/✓ glyph precedent), rendered only while playing, staggered ~2.6s apart within a 5.2s cycle so they read as "occasionally appearing," not constant. `aria-hidden`, removed entirely under `prefers-reduced-motion`.

### 4. Record rotation — flagged, not faked

The brief asks for the record disc to rotate slowly while the horn stays still. `gramophone.png` is one flattened crop with the horn, cabinet, and record disc baked into a single image (documented since Phase A) — there is no separate disc-only sprite to rotate independently, and rotating the whole image would visibly spin the horn too, which both Phase B and this phase's own brief ("do not rotate the horn") establish as wrong. Per "flag missing assets, continue implementation where possible": **recommended, not fabricated** — a small (~8-10px), circular, transparent-background record-disc sprite that could be layered under/over the existing body and rotated independently. Logged in `MISSING_ASSETS.md` would be the natural next step if this becomes a priority; until then, the playing state keeps the bounce + glow this project's brief has now twice explicitly sanctioned as the substitute ("small rotation OR bounce").

## Requirements checklist

| Requirement | Status |
|---|---|
| Begins only after explicit interaction | ✅ Unchanged from Phase A — `toggle` is the only caller of `.play()` |
| Never autoplay | ✅ True even for the new resume-on-refresh path — gated behind a real gesture |
| Persist preference in localStorage | ✅ Unchanged — `the-studio:ambient-audio` |
| Fade in / fade out | ✅ Unchanged — `requestAnimationFrame`-driven `fadeTo` |
| Mute state remembered | ✅ Unchanged |
| Survives panel opens/closes | ✅ By construction — `Gramophone` lives at `Workspace` root, never unmounts when a `LayerPanel` opens/closes |
| Survives camera movement | ✅ Same reasoning — the camera transform never touches the DOM subtree `useAmbientAudio`'s `<audio>` element lives in |
| Survives navigation | ✅ `?panel=X` query changes don't remount `Workspace` |
| Resumes after refresh if enabled | ✅ New this pass — see "resuming after refresh" above |
| Future ambience is plug-and-play | ✅ New this pass — `AMBIENCE_TRACKS` catalog |

## Verification

`lint`/`tsc --noEmit`/`next build` clean. Live DOM checks on a fresh production-equivalent dev server: gramophone renders with the correct `title`/`aria-pressed`, both `localStorage` keys (`the-studio:ambient-audio`, `the-studio:visited-hotspots`) present and correctly scoped, zero note-particle elements rendered while muted (correct — they're playing-state-only). Live click-driven verification (actually toggling playback, confirming the resume-on-refresh listener fires) was constrained by a Browser-pane tool limitation this pass — see `ENGINEERING_DECISIONS.md`'s Phase C entry — and rests on the mechanism's own reasoning plus the unit-level pieces (fade math, gating booleans) that Phase A already verified and this pass didn't touch.
