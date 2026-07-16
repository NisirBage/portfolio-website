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

---

## Phase C, Part 2 & 6 — reconciliation against actual implementation

**Status of this section:** appended, not a rewrite of the design-phase content above — per "repository reality overrides prompts," this reconciles the original spec against what actually shipped through Phase A/B/C, the same way `ENGINEERING_DECISIONS.md` is this project's living implementation counterpart to its frozen design docs.

### The timing scale, superseded

The three-band scale above (Fast 150-250ms / Standard 400-600ms / Slow 700ms) was superseded during Phase B's own timing-standardization pass and again by Phase C's Part 14/6 rework. The current, shipped scale lives in `src/lib/motion.ts` and `UI_THEME.md`'s timing table: **Instant** (80-120ms, press/squash), **Fast** (120-180ms, hover), **Standard** (220-300ms, panel/accordion open), **Slow** (350-450ms, camera pans; panel/accordion close deliberately stays in Fast, not Slow — exits read faster than entrances, the same principle this document's own "Layer Closing" entry already stated). This is a real evolution, not a contradiction: the underlying principle ("one fixed vocabulary, not per-object tuning") is exactly what Phase C's `motion.ts` still enforces, just with numbers matched to what the room actually needed once it existed, rather than numbers estimated before a single hotspot had been built.

### Hover, extended to every interactive object

The original "identical hover treatment on every hotspot" principle is honored and extended: Phase C's `useHoverState` hook (`src/hooks/useHoverState.ts`) is the single implementation every hotspot (Desk, Bookshelf, Research Stand, Leadership frames) and the Gramophone use — a slight lift (`translateY(-3%) scale(1.015)`), a brightness increase, and a drop-shadow, all through the same hook, same values, same Fast-band timing. JS state, not CSS `:hover`, per the investigation trail already recorded in `Gramophone.tsx`'s own comments (CSS `group-hover` didn't reliably verify across three separate attempts in this project's test environment).

### Selection/press, extended

The original "press-down, 98%, 80ms" concept is now: a press-squash (`scale(0.96, 1.04)`, asymmetric rather than uniform — reads more like a real object settling under a fingertip than a uniform shrink) at the Instant band (100ms), plus a brief background highlight flash on the button itself, distinct from the steady hover tint. Both release automatically on mouseup/touchend via the same `useHoverState` hook — no separate timer needed, since the natural press-and-release gesture already brackets the effect.

### Idle animations — now two distinct patterns, not one

The original spec called for one shared idle cadence for "every ambient element." Phase C's implementation has two, deliberately distinct:
- **`.idle-pulse`** (Phase A/B) — an opacity blink, a *discovery* affordance specifically for unvisited hotspots, dropped once a hotspot is visited (see `useVisitedHotspots`). This is closer to the original document's "Completion Feedback" idea than to its "Idle Animations" one — it's about first-contact discoverability, not ambient life.
- **`.sprite-breathe`** (Phase C, Part 2) — a genuine ambient idle animation, a subtle scale pulse (3.2s, inside the brief's 2-4s Idle band) on every interactive sprite's own furniture, always on regardless of visited state, each object's `animation-delay` offset from the others (Desk 0s, Knowledge 1.3s, Research 2.6s, Leadership 3.9s, Gramophone 4.8s) so five pieces of furniture don't visibly breathe in lockstep — a direct, intentional instance of this document's own "a scene where different objects breathe at different speeds reads as busy" concern, resolved by choosing offsets specifically so they *don't* sync, not by making them identical.

### Visual hierarchy — resolved in favor of the original "no grading" principle

Phase C's own brief asks for a stated priority order (Desk highest, then Knowledge/Research/Leadership, then decoration) and separately says "never allow decorative objects to compete with primary interactions." Read against this document's pre-existing, explicit "no hotspot gets a stronger or weaker hover treatment because it's more important... affordance shouldn't be graded" principle, the two aren't actually in conflict: the hierarchy is already encoded structurally (Desk has the largest click zone and the deepest content — three projects with accordion and Blueprint reveal, versus Knowledge's flat list) and the "decoration doesn't compete" rule is already satisfied by construction (the walnut bookshelf, paper stack, and other pure-decoration sprites received none of Phase C's hover/press/breathe treatment — only the four real hotspots and the Gramophone did). No hotspot's *microinteraction* was made stronger or weaker than another's; the hierarchy lives in what each object *is*, not in how hard it reacts to a cursor.
