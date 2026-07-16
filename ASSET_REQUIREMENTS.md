# Asset Requirements — The Studio

**Status:** Implementation-phase audit, using `ASSET_REGISTRY.md`/`MISSING_ASSETS.md`'s existing conventions — not a new planning system, an application of the existing one to the current build state. Covers the four Must-Have, shipped interaction areas (Desk, Knowledge, Research, Leadership) in full. Window and Coffee Corner are audited too, flagged separately below, since their V1 scope status is unresolved or explicitly cut — see the note above this file in-conversation, not repeated here.

---

## Desk

- **Existing assets used.** Room shell, door sprites — both VERIFIED and integrated.
- **Existing assets reused.** None yet — see Missing below.
- **Assets missing (from the live build; verified present in source).** Wood desk sprite (`TopDownHouse_FurnitureState1.png`) — never cropped or rendered. The hotspot is currently a bare click-zone over floor.
- **Blocking assets.** None — the hotspot functions correctly without it; this is a visual-truthfulness gap (the room doesn't look like a desk), not a functional one.
- **Optional assets.** Loose paper stack, folder stack (`SmallItems.png`, both VERIFIED, unused) — candidates for dressing near the Desk once the desk sprite itself is integrated.
- **Decorative opportunities.** None beyond the above until the desk sprite exists to dress around.

### Requested: Desk furniture sprite integration

- **Asset Name.** Wood desk (crop from `TopDownHouse_FurnitureState1.png`).
- **Purpose.** Give the Desk hotspot an actual visual object, replacing the current invisible click-zone.
- **Narrative Role.** Execution — the hub.
- **Priority.** P0.
- **Blocking.** No (functionally), but it's the single highest-value visual-truthfulness fix in the project.
- **Suggested Pixel Dimensions.** Whatever the sprite's native crop bounds are within the 208×288 sheet — to be measured directly, not estimated (Asset Truthfulness Protocol).
- **Suggested Perspective.** Top-down, matching the room shell (already the pack's native perspective).
- **Suggested Palette.** N/A — reusing the existing verified sprite as-is.
- **Suggested Animation.** None required; the idle-pulse affordance already exists as a separate CSS layer.
- **Can AI Generate?** N/A.
- **Would a Human Pixel Artist Produce Better Results?** N/A.
- **Reason it is needed.** This asset already exists, verified, and is sitting unused — this is integration work, not sourcing. See Root Cause note above.
- **Sourcing method.** Reuse existing sprite (Method 2) — crop directly from the already-owned source pack.

---

## Knowledge (Bookshelf)

- **Existing assets used.** None yet integrated — same gap as Desk.
- **Existing assets reused.** The book sprite (open/closed, `SmallItems.png`) is wired into the panel's content-reveal logic, but the bookshelf furniture piece itself is not rendered in the establishing shot.
- **Assets missing (from the live build).** Oak bookshelf sprite (`FurnitureState1.png`) — verified, uncropped.
- **Blocking assets.** None functionally.
- **Optional assets.** Walnut bookshelf variant (`FurnitureState1.png`, VERIFIED, unused) as adjacent ambient dressing, to visually distinguish the Knowledge zone from the Research zone now that they're peer objects sharing Zone 3 (per Milestone 7's split) — reuses an already-verified sprite, zero new sourcing.
- **Decorative opportunities.** The walnut-bookshelf placement above satisfies "improves environmental immersion" and "reinforces evidence-driven design" (visually confirms Knowledge and Research are distinct objects, not one shelf serving two purposes) at zero asset cost.

### Requested: Bookshelf furniture sprite integration

- **Asset Name.** Oak bookshelf (crop from `FurnitureState1.png`).
- **Purpose / Narrative Role.** Same reasoning as Desk — visual truthfulness for the Knowledge hotspot.
- **Priority.** P0.
- **Blocking.** No.
- **Suggested Dimensions / Perspective / Palette / Animation.** Same as Desk — measure directly, reuse as-is, no animation required.
- **Can AI Generate? / Pixel Artist Preferred?** N/A — already exists.
- **Reason needed.** Integration gap, not a sourcing gap.
- **Sourcing method.** Reuse existing sprite.

---

## Research (Research Journal)

- **Existing assets used.** None yet integrated as a distinct furniture piece — the Research Journal hotspot is also a bare click-zone.
- **Existing assets reused.** Same book sprite as Knowledge, rendered smaller per Milestone 7's design (one verified sprite, two hotspots).
- **Assets missing.** No dedicated "notebook" sprite exists in the source pack (already established honestly in `ASSET_REGISTRY.md`/`ENGINEERING_DECISIONS.md` Milestone 7) — the book sprite stands in for it. This remains the correct call; no new asset requested here.
- **Blocking assets.** None.
- **Optional assets.** None identified beyond what Knowledge's dressing already provides for the shared zone.
- **Decorative opportunities.** None beyond the Knowledge zone's walnut-bookshelf placement above, which benefits both hotspots' surrounding context.

*No new asset requested for Research — the existing book-sprite reuse decision from Milestone 7 stands.*

---

## Leadership

- **Existing assets used.** None yet integrated — same gap as Desk/Knowledge.
- **Existing assets reused.** None yet.
- **Assets missing (from the live build).** Filled picture-frame sprites, 2 variants (`SmallItems.png`, VERIFIED) — the certificate-frame gallery has never been rendered; the hotspot is a bare click-zone over the sage wall.
- **Blocking assets.** None functionally — the panel's real content (Diplomacy/Communication/Leadership/Case Competitions) works independent of whether frames are visually rendered.
- **Optional assets.** Blank picture-frame sprite (VERIFIED) — reserved for the Whiteboard sub-interaction, which remains deferred pending real content (`MISSING_CONTENT.md`); not requested now since the interaction it supports doesn't exist yet.
- **Decorative opportunities.** A small cluster of the filled-frame sprite (2-3 instances) on the sage wall would visually signal "gallery" before any click, reinforcing the panel's real content rather than decorating for its own sake.

### Requested: Leadership Wall frame sprites

- **Asset Name.** Filled picture frames ×2-3 instances (crop from `SmallItems.png`).
- **Purpose.** Visual truthfulness for the Leadership hotspot; signals "gallery of evidence" before any click.
- **Narrative Role.** Trust / external validation.
- **Priority.** P1 — not as foundational as Desk/Knowledge (Leadership's real evidence is entirely in the panel, not the establishing shot), but still a real gap.
- **Blocking.** No.
- **Suggested Dimensions / Perspective / Palette / Animation.** Measure directly; no animation required for the shipped grid fallback (fan-out animation is Should-Have, not this).
- **Can AI Generate? / Pixel Artist Preferred?** N/A — already exists.
- **Reason needed.** Integration gap, not sourcing gap.
- **Sourcing method.** Reuse existing sprite.

---

## Window (scope unresolved — see note above)

- **Existing assets used.** None — no hotspot built.
- **Assets available if built.** Window sprite — 9 variants (4-pane, 2-pane, small; 3 wood-tone finishes), `TopDownHouse_DoorsAndWindows.png`, VERIFIED.
- **Blocking.** N/A — not scheduled in `IMPLEMENTATION_PLAN.md`'s 11 milestones. Building this now would be scope expansion, not a gap-fill, and needs your confirmation first per the Repository Consistency Principle.

## Coffee Corner (explicitly cut from V1 — see note above)

- **Existing assets used.** Mug, kitchen counter, refrigerator — all VERIFIED, all already rendering as pure decorative dressing per the Feature Removal Review's explicit instruction (no click target).
- **Assets missing.** None requested — `VERSION1_SCOPE.md` already resolved this: Coffee Focus is cut, not under-resourced. Reopening it needs your explicit approval, not an asset list.
