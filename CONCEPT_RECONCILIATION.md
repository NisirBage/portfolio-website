# Concept Reconciliation — Visual Revision Report

**Status:** One-time review record (like `REPOSITORY_REVIEW.md`, `DEPLOYMENT_CHECKLIST.md` before it), not a living document. Produced against the approved concept layout (three reference images: concept mockup, the user's own `Screenshot (374).png` of the live implementation, the 30-item labeled asset sheet). Scope: reconcile the room's furniture placement, spacing, scale, and hierarchy with the concept — architecture, hotspot system, camera system, layer engine, routing, and content model were preserved, not touched.

---

## 1. Visual Revision Report

### What the user's screenshot got right, confirmed before any code changed

Before touching anything, a fresh production build was started and checked by direct DOM measurement (`naturalWidth`/`complete`) and a screenshot — not assumed from the report alone (Falsification Before Confirmation). Two of the three complaints were real:

- **Bookshelf overlap — real.** The decorative walnut bookshelf (`centerX 51%`, native 50×48) and Knowledge's oak bookshelf (`centerX 55.5%`, native 47×49) had genuinely overlapping footprints — 42.32%–59.68% vs 47.34%–63.66%, a ~12-point overlap on the canvas's own percentage scale. This was a real defect from the Phase 1 reuse pass, not a rendering artifact.
- **Floating book — real.** The Research journal (`book-open.png`) had no supporting furniture. The earlier Visual Truthfulness pass had fixed its *visibility* (it wasn't rendering at all before that pass), but never gave it something to rest on.
- **"Empty" Desk zone — not reproduced.** DOM measurement on a fresh build showed `desk.png` loading correctly (`complete: true`) at its expected position, and a screenshot from this session confirmed it visually present. Most likely explanation: a stale/cached page or different dev-server state on the reporting screenshot's side, not a regression in this repository. Stated to the user at the time with the supporting evidence; not silently dismissed or blindly accepted.

### What changed, and why

**Knowledge / Research (the room's most visually broken area).** Knowledge's oak bookshelf — the dominant, interactive object — kept its position (`centerX 55.5%`); it already cleared the Desk with margin and the concept doesn't ask to move it, only its overlapping neighbor. The walnut bookshelf moved right (51% → 72.5%) and was scaled down to ~0.64× native display size (32×31 vs 50×48), so it reads as secondary rather than fighting the oak shelf for visual weight — directly answering the concept's "one dominant, one secondary" requirement. The Research journal is no longer a lone floating sprite: a genuine, previously-unused pack asset (a round pedestal side table, 16×32px, cropped from the same owned `TopDownHouse_FurnitureState1.png` sheet) now sits beneath it, and the journal is offset upward so it visually rests on the stand's top surface. Research's hotspot moved 67% → 83% to create real separation from the walnut bookshelf.

**Leadership.** Reviewed per the concept's request but not restructured — portraits already render as framed wall objects (not furniture), spaced with a visible gap, reading as a small gallery rather than one item. One real, smaller defect found on re-measurement: the click zone under-covered the left frame's left edge by about 0.3% of canvas width. Widened 14% → 16% to fully enclose both frames.

**Workspace/Desk decoration (monitor, keyboard, mouse, lamp, mug, pencil cup, notebook, blueprint).** **Blocked, not attempted.** No real asset files exist for any of these — only concept-sheet renderings and, for three of them (Monitor, Keyboard, Blueprint Roll), unfulfilled generation specs already sitting in `AI_GENERATION_REQUEST.md`. Building placeholder or recolored substitutes would violate Asset Truthfulness the same way a fabricated sprite would. See §4 below for the honest state of every item in this category.

**Furniture scale.** Reviewed each object's footprint independently rather than applying a uniform scale, per the task's own instruction. Desk and the oak bookshelf were left at native size — both already read at a believable scale relative to the room shell and to each other. The walnut bookshelf was the one object that needed an independent scale correction (see above); nothing else warranted one.

**Visual hierarchy — a real, unresolved conflict, not silently worked around.** See §1a below.

**Click zones and camera anchors.** Every hotspot's click zone was re-measured against its actual rendered sprite bounding box after repositioning — not carried over from the pre-reconciliation coordinates. Research's zone was rebuilt from scratch (8%×13% → 10%×25%) to cover the new stand+book combined footprint. Leadership's zone widened as noted above. Desk and Knowledge's sprites didn't move, so their already-correct zones (from the earlier Visual Truthfulness pass) needed no change. Camera scales (`cameraScale`) were left unchanged — see §1b for why moving Research's `x` target didn't require a scale change.

### 1a. The Visual Hierarchy conflict (explicit, per the task's own fallback instruction)

The concept asks for a room that reads **Leadership → Knowledge → Research → Workspace** without labels. The frozen `SPATIAL_BLUEPRINT.md` decision ("Option A: Priority-Anchored") assigns physical zones as **Zone 1 = Leadership, Zone 2 = Desk (Workspace), Zone 3 = Research** (Knowledge and Research both live in Zone 3, at different x-positions within it). Physically, left to right, the room reads **Leadership → Workspace → Knowledge → Research** — Workspace sits *second*, not *last*.

Reordering the physical zones to match the concept's narrative order isn't a coordinate change: `DOOR_GAPS` are baked into fixed pixel positions inside `floors-and-walls.png` per zone (left-wall door serves Zone 1, front-wall door serves Zone 2/Desk specifically — see `roomGeometry.ts`). Moving Desk to the room's *right* end would either strand a door in the wrong zone or require regenerating the room-shell PNG itself — a new asset, not a layout revision, and a change to a frozen architectural decision (`SPATIAL_BLUEPRINT.md`'s Option A) that this task's own brief says to preserve unless the conflict is explained and the smallest alternative proposed instead.

**Proposed smallest-viable alternative — not implemented without approval, since it touches a frozen decision's interpretation:** keep the physical zone order as-is, and rely on visual weight rather than left-to-right position to carry the hierarchy. This isn't a new idea invented to dodge the conflict — `EXPERIENCE_ARCHITECTURE.md` already reasons that Desk "wins first fixation" despite Leadership occupying the leftmost physical position, i.e., the room's design has never assumed raw x-position equals reading priority. Under this reading, hierarchy is already partly encoded: Knowledge's dominant oak bookshelf is the room's largest single silhouette after the Desk itself; Research's compound stand+book object is visually distinct and smaller, reading as "supporting" rather than "primary"; Leadership's two small wall frames are the room's quietest objects. If the user wants the *physical* order itself corrected rather than accepting weight-based hierarchy, that's a call this task didn't have standing to make unilaterally — flagged here rather than decided.

### 1b. Camera scale — checked, not silently reused

Research's `cameraScale` (2.4) was kept rather than recalculated, but this was checked, not assumed: at `x=83%, scale=2.4`, the camera's visible window (`50/scale` percent on each side of the target) extends to roughly 104% of canvas width — beyond the room shell's right edge. This is not a new problem introduced by this pass: the existing (pre-reconciliation) `CameraTestHarness` "coffee" test target (`x=83.9%, scale=2.2`) already reaches ~107%, further out than Research's new position reaches, and has shipped since Milestone 3 without a reported issue, because the room-shell PNG's own transparent canvas margin (outside `ROOM_CONTENT_BOUNDS`) absorbs the overshoot rather than exposing a hard edge or void. Research's new camera behavior sits within that same, already-accepted precedent.

---

## 2. Updated Asset Placement Table

| Object | Sprite / File | Rendered in | Purpose | Interactive? | Hotspot (center %, size) | Camera Target |
|---|---|---|---|---|---|---|
| Desk | `desk.png` (48×33) | `DeskHotspot.tsx` | Projects evidence surface | Yes | (38.7, 50), 18%×26% | `DESK_HOTSPOT` (38.7, 50, scale 2.2) |
| Oak bookshelf (dominant) | `bookshelf.png` (47×49) | `KnowledgeHotspot.tsx` | Knowledge evidence surface | Yes | (55.5, 50), 18%×37% | `KNOWLEDGE_HOTSPOT` (55.5, 50, scale 2.4) |
| Walnut bookshelf (secondary) | `walnut-bookshelf.png`, displayed at 32×31 (native 50×48) | `Workspace.tsx` (decorative layer) | Visual distinction — secondary shelf, no evidence surface of its own | No | — (no button) | — |
| Reading stand | `reading-stand.png` (16×32) | `ResearchHotspot.tsx` | Furniture support for the journal | Shared with journal | (83, 50), 10%×25% | `RESEARCH_HOTSPOT` (83, 50, scale 2.4) |
| Journal (open book) | `book-open.png` (16×16), offset −5.5556% in y from hotspot center | `ResearchHotspot.tsx` | Research evidence surface | Shared with stand | same button as stand | same as stand |
| Frame — abstract | `frame-abstract.png` (16×16) | `LeadershipHotspot.tsx` | Leadership wall gallery item 1 | Shared | (16.5, 50), 16%×26% | `LEADERSHIP_HOTSPOT` (16.5, 50, scale 2.2) |
| Frame — landscape | `frame-landscape.png` (16×16) | `LeadershipHotspot.tsx` | Leadership wall gallery item 2 | Shared | same button | same |
| Paper stack | `paper-stack.png` (16×16) | `Workspace.tsx` (decorative layer) | Desk surface dressing | No | — | — |
| Doors ×2 | `door-closed.png` (26×40) | `Workspace.tsx` | Architectural dressing | No | — | — |
| Room shell | `floors-and-walls.png` (288×144) | `Workspace.tsx` | Base layer | No | — | — |

---

## 3. Updated Geometry Table

Every coordinate changed by this pass, before → after. Anything not listed (Desk, Knowledge, doors, room shell) kept its coordinates unchanged — the task's own instruction to review scale/spacing independently didn't require moving objects that already cleared their neighbors.

| Constant / Value | File | Before | After |
|---|---|---|---|
| `RESEARCH_HOTSPOT.centerXPercent` | `roomGeometry.ts` | 67 | 83 |
| `RESEARCH_HOTSPOT.centerYPercent` | `roomGeometry.ts` | 50 | 50 (unchanged) |
| `RESEARCH_HOTSPOT.cameraScale` | `roomGeometry.ts` | 2.4 | 2.4 (unchanged — see §1b) |
| `RESEARCH_BOOK_Y_OFFSET_PERCENT` | `roomGeometry.ts` | — (didn't exist) | −5.5556 (new constant) |
| Walnut bookshelf `getSpritePlacement` centerX | `Workspace.tsx` | 51 | 72.5 |
| Walnut bookshelf display width/height | `Workspace.tsx` | 50×48 (native) | 32×31 (~0.64×) |
| Research click-zone width × height | `ResearchHotspot.tsx` | 8% × 13% | 10% × 25% |
| Leadership click-zone width | `LeadershipHotspot.tsx` | 14% | 16% (height 26% unchanged) |
| `ASSETS.readingStand` | `assets.ts` | — (didn't exist) | `/assets/furniture/reading-stand.png`, 16×32 (new entry) |

---

## 4. Remaining Asset Requirements — fresh audit

Not a reuse of the earlier `AI_GENERATION_REQUEST.md`/`VISUAL_PUNCHLIST.md` lists — a fresh determination of what's genuinely still missing after this pass, cross-referenced against those docs rather than duplicating them.

| Item | Priority | Reusable from owned packs? | AI-generate? | Dimensions (target) | Placement | Narrative role | Why needed |
|---|---|---|---|---|---|---|---|
| Computer / Monitor | P1 | No — checked both `FurnitureState1`/`2` and `SmallItems`, no desk-scaled monitor sprite exists | Yes — full spec already written (`AI_GENERATION_REQUEST.md` §Computer/Monitor) | ~24×20px (per existing spec) | Desk surface, centered toward the back edge | Establishes the Desk as a technical workspace, not just a writing surface | Concept and real narrative both require it; nothing in either pack substitutes without misrepresenting scale or object identity |
| Keyboard | P2 | No | Yes — spec written, explicitly contingent on Monitor generating first (`AI_GENERATION_REQUEST.md` §Keyboard) | ~16×8px | In front of Monitor | Completes the "workstation" read | Weak alone; only justified paired with Monitor |
| Blueprint Roll | P2 | No | Yes — spec written (`AI_GENERATION_REQUEST.md` §Blueprint Roll) | ~10×24px | Desk corner, angled | Engineering/technical-work signal distinct from the paper stack | Paper stack alone reads as generic paperwork, not technical drafting |
| Mouse | P1 candidate | No | Not yet spec'd | Small, pairs with Keyboard scale | Beside Keyboard | Completes the workstation cluster | Flagged in `AI_GENERATION_REQUEST.md`'s backlog as real but unwritten — full spec not yet produced |
| Pencil Cup | P2 candidate | No | Not yet spec'd | ~8×10px | Desk corner | Engineering/craftsmanship signal | Same — real candidate, no spec written yet |
| Desk Lamp | P2/P3 candidate | No — the real pack's lamp is standing-lamp-scaled, would misrepresent a desk lamp | Not yet spec'd | Desk-scaled, distinct from the pack's floor lamp | Desk corner | Warmth/lived-in signal | Genuine gap, not a duplicate — the existing pack asset doesn't fit despite being nominally "a lamp" |
| Coffee mug, desk plant, generic books, wall clock | — | **Yes — already owned/integrated or reusable, no generation needed** | No | — | — | — | Confirmed duplicates of assets already in the pack or already integrated; listed here only to state explicitly that they are *not* part of the remaining gap, per the "fresh audit, don't just repeat the old list" instruction |
| Desk notebook (distinct from Research's journal) | — | N/A | **Rejected** | — | — | — | `AI_GENERATION_REQUEST.md` already rejects this as redundant with the integrated `bookOpen` sprite; a second, distinct-narrative-slot notebook was held as "unclear" and never cleared the Decoration Principle bar — not resurrected here |

**Net effect on Workspace/Desk decoration (concept §4):** still blocked, same as before this pass — three items have complete generation specs waiting on external image generation (Monitor, Keyboard, Blueprint Roll), three are real candidates without specs yet (Mouse, Pencil Cup, Desk Lamp), and several concept-sheet items are already ruled out as duplicates. This reconciliation pass did not add or resolve any of this — it wasn't in scope, since generating or fabricating these would violate Asset Truthfulness regardless of how urgently the concept wants them.

---

## 5. Verification

**Static checks — all clean:**
- `npm run lint` — clean, no errors or warnings
- `npx tsc --noEmit` — clean
- `npm run build` — clean production build, all static routes generated (`/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`)

**Runtime checks — fresh production server (port 3110), verified by direct DOM measurement and screenshot, not visual judgment alone:**

| Check | Result |
|---|---|
| All images load | 11/11 `complete: true`, correct `naturalWidth`/`naturalHeight` — no silent load failures (the `priority`-prop bug from the Phase 1 pass did not recur) |
| No bookshelf overlap | Oak↔walnut gap: 34 screen px (≈3.3% canvas). Walnut↔reading-stand gap: 23 screen px (≈2.2% canvas). Both positive — no overlap |
| Research no longer floats | Journal renders offset above the reading stand, both sprites sharing one x-position, confirmed visually via screenshot and by coordinate math |
| Click zones ≥ sprite footprints | All four hotspot buttons' bounding boxes measured in a single script pass (to avoid a false alarm from cross-call scroll-offset drift — see `ENGINEERING_DECISIONS.md`) fully enclose their sprites' combined bounding boxes, with margin on every edge |
| No horizontal page overflow | `document.documentElement.scrollWidth === clientWidth` at both 1230px (desktop) and 400px (narrow) viewports |
| Responsive | At 400×700, all 11 images still `complete`, no overflow introduced |
| Keyboard accessibility / focus management | **Assumed unchanged, not re-verified this pass.** No DOM structure, element order, or focus logic changed — only inline `left`/`top`/`width`/`height` style values on buttons already covered by the earlier full audit (`ACCESSIBILITY_CHECKLIST.md`). Re-running that audit was judged unnecessary since nothing it tests (tab order, Escape, ARIA labels, focus-visible states) was touched; stated here as Assumed rather than claimed Verified, per this project's evidence-labeling convention |
| Cross-browser | Not re-run — no CSS mechanism changed (still `position: absolute` + percentage `left`/`top`/`width`/`height`, the same pattern already reviewed in `ASSUMPTIONS.md`'s cross-browser entries); new values, not new techniques |

No regressions found in any check that was run.
