# Spatial Blueprint — The Studio

**Status:** Phase 3, Deliverable 1. An architectural plan, not a wireframe — this document establishes where things exist and why, before any visual design begins. Grounded in the actual room asset, verified by direct pixel inspection (not assumed) per the Asset Truthfulness Protocol.

---

## The Real Geometry

`TopDownHouse_FloorsAndWalls.png` (288×144px canvas) contains a room roughly 263×119px (content bounding box confirmed at pixel level: x 12–275, y 12–131 — a few pixels of transparent margin on all sides). Within that room, four material zones run left to right, each roughly a quarter of the width:

| Zone | Position | Wall finish | Floor finish |
|---|---|---|---|
| **Zone 1** | Leftmost | Sage/olive | Rust brick |
| **Zone 2** | Second | Rust/orange, dark wainscoting | Tan diamond-pattern |
| **Zone 3** | Third | Tan vertical wood paneling | Rust brick |
| **Zone 4** | Rightmost | Light tan/cream | Orange tile, with a floor vent detail |

Two features exist in the asset that earlier documents hadn't accounted for and that a blueprint can't honestly skip: a **door-shaped gap in the left wall** (measured during Milestone 2's implementation at x≈13–15, y≈33–78 of the 288×144 canvas — inside Zone 1), and a **second gap in the front wall** (measured at x≈88–135, y≈128–130 — inside Zone 2, not at the Zone 1/2 boundary as this document originally estimated from a screenshot alone; corrected per the Asset Truthfulness Protocol once precise pixel measurement was possible — see `ENGINEERING_DECISIONS.md`). Both read as pre-cut openings meant to connect this room to others in the source asset pack's larger house — since The Studio is a single standalone room, these need a deliberate resolution, not a silent ignore.

**Resolution:** both gaps are dressed with closed door sprites from `TopDownHouse_DoorsAndWindows.png` (VERIFIED, multiple wood-tone variants available), styled to match their zone's palette. Neither is a hotspot. Narratively, they do real work at zero cost: a closed door implies the workspace exists inside a larger, real building — reinforcing "an actual place someone works," not a stage built to be looked at. Visual Priority: **Background** (see `VISUAL_PRIORITY_MAP.md`).

**Honesty note on precision.** The zone boundaries and door positions above are confirmed from direct visual inspection at 4× magnification, not invented. Sub-pixel placement (exact x/y coordinates for hotspot click regions, exact furniture-sprite anchor points) is *not* claimed here — that level of precision belongs to implementation in Phase 4/5, once real layout code exists to verify against. Claiming it now would itself violate the Asset Truthfulness Protocol by implying false precision.

---

## Object Placement — Three Options

### Option A — Priority-Anchored (recommended)

Desk in Zone 2, Leadership Wall in Zone 1, Bookshelf/Knowledge and Research Journal both in Zone 3 (two distinct, spatially separated objects — *revised, Milestone 7*, see `NARRATIVE_SYSTEM.md`), Coffee Corner in Zone 4. Clock placed as a furniture item at the Zone 2/3 boundary — physically between Engineering and Zone 3's evidence cluster, standing between the two rather than belonging fully to either. Window mounted on the wall directly above/behind the Desk (Zone 2), reached by tilting the camera up, not panning sideways — it isn't a fifth lateral zone at all.

- **Strengths.** Matches `CONTENT_HIERARCHY.md`'s proximity-priority logic (Desk near-center, evidence zones flanking it, Coffee peripheral). Preserves the rust=Engineering / tan=Research / sage=Leadership color logic Phase 1 already established, avoiding rework for no reason (Asset Evolution). The Window-above-Desk placement removes a zone-count problem entirely rather than fighting for a fifth lateral slot in a four-zone room.
- **Weaknesses.** In raw left-to-right reading order, Leadership (Zone 1) is technically scanned before the Desk (Zone 2) — the Desk does not win on position alone. This has to be compensated for with visual weight (scale, lighting, contrast), which is `VISUAL_PRIORITY_MAP.md` and `COMPOSITION_STUDY.md`'s job, not a placement guarantee by itself. Flagged honestly below, not glossed over.
- **Recruiter experience.** The Desk still wins first *fixation* even though Leadership wins first raw *position*, because visual salience (size, light, contrast) typically overrides scan order for the very first glance — well-established in basic visual hierarchy practice. This only holds if the Composition Study and Visual Priority Map actually deliver that salience; it's a dependency, not a given.
- **Implementation complexity.** Low — every zone assignment matches an already-real, already-differently-colored floor/wall zone; no new geometry needed.
- **Asset compatibility.** Full — every object placed sits on a verified zone from `ASSET_REGISTRY.md`.

### Option B — Reading-Order-Anchored

Desk moved to Zone 1 (the literal first-scanned position), Research to Zone 2, Leadership to Zone 3, Coffee stays Zone 4.

- **Strengths.** The Desk wins first position *and* first fixation without depending on a separate visual-weight treatment to compensate — structurally simpler to guarantee.
- **Weaknesses.** Breaks the existing rust=Engineering color continuity for a gain that Option A can already achieve through weight and lighting — a real cost (rework, and losing an established color-to-content association across four earlier documents) for a benefit Option A likely gets anyway.
- **Recruiter experience.** Comparable to Option A for the 90-second fast pass; no meaningful advantage once Option A's visual-weight treatment is in place.
- **Implementation complexity.** Low, but requires re-touching color/zone references in `ASSET_MAPPING_V2.md`, `EXPERIENCE_ARCHITECTURE.md`, and `INTERACTION_SPECIFICATION.md` for no functional gain — unnecessary churn under the Asset Evolution rule.
- **Asset compatibility.** Full — same zones, just reassigned.

**Rejected.** The cost (documentation churn, lost continuity) isn't justified by a benefit Option A is already positioned to deliver through composition instead of placement.

### Option C — Grouped-by-Intensity

Desk and Leadership Wall placed adjacent (Zones 1–2, the two highest-traffic, highest-depth states), Research and Coffee placed adjacent (Zones 3–4, the two quieter states).

- **Strengths.** Groups "evidence-heavy" content together and "lighter" content together — a cleaner emotional zoning in theory.
- **Weaknesses — the decisive one.** `INFORMATION_ARCHITECTURE.md`'s Cognitive Load Budget already identified a real, unresolved risk: a visitor could chain the two High-load states (the Blueprint Layer and the Leadership cluster) back to back with no lighter moment between them, since navigation has no forced order. Placing those two states *spatially adjacent* makes that exact chaining easier and more likely, not harder — this option would actively work against a risk already on the record, not just fail to help it.
- **Recruiter experience.** Risks a denser, less-paced experience for exactly the visitor most likely to explore thoroughly.
- **Implementation complexity.** Low.
- **Asset compatibility.** Full.

**Rejected**, specifically because of the pacing interaction with prior analysis — this isn't a stylistic preference, it's a concrete conflict with a documented risk.

---

## Interaction Zones

Every hotspot's click/tap target is generously sized beyond its visible sprite bounds — per Experience Architecture's Accessibility Strategy, a minimum 44×44px target regardless of how small the underlying pixel art renders. No interaction in this room requires precision clicking; the target always exceeds the sprite.

## Sight Lines

From the Arrival establishing shot, foveal (central) vision lands on the Desk and its immediate surroundings — the largest, most-lit object in the frame by design (see Composition Study). Zone 1 (Leadership) and Zone 3 (Bookshelf/Knowledge and Research Journal) sit in near-peripheral vision, visible but not demanding attention — legible enough that a visitor knows they're there without needing to be told. Zone 4 (Coffee) sits at the edge of the frame, present but genuinely peripheral, consistent with its Optional/low-traffic status.

## Camera Anchor Points

Seven anchors, one per Focus state (*revised, Milestone 7 — Research Journal promoted from a Bookshelf sub-state to its own anchor*), each framed tight enough to exclude the neighboring zones from the shot (so attention genuinely narrows, not just zooms):
- **Desk Focus** — centered on Zone 2's furniture cluster.
- **Bookshelf Focus** — centered on its own position within Zone 3, tight enough to exclude the Research Journal from frame.
- **Research Journal Focus** — centered on its own, spatially distinct position within Zone 3, tight enough to exclude the Bookshelf from frame — the two are peer anchors sharing a zone, not one anchor with two states.
- **Leadership Focus** — centered on Zone 1's frame wall.
- **Coffee Focus** — centered on Zone 4.
- **Clock Focus** — centered on the Zone 2/3 boundary, tight enough that neither the Desk nor Zone 3's objects compete for attention in frame.
- **Window Focus** — an upward tilt from the Desk anchor, not a lateral move to a new x-position.

## Attention Corridors

The natural eye path across the establishing shot runs left-to-right through Zones 1→2→3→4 (standard Western scanning), crossing the Desk near the start of that path rather than at the end — reinforcing Option A's dependency on visual weight (noted above) rather than claiming position alone solves it. The Window sits outside this horizontal corridor entirely (it's reached vertically), which is intentional: it should never compete with the lateral scan, only reward a visitor who's already finished it.

## Natural Stopping Points

These align with the two **Pause** shots already established in `ATTENTION_FLOW.md` — the Blueprint Layer (Zone 2 depth) and the Leadership Cluster Detail (Zone 1 depth). Spatially, both stopping points sit in the *first half* of the room (Zones 1–2), which means a visitor who stops at either one has already passed the room's highest-intensity content before reaching the lighter Zones 3–4 — the room's geometry front-loads difficulty and tapers toward ease, which is a defensible pacing shape (get the hardest evaluation done first, coast afterward) rather than an accident of where zones happened to land.
