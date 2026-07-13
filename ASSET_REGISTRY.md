# Asset Registry — The Studio

**Status:** Source of truth under the Asset Truthfulness Protocol. Every entry below was confirmed by direct pixel-level inspection (upscaled 4–5× with nearest-neighbor scaling, not memory or inference from a thumbnail) on this pass. Anything not in this file is either not yet verified or doesn't exist — check [MISSING_ASSETS.md](MISSING_ASSETS.md) before assuming.

Two corrections came out of this verification pass, both now reflected in [EXPERIENCE_ARCHITECTURE.md](EXPERIENCE_ARCHITECTURE.md) and [ASSET_MAPPING_V2.md](ASSET_MAPPING_V2.md):
1. The room background (`TopDownHouse_FloorsAndWalls.png`) is a **complete, pre-built rectangular room** with a solid four-wall border and pre-cut door openings — not a set of modular tiles I'd assemble into an L-shape. "Single Continuous L-Shaped Studio" was wrong; it's a single rectangular studio. This is actually good news: less compositing work, not more.
2. There are **two distinct clock sprites**, not one as previously assumed — a floor-standing grandfather clock (`FurnitureState1`) and a small round wall clock (`SmallItems`). The grandfather clock is specified as the Clock hotspot asset below; the wall clock is logged as an available but unused alternative.

---

## Top-Down Retro Interior — `TopDownHouse_FurnitureState1.png` (208×288px)

| Asset Name | Category | States | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|---|
| Wood desk | Furniture — surface | 1 (single sprite, no alt state in this sheet) | The Desk (hub) | Primary hotspot | Execution | **VERIFIED** |
| Oak bookshelf (open-shelf, visible books) | Furniture — storage | 1 | Bookshelf hotspot | Primary hotspot | Knowledge (*revised, Milestone 7 — no longer also Research; see `NARRATIVE_SYSTEM.md`*) | **VERIFIED** |
| Walnut bookshelf (with drawers, darker wood) | Furniture — storage | 1 | Not currently assigned — see Notes | Decorative or future differentiation | — | **VERIFIED**, unused |
| Grandfather clock | Furniture — decor | 1 | Clock hotspot | Primary hotspot | Growth over time | **VERIFIED** |
| Wood stove (black cast iron, with flue pipe) | Furniture — decor | 1 | Ambient dressing near Coffee Corner, no hotspot | None (decorative-tier) | "Lived-in" signal | **VERIFIED**, decorative only |
| Standing mirror (grey frame) | Furniture — decor | 1 | Not currently assigned | — | — | **VERIFIED**, unused |
| Armchairs, sofas (orange, multiple orientations) | Furniture — seating | Several color/orientation variants in this sheet, more in `FurnitureState2` | Ambient dressing near Leadership Wall / Coffee Corner | None | "Lived-in" signal | **VERIFIED** |
| Kitchen counter unit (stove + sink + cabinets, includes an L-shaped counter run) | Furniture — kitchen | 1 | Coffee Corner backdrop | None (Coffee Mug is the actual hotspot, not the counter) | Curiosity | **VERIFIED** |
| Refrigerator | Furniture — kitchen | 1 | Coffee Corner dressing | None | — | **VERIFIED**, decorative only |
| Bathroom fixtures (tub, sink, toilet) | Furniture — bathroom | 1 set | None | None | None — no narrative fit | **VERIFIED**, confirmed **Do Not Use** (per Asset Mapping V2) |
| Dining table, chairs, side tables, rugs, coat rack, floor lamps, vanity, ironing board | Furniture — misc | Various | None currently | None | — | **VERIFIED**, unused; candidates for future ambient dressing only |

## `TopDownHouse_FurnitureState2.png` (208×288px)

Same categories as State 1, alternate color palette (e.g., green sofas instead of orange) and some open/in-use variants (cupboard doors ajar, etc.).

| Asset Name | Current Usage | Status |
|---|---|---|
| Alt-state furniture set | Reserved for the "visited" state treatment on the Bookshelf (a book pulled partway out) — not yet built | **VERIFIED** sheet exists; specific frame-level mapping to the "visited" animation not yet done — treat as **LIKELY** until Phase 3 confirms exact sprite coordinates |

## `TopDownHouse_SmallItems.png` (128×128px)

| Asset Name | Category | Current Usage | Interaction | Narrative Role | Status |
|---|---|---|---|---|---|
| Mug (4 color variants: cream, brown, tan, purple) | Small item | Coffee Mug hotspot | Primary hotspot | Curiosity | **VERIFIED** |
| Green teapot | Small item | Not currently assigned | Could substitute or accompany the mug in Coffee Corner dressing | Curiosity | **VERIFIED**, unused |
| Picture frame, filled (2 variants — abstract art / landscape content baked into the sprite) | Small item | Leadership Wall — certificate frames | Primary hotspot (clustered gallery) | Trust / external validation | **VERIFIED** |
| Picture frame, blank (plain canvas, no content baked in) | Small item | Leadership Wall — **Whiteboard sub-object**, corrected from "reuse a filled frame" in the original Interaction Specification draft | Sub-hotspot within the Leadership cluster | Structured thinking (case-comp framework) | **VERIFIED** — this is a better match than the filled-frame reuse originally proposed, since it starts visually blank and the "sketch" content is added in the modern panel, not implied over an existing image |
| Loose paper stack | Small item | Not currently assigned — candidate for desk dressing (see Missing Assets, "Blueprint" entry) | Decorative dressing under the Blueprint sub-interaction, if used | Architecture / active work | **VERIFIED**, unused |
| Folder stack (brown) | Small item | Not currently assigned — candidate for Resume dressing | Could sit near the Resume sub-interaction as a visual anchor for "the paper you can take" | Execution | **VERIFIED**, unused |
| Small round wall clock | Small item | Not currently assigned (grandfather clock used instead) | — | — | **VERIFIED**, unused alternative to the primary Clock asset |
| Potted plant, flower bouquet in vase (2 items) | Small item | Ambient decoration (per Content Hierarchy's Decorative tier) | Hover only, no click | Continuous learning | **VERIFIED** |
| Books (open, closed) | Small item | Milestone 7: the literal object animating in both the Bookshelf (Knowledge) slide-open and, rendered as a distinct smaller instance, the Research Journal's page-turn — one VERIFIED sprite, two separate hotspots, no new asset needed (*revised, Milestone 7*) | Primary interaction visual for both hotspots | Knowledge / Research | **VERIFIED**, now wired into both |
| Food/kitchen items (plates, pots, bottles, jars, wine glasses) | Small item | Not currently assigned | None planned | None — no narrative fit found | **VERIFIED**, confirmed **Do Not Use** |
| Misc (rubber duck, key rack, hanger, fishbowl, lamp) | Small item | Not currently assigned | None planned | None — no narrative fit found | **VERIFIED**, confirmed **Do Not Use** |

## `TopDownHouse_DoorsAndWindows.png` (288×160px)

| Asset Name | Category | States | Current Usage | Status |
|---|---|---|---|---|
| Window (4-pane square, 2-pane horizontal, small variants; 3 wood-tone finishes) | Architecture | ~9 variants | Window/Observatory hotspot | **VERIFIED** |
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

## Sprout Lands UI Pack — assets actually slated for use

| Asset Name | Filename | Dimensions | Current Usage | Status |
|---|---|---|---|---|
| Pixel font | `fonts/pixelFont-7-8x14-sproutLands.ttf` | N/A (font file, valid TTF confirmed via file inspection) | In-scene ambient labels only | **VERIFIED** |
| Triangle mouse cursor | `Sprite sheets/Mouse sprites/Triangle Mouse icon 1.png` | 16×16px | Custom cursor while hovering the scene | **VERIFIED** |
| Small dialog box | `Sprite sheets/Dialouge UI/dialog box small.png` | 112×48px | Ambient hotspot hover tooltips only | **VERIFIED** |
| Icon set | `Sprite sheets/Icons/All Icons.png` | 288×48px | Small accent glyphs in modern panels (checkmark, link icon — specific glyphs not yet cropped/identified individually) | **LIKELY** — sheet exists and is usable, but I have not yet isolated the exact checkmark/link-icon sprite coordinates within it. Treat glyph-level selection as pending Phase 3 work, not yet VERIFIED at that granularity. |

Everything else in the Sprout Lands pack retains its **Do Not Use** verdict from `ASSET_MAPPING_V2.md` (inventory/emoji/weather assets, Teemo emotes, cat-paw cursors, settings UI, pixel-styled buttons) — that audit was already asset-truthful and doesn't need correction.
