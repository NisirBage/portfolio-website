# Experience Storyboard — The Studio

**Status:** Draft for review. This is a cinematic walkthrough of the first ten minutes, not a wireframe — no layout decisions here, only sequence, camera, lighting, and emotional intent. Scenes map directly onto [EXPERIENCE_ARCHITECTURE.md](EXPERIENCE_ARCHITECTURE.md)'s hub-and-spoke model and [NARRATIVE_SYSTEM.md](NARRATIVE_SYSTEM.md)'s emotional arc.

Note on structure: unlike your original scene list (which had a separate Analytics scene), this storyboard has six scenes, not seven — Analytics evidence lives inside Scene 3 rather than as its own stop, per Content Hierarchy's removal recommendation. The sequence below is the *default* path a curious visitor follows; because there's no forced order (Experience Architecture's Navigation Philosophy), any persona can jump straight to any scene from Arrival — this storyboard describes the intended rhythm, not a rail.

---

## Scene 1 — Arrival

**Camera.** Static wide establishing shot of the whole Studio — Desk centered, Bookshelf and Leadership Wall visible either side, Coffee Corner in the periphery, Window above.
**Lighting.** Warm, even, desk-lamp-lit. Nothing dramatic — the room looks occupied, mid-use, not staged for entrance.
**Sound.** Silent (Audio Philosophy: opt-in only, nothing plays automatically).
**On screen.** Name and one-line identity render immediately, no animation gate in front of them — a visitor who screenshots the page in the first second still gets the Level-1 read.
**Emotional objective.** Calm curiosity, not spectacle. The room should feel like walking into someone's actual workspace mid-afternoon, not a title screen.
**Pacing.** Instant — nothing to wait for. This is the scene most sensitive to Recruiter Time Is Precious; any loading delay here costs disproportionately.

---

## Scene 2 — The Desk

**Camera.** Zoom-in on the Desk (500ms, decelerating ease) triggered by the visitor's first click, wherever it lands.
**Interaction.** Monospace boot-line reveal, then the panel opens with the three project headlines and the always-visible Resume tab.
**Lighting.** No change from Scene 1 — the Desk was already the brightest, most legible object in the establishing shot.
**Emotional objective.** Confirmation — "yes, this room does what I expected," and the first proof point ("this person builds software") lands here, fast.
**Pacing.** Sub-second to Level 1, ~20 seconds if the visitor reads a project summary to Level 2.

---

## Scene 3 — Engineering Depth (within the Desk)

**Camera.** No further zoom — the panel itself expands in place as the visitor chooses a project and goes deeper.
**Interaction.** Blueprint sub-interaction (diagonal unroll) on "see the architecture"; dashboard/analysis evidence for the Safety Platform is presented here as part of the same panel, not a separate scene.
**Lighting/Sound.** Unchanged; this scene is entirely about panel content, not environment.
**Emotional objective.** Respect — the tradeoffs and lessons-learned copy is where a technically serious visitor either stays convinced or starts to doubt. This is the highest-stakes writing in the whole site.
**Pacing.** ~2 minutes for a visitor who reads Level 3 on one project.

---

## Scene 4 — Research (Bookshelf)

**Camera.** Return-to-Desk snap-back (250ms), then zoom to the Bookshelf (500ms) on the next click.
**Interaction.** Book slides out and opens; Research Journal page-turn if the visitor goes to Level 3.
**Lighting.** The Desk gains its first faint "visited" glow, visible in peripheral vision as the camera moves past it — the room quietly remembers where the visitor has been.
**Emotional objective.** Understanding — this is the first moment the visitor learns the site has more than one dimension to it, which is the pivot from "portfolio" to "person."
**Pacing.** ~30 seconds to Level 2; up to 2 minutes if the Research Journal is opened.

---

## Scene 5 — Leadership Wall

**Camera.** Zoom to the wall (500ms).
**Interaction.** Frame fan-out, clustered by category; Whiteboard sub-object available within the cluster set.
**Lighting.** Narrative State likely shifts from Curious to Engaged here (2nd–3rd branch visited) — a barely-perceptible warm-up in overall room brightness.
**Emotional objective.** Respect deepens into genuine surprise — this is where "systems builder" and "runs a 400-person conference" collide in the same visitor's head, which is the whole point of Section 2 of the Strategy doc.
**Pacing.** Highly variable — a Consulting Recruiter may spend the most time in the whole session here; an SWE Recruiter may glance and move on. Both are correct outcomes.

---

## Scene 6 — Coffee Corner *(optional branch, not required for the arc)*

**Camera.** Zoom to the counter (500ms), the widest camera swing in the sequence since it's physically furthest from the Desk.
**Interaction.** Steam-rise hover, fade-in panel.
**Lighting/Sound.** No shift beyond the ambient state already established; opt-in coffee-pour sound if audio is on.
**Emotional objective.** Warmth, relief from "evidence mode" — this is deliberately the one scene that isn't building a case for anything.
**Pacing.** Short, ~30 seconds — the content itself is light by design (Content Hierarchy: Optional tier).

---

## Scene 7 — The Window / Observatory *(closing scene)*

**Camera.** Once 3+ branches are visited, the Window visibly brightens in peripheral view even before it's clicked — the one piece of foreshadowing in the whole experience. On click: the slowest, most deliberate camera move in the spec (700ms tilt-up).
**Lighting.** The one genuine palette shift — a cooler, sky-toned light distinct from the warm wood tones everywhere else, per Narrative System's Visual Storytelling.
**Interaction.** Panel opens on what's next — research directions, grad-school interests — then a clear, final path to Contact/GitHub.
**Sound.** Opt-in soft breeze, once.
**Emotional objective.** Inspiration — the last thing a visitor experiences is momentum, not a summary. This is the scene the entire storyboard was paced toward; every earlier scene's "visited glow" mechanic exists to make this payoff feel earned rather than arbitrary.
**Pacing.** The natural close of a 5–10 minute session; the Contact/GitHub click-through from here is the single most important conversion event in the whole site (Zone Success Matrix).

---

## Sequence Summary

| Scene | Typical elapsed time | Emotional beat |
|---|---|---|
| 1 — Arrival | 0–3 sec | Calm curiosity |
| 2 — The Desk | 3 sec – 1 min | Confirmation |
| 3 — Engineering Depth | 1–3 min | Respect (technical) |
| 4 — Research | 3–4 min | Understanding (breadth) |
| 5 — Leadership Wall | 4–7 min | Respect (deepened) / surprise |
| 6 — Coffee Corner | optional, ~30 sec anywhere in the sequence | Warmth |
| 7 — Window | 7–10 min | Inspiration → action |

No scene is mandatory except 1 and 2 — everything from Scene 3 onward is visitor-initiated, in whatever order they choose. This storyboard describes the *intended* rhythm for a fully engaged visitor, not a forced path.
