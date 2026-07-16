# Visual Punch List — The Studio

Living implementation checklist. Completed items are removed, not marked done. Phase B (UX Refinement, Visual Polish & Production Readiness) opened no new sprite/asset gaps — its visual work (room background, panel theme, controls, dividers, visited-state badges) was entirely CSS and text-glyph, per `UI_THEME.md`'s "why CSS tokens, not a cropped frame sprite." Phase B did shrink and reposition the gramophone's muted/playing badge sprites (a real fix, not a new gap — see `ENGINEERING_DECISIONS.md`'s "ghost Leadership popup" entry); both remain 8px, already-integrated assets, not additions to this list. Last cleared (Workspace Decoration pass): Desk fully dressed with 8 generated items (Monitor, Keyboard, Mouse, Pencil Cup, Coffee Mug, Rolled Blueprint, Engineering Notebook, Desk Lamp) — see `ENGINEERING_DECISIONS.md` and `WORKSPACE_DECORATION.md` for what shipped and why. Prior clearance (Concept Reconciliation pass): bookshelf overlap between Knowledge (oak, dominant) and the walnut bookshelf (secondary, repositioned + scaled down); Research journal's floating appearance, now resting on a new reading-stand sprite; Research and Leadership click-zones re-measured against their real sprite footprints. Earlier still: Desk sprite + click-zone, Bookshelf sprite + click-zone, Research Journal sprite + click-zone, Leadership frames ×2, walnut-bookshelf dressing.

---

## P0 — Critical

*None open.* All four built hotspots (Desk, Knowledge, Research, Leadership) are visible, recognizable, and click-zone-verified ≥ sprite footprint.

## P1 — Important

*None open from the existing packs.* Every verified, unused, narratively-justified sprite in both owned packs has now been integrated. Remaining P1-priority gaps have no existing-pack source — see `AI_GENERATION_REQUEST.md`.

## P2 — Nice To Have

| Priority | Area | Asset | Status | Source |
|---|---|---|---|---|
| P2 | Coffee Corner | Steam animation (mug) | Missing | AI Generated (CSS effect over existing verified mug sprite, no new image asset — not a sprite request) |
| P2 | Global | Desk sprite drop-shadow consistency check | In Progress | N/A (CSS, not an asset) |
| P2 | Desk | Keyboard legibility — reads as a plain dark rectangle, not a detailed keyboard, at its current 14×7 size | Known limitation | Same generated sheet; would need a re-generated, simpler-silhouette keyboard sprite to improve, not a placement fix |

Computer/Monitor, Rolled Blueprint, and Keyboard (previously the P1/P2 entries here) are now **integrated** — see `WORKSPACE_DECORATION.md`'s Asset Placement Table and `ASSET_REGISTRY.md`'s Generated Desk Set section.

## P3 — Future

*None queued.* Not populating this tier with speculative items — no current asset, narrative, or scope basis for anything here yet. Add only when a real candidate exists.

---

## Explicitly Not On This List

Per Version 1 Scope Lock: Coffee Corner and Window stay decorative-only, deferred to V2. Their existing dressing (mug, counter, fridge; window sprite unused) is already correctly non-interactive — not a gap.
