# Asset Priority Queue — The Studio

**Status:** Companion to `ASSET_REQUIREMENTS.md`. P0 blocks nothing functionally but represents the highest-leverage visual-truthfulness gap in the project; P1-P3 are genuinely lower-stakes. All four P0/P1 items reuse already-owned, already-VERIFIED source assets — no new sourcing or AI generation needed for any of them.

| Priority | Asset | Room | Blocks | Reason | Suggested Source | Current Status |
|---|---|---|---|---|---|---|
| **P0** | Wood desk sprite | Desk | No | Highest-traffic hotspot in the room, currently invisible | Reuse — crop from owned source pack | **Integrated** — `desk.png`, rendered in `DeskHotspot.tsx` |
| **P0** | Oak bookshelf sprite | Knowledge | No | Same reasoning as Desk | Reuse — crop from owned source pack | **Integrated** — `bookshelf.png`, rendered in `KnowledgeHotspot.tsx` |
| **P1** | Filled picture-frame sprites (×2-3) | Leadership | No | Signals "gallery" before click; less critical since panel content carries the real evidence | Reuse — crop from owned source pack | **Integrated** (×2 of the suggested 2-3) — `frame-abstract.png`/`frame-landscape.png`, rendered in `LeadershipHotspot.tsx` |
| **P2** | Walnut bookshelf (adjacent dressing) | Knowledge/Research | No | Visually distinguishes the two peer zones sharing Zone 3 | Reuse — already-verified, unused sprite | Verified, unused |
| **P2** | Loose paper / folder stack | Desk | No | Ambient dressing once the desk sprite exists to dress around | Reuse — already-verified, unused sprites | Verified, unused |
| **P3** | Blank picture-frame (Whiteboard) | Leadership | No | Blocked on real content (`MISSING_CONTENT.md`), not on the asset — asset itself is ready whenever content is | Reuse — already-verified sprite | Verified, unused, content-blocked |
| **Unscheduled** | Window sprite | Window | N/A | Room never scheduled in `IMPLEMENTATION_PLAN.md` — scope question, not an asset gap | Reuse — already-verified, 9 variants available | Verified, unused, scope-pending |
| **Cut** | Coffee Corner interaction assets | Coffee | N/A | `VERSION1_SCOPE.md` explicitly cuts this interaction for V1; existing mug/counter/fridge sprites already render as decoration only | N/A | Already resolved, not a gap |

**Reading this table.** Nothing here is blocking in the literal sense — every shipped hotspot works without its furniture sprite. P0 reflects visual-truthfulness urgency (the room doesn't yet look like anything), not functional risk. The two P0 items are recommended as the immediate next implementation work, per "ship working software first."
