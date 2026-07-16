# Audio System — Phase A

**Status:** One-time review record for the Phase A pass, not a living document (though it should be re-read and updated the day a real ambient track is added — see "Going live" below). Documents the ambient-audio system built this pass: a genuine new feature, explicitly approved as a scoped exception to the otherwise-frozen Version 1 feature set.

---

## What was actually supplied, and what wasn't

The brief described audio *concepts* — "soft vinyl crackle," "light rain," "coffee shop ambience," "lo-fi room atmosphere" — as examples of a mood, not as attached files. No audio clip was provided with this request. Per Asset Truthfulness (which applies to audio exactly as it applies to images — this project has twice already declined to fabricate visual assets that weren't supplied, and fabricating a stand-in sound file would be the same mistake), no audio file was invented. Per the explicit direction that followed ("build the system now, wire audio in later"), everything *except the actual sound* was built and is fully functional.

## Architecture

Two new files, both minimal:

- **`src/lib/audio.ts`** — configuration constants: `AMBIENT_TRACK_SRC` (currently `""`, empty — this is the one line that changes when a real file exists), `AMBIENT_VOLUME` (0.35, a reasonable ambient level, not full volume), `FADE_DURATION_MS` (600ms), `STORAGE_KEY` (the `localStorage` key).
- **`src/hooks/useAmbientAudio.ts`** — a hook returning `{ isPlaying, toggle, hasRealTrack }`. Owns exactly one `<audio>` element (created once in a `ref`, never duplicated — satisfies "no multiple audio instances, no duplicate playback" by construction, since there's only one place in the codebase that ever constructs an `Audio()` instance).

`Gramophone.tsx` consumes the hook and is the only UI surface for it — no second toggle exists anywhere else, so there's no risk of two controls disagreeing about state.

## Why it's silent right now, and why that's not a bug

With `AMBIENT_TRACK_SRC` empty, the hook's `hasRealTrack` flag is `false`, and every place that would touch the underlying `<audio>` element (`useEffect` that constructs it, `fadeTo`, the `play()`/`pause()` calls inside `toggle`) is gated behind that flag. The hook still manages `isPlaying` state, `localStorage` persistence, and the gramophone's visual state (badge, glow, bounce) fully — clicking the gramophone today toggles all the visual feedback correctly, it just has no sound to play yet, and the code never attempts to fetch or play a file that doesn't exist. This was verified, not assumed: `read_network_requests` after clicking the toggle shows zero requests for any audio file, and `read_console_messages` shows zero errors or warnings from the interaction.

## Default state and autoplay policy

Always muted by default, on every visit, verified via `useState(false)` as the hook's initial value (not read from `localStorage` synchronously — see the code comment in `useAmbientAudio.ts` for why: reading `localStorage` in the initializer would make a returning visitor's first client render disagree with the server-rendered HTML, a real hydration-mismatch risk, not a hypothetical one). The stored preference is re-applied in a `useEffect` immediately after mount instead — client-only, post-hydration, so the visible UI settles into the right state within one frame without ever risking a server/client mismatch.

Actual playback is never started programmatically — not on mount, not from the persistence-restore effect. It only ever starts inside `toggle`, which is only ever invoked from a real click or keydown on the gramophone button. This satisfies "must never autoplay unexpectedly" by construction: there is no code path that calls `.play()` without a fresh user gesture in the same call stack, and modern browsers would block an autoplay attempt anyway — this design doesn't rely on that browser behavior as a safety net, it simply never attempts it.

## Fade in / fade out

A `requestAnimationFrame`-driven linear interpolation of `audio.volume` over `FADE_DURATION_MS` (600ms), implemented in `fadeTo()`. Any in-flight fade is cancelled (`cancelAnimationFrame`) before a new one starts, so rapidly toggling the gramophone can't produce two competing fades fighting over the volume value — the specific mechanism "no audio pop" requires. Not yet audible-tested against a real track, for the obvious reason (none exists) — the interpolation math itself was verified by reading the implementation, not by ear.

## Persistence

`localStorage`, key `the-studio:ambient-audio`, value `"playing"` or `"muted"`. Verified live: toggling the gramophone, then reloading the page, correctly restores the toggle's visual state (`aria-pressed`, `aria-label`, badge sprite) without needing to click again.

## Gramophone — the visual/interaction half

See `VISUAL_VERIFICATION.md` and `ENGINEERING_DECISIONS.md` for the asset-processing story (cropped from a user-supplied sheet, background-keyed, legibility-tested at 18px). Interaction-relevant details:

- **Not a hotspot.** No panel, no camera focus target, no `LayerPanel` involvement — a real room object with a click handler, architecturally closer to `PersistentActions` than to `DeskHotspot`, except it's rendered inside the camera-panned layer (so it moves with the room) rather than fixed to the viewport.
- **States communicated two ways**, deliberately redundant: the corner badge sprite (a real cropped asset — a red X for muted, a green note for playing) and a CSS animation class (`.gramophone-playing`) applied only while playing. Neither depends on the other, so a user relying on either signal gets the correct state.
- **The animation is a bounce, not a spin** — a real design correction made mid-implementation, not the original plan. The gramophone sprite is one flat image with the horn, cabinet, and record disc all baked into a single crop; animating a full-body rotation would visibly spin the horn and wooden base along with the disc, which is mechanically wrong, not just a style choice. The brief's own "small rotation OR bounce" phrasing explicitly allows either, so this substitution satisfies the actual requirement rather than working around it.
- **Reduced motion**: the bounce and the pulsing glow both drop out; a static, non-animated glow remains as the sole playing-state motion-free signal, consistent with every other animation in this codebase (`idle-pulse`, `boot-line`, `blueprint-unroll` all follow the same "remove the motion, keep a static equivalent where one exists" pattern).
- **Touch target**: percentage-sized to scale with the room like every other sprite, with a `min-width`/`min-height: 44px` floor added after live measurement showed it dropping to 43px at 540px viewport width — see `RESPONSIVE_AUDIT.md`.

## Going live — what changes when a real track exists

1. Add the file to `public/audio/` (a new folder — doesn't exist yet, nothing to register prematurely).
2. Set `AMBIENT_TRACK_SRC` in `src/lib/audio.ts` to that path.
3. That's the entire change. `hasRealTrack` becomes `true` automatically, and every gated code path (the `<audio>` element construction, the fade, the `play()`/`pause()` calls) activates with no other code change required — verified by reading the implementation: every one of those gates checks the same single `hasRealTrack` boolean, computed from the same single constant.

## What this pass did not do

No real audio file was fabricated, sourced, or licensed — that was never in scope for an engineering pass, and doing so would have meant inventing content the user explicitly didn't provide. No audible testing occurred, for the same reason. No Web Audio API graph (multiple tracks, crossfading between ambience types, spatial audio) was built — the brief described one ambient loop, and building more than that would be scope expansion beyond what was asked, not polish.
