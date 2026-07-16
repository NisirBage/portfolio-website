# Visual Review — Version 1 Launch Readiness

**Status:** One-time review record, not a living document. Phase 1 of the Launch Readiness audit — the room reviewed purely as an environment artist, ignoring code and architecture. Evidence source: a pixel-exact composite built from the actual committed sprite files at their actual code-specified coordinates (not a mockup), cross-checked against live DOM measurement on a fresh production build. The Browser pane's screenshot tool was unavailable for this entire pass (timed out on every attempt); the composite substitutes for it and is strictly more reliable, since it's literally the same pixels the browser renders, not a lossy screen capture.

---

## Would this room convince me a real person works here?

Yes, more than it would have before this session's work, and with one real caveat. The Desk reads as an active technical workspace (monitor, keyboard, mouse, blueprint, notebook, lamp, mug, pencil cup — a believable cluster, not a bare prop). The bookshelf reads as accumulated, serious material. The reading stand reads as ongoing, separate work. The one place this test partially fails: the Leadership wall. Two picture frames with no visible content inside them signal "this matters enough to be displayed" but not specifically "debate and diplomacy" — that context lives entirely in the panel text, not in the room itself. A visitor who never clicks Leadership would walk away with no idea what that wall represents.

## Visual hierarchy

The room's four zones read at meaningfully different visual weights, which is the right outcome even though it doesn't match the room's left-to-right physical order (Leadership, Desk, Knowledge, Research — Desk sits second, not last; this is a known, previously-documented, deliberate divergence from the concept's requested reading order, carried forward from `CONCEPT_RECONCILIATION.md` and not revisited here). Ranked by actual visual weight in the rendered composite: Knowledge's oak bookshelf is the single largest, densest silhouette in the room; the Desk cluster is the second-most visually active area (more color variety than the bookshelf, but built from many small objects rather than one large mass); Research is deliberately quieter (two small objects, most of the local negative space of any zone); Leadership is the quietest zone in the room by a wide margin (two 16×16 frames on an otherwise bare wall). This is a coherent hierarchy on its own terms — it's just not the exact sequence the concept asked for, a conflict already surfaced and not re-litigated here.

## Focal points

Each zone has exactly one clear focal point, which is correct — a room with competing focal points within a single zone would read as noisy. Leadership's focal point is the frame pair as a unit. Desk's is the monitor (largest, most central, highest-contrast object in that cluster). Knowledge's is the bookshelf's own mass. Research's is the book resting on the stand (the palest, most attention-grabbing color against the warm-toned room). No zone has two objects competing for the same visual priority.

## Object spacing and silhouette readability

All four zones were re-measured this pass; one real, measurable defect was found and fixed (see "Fixed this pass" below). Everything else held up:

- Knowledge↔walnut bookshelf gap: ~3.3% of canvas width, confirmed still clean, no regression from the desk decoration or grounding work.
- Walnut bookshelf↔reading stand gap: ~2.2% of canvas width, confirmed clean.
- Leadership's two frames: ~3.4% gap between them, both fully inside the wall's own bounds, no clipping.
- Every silhouette in the room is independently readable at native scale — confirmed by isolating each sprite's alpha channel and inspecting it individually (the same check used to catch the Lamp/Notebook overlap during the prior desk-decoration pass); nothing in this room is currently a shapeless blob except the one already-logged exception below.

**Known, already-logged exception, not new:** the Keyboard sprite (14×7px) reads as a plain dark rectangle rather than a keyboard with visible keys — this was found and documented during the Workspace Decoration pass (`WORKSPACE_DECORATION.md`), not new to this review. Re-confirmed still true; not re-fixed here since the underlying cause (source art detail exceeds what a 14×7px sprite can carry) hasn't changed and re-generating the sprite is out of scope for a polish pass.

## Fixed this pass: a real grounding defect (Visual Art Direction, "micro-adjust, 2–6px")

**Finding:** the oak bookshelf, the decorative walnut bookshelf, and the reading stand were all vertically centered on the same 50% line, despite having different native heights (49px, 31px, 32px respectively). Centering objects of different heights on the same line means their *bases* land at different heights — measured precisely: the oak bookshelf's base sat at canvas y=96.5px, while the walnut bookshelf's and reading stand's bases sat at y=87.5px and y=88px. A 9px and 8.5px discrepancy respectively — small in absolute terms, but visually legible as "these two pieces of furniture aren't standing on the same floor," exactly the kind of defect this phase asks to hunt for.

**Fix:** `RESEARCH_HOTSPOT.centerYPercent` moved from 50 to 55.9; the walnut bookshelf's placement in `Workspace.tsx` moved from centerY 50 to 56.25. Both now bottom out at canvas y=96.5px, exactly matching the oak bookshelf's base. Verified via a fresh composite render (before/after comparison) and via live DOM measurement on a rebuilt production server — all 18 sprites still load, no new overlap, no overflow at 1230px or 400px. Full math and reasoning in `roomGeometry.ts`'s and `Workspace.tsx`'s inline comments, and in `ENGINEERING_DECISIONS.md`.

## Color balance

The room's palette is warm and consistent (browns, tans, oranges, one sage-green accent wall for Leadership) — no zone introduces a jarring, out-of-palette color. The one place this gets slightly complicated: the generated desk items (monitor's cool dark gray/black, notebook's blue) are cooler and more saturated than the rest of the room's warm wood tones. This is a genuine, permanent tension — already flagged in `WORKSPACE_DECORATION.md` — between the real pack's flat warm palette and the generated sheet's own rendering, and it reads as a real (if minor) inconsistency up close. At the room's actual in-game scale it's not disruptive; it would become more noticeable if the room were ever zoomed in further than the current camera scales allow.

## Density and negative space

Leadership and Research are appropriately sparse — the task's own "large negative spaces are intentional" instruction is respected there without needing any change. Desk is dense by design (this was the explicit goal of the prior pass, and it's working — see Performance/UX reviews for whether that density crosses into clutter; visually, no single pair of objects there occupies more than the two small, deliberate, already-documented overlaps). Knowledge's bookshelf has generous breathing room on both sides (confirmed ≥3% canvas width gaps to its neighbors in both directions). Nothing in the room was found to be crammed in "because empty space existed" — every object present has a documented narrative reason (see `WORKSPACE_DECORATION.md` §6 for the desk items specifically).

## Lighting consistency

The real pack's furniture (desk, both bookshelves, frames, reading stand, doors) all share one consistent light source (implied top-left, soft shading, hard 1px dark-brown outlines) — confirmed by direct visual inspection, no inconsistency found among those pieces. The generated desk items use a different implied lighting convention (soft gradient drop-shadows, "warm top-right" per their own spec sheet) — this is the same style-source mismatch noted under Color Balance, not a separate defect, and it's already logged rather than hidden.

## Object overlap

Re-verified this pass, not assumed from prior passes: Keyboard/Mouse touch at their shared edge (deliberate, realistic), Blueprint/Notebook overlap ~15% of the Blueprint's own footprint (deliberate, "leaning against" composition), and that's the complete list — no other pair in the room overlaps at all, confirmed via pairwise bounding-box comparison across all 18 sprites.

## What was not touched, and why

Object scale (per-sprite dimensions) is frozen — every sprite's size is either a real, measured pack asset or a legibility-tested generated crop; resizing any of them without a new measurement would be exactly the "subjective preference over evidence" the task explicitly rules out. The physical zone order (Leadership→Desk→Knowledge→Research rather than the concept's requested Leadership→Knowledge→Research→Workspace) was reconsidered and left alone — it's a known, previously-argued, deliberate tradeoff (`CONCEPT_RECONCILIATION.md`), not an oversight, and reopening it here would be a redesign, not a polish pass.
