# Asset Registry — The Studio

**Status:** Source of truth under the Asset Truthfulness Protocol. Every entry below was confirmed by direct pixel-level inspection (upscaled 4–5× with nearest-neighbor scaling, not memory or inference from a thumbnail) on this pass. Anything not in this file is either not yet verified or doesn't exist — check [MISSING_ASSETS.md](MISSING_ASSETS.md) before assuming.

Two corrections came out of this verification pass, both now reflected in [EXPERIENCE_ARCHITECTURE.md](EXPERIENCE_ARCHITECTURE.md) and [ASSET_MAPPING_V2.md](ASSET_MAPPING_V2.md):
1. The room background (`TopDownHouse_FloorsAndWalls.png`) is a **complete, pre-built rectangular room** with a solid four-wall border and pre-cut door openings — not a set of modular tiles I'd assemble into an L-shape. "Single Continuous L-Shaped Studio" was wrong; it's a single rectangular studio. This is actually good news: less compositing work, not more.
2. There are **two distinct clock sprites**, not one as previously assumed — a floor-standing grandfather clock (`FurnitureState1`) and a small round wall clock (`SmallItems`). The grandfather clock is specified as the Clock hotspot asset below; the wall clock is logged as an available but unused alternative.

---

## Top-Down Retro Interior — `TopDownHouse_FurnitureState1.png` (208×288px)

| Asset Name | Category | States | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|---|
| Wood desk | Furniture — surface | 1 (single sprite, no alt state in this sheet) | The Desk (hub) | Primary hotspot | Execution | **VERIFIED, INTEGRATED** — cropped to `public/assets/furniture/desk.png` (48×33px, source crop box 0,31–48,64) post-Milestone-8; rendered as a real `<Image>` in `DeskHotspot.tsx`, not just registered |
| Oak bookshelf (open-shelf, visible books) | Furniture — storage | 1 | Bookshelf hotspot | Primary hotspot | Knowledge (*revised, Milestone 7 — no longer also Research; see `NARRATIVE_SYSTEM.md`*) | **VERIFIED, INTEGRATED** — cropped to `public/assets/furniture/bookshelf.png` (47×49px, source crop box 31,63–78,112) post-Milestone-8 |
| Walnut bookshelf (with drawers, darker wood) | Furniture — storage | 1 | Zone 3/4 boundary ambient dressing, secondary to Knowledge's oak bookshelf | None (decorative-tier) | Visually distinguishes Knowledge and Research as two objects, not one shelf | **VERIFIED, INTEGRATED** — cropped to `public/assets/dressing/walnut-bookshelf.png` (50×48px, source crop box 93,64–143,112), rendered in `Workspace.tsx`. *Revised, Concept Reconciliation:* repositioned from centerX 51% to 72.5% (its original position genuinely overlapped the oak bookshelf) and displayed at ~0.64× native size (32×31) so it reads as the secondary shelf, per the concept's "one dominant, one secondary" requirement — see `ENGINEERING_DECISIONS.md`. |
| Round pedestal side table | Furniture — decor | 1 | Research hotspot — reading stand beneath the journal | Part of the Research hotspot (shared click zone with the journal) | Furniture support for the journal, replacing the previous floating-book presentation | **VERIFIED, INTEGRATED** — cropped to `public/assets/furniture/reading-stand.png` (16×32px, source crop box 176,0–192,32), rendered in `ResearchHotspot.tsx`. Added during the Concept Reconciliation pass; a genuine, previously-unused pack asset, not a fabricated or recolored substitute. |
| Grandfather clock | Furniture — decor | 1 | Clock hotspot | Primary hotspot | Growth over time | **VERIFIED** |
| Wood stove (black cast iron, with flue pipe) | Furniture — decor | 1 | Ambient dressing near Coffee Corner, no hotspot | None (decorative-tier) | "Lived-in" signal | **VERIFIED**, decorative only |
| Standing mirror (grey frame) | Furniture — decor | 1 | Not currently assigned | — | — | **VERIFIED**, unused |
| Armchairs, sofas (orange, multiple orientations) | Furniture — seating | Several color/orientation variants in this sheet, more in `FurnitureState2` | Ambient dressing near Leadership Wall / Coffee Corner | None | "Lived-in" signal | **VERIFIED** |
| Kitchen counter unit (stove + sink + cabinets, includes an L-shaped counter run) | Furniture — kitchen | 1 | Coffee Corner backdrop | None (Coffee Mug is the actual hotspot, not the counter) | Curiosity | **VERIFIED** |
| Refrigerator | Furniture — kitchen | 1 | Coffee Corner dressing | None | — | **VERIFIED**, decorative only |
| Bathroom fixtures (tub, sink, toilet) | Furniture — bathroom | 1 set | None | None | None — no narrative fit | **VERIFIED**, confirmed **Do Not Use** (per Asset Mapping V2) |
| Dining table, chairs, side tables, rugs, coat rack, floor lamps, vanity, ironing board | Furniture — misc | Various | None currently | None | — | **VERIFIED**, unused; candidates for future ambient dressing only |

## `TopDownHouse_FurnitureState2.png` (208×288px)

Same categories as State 1, alternate color palette (e.g., green sofas instead of orange) and some open/in-use variants (cupboard doors ajar, etc.). Re-scanned in full during the Phase 2 audit (post-Milestone-8) — one genuinely new item not present in State 1: a small record player / turntable (bottom-right corner). **Not recommended for use** — no narrative basis exists anywhere in this project's real content (nothing in the Identity Interview, resume, or project content establishes music/vinyl as a real interest); using it would be exactly the "decoration that communicates nothing" the Decoration Principle warns against. Logged here for completeness, not proposed as a candidate.

| Asset Name | Current Usage | Status |
|---|---|---|
| Alt-state furniture set | Reserved for the "visited" state treatment on the Bookshelf (a book pulled partway out) — not yet built | **VERIFIED** sheet exists; specific frame-level mapping to the "visited" animation not yet done — treat as **LIKELY** until Phase 3 confirms exact sprite coordinates |

## `TopDownHouse_SmallItems.png` (128×128px)

| Asset Name | Category | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| Mug (4 color variants: cream, brown, tan, purple) | Small item | Coffee Mug hotspot | Primary hotspot | Curiosity | **VERIFIED** |
| Green teapot | Small item | Not currently assigned | Could substitute or accompany the mug in Coffee Corner dressing | Curiosity | **VERIFIED**, unused |
| Picture frame, filled (2 variants — abstract art / landscape content baked into the sprite) | Small item | Leadership Wall — certificate frames | Primary hotspot (clustered gallery) | Trust / external validation | **VERIFIED, INTEGRATED** — cropped to `public/assets/furniture/frame-abstract.png` and `frame-landscape.png` (16×16px each) post-Milestone-8; rendered in `LeadershipHotspot.tsx` as a small two-frame cluster, not the full fan-out gallery (that remains Should-Have per `VERSION1_SCOPE.md`) |
| Picture frame, blank (plain canvas, no content baked in) | Small item | Leadership Wall — **Whiteboard sub-object**, corrected from "reuse a filled frame" in the original Interaction Specification draft | Sub-hotspot within the Leadership cluster | Structured thinking (case-comp framework) | **VERIFIED** — this is a better match than the filled-frame reuse originally proposed, since it starts visually blank and the "sketch" content is added in the modern panel, not implied over an existing image |
| Loose paper stack (two offset sheets) | Small item | **Superseded, removed from the desk** | — | — | **VERIFIED** asset still exists at `public/assets/dressing/paper-stack.png` (16×16px, source crop box 32,16–48,32 in `SmallItems.png`), but is **no longer rendered** — the "polish and environmental storytelling" pass replaced it with the more specific Engineering Notebook + Rolled Blueprint (see Generated Desk Set below), which cover the same "papers on the desk" narrative beat with more particularity. File kept on disk, not deleted, per no-destructive-cleanup-without-need; simply unregistered from `assets.ts`. |
| ~~Folder stack (brown)~~ | Small item | — | — | — | **CORRECTION, post-Milestone-8:** this entry was a misidentification. Direct pixel inspection during the Phase 1 reuse pass found the item at this approximate sheet position is a treasure-chest sprite (lid line, latch detail), not folders — fantasy-adjacent, doesn't fit the cozy-study aesthetic, and isn't what the label claimed. No folder-appropriate sprite was found elsewhere in either owned pack after a full re-scan. Removed as a reuse candidate; logged as a genuine gap in `AI_GENERATION_REQUEST.md` instead of forced into use, per Asset Truthfulness ("do not recolor unrelated sprites into inaccurate substitutes"). |
| Small round wall clock | Small item | Timeline hotspot's sprite (Phase F.2) | Primary hotspot visual for Timeline | Timeline | **VERIFIED, INTEGRATED, Phase F.2** — this row correctly flagged the small round clock as an unused alternative to the Phase D generated clock (32×43, visually dominant per direct user feedback); now the active asset. Cropped as `public/assets/narrative/wall-clock.png` (15×15px, tight-bboxed from source region x:80–95,y:15–32 in `SmallItems.png`), rendered in `ClockHotspot.tsx`. The Phase D generated clock (`ASSETS.clock`'s old file, `clock.png`) remains on disk, unregistered. See `ENGINEERING_DECISIONS.md`'s Phase F.2 entry. |
| Potted plant, flower bouquet in vase (2 items) | Small item | Ambient decoration (per Content Hierarchy's Decorative tier) | Hover only, no click | Continuous learning | **VERIFIED** |
| Books (open, closed) | Small item | Research Journal's establishing-shot sprite (open variant); closed variant was briefly the Contact **and** Resume hotspots' interim sprite (Phase F.2; Resume's interim use added and then superseded again within post-Phase-H.2) | Primary hotspot visual for Research | Research | **VERIFIED, INTEGRATED** — the open-book crop (`public/assets/furniture/book-open.png`, 16×16px, source crop box 0,48–16,64 in `SmallItems.png`) is rendered in `ResearchHotspot.tsx`, resolving Visual Truthfulness's "hidden hotspot" finding for the one built hotspot that still had no sprite. Knowledge's own visual comes from the bookshelf furniture sprite (separate entry above), not this one. *Revised, Concept Reconciliation:* now positioned resting on the reading stand, offset upward from its own hotspot center. **Closed variant, Phase F.2:** cropped as `public/assets/narrative/ledger.png` (7×8px, tight-bboxed from source region x:17–31,y:52–65 in `SmallItems.png`); rendered in `RolodexHotspot.tsx` as the Contact hotspot's sprite through Phase F.2, and briefly in `PortfolioHotspot.tsx` too as a post-Phase-H.2 interim proportion fix. **No longer rendered anywhere as of post-Phase-H.2** — both hotspots moved to real, user-supplied art (a telephone and a folder; see the "User-Supplied Pixel Art" section below). `ledger.png`, `ASSETS.portfolio`, and `ASSETS.rolodex` all stay registered as historical record, per this registry's "corrected, not erased" convention. See `ENGINEERING_DECISIONS.md`'s Phase F.2 and Phase H.2 entries. |
| Food/kitchen items (plates, pots, bottles, jars, wine glasses) | Small item | Not currently assigned | None planned | None — no narrative fit found | **VERIFIED**, confirmed **Do Not Use** |
| Misc (rubber duck, key rack, hanger, fishbowl, lamp) | Small item | Not currently assigned | None planned | None — no narrative fit found | **VERIFIED**, confirmed **Do Not Use** |

## `TopDownHouse_DoorsAndWindows.png` (288×160px)

| Asset Name | Category | States | Current Usage | Status |
|---|---|---|---|---|
| Window (4-pane square, 2-pane horizontal, small arched-transom variants; 2 color groups) | Architecture | 6 variants | Future hotspot's sprite (Phase F.2): the 4-pane square variant | **VERIFIED, INTEGRATED, Phase F.2** — cropped as `public/assets/narrative/window-small.png` (25×28px, tight-bboxed from source region x:97–127,y:51–80 in `TopDownHouse_DoorsAndWindows.png`), rendered in `WindowHotspot.tsx`, replacing the Phase D generated window (40×41, visually dominant per direct user feedback — its old file, `window.png`, remains on disk, unregistered). Chosen over the sheet's wide 2-pane picture window and its small wide arched-transom window because it's the only one that's actually square in proportion — the plainest, most ordinary-reading option of the three. See `ENGINEERING_DECISIONS.md`'s Phase F.2 entry. |
| Door (plain frame, solid, ajar; 3 wood-tone finishes) | Architecture | ~9 variants | Not used as a hotspot (no "walk through a door" mechanic in the hub model) — available for establishing-shot dressing only | **VERIFIED**, decorative use only |
| Staircase (straight, with banister) | Architecture | 2 variants | **Retired** — the mezzanine/stairs mechanic from Phase 1 no longer applies (Window is now reached by camera tilt, not a physical stair) | **VERIFIED** asset exists, confirmed **Do Not Use** under the current architecture |

## `TopDownHouse_FloorsAndWalls.png` (288×144px)

| Asset Name | Category | Current Usage | Status |
|---|---|---|---|
| Complete rectangular room shell — 4 material zones (sage rug, rust wall/brick wainscoting, tan wood-paneled wall, orange tiled zone), full 4-wall border, 2 pre-cut door openings, 1 floor vent detail | Background / room shell | Base layer for the entire establishing shot | **VERIFIED** — this is one complete asset, not a tile system requiring assembly. Confirms Experience Architecture's "single continuous scene" is directly buildable from this one file with no compositing risk. Door-gap coordinates pixel-measured during Milestone 2 (`ENGINEERING_DECISIONS.md`): left-wall gap x≈13–15/y≈33–78 (Zone 1); front-wall gap x≈88–135/y≈128–130 (Zone 2 — corrects `SPATIAL_BLUEPRINT.md`'s original "near the Zone 1/2 boundary" estimate). |

## `TopDownHouse_FloorsAndWalls_OpenDoors.png` (128×48px)

| Asset Name | Status |
|---|---|
| Door-open variant of the wall strip | **VERIFIED** exists; confirmed **Do Not Use** (no walk-through-door mechanic needed) |

---

## Generated Desk Set

Not sourced from either owned pack — a separate, user-supplied, AI-generated sheet (`generated_asset_sheet.png`, 30 labeled items, 1536×1024px) integrated during the "polish and environmental storytelling" pass. Per the Concept Reference vs. Style Reference rule, this sheet is an **Asset Reference** (its content used as-provided, not reinterpreted) rather than a Style Reference — its own rendering (soft gradient drop-shadows, higher internal line detail) does not actually match the real pack's flat hard-outline style, despite the sheet's own claim of matching it. This deviation is used anyway, per explicit instruction to use the generated sprites "exactly as provided," and is documented here and in `ENGINEERING_DECISIONS.md` rather than silently corrected.

The sheet has no real alpha channel — its checkerboard "transparency" is drawn into flat RGB — so every crop required background keying (near-neutral pixels, lightness ≥233, channel spread ≤10, removed to alpha 0) before use, plus a legibility-tested downscale (crop → shrink → nearest-neighbor upscale re-inspection, same verification discipline as the real pack's own crops) since the source art does not survive downscaling to true low-res pixel-art density uniformly — flat/simple shapes (mug, notebook) stayed legible far smaller than detailed ones (monitor, lamp).

| Asset Name | Sheet Position | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| 01 Monitor | Row 1, col 1 | **Superseded, post-Phase-H.2** — no longer rendered | None (decorative-tier) | Active technical work | **VERIFIED**, `public/assets/desk/monitor.png`, 16×11px, still on disk but unregistered from `DeskDressing.tsx`'s item list. Replaced, together with Keyboard and Mouse below, by one real user-supplied sprite — see "User-Supplied Pixel Art" below |
| 02 Keyboard | Row 1, col 2 | **Superseded, post-Phase-H.2** — no longer rendered | None | Active technical work | **VERIFIED**, `desk/keyboard.png`, 14×7px, no longer rendered. (Its own legibility was already logged as the weakest of the original set — a plain dark rectangle rather than a detailed keyboard — before this supersession.) |
| 03 Mouse | Row 1, col 3 | **Superseded, post-Phase-H.2** — no longer rendered | None | Active technical work | **VERIFIED**, `desk/mouse.png`, 8×11px, no longer rendered |
| 04 Rolled Blueprint | Row 1, col 4 | Desk surface, front-right corner | None | Technical/engineering design work, distinct from generic paperwork | **VERIFIED, INTEGRATED** — `desk/blueprint-roll.png`, 9×11px |
| 06 Engineering Notebook | Row 1, col 6 | Desk surface, back-right | None | Records/documentation habit | **VERIFIED, INTEGRATED** — `desk/notebook.png`, 10×12px. Supersedes the earlier generic `paperStack` dressing (removed — more specific evidence now covers the same "papers on the desk" narrative beat) |
| 08 Pencil Cup | Row 2, col 1 | Desk surface, back-left corner | None | Hands-on/craftsmanship signal | **VERIFIED, INTEGRATED** — `desk/pencil-cup.png`, 8×11px |
| 11 Coffee Mug | Row 2, col 4 | Desk surface, front-left | None | Human presence, lived-in signal | **VERIFIED, INTEGRATED** — `desk/coffee-mug.png`, 11×10px |
| 21 Desk Lamp | Row 3, col 6 | Desk surface, back-right corner | None | Focused/evening work signal | **VERIFIED, INTEGRATED** — `desk/desk-lamp.png`, 16×13px |

The remaining 22 items on the sheet (Mechanical Pencil, Fountain Pen, Desk Plant, Cable Bundle, USB/SSD Drive, Folder, Closed/Open Binder, Sticky Notes, Document Tray, Monitor Stand, Mouse Pad, Books ×2, Research Papers, Open Notebook, Calculator, Wall Clock, Desk Organizer) were not requested for this pass and were not evaluated for integration — not a rejection verdict, simply out of the explicit 8-item scope given. See `CONCEPT_RECONCILIATION.md`'s remaining-requirements section (from the prior pass) for related triage of overlapping candidates.

---

## Gramophone Asset

Not sourced from either owned pack, and not from the "Generated Desk Set" sheet above — a separate, user-supplied, AI-generated sheet (`ChatGPT Image Jul 15, 2026, 05_35_48 PM.png`, 1254×1254px) supplied specifically for Phase A's ambient-audio feature. Per the Concept Reference vs. Style Reference rule, this is an Asset Reference (used as-provided), not a Style Reference. Background is a solid near-black panel color (sampled directly, not assumed), not a checkerboard — a different removal technique from the Generated Desk Set's checkerboard keying, same underlying principle (near-neutral, low-variance pixels removed to alpha 0).

| Asset Name | Sheet Location | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| Gramophone body | "16×16 BASE ICON" panel | Room floor, right of the Research reading stand | The ambient-audio toggle itself | A believable room object, not a floating UI control | **VERIFIED, INTEGRATED** — `gramophone/gramophone.png`, 18×21px (legibility-tested: 18px is the smallest width the horn/cabinet silhouette survives at; 14px was an unrecognizable blur) |
| Muted-state badge | "STATES → MUTED" panel | Corner accent on the gramophone body when muted | Same button, visual state only | Muted-state indicator | **VERIFIED, INTEGRATED** — `gramophone/badge-muted.png`, 14×17px |
| Playing-state badge | "STATES → PLAYING" panel | Corner accent on the gramophone body when playing | Same button, visual state only | Playing-state indicator, paired with a CSS bounce+glow | **VERIFIED, INTEGRATED** — `gramophone/badge-playing.png`, 14×13px. The reference sheet's own "note" glyph is intricate relative to its size — legible at 14px, would not have survived downscaling further (tested at 8px and 10px, both unrecognizable) |
| 32×32 preview | Top-left panel | Not used | — | Reference only, not a separate asset | **VERIFIED exists**, not integrated — purely a larger reference rendering of the same base icon, no new information |

## UI Glyph Assets

| Asset Name | Source | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| ESC keycap | `kb_dark_symbols.png`, user-supplied "Controllers and Keyboard" pack, real alpha channel (no keying needed) | `LayerPanel`'s Close button, beside the ✕ glyph | Visual hint only, not itself clickable | Makes the Escape shortcut discoverable, not just functional | **VERIFIED, INTEGRATED** — `ui/key-esc.png`, 13×14px, used at native scale |

**What the same folder does *not* contain, despite being described as if it might**: a dedicated Check/Confirm, Close, Search, or Information icon. Verified by direct inspection of every file in the folder (`controller_minimal/ps/switch/xbox.png`, `cursors.png`, `kb_dark/kb_light_all/alphanumeric/symbols.png`, `mouse.png`, `sticks.png`) — it contains keyboard keys, controller buttons, a mouse, and cursor icons, nothing else. The popup's ✕ (Close) and ✓ (Done) controls use styled text glyphs instead, consistent with this codebase's existing convention (the accordion's own "+"/"−" indicators are plain text, not sprites) rather than a fabricated pixel icon standing in for an asset that doesn't exist in the supplied pack. Controller/gamepad icons were reviewed and explicitly not used, per direct instruction ("not for the portfolio UI... ignore unless controller support is ever implemented").

---

## Sprout Lands UI Pack — assets actually slated for use

| Asset Name | Filename | Dimensions | Current Usage | Status |
|---|---|---|---|---|
| Pixel font | `fonts/pixelFont-7-8x14-sproutLands.ttf` | N/A (font file) | Not integrated | **CORRECTION, Phase G:** this row's own "VERIFIED" meant the file was confirmed to exist in the *source* pack, not that it was ever actually copied into `public/` or wired up via `@font-face` — neither is true, confirmed by direct inspection while looking for a game-appropriate typeface for the Save Slot screen. No component anywhere in this codebase references it. Corrected rather than left to mislead a future pass into citing it as a working asset; the Save Slot uses the already-integrated `--font-geist-mono` instead. See `ENGINEERING_DECISIONS.md`'s Phase G entry. |
| Triangle mouse cursor | `Sprite sheets/Mouse sprites/Triangle Mouse icon 1.png` | 16×16px | Custom cursor while hovering the scene | **VERIFIED** |
| Small dialog box | `Sprite sheets/Dialouge UI/dialog box small.png` | 112×48px | Ambient hotspot hover tooltips only | **VERIFIED** |
| Icon set | `Sprite sheets/Icons/All Icons.png` | 288×48px | Small accent glyphs in modern panels (checkmark, link icon — specific glyphs not yet cropped/identified individually) | **LIKELY** — sheet exists and is usable, but I have not yet isolated the exact checkmark/link-icon sprite coordinates within it. Treat glyph-level selection as pending Phase 3 work, not yet VERIFIED at that granularity. |

Everything else in the Sprout Lands pack retains its **Do Not Use** verdict from `ASSET_MAPPING_V2.md` (inventory/emoji/weather assets, Teemo emotes, cat-paw cursors, settings UI, pixel-styled buttons) — that audit was already asset-truthful and doesn't need correction.

---

## Narrative Set — Phase D (Clock, Coffee Corner, Window)

Sourced from a separate, user-supplied, AI-generated sheet (`ChatGPT Image Jul 15, 2026, 10_20_11 PM.png`, 1536×1024px), the canonical source per explicit instruction ("do not redesign, use directly, crop cleanly"). Each of the three is a small still-life scene rather than a single isolated object — the Clock is a full mantel clock with case and pendulum; the Coffee Corner keeps its mug, its stack of three books, and its notebook; the Window keeps its 4-pane sky/mountain view, its potted plant, and its stacked books.

Two separate background-removal techniques were needed, not one uniform pass: the Clock's green card background was distant enough in color from the clock itself for a global color-distance threshold; the Coffee Corner's tan card background was *not* distant enough from the mug's own cream color (a global threshold destroyed the mug, eating holes through its body) and needed a flood-fill instead, which only clears pixels contiguous with a confirmed background seed and leaves an enclosed shape like a mug untouched regardless of color similarity. The Window needed almost no keying at all — its own wood frame fills nearly the entire card, so only the four corner slivers of the outer picture-frame border needed clearing.

All three were legibility-tested the same way as every other generated asset in this project (crop → downscale → nearest-neighbor upscale → re-inspect) before their final size was chosen — each stayed clearly readable, every element in the scene individually distinguishable, well below native size.

| Asset Name | Sheet Location | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| Clock | Left card | Wall-mounted above the Desk/Knowledge floor line (`CLOCK_HOTSPOT`) | Opens the Timeline panel | "What moments changed the direction of things" | **VERIFIED, INTEGRATED** — `narrative/clock.png`, 32×43px |
| Coffee Corner | Middle card | Wall-mounted/shelf above the Research/Gramophone floor line (`COFFEE_HOTSPOT`) | Opens the About Me panel | The human section, beyond the resume | **VERIFIED, INTEGRATED** — `narrative/coffee-corner.png`, 32×32px |
| Window | Right card | Upper wall, unchanged position from the retired `CameraTestHarness` "window" test target | Opens the Future panel | Vision, goals, what's next | **VERIFIED, INTEGRATED** — `narrative/window.png`, 40×41px |

**Placement note.** All three were originally going to reuse `CameraTestHarness`'s old floor-level test coordinates directly (Design For Deletion, the same pattern DESK_HOTSPOT and LEADERSHIP_HOTSPOT already followed) — but the room's floor line turned out to be packed edge to edge with no room left for two more compound objects (measured, not assumed: the real gap between Knowledge and the walnut bookshelf is only ~2.4 points wide). Clock and Coffee Corner were moved up onto the wall instead, at a fresh y-coordinate, reading as shelf objects above the desk/bookshelf line rather than floor furniture — see `roomGeometry.ts`'s own comment on `CLOCK_HOTSPOT`/`COFFEE_HOTSPOT` for the full measurement. Window kept its original coordinates unchanged, since it was already wall-height and never competed with the floor line.

**Style note**, the same one already on record for the Generated Desk Set and the Gramophone: this sheet renders with soft internal shading (a gradient-highlighted clock face, a shaded sky) that the base "Top-Down Retro Interior" pack's flat, hard-outline sprites don't have. Used as-provided per explicit instruction rather than redrawn to match the pack — the deviation is documented, not hidden.

**Motion note.** The brief asked for a pendulum swing (Clock) and drifting clouds (Window), with an explicit fallback for both: "otherwise keep static." Both `clock.png` and `window.png` are single flattened crops with no separate pendulum or cloud layer to animate independently — animating the whole sprite would swing the case or shift the frame along with it, the same category of mistake already ruled out for the Gramophone's horn. Both stay static, per the brief's own fallback, rather than faking motion. A follow-up asset request (a pendulum-only or cloud-only sprite, transparent background) is the real fix if this becomes a priority — see `MISSING_ASSETS.md`. The Coffee Corner's steam, by contrast, got real motion: the source crop's own baked-in steam didn't survive background-keying intact, so the rising steam in the room is three small CSS-animated wisps instead (`CoffeeHotspot.tsx`), not a fabricated sprite.

**Superseded, Phase F.2.** The Clock and Window rows in the table above describe the generated assets as originally shipped in Phase D — both are now unregistered (files remain on disk, no code references either). A direct user report ("visually dominant," "far too large... draws attention away from the room") triggered Phase F.2's asset-replacement pass, which repointed `ASSETS.clock` and `ASSETS.window` at sprites cropped directly from the native "Top-Down Retro Interior" pack instead — see the corrected rows in `TopDownHouse_SmallItems.png`'s and `TopDownHouse_DoorsAndWindows.png`'s own tables above, and `ENGINEERING_DECISIONS.md`'s Phase F.2 entry for the full reasoning. Coffee Corner is unaffected — it was already retired as the About Me hotspot's visual in Phase F.1 (superseded by the Corkboard), and Phase F.2's brief didn't touch About Me.

---

## Save Slot Frame and Continue Button — Phase G

Sourced from a third user-supplied, AI-generated sheet (`ChatGPT Image Jul 16, 2026, 02_00_02 PM.png`, "GBA-Inspired Loading Screen Asset Sheet (Tier 2)," 1536×1024px), the stated production source for the new intro/boot sequence — flat RGB like the Generated Desk Set and Gramophone sheets before it, no real alpha channel, requiring background keying rather than a direct alpha-preserving crop.

| Asset Name | Sheet Location | Current Usage | Interaction | Status |
|---|---|---|---|---|
| Save Slot frame | Section 1, "Standard (Recommended)" variant | The intro sequence's Save Slot screen, background art | None directly (decorative, `alt=""`) | **VERIFIED, INTEGRATED** — `intro/save-slot-frame.png`, 399×371px. The frame's own baked "Play Time 00:00:00" and "▶ Continue" pixels were surgically erased (tiled-texture patch from a verified-clean donor region on the same card) and rebuilt as real, live DOM elements in `SaveSlot.tsx` — see `assets.ts`'s own comment and `ENGINEERING_DECISIONS.md`'s Phase G entry for why. The baked name/subtitle/builder/header text was left untouched (real and accurate, paired with an `sr-only` equivalent rather than re-rendered). |
| Continue button chrome | Cropped from *within* the same Standard frame's own button region, before erasure | The Save Slot's real `<button aria-label="Continue">` | Advances the intro to the room | **VERIFIED, INTEGRATED** — `intro/continue-button.png`, 356×56px. Deliberately not Section 5's standalone "▶ Continue" button (223×72, ≈3.1:1) — a different aspect ratio than this frame's own button slot (356×56, ≈6.4:1); stretching one to fit the other would have visibly distorted it. Cutting the chrome from the frame's own button preserves it exactly as authored, with zero seam where it recombines with the erased frame. |

Section 5's standalone button row (Continue/A-Continue/Press-Enter/Start/Continue/Load/Back) was reviewed and not used for the reason above — logged here so a future pass doesn't re-discover the same aspect-ratio mismatch from scratch.

## User-Supplied Pixel Art — post-Phase-H.2

Three real, standalone pixel-art images pasted into chat (not part of either owned pack, and not a multi-object sheet like the Generated Desk Set or Save Slot art) — a computer system, a red rotary telephone, and a red document folder. This harness doesn't persist chat-pasted images to a file path automatically; all three were recovered from `~/Downloads` (saved there by the paste action itself) before processing — confirmed to be the correct three images via direct visual inspection of each, not assumed from filename. Full processing account (flood-fill technique per image, premultiplied-alpha downscale, sizing rationale) is in `ENGINEERING_DECISIONS.md`'s Phase H.2 entry; this table is the registry-format summary.

| Asset Name | Source File | Current Usage | Interaction | Status |
|---|---|---|---|---|
| Computer system | `compu chill.jpeg` (736×736 JPEG, white background) | Desk surface dressing, replacing the three separate Generated-Desk-Set Monitor/Keyboard/Mouse sprites | None (decorative-tier) | **VERIFIED, INTEGRATED** — `public/assets/desk/computer-system.png`, 24×21px. Background removed via a strict near-white binary flood fill (R/G/B≥248 — a looser chain-tolerant fill leaked into the monitor's own white casing on the first attempt). Sized to match the three items' old ~25×25 combined footprint, not to its own best standalone legibility (a 40×35 test render read crisper but would have exceeded the desk sprite's own 48×33 size) — screen zigzag and cable detail read softly at the shipped size, logged honestly rather than claimed sharper than it is. |
| Resume Folder | `download (2).jpeg` (512×512 JPEG, white background, watermark badge in one corner) | Resume hotspot's sprite | Primary hotspot visual for Resume | **VERIFIED, INTEGRATED** — `public/assets/narrative/resume-folder.png`, 10×14px. A "COLOR by NUMBER" watermark badge in the source image's own bottom-right corner (bbox x:339–511,y:484–511) was cropped out before background keying — confirmed clear of the folder artwork's own bbox (x:135–420,y:33–438), not part of the shipped asset. |
| Telephone | `download (1).jpeg` (735×588 JPEG, light lavender gradient background) | Contact hotspot's sprite | Primary hotspot visual for Contact | **VERIFIED, INTEGRATED** — `public/assets/narrative/telephone.png`, 16×10px. Background removed via a chain-tolerant flood fill (needed to follow the source's own corner-to-corner gradient, which a fixed-reference threshold can't). One small enclosed pocket of the original background survives inside the coiled cord (the coil doesn't fully close, so it's topologically unreachable from a border-seeded fill) — invisible at the shipped size, a known and accepted limitation rather than an oversight. |

All three supersede an earlier sprite at their hotspot: Computer replaces `deskMonitor`/`deskKeyboard`/`deskMouse` (Generated Desk Set, above); Resume Folder replaces `ASSETS.ledger`'s brief interim use in `PortfolioHotspot.tsx`; Telephone replaces `ASSETS.ledger` in `RolodexHotspot.tsx` (itself the Phase F.2 replacement for the original Phase F.1 Rolodex sprite). Every superseded sprite stays registered in `assets.ts`, not deleted, per this registry's "corrected, not erased" convention.
