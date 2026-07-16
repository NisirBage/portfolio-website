# UI Sound Design — Phase F.1

**Status:** New deliverable, Phase F.1. Where `AUDIO_INTEGRATION.md` documents the technical wiring (what plays, from where, gated by what state), this document records the design reasoning behind *why* the sound system is shaped the way it is — the brief's own Final Design Goal ("the visitor should never consciously notice the sound system") is a design claim, not just an engineering one, and deserves its own record.

---

## The governing principle: sound as texture, not feedback

Most web UI sound design treats audio as a confirmation signal — a click plays a "ding" to confirm the click landed. That model is explicitly rejected by this brief. The three supplied sounds (a paper swish, a soft close click, a 55-second piano loop) aren't confirmation tones; they're material sounds — the sound a real object in a real study would make. A popup opening sounds like paper unfolding because, narratively, it *is* paper unfolding: every panel in this codebase is styled as a parchment/paper document (`UI_THEME.md`), so the paper-swish sound isn't decorating an abstract "modal opened" event, it's completing a physical metaphor the visuals already started.

This distinction shapes every implementation choice below. A confirmation-tone system would want the sound loud enough to notice and distinct enough to associate with the action. A texture system wants the opposite: quiet enough to sit under conscious attention (hence `POPUP_SFX_VOLUME = 0.25`, the brief's own 20–30% range), and materially connected to what's already on screen rather than an arbitrary earcon.

## Why three sounds and not more

The supplied asset sheet's own "Sound Theme Suggestions" section proposed five categories: Hover, Open Panel, Accordion, Copy, Gramophone. Only three real audio files were supplied (piano loop, paper swish, close SFX) — Hover and Copy/Accordion sounds were suggested but not provided. Per this project's Asset Truthfulness Protocol, no substitute or generated sound fills that gap; those two categories simply have no audio, and the visual feedback already built for hover states (`useHoverState`-driven brightness/transform changes) and the Toast notification (Part 6/7's new visual confirmation) carry that feedback load instead. A sound-per-interaction system with two real sounds and three silent categories would read as broken or unfinished; three sounds serving exactly the three things they were built for, with the rest carried visually, reads as a deliberate, complete design rather than a partial one.

## Why the ambient loop has no controls beyond on/off

The brief's Part 1 is unusually prescriptive for a design document: "No playlist. No music selector. No settings menu. No volume slider. Keep the experience intentionally simple." This isn't a scope-cutting shortcut — Phase C had already built a full six-track selectable ambience catalog (`AMBIENCE_TRACKS`), which Phase F.1 explicitly tore out. The reasoning, read against the Final Design Goal: a settings menu is administrative UI. It asks the visitor to think about the sound system as a system — to make a choice, weigh options, manage a setting. A single gramophone with one responsibility (off → on → off) asks nothing administrative of the visitor; it's a physical object they either touch or don't, the same as any other hotspot in the room. Removing the choice *is* the design decision, not a simplification made in spite of one.

## Why the fade times are asymmetric (1.6s in, 1s out)

The brief specifies "1.5–2 second fade in; 1 second fade out" as a hard requirement, but it maps onto a real perceptual asymmetry worth recording: a fade-in is an *invitation* — something arriving, allowed to take its time, since the visitor just took a deliberate action (clicking the gramophone) and isn't waiting on anything. A fade-out is a *departure* — the visitor has already decided to stop, so a long lingering fade would read as the system failing to respond to that decision promptly. The 1.6:1 ratio (roughly 60% longer in than out) isn't arbitrary polish; it encodes "arriving is unhurried, leaving is prompt" as a real timing difference.

## Why popup close plays on Done/ESC/Outside-click/Back but never on camera motion alone

The brief's Part 2 draws this line explicitly, and it maps onto a distinction the codebase already has structurally: `activeLayer` transitioning to `null` is a *closing* event; the camera resetting to its home framing is a *consequence* of that event, driven by the same `useCamera` effect that reacts to `activeLayer`, but on its own timeline (the pan animation). If the close sound were tied to camera motion instead of the `activeLayer` transition itself, it would fire late — after the panel has already visually started closing — and would also fire in any future scenario where the camera moves without a panel closing (there isn't one today, but the brief's phrasing suggests this was anticipated as a risk). Tying the sound to the state transition, not the animation, keeps it synchronized with the moment the visitor's action actually registers, which is what Part 4 calls "one continuous interaction."

## Why the sound is centralized instead of per-panel

Covered in implementation detail in `AUDIO_INTEGRATION.md`'s Part 2 section — recorded here as a design point, not just an engineering one: the brief's Part 3 requirement ("never layer multiple paper sounds") is fundamentally a *design* constraint on the experience, and the centralized-hook architecture is the mechanism that makes it actually true rather than usually true. A per-panel implementation could satisfy Part 3 in every case that gets tested and still have a latent double-fire bug in an untested transition; watching one shared state value at the root removes that class of bug by construction rather than by coverage.

## What the sound design deliberately does not do

- **No spatial/positional audio** — the paper swish doesn't pan toward the side of the screen the clicked object is on. The brief never asked for this, and adding it would move the system from "texture" toward "feedback," working against the stated goal.
- **No pitch or playback-rate variation between repeated plays** — the same swish sounds identical on the 1st and the 50th popup open. A texture is allowed to repeat identically; a real paper swish would too.
- **No audio cue for hover, focus, copy, or toast** — see "Why three sounds and not more," above. These are visual-only by design, not by oversight.
