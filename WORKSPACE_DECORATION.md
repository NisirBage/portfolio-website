# Workspace Decoration — Polish & Environmental Storytelling Pass

**Status:** One-time review record (like `CONCEPT_RECONCILIATION.md`, `REPOSITORY_REVIEW.md` before it), not a living document. Scope: reconcile the room with an updated layout concept and fully decorate the Workspace/Desk using a separately-supplied generated asset sheet — a polish pass, not a redesign. Architecture, hotspot system, camera system, layer engine, routing, content model, and the four frozen interaction mappings (Leadership→Portraits, Knowledge→Bookshelf, Research→Journal-on-stand, Workspace→Desk) were preserved, not touched.

---

## 1. Visual Revision Report

### What changed

**Workspace/Desk — the actual focus of this pass.** The desk went from a bare surface (just `desk.png`, no dressing) to 8 integrated items from the user-supplied generated sheet: Monitor, Keyboard, Mouse, Pencil Cup, Coffee Mug, Rolled Blueprint, Engineering Notebook, Desk Lamp. This directly answers the pass's stated highest-priority goal ("fully decorate the Workspace... arrangement should imply active work"). The old generic `paperStack` decoration was removed — the Notebook and Blueprint now cover the same "papers on the desk" narrative beat with more specificity, and keeping both would be the kind of redundant decoration the project's own Decoration Principle warns against.

**What did not change.** Leadership's frame placement, Knowledge's bookshelf, Research's stand+journal, and all four hotspot click zones (Desk, Knowledge, Research, Leadership) are exactly as they were after the prior Concept Reconciliation pass — reviewed against the updated concept and found to already satisfy this pass's preservation requirements (frames stay quiet/distinct, Knowledge stays the largest single object in the room, Research stays visually separate from Knowledge). No coordinates were changed outside the new `DeskDressing` component.

### Why the desk decoration wasn't a straightforward crop-and-place job

Three real problems surfaced during implementation, each with measurements behind the decision (documented in full in `ENGINEERING_DECISIONS.md`'s "Workspace Decoration" entry — summarized here):

1. **The generated sheet has no real alpha channel.** Its checkerboard "transparency" is drawn into flat RGB. Every sprite needed its background keyed out programmatically before it could be used.
2. **The generated art doesn't survive naive downscaling.** A first attempt sized items using the concept image's own desk-vs-object proportions (yielding 4–11px targets); at that size, every icon blurred into an unrecognizable smudge — verified visually, not assumed. Sizes were recalibrated against the real pack's own established "small item" convention (16×16, per `frame-abstract.png`/`book-open.png`/`paper-stack.png`) and legibility-tested per item, since simple silhouettes (mug, notebook) survived much smaller than detailed ones (monitor, lamp).
3. **The desk sprite is nearly too small to hold all 8 items.** `desk.png` is 48×33 native, frozen since Milestone 5. At their legibility-tested sizes, the 8 items' combined footprint (987px²) consumes almost the entire usable surface (~48×28px, before the front lip/legs begin). No fully non-overlapping arrangement of all 8 was achievable. Per the user's explicit instruction to surface this kind of constraint rather than silently work around it: two small, deliberate overlaps were kept (Keyboard/Mouse touch at their shared edge; Rolled Blueprint overlaps ~15% of its footprint against the Notebook, reading as "leaning against" it) rather than shrinking already-minimum-size items further or resizing the desk itself (an architectural change out of scope here).

A first placement attempt, judged safe by bounding-box math alone, turned out to be a real problem once rendered: a PIL composite of the actual sprite files at their planned positions (built because the Browser pane's screenshot tool was unavailable for this entire pass — every attempt timed out) showed the Desk Lamp visually swallowing roughly half of the Engineering Notebook, far worse than the 46% *bounding-box* overlap suggested once real alpha was considered. Repositioned based on the rendered composite, re-rendered to confirm (final Lamp↔Notebook overlap: negligible), then carried into code. This is recorded as a general lesson in `ENGINEERING_DECISIONS.md`: bounding-box math is a poor proxy for real visual collision on irregular sprites.

### What this pass explicitly did not attempt

The Leadership↔Knowledge↔Research↔Workspace physical zone-ordering conflict (flagged in `CONCEPT_RECONCILIATION.md`) remains unresolved and out of scope here — this pass was decoration, not zone reordering, and the prior pass's proposed alternative (visual weight over strict position) still stands as the live answer unless overridden.

---

## 2. Asset Placement Table

All 8 items are pure decorative dressing — no hotspot, no click handler, no new interaction zone (`DeskDressing.tsx` renders only `<Image>` elements). Position is expressed as room-canvas percent (the same coordinate space every other sprite in the room uses); rotation was not applied to any item (none of the source sprites needed it — the sheet's own orientation already matched the intended in-scene orientation for each).

| Asset | Position (canvas %) | Scale (native → rendered) | Rotation | Narrative Purpose |
|---|---|---|---|---|
| Monitor | (38.0%, 43.8%) — desk back-center | 193×136px sheet crop → 16×11px | None | Active technical work; the desk's primary focal object |
| Desk Lamp | (43.2%, 43.8%) — desk back-right | 151×124px crop → 16×13px | None | Focused/evening-work signal; the desk's second-largest object |
| Pencil Cup | (32.1%, 43.8%) — desk back-left | 106×142px crop → 8×11px | None | Hands-on/craftsmanship signal |
| Coffee Mug | (32.8%, 53.5%) — desk front-left | 137×126px crop → 11×10px | None | Human presence, lived-in signal |
| Keyboard | (38.7%, 52.8%) — desk front-center | 193×99px crop → 14×7px | None | Active technical work, paired with Monitor |
| Mouse | (42.5%, 53.5%) — desk front-center-right | 71×100px crop → 8×11px | None | Active technical work, paired with Keyboard |
| Engineering Notebook | (45.3%, 50.7%) — desk right | 138×164px crop → 10×12px | None | Records/documentation habit |
| Rolled Blueprint | (45.0%, 56.9%) — desk front-right corner | 119×146px crop → 9×11px | None | Technical/engineering design work, distinct from generic paperwork |

---

## 3. Geometry Table

No existing hotspot, camera target, or previously-placed sprite moved during this pass — every row below is a new addition, not a revision.

| Item | Old Coordinates | New Coordinates | Reason |
|---|---|---|---|
| `paperStack` (generic paper dressing) | `DESK_HOTSPOT + (7%, 4%)`, rendered | **Removed — no longer rendered** | Superseded by the Notebook + Blueprint, which cover the same narrative beat more specifically; kept redundant generic dressing would violate the Decoration Principle |
| `deskMonitor` (new) | — | offset (−2, −9)px from `DESK_HOTSPOT` center | New — see placement table |
| `deskLamp` (new) | — | offset (13, −9)px | New. First attempt used (15, −8); moved after a composite render showed it overlapping ~46% of the Notebook's bounding box |
| `deskPencilCup` (new) | — | offset (−19, −9)px | New |
| `deskCoffeeMug` (new) | — | offset (−17, 5)px | New |
| `deskKeyboard` (new) | — | offset (0, 4)px | New |
| `deskMouse` (new) | — | offset (11, 5)px | New |
| `deskNotebook` (new) | — | offset (19, 1)px | New. First attempt used (17, −1); moved to clear the repositioned Lamp |
| `deskBlueprintRoll` (new) | — | offset (18, 10)px | New. First attempt used (18, 9); moved slightly to reduce overlap with the repositioned Notebook |

All offsets are local pixel displacement from `DESK_HOTSPOT`'s own center (38.7%, 50%), converted to canvas percent via the existing `getSpritePlacement` helper — no new coordinate system was introduced.

---

## 4. Remaining Asset Requirements

Priority order, each cross-referenced against `AI_GENERATION_REQUEST.md` rather than repeating its content:

1. **Keyboard re-generation (P2).** The current 14×7px integration is the weakest result in this set — it reads as a plain dark rectangle, not a keyboard with visible keys, because the source art's internal detail (a grid of tiny keys) cannot survive downscaling to a legible desk-item size. **Narrative reason:** keyboards are core to the "active technical work" signal this pass targets. **Placement:** unchanged, already integrated. **Blocks anything?** No — it's functional as-is, just visually softer than its neighbors. **Reuse possible?** No existing-pack substitute exists. Would need a simpler-silhouette source generation (flatter color, less internal linework) to improve, not a placement or scale fix.
2. **Desk sprite drop-shadow consistency (P2, pre-existing, unrelated to this pass).** Still open per `VISUAL_PUNCHLIST.md`.
3. **Steam animation over the Coffee Mug (P2, pre-existing).** A CSS effect over the now-integrated mug sprite, not a new image asset. Still open.

No new P0/P1 gaps were created by this pass. Everything explicitly requested (Monitor, Keyboard, Mouse, Desk Lamp, Pencil Cup, Coffee Mug, Rolled Blueprint, Engineering Notebook) is integrated.

---

## 5. Verification

**Static checks — all clean:**
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean production build

**Runtime checks — fresh production server (port 3112), verified by direct DOM measurement (the Browser pane's screenshot tool timed out on every attempt this pass; PIL composites of the actual committed asset files substituted for visual review — see §1):**

| Check | Result |
|---|---|
| Sprite loading | 18/18 images `complete: true`, correct `naturalWidth`/`naturalHeight` |
| Layering | Confirmed via composite render — Blueprint (last in render order) sits visibly on top at its intended "leaning" position; no item is fully hidden behind another |
| Click zones | The existing Desk hotspot button (unchanged coordinates, `407–591px × 205–338px` at this viewport) fully encloses the desk sprite and all 8 new items — verified via `getBoundingClientRect()`, not visual judgment. No new interactive elements were added, so no new click-zone measurement was required |
| No overlap (beyond the two documented, deliberate ones) | All 8 item bounding boxes checked pairwise; only Keyboard/Mouse (touching) and Blueprint/Notebook (~15% overlap) intersect — both intentional and documented |
| No overflow | `document.documentElement.scrollWidth === clientWidth` at 1230px and 400px viewports |
| Responsiveness | 400×700 viewport: all 18 images still `complete`, no overflow introduced |
| Clipping | All 8 new items' bounding boxes fall fully within the desk sprite's own bounding box — none extend past the desk's drawn edge |
| Accessibility | Not re-run — no interactive surface changed (`DeskDressing` has zero buttons/links), so tab order, focus management, and ARIA labeling are unaffected by construction, not by assumption |

---

## 6. Final Self Review

Answered directly, per the request to be critical rather than to simply state it "looks good."

**1. Does the room immediately communicate who works here?** Partially, and better than before this pass. The Desk now visibly signals "engineer at a computer, mid-work" (monitor, keyboard, mouse, blueprint, notebook) rather than reading as an empty prop. The Knowledge and Research zones already signaled "someone who reads and researches." What's still missing from a first-glance read: nothing in the room currently signals the *Leadership* content's specific domain (debate/MUN) — the two frames are generic picture-frame silhouettes with no visible content at this resolution, so "who works here" reads clearly for the technical/research identity but not for the leadership one, and that's an honest gap, not a fixed one.

**2. Is Leadership visually distinct from Knowledge?** Yes — different wall color (sage green vs. cream), radically different object type (small wall frames vs. a large freestanding bookshelf), and Leadership is deliberately the quietest zone in the room. No ambiguity between them.

**3. Is Knowledge visually distinct from Research?** Yes, and this was the specific defect the prior Concept Reconciliation pass fixed (real overlap, now a measured ~3.3% canvas gap) — not re-broken by this pass, since Research wasn't touched.

**4. Does the Workspace finally look like an engineer's workspace?** Yes, materially more than before — this is the biggest honest improvement from this pass. It went from a bare surface to a recognizable working cluster (monitor+keyboard+mouse centered, lamp and notebook for evening/documentation work, pencil cup and mug for the human/craft signal, a blueprint for technical-design specificity). The one honest caveat: the Keyboard specifically doesn't read as crisply as its neighbors (see Remaining Requirements #1) — it contributes correctly by position and color but not by fine detail.

**5. Would a first-time visitor understand the room without reading any text?** Mostly. Desk = work, Bookshelf = knowledge, and the reading stand + journal read as "research in progress" reasonably well. Leadership is the weakest of the four on this specific test — two blank-content frames on a wall don't obviously say "leadership" without the panel text, though they do clearly say "this matters enough to be framed and displayed," which is directionally correct even if not fully self-explanatory.

**6. Is every decorative object justified?** Yes for the 8 added this pass — each was chosen from the generated sheet specifically because it answers "what does this tell a visitor" (monitor/keyboard/mouse = active technical work; lamp = focused/evening work; notebook = documentation habit; blueprint = technical-design specificity, not generic paperwork; mug = human presence; pencil cup = hands-on craftsmanship). Nothing was added because empty space existed — the 22 unused sheet items (calculator, wall clock, cable bundle, USB/SSD drives, folders, binders, sticky notes, etc.) were deliberately left out because they weren't requested and weren't independently justified this pass.

**7. Is there any remaining visual debt?** Yes, three items, all logged rather than glossed over: (a) the Keyboard's soft/illegible detail at its current size; (b) the unresolved Leadership↔Knowledge↔Research↔Workspace physical zone-ordering conflict against the concept's requested reading order, carried over from the prior pass; (c) the generated sheet's own rendering style (soft gradient shadows) doesn't actually match the real pack's flat hard-outline style, which is a permanent, structural mismatch between the two art sources now visible side-by-side in the same room, not something a placement pass can fix.

**8. If this were your portfolio, what would you improve next?** Two things, in order: first, a regenerated Keyboard with a flatter, simpler silhouette that survives small-scale rendering (the specific, narrow fix from #1) — it's the one piece of this pass that doesn't fully deliver. Second, and bigger: some visible content on the Leadership frames themselves (even a simple silhouette/color distinction between the "portrait" and "certificate" frames) so that zone passes the same "readable without text" bar the other three now clear — right now it's the one zone whose narrative depends entirely on the panel, not the room.
