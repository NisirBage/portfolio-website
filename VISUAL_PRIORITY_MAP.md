# Visual Priority Map — The Studio

**Status:** Phase 3, Deliverable 4. Every object that will appear in the scene, ranked. The rule you set — nothing outranks a flagship interaction — is interpreted precisely: "flagship" refers specifically to the three Depth-5 flagship projects (`INFORMATION_ARCHITECTURE.md`'s Interaction Depth Index), so the Desk, as their gateway, is the sole **Primary** object. Everything else, including genuinely important content like the Leadership Wall, is deliberately kept one tier below — a literal reading of your rule, not a loose one.

Persistent UI chrome (Resume, Contact, Return-to-Workspace, audio toggle) sits outside this map entirely — those render in the modern UI layer, not the pixel scene, and were already specified as small and quiet by design (`EXPERIENCE_ARCHITECTURE.md`).

---

## Primary

| Object | Reasoning |
|---|---|
| **The Desk** | Sole Primary object. Gateway to the only Depth-5 content in the room. Every other object's visual treatment is calibrated to stay beneath this one. |

## Secondary

*(Correction from `DESIGN_DEBT.md` Finding #3: this tier previously listed Leadership Frames and the Bookshelf as tied. `COMPOSITION_STUDY.md`'s Workspace entry establishes a stricter ordering — Desk > Leadership > Bookshelf > Coffee — and that ranking is the more useful one for implementation. Secondary is kept as one tier for simplicity, but the two entries below are now explicitly ordered within it, not tied.)*

| Object | Reasoning |
|---|---|
| **Leadership Frames** *(upper end of this tier)* | High traffic, high narrative weight, the site's central differentiator — but deliberately one tier below the Desk per the rule above, matching `COMPOSITION_STUDY.md`'s explicit weight ordering (Desk > Leadership). |
| **Bookshelf (oak)** *(lower end of this tier)* | Real, load-bearing content (the Research pillar of the central metaphor) — strong presence, but proportionate to its Depth-3/4 content, and ranked beneath Leadership Frames, not tied with it. |

## Supporting

| Object | Reasoning |
|---|---|
| **Grandfather Clock** | Depth 2, single-layer, positioned as a "crossroads" object between Desk and Bookshelf (`SPATIAL_BLUEPRINT.md`) — present and legible, never a focal draw. |
| **Coffee Mug / Coffee Corner backdrop** | Depth 2, Optional-tier content by design (`INTERACTION_HEATMAP.md`'s Removal Check) — visible, inviting, never demanding. |
| **Window** | Context-dependent: Supporting in the baseline establishing shot (it should not announce itself early — Narrative States gates its brightening behind 3+ prior visits), but its own Focus state is deliberately the most visually elevated moment in the entire experience once reached. This isn't a contradiction — a state can earn temporary visual primacy through the Narrative System's engagement gating without being visually loud by default. |

## Background

| Object | Reasoning |
|---|---|
| Closed doors dressing the two real door-gaps in the room asset | Present for world-grounding (`SPATIAL_BLUEPRINT.md`'s door-gap resolution), explicitly non-interactive, kept visually quiet so they read as "part of a real building" rather than inviting a click that goes nowhere |
| Wood stove | VERIFIED asset, ambient dressing near Coffee Corner, no hotspot |
| Standing mirror | VERIFIED asset, unused as a hotspot, available as quiet room-filling texture if the Coffee Corner or transition zones read as too sparse during implementation |
| Armchairs / sofas | Ambient "lived-in" dressing near Leadership Wall and Coffee Corner, no hotspot |
| Kitchen counter, refrigerator | Backdrop for the Coffee Mug hotspot — visible enough to establish "kitchen," never competing with the mug itself, which is the actual interactive object |
| Floor and wall zone textures | The base layer everything else sits on — by definition never competes for attention, it's the canvas |

## Decorative

| Object | Reasoning |
|---|---|
| Potted plant, flower bouquet | Zero Interaction Depth (`INFORMATION_ARCHITECTURE.md`), present purely as the "continuous learning" ambient signal from `NARRATIVE_SYSTEM.md`'s World Rules — explicitly allowed to exist without proving anything, as long as it stays honest about being decorative and never gains a click target |

---

## Explicitly Excluded From the Scene

Confirmed **Do Not Use** in `ASSET_MAPPING_V2.md` and unchanged here: bathroom fixtures, dining furniture, food/kitchen prop items, the staircase, all Sprout Lands emoji/inventory/weather/settings assets, the Teemo emote sheet, the cat-paw cursor. None of these appear in the room at any priority tier, including Decorative — they weren't demoted, they were cut, and the Visual Priority Map should reflect that they're not quietly present in the background either.

---

## The Check This Map Exists to Run

Cross-referencing against `INTERACTION_HEATMAP.md`: the two highest-traffic, highest-importance states (Desk, Leadership) are Primary and Secondary respectively — the two tiers this document reserves for real weight. The two lowest-traffic states (Clock, Coffee) land in Supporting, not Background or Decorative — they're still real, interactive, narratively justified objects, just not ones competing for first attention. Nothing decorative outranks anything interactive, and nothing interactive outranks the Desk. The hierarchy holds without needing an exception anywhere in the list.
