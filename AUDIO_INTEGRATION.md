# Audio Integration — Phase F.1, Parts 1–4

**Status:** This document fulfills Phase F.1's own Part 10 ask ("verify audio plays correctly... produce `AUDIO_INTEGRATION.md`") under the same filename an earlier pass already used. Distinguished explicitly, the same reconciliation pattern already applied to `PERFORMANCE_REVIEW.md`/`ACCESSIBILITY_REVIEW.md` in Phase C: the Phase B version (preserved in full below the divider) recorded a one-time status check confirming the ambient system was still blocked on a missing asset. That blocker is now resolved — this pass supersedes it with the real, wired, three-file audio system Phase F.1 shipped.

---

## What changed

Phase B's `AUDIO_INTEGRATION.md` left off with `AMBIENT_TRACK_SRC` as an empty string and a six-track plug-and-play catalog (`AMBIENCE_TRACKS`, built in Phase C) sitting ready for real files that never arrived. Phase F.1's brief changed the requirement entirely: not "wire up whichever ambience tracks eventually show up," but "the supplied 55-second piano loop is now the only ambient soundtrack... remove the idea of multiple ambience selections." The six-track catalog was removed outright, not deprecated — `src/lib/audio.ts` no longer has an `AmbienceId` type, an `AMBIENCE_TRACKS` record, or an `ACTIVE_AMBIENCE`/`ACTIVE_TRACK` selection concept of any kind. In its place:

```ts
// src/lib/audio.ts
export const AMBIENT_TRACK_SRC = "/audio/ambient-piano.mp3";
export const AMBIENT_VOLUME = 0.35;
export const FADE_IN_MS = 1600;
export const FADE_OUT_MS = 1000;
export const STORAGE_KEY = "the-studio:ambient-audio";

export const POPUP_OPEN_SRC = "/audio/popup-open.mp3";
export const POPUP_CLOSE_SRC = "/audio/popup-close.mp3";
export const POPUP_SFX_VOLUME = 0.25;
```

Three real files, supplied directly by the user and used unmodified per the brief's own explicit instruction ("Use these assets directly. Do not replace them. Do not generate alternatives."), now live in `public/audio/`:

| File | Role | Verified on disk |
|---|---|---|
| `ambient-piano.mp3` | Part 1 — the sole ambient loop | 1,119,360 bytes |
| `popup-open.mp3` | Part 2 — paper swish, plays on every popup open | 81,920 bytes |
| `popup-close.mp3` | Part 2 — plays on every popup close | 25,077 bytes |

Verified via `ls -la public/audio/` after copying, not just trusted from a script's own "done" output — this session's own established discipline (see `ENGINEERING_DECISIONS.md`'s Phase F.1 entry) after Phase D's silent asset-loss incident.

## Part 1 — Ambient music, one track, gramophone-gated

`useAmbientAudio.ts`'s public shape is unchanged from every prior phase (`{ isPlaying, toggle, hasRealTrack }`), so the Gramophone component itself needed zero changes to its audio-consuming logic. What changed underneath it:

- `fadeTo`'s signature grew an explicit duration parameter — `fadeTo(target, durationMs, onDone?)` — so the open fade (`FADE_IN_MS`, 1600ms) and the close fade (`FADE_OUT_MS`, 1000ms) are two distinct, named durations rather than one shared constant, matching the brief's own asymmetric spec ("1.5–2 second fade in; 1 second fade out").
- No playlist, no selector, no settings menu, no volume slider exists anywhere in the codebase — confirmed by the same removal that deleted the six-track catalog; there was never a UI for track selection to begin with (Phase C's catalog was selectable only by editing `ACTIVE_AMBIENCE` in source), so nothing needed to be hidden, only the underlying data model needed to shrink to one track.
- **Persistence.** `STORAGE_KEY` ("the-studio:ambient-audio") stores the boolean enabled state. Confirmed present in `localStorage` on a live page load via `Object.keys(localStorage)` — see the Part 10 verification section below.
- **No-autoplay-until-interaction.** Unchanged from every prior phase's architecture: the `<audio>` element is created but never `.play()`-ed until `toggle()` is called by a real user gesture. Restoring `true` from `localStorage` on mount sets the *intent* to resume, not an immediate autoplay — the actual `.play()` call still waits for the first user interaction, per the brief's explicit "if previously enabled, resume automatically after the first user interaction" (not "resume immediately on load").
- **Seamless looping.** `<audio loop>` — native browser looping, not a manual `timeupdate`-driven restart, so there is no JS-timing gap at the loop boundary.

## Part 2 — Popup audio, centralized

`usePopupAudio.ts` is new this phase, and is a Workspace-root hook, not a per-panel one:

```ts
export function usePopupAudio(activeLayer: string | null) {
  // two <audio> elements created once; watches activeLayer directly,
  // not each panel's own derived isOpen boolean
}
```

Why centralized, not per-panel: `Workspace.tsx` has exactly one `activeLayer: string | null` value at any time (the Layer Engine's own invariant, unchanged since Milestone 4). A direct panel-to-panel switch — clicking the Corkboard while the Research panel is already open — changes `activeLayer` from `"research"` to `"about"` in a single render. If each panel watched its own `isOpen` boolean independently, that one transition would look like two simultaneous, unrelated events (Research's `isOpen` going `true→false`, About Me's going `false→true`), and both a close sound and an open sound would fire together — exactly the "noisy" failure Part 3 rules out. Watching the single shared `activeLayer` string instead means the hook sees one state transition, not two, and can special-case it: if `activeLayer` is non-null after the change, that's an open (regardless of what it was before), full stop — no close sound plays in that case at all.

Both `<audio>` elements are created once, in a mount-only effect, and reused: the open sound's `currentTime` is reset to `0` before every `.play()` call so a rapid successive open (Part 3's "restart cleanly") never plays over a still-finishing previous instance — one `HTMLAudioElement`, restarted, not one Audio object per click.

## Part 3 — Never noisy

Enforced structurally, not by a volume-ducking heuristic:

- One `<audio>` element per sound type (open, close) — there is no code path that can construct a second concurrent instance of either.
- The `activeLayer`-diffing logic in `usePopupAudio` (above) is what prevents the close-then-open double-fire on a direct switch; it is the single mechanism Part 3's whole "never layer multiple paper sounds" requirement rests on.
- Both SFX volumes are fixed at `POPUP_SFX_VOLUME = 0.25` (mid-point of the brief's 20–30% range) — not adjustable, so there is no way for a rapid sequence of opens to compound in perceived loudness the way overlapping full-volume clips would.

## Part 4 — Camera synchronization

`usePopupAudio` fires from the same `activeLayer` change that also drives `useCamera`'s own target-recalculation effect — both are downstream of the identical `router.push`-driven URL state, so they are not two independently-timed systems that happen to usually agree; they observe the same state transition in the same render pass. The open sound and the camera's pan both begin from that one state change, which is what makes "Paper Swish begins → Camera starts moving" read as one continuous interaction rather than two coincidentally-close ones — there's no intermediate polling or manual sequencing timer coordinating them.

## Verification

Structural/DOM-level, consistent with the same Browser-pane click-dispatch limitation documented across Phase C, Phase D, and reconfirmed this phase (`ENGINEERING_DECISIONS.md`) — a dispatched `.click()` on the Gramophone toggle did not change `aria-pressed`, and the `computer` screenshot tool itself timed out during this pass's own final check, matching Phase C's "screenshot tool was unavailable for the same duration" precedent. What was verified:

- `ls -la public/audio/` — all three files present with real, non-zero byte sizes (table above).
- `grep -rn "AMBIENT_TRACK_SRC\|POPUP_OPEN_SRC\|POPUP_CLOSE_SRC" src` — each constant has exactly one definition and resolves to a real path under `public/audio/`, confirmed to exist on disk.
- Live `localStorage` read on a fresh page load: `["the-studio:ambient-audio", "the-studio:visited-hotspots"]` — the ambient-audio key is present and namespaced correctly.
- `next build` clean; zero console errors or hydration warnings on a fresh load.
- **Not verified live this pass:** actual audio playback, actual fade timing, actual click-triggered open/close sounds. The wiring is code-reviewed and structurally sound, following the identical hook/effect pattern already proven live in earlier phases (`useAmbientAudio`'s core mechanism is unchanged since Phase A) — but a genuine "pressed play and heard the piano loop" confirmation could not be produced in this Browser-pane session. Flagged here rather than implied.

---

## Superseded record — Phase B's original entry, preserved for history

# Audio Integration — Phase B, Part 10

**Status:** One-time status check for this pass. The full system design lives in `AUDIO_SYSTEM.md` (Phase A) and is unchanged by Phase B — this document exists only to confirm that status explicitly, per the brief's own Part 10 ask, rather than let it go unaddressed.

---

## Status: still blocked on the same single missing asset

No real audio file was supplied with the Phase B request, exactly as none was supplied with Phase A's. Per Asset Truthfulness, none was fabricated this pass either. `src/lib/audio.ts`'s `AMBIENT_TRACK_SRC` remains `""`.

## What Phase B did and didn't touch in the audio system

- **Unchanged:** `useAmbientAudio.ts`, `lib/audio.ts`, the fade/persistence/gating logic, the "always muted by default, never autoplays" behavior — all exactly as built and verified in Phase A.
- **Touched, cosmetically only:** the gramophone's hover-brightness mechanism was rewritten from an unverifiable CSS `group-hover` attempt to a JS-state-driven one (`Gramophone.tsx`), and its muted/playing badge sprites were shrunk and repositioned to fix the "ghost popup" report (`ENGINEERING_DECISIONS.md`). Neither change touches playback, persistence, or fade behavior — `useAmbientAudio`'s public shape (`{ isPlaying, toggle, hasRealTrack }`) is identical to Phase A's.
- **Touched, non-functionally:** the playing-state glow keyframe duration was tightened from 3.5s to 3s as part of the Part 14 animation-timing pass (`globals.css`) — a visual-only change, not audio.

## Going live

Unchanged from `AUDIO_SYSTEM.md`'s own "Going live" section: add a file to `public/audio/`, set `AMBIENT_TRACK_SRC` to that path, and every gated code path activates automatically. That remains the entire integration step — this pass didn't need to touch it because nothing about the gating mechanism changed.

## Verification

Static, not re-tested live this pass: `grep -rn "AMBIENT_TRACK_SRC" src` shows exactly the one empty-string definition and its two consumers (`useAmbientAudio.ts`'s `hasRealTrack` check, nothing else) — the gating logic itself is untouched by this pass's edits, so the "zero network requests for a nonexistent file" behavior verified live in Phase A (`read_network_requests` after clicking the toggle) still holds architecturally. This pass's own click-interaction testing was constrained by the Browser-pane limitation recorded in `ENGINEERING_DECISIONS.md` — see that entry rather than assume a fresh live re-test happened here that didn't.
