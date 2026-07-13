# Microinteractions — The Studio

**Status:** Phase 2, Step 2. A small, fixed vocabulary of motion reused across every state — per your instruction, consistency over variety. This document is the canonical source for every timing value; where earlier documents (`EXPERIENCE_ARCHITECTURE.md`, `INTERACTION_SPECIFICATION.md`) specified durations individually, those numbers are reconciled here into one scale rather than left as scattered, potentially-drifting figures. Bespoke, per-object signature animations (the book sliding out, the clock hands sweeping) stay in `MOMENTS_OF_DELIGHT.md` — this document covers the connective tissue *around* those moments, not the moments themselves.

---

## The Timing Scale

Three bands, not a continuum — a fixed set is what makes consistency checkable instead of aspirational.

| Band | Duration | Used for |
|---|---|---|
| **Fast** | 150–250ms | Hover response, press/selection feedback, focus-ring appearance, return-to-Workspace |
| **Standard** | 400–600ms | Layer opens, Focus-state zooms — the default for any state change |
| **Slow** | 700ms | Reserved for exactly one moment: the Window's tilt-up-and-brighten. Everything else that might feel "special enough" for Slow stays at Standard — Slow is a single deliberate exception, not a tier other states can opt into. |

**Correction from earlier drafts:** `EXPERIENCE_ARCHITECTURE.md`'s Camera Philosophy and `INTERACTION_SPECIFICATION.md`'s per-object entries independently specified numbers in the 400–700ms range without a shared scale behind them (450ms for the Clock, 500ms for most zooms, 700ms for the Window). Those numbers weren't wrong, but they weren't provably consistent either. They're retained here, now explicitly mapped onto the three-band scale above — Clock's 450ms and the general 500ms zoom both round to **Standard**, and the Window's 700ms is confirmed as the **one intentional Slow exception**, not an unexplained outlier.

Exits are always faster than the entrance they reverse — roughly 40% faster, consistent with the already-specified 250ms return-to-Workspace following a 400–600ms Standard entrance.

---

## Hover

**Behavior.** A subtle lift (translate up 2px) plus a brightness increase (~8%), Fast band, ease-out. Identical parameters on every hotspot — the Desk, the Bookshelf, the Clock, the Leadership Wall, the Coffee Mug, the Window all lift and brighten by the same amount at the same speed.
**Purpose.** Confirms "this is clickable" without previewing content — the one-line label from `EXPERIENCE_ARCHITECTURE.md`'s Interaction Philosophy appears alongside this, not as a separate microinteraction.
**Consistency rule.** No hotspot gets a stronger or weaker hover treatment because it's "more important" — the Depth Index and Cognitive Load Budget already encode importance; the hover state's job is just affordance, and affordance shouldn't be graded.

## Focus (keyboard)

**Behavior.** A visible ring, same visual weight as the hover lift (not fainter, not louder) — a keyboard user gets an equally confident signal as a mouse user, per Accessibility Strategy's commitment to parity.
**Purpose.** Satisfies "never require precision clicking" directly: focus state must be legible enough that a keyboard user always knows exactly what they're about to activate.

## Selection (click/tap commit)

**Behavior.** A brief press-down (scale to 98%, 80ms) immediately on interaction, before the Layer-opening animation begins.
**Purpose.** Physical-feeling confirmation that the input registered, distinct from the (slower) consequence of that input. Without this, a Standard-band 500ms delay before anything visibly happens can read as unresponsiveness rather than intentional pacing.

## Layer Opening

**Behavior.** Standard band (400–600ms), entrance direction fixed by Step 1's docked-side-panel decision — layers always enter from the same edge, never varied per object. Content fades in slightly after the panel's motion completes, not simultaneously, so the visitor registers "something arrived" before "here's what's in it."
**Purpose.** The one microinteraction most visitors will experience the most times per session — its consistency matters more than any other single decision in this document.

## Layer Closing

**Behavior.** Reverse of opening, Fast band (~250ms, the already-specified return-to-Workspace timing) — faster out than in, universally.
**Purpose.** A visitor dismissing a layer already knows what they're going back to; there's no new information to let land, so there's no reason to slow the exit the way the entrance is paced.

## Loading

**Behavior.** No spinners, anywhere. The only content with real load weight (certificate images in the Leadership Layer) uses a blurred low-resolution placeholder that sharpens on load, not a loading indicator.
**Purpose.** A spinner is a game/app-loading-screen convention that would puncture the "continuous workspace" model this entire project is built on — Professional Before Playful applies here as directly as anywhere else in the spec.

## Idle Animations

**Behavior.** A single shared cadence — slow, 4–6 second loop — for every ambient element (the plant's sway, the mug's steam-rise once hovered). Nothing idle animates faster than anything else idle.
**Purpose.** A scene where different objects breathe at different speeds reads as busy/gamified even if each individual animation is subtle; one shared cadence keeps the room calm.

## Completion Feedback

**Behavior.** No toast, no checkmark popup, no badge. The object itself gains the "visited" glow already specified in `NARRATIVE_SYSTEM.md`'s Environmental Storytelling section.
**Purpose.** This is a direct reuse, not a new pattern — the whole point of Consistency Over Novelty is not inventing a second way to say "you did a thing" when the Environmental Storytelling system already has one.

---

## Summary Table

| Microinteraction | Band | Reused elsewhere as |
|---|---|---|
| Hover | Fast | — (this document is the source) |
| Focus | Fast | — (this document is the source) |
| Selection | Fast | — (this document is the source) |
| Layer opening | Standard | The default for every Focus-state zoom in Attention Flow |
| Layer closing | Fast | The "Return" shot in Attention Flow's vocabulary |
| Loading | N/A (no timed animation) | — |
| Idle | 4–6s loop, its own band | The Coffee Corner's steam-rise, the ambient plant |
| Completion | Reuses Narrative System's "visited glow" | — |

No new visual language is introduced here — every entry above either sets a number that earlier documents left implicit, or points back to a pattern already defined elsewhere. That's intentional: this document's job is reconciliation, not invention.
