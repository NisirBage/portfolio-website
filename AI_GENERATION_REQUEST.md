# AI Generation Request — The Studio

**Status:** Asset specification document, not an implementation plan. Produced after Phase 1's complete reuse pass — both owned packs (`TopDownHouse_FurnitureState1.png`, `FurnitureState2.png`, `SmallItems.png`, `DoorsAndWindows.png`) were fully re-scanned; every verified, narratively-justified, unused sprite has been integrated (`ENGINEERING_DECISIONS.md`). What follows is genuinely missing, not carried forward from an earlier, less current audit.

**Discipline applied.** Per the Decoration Principle, only items that answer "what does this tell the visitor about the person who works here?" are listed. Rejected during this pass: circuit board (no hardware-focused work exists in the real project content — would invent a trait), sticky notes (generic, already covered by other Desk evidence), research-diagram papers (illegible at native 16px resolution, practically dubious regardless of narrative fit), the record player found in `FurnitureState2.png` (no narrative basis anywhere in this project's real content).

---

## Concept Reference vs. Style Reference

Two categories of reference material exist for this document, and they are never interchangeable.

### Concept Reference

A concept sheet (e.g., a mockup image proposing candidate desk objects) communicates:
- **Object identity** — what the thing is
- **Approximate proportions** — roughly how big, relative to other objects
- **Narrative purpose** — what it should tell a visitor about the person who works here
- **Room placement** — which zone/hotspot it belongs near
- **Engineering priority** — P0–P3

**Not authoritative for:** palette, shading technique, perspective, outline weight or color, pixel density, lighting direction, shadow technique, or visual weight. A concept sheet may itself be AI-generated in a completely different rendering style (softer shading, blurred drop shadows, higher detail density) than this project's actual owned pack — confirmed to be the case for the first concept sheet supplied — and none of that carries any authority over what gets generated.

### Style Reference

The **only** style authority for any generated asset is the actual, owned, purchased pack:

- `TopDownHouse_FurnitureState1.png`
- `TopDownHouse_FurnitureState2.png`
- `TopDownHouse_SmallItems.png`
- `TopDownHouse_DoorsAndWindows.png`
- `TopDownHouse_FloorsAndWalls.png`

**Authoritative for:** palette, shadow direction/softness/technique, outline thickness and color, perspective, lighting direction, pixel density, visual weight — everything that determines whether a generated sprite blends in. Every prompt in this document draws its style language from direct pixel inspection of these five files (and the sprites already cropped from them and integrated — `deskSprite`, `bookshelfSprite`, `frameAbstract`, `frameLandscape`, `bookOpen`, `walnutBookshelf`, `paperStack`), never from a concept sheet, never from general knowledge of "pixel art style."

### Validation rule

Every future comparison — validating a generated PNG, or checking whether a new request's prompt language is accurate — is made against the **Style Reference** pack only. If a concept sheet and the real pack ever disagree on how something should look, the real pack wins, unconditionally. This is the same Repository Consistency Principle already governing content and documentation, applied to visual style.

---

## Computer / Monitor Sprite

*Style Reference: `TopDownHouse_FurnitureState1.png` / `SmallItems.png` only (desk, bookshelf, mirror, wood-stove sprites, directly inspected). Concept Reference: none used — this entry predates the concept sheet and was already built the correct way. Corresponds to Concept Sheet item 01 for object-identity/priority cross-reference purposes only.*

- **Asset Name.** Flat-panel monitor, top-down, screen off.
- **Narrative Purpose.** The Desk currently reads as "a desk" before any click, not "an engineer's desk" — flagged as a real gap since `MISSING_ASSETS.md`'s Phase 1 audit and never resolved. Screen deliberately off (per your requirement) — this is establishing-shot dressing, not a functional UI element; a glowing screen would misleadingly imply the panel content is "on" the monitor rather than in the docked side panel it actually opens into.
- **Where It Will Be Used.** Desk establishing shot, inside `Workspace.tsx`'s `CameraContainer`, rendered as a non-interactive decorative layer (same pattern as the walnut bookshelf and paper stack — no click handler; `DeskHotspot`'s existing click-zone already covers the whole desk surface).
- **Exact Placement.** Centered horizontally on the desk sprite (`DESK_HOTSPOT.centerXPercent`, 38.7%), positioned toward the upper/back portion of the desk surface rather than desk-center — in this pack's top-down convention, objects "on" a desk sit slightly above the desk's own vertical midpoint (the desk sprite spans roughly 38.5%–61.5% of its own height; the monitor should center around the upper third of that span, approximately `DESK_HOTSPOT.centerYPercent − 6` to `− 8`).
- **Expected Pixel Dimensions.** ~20×16px of actual monitor content (body + stand).
- **Expected Canvas Size.** ~24×20px transparent canvas — a few pixels of padding on each edge, matching how the existing pack's small items (frames, mug, books) sit inside a slightly larger transparent cell rather than being cropped flush to the art. Do not crop tightly.
- **Perspective.** Top-down orthographic — verified directly against the desk sprite (48×33px) and bookshelf sprite (47×49px) already integrated; both are drawn as if viewed from directly above with a slight forward-facing tilt on vertical surfaces (the bookshelf's shelves are visible face-on despite the top-down camera), not a true flat plan view. The monitor should follow the same convention: top-down base/footprint, screen face tilted toward the viewer enough to read as a screen.
- **Palette.** Dark charcoal-grey body — checked directly against the pack's existing muted-neutral items (the standing mirror's grey frame, the wood stove's cast-iron black) rather than assumed; those sit in a desaturated grey-brown family, not pure neutral grey or pure black. Match that family exactly.
- **Lighting Direction.** Upper-left — confirmed by direct inspection of the integrated desk and bookshelf sprites, both of which carry a lighter highlight on their upper-left surfaces and darker shading toward the lower-right/base. Any new sprite that doesn't share this exact light direction will visibly disagree with its own neighbors.
- **Shadow Direction.** Soft shadow cast down and slightly right of the object's base, matching the desk sprite's own shadow ellipse (visible beneath its legs) and the bookshelf's shadow at its feet.
- **Animation Requirement.** None. Static establishing-shot object only.
- **Neighbouring Sprites.** Sits directly on the wood desk sprite (`deskSprite`, 48×33px, already integrated) and near the paper stack (`paperStack`, 16×16px, already integrated, offset to the desk's right per `Workspace.tsx`). If the Keyboard sprite is generated later, it will sit directly in front of (below, in top-down terms) the monitor — leave room in the composition for that, but do not generate the keyboard in the same image.
- **Reason Existing Assets Cannot Be Reused.** Confirmed via full re-scan of every sheet in both owned packs (`ENGINEERING_DECISIONS.md`, Phase 2 audit) — no electronics or computer-adjacent item exists anywhere in either pack. The standing mirror is the closest shape match but carries a baked-in reflective diagonal highlight that reads unambiguously as glass, not a screen; recoloring it would misrepresent what it visually communicates, not just its color, which is exactly what Asset Truthfulness prohibits.

### 1. Master production prompt

```
You are extending an existing commercial top-down pixel-art interior
asset pack ("Top-Down Retro Interior"), supplied as a style reference
image alongside this prompt. Generate ONE new sprite that could pass as
an official expansion to that exact pack — visually indistinguishable
from the artist's own work, not a reinterpretation of the style.

SUBJECT: a flat-panel LCD computer monitor with a thin bezel and a
simple rectangular stand, screen turned OFF (no glow, no reflections, no
UI, no logos), viewed top-down to match the reference sheet's existing
furniture (the wood desk and bookshelf sprites in particular).

STYLE — matched exactly to the reference, zero deviation:
- Top-down orthographic perspective, identical camera angle to every
  other object in the reference sheet
- Identical pixel density — do not render at a finer or coarser grain
  than the reference sprites
- Dark charcoal-grey plastic body and stand, in the same desaturated
  grey-brown palette family as the reference pack's mirror frame and
  wood-stove ironwork — not pure black, not pure neutral grey
- Light source from the upper-left, matching the highlight/shadow
  pattern on the reference pack's desk and bookshelf sprites exactly
- Soft shadow cast down and slightly right of the object's base,
  matching the softness and falloff of the reference sprites' own
  shadows
- Outline thickness and color identical to the reference pack's
  dark-brown/maroon outlines — never pure black outlines
- Same level of surface detail as the reference sprites — no extra
  texture, gradient, or rendering complexity the reference doesn't use
  elsewhere

TECHNICAL:
- Transparent background
- Nearest-neighbor pixel art, hard edges, zero anti-aliasing
- Approximately 20×16 pixels of actual content, centered in a ~24×20px
  transparent canvas with natural padding — do not crop tightly to the
  art
- One object only, no sprite sheet, no multiple angles or states
- No text, no logo, no watermark, no signature

If any creative choice would conflict with matching the reference pack's
existing style, always choose the reference pack's style over
creativity. The goal is that someone familiar with the original pack
could not tell this sprite apart from one the original artist made.
```

### 2. Simplified prompt

```
Top-down pixel art computer monitor, screen off, dark charcoal-grey,
thin bezel, simple stand. Match the exact pixel density, palette,
upper-left lighting, shadow softness, and dark-brown outline style of
the attached "Top-Down Retro Interior" reference sheet. Transparent
background, ~20×16px content on a ~24×20px canvas with natural padding.
Nearest-neighbor, no anti-aliasing, no text, no logo, no watermark, one
object only.
```

### 3. Negative prompt

```
isometric perspective, 3D render, voxel art, anime style, chibi
proportions, fantasy elements, cyberpunk elements, oversaturated colors,
neon colors, RGB lighting, glowing screen, screen reflections, on-screen
UI or icons, thick black outlines, anti-aliased or soft edges, smooth
gradients, cartoon proportions, floating or tilted perspective, drop
shadow as a separate rendered layer distinct from the pack's native
shadow style, multiple objects, sprite sheet, grid lines, background,
scenery, text, logo, brand marks, watermark, signature, frame or border
```

### 4. Validation checklist (this asset specifically)

| Criterion | Check |
|---|---|
| Palette | Matches the mirror-frame / wood-stove grey-brown family, not pure grey or black? |
| Pixel density | Same apparent grain as the desk/bookshelf sprites at equal zoom? |
| Perspective | Top-down with the same forward-tilt convention as the bookshelf, not a flat plan or 3/4 view? |
| Lighting direction | Highlight on the upper-left, matching desk and bookshelf? |
| Shadow direction | Cast down-and-right, same softness as desk/bookshelf shadows? |
| Scale | ~20×16px content — checked side-by-side against the 48×33px desk sprite, proportion looks plausible (not oversized, not a speck)? |
| Outline | Dark brown/maroon, matching weight — not black, not thin/absent? |
| Screen state | Genuinely off — no glow, gradient, or implied UI baked in? |
| Canvas padding | Natural padding present, not cropped flush to the art? |
| Compatibility | Placed next to the integrated desk sprite in a mockup, could you tell which one shipped with the original pack? |

**If any row fails: regenerate, don't integrate.** Per the Asset Validation Review process below, this sprite is assumed incorrect until it passes every row here, not just "looks close."

---

## Blueprint Roll

*Style Reference: `TopDownHouse_FurnitureState1.png` / `SmallItems.png` only. Concept Reference: none used — predates the concept sheet. Corresponds to Concept Sheet item 04 for object-identity/priority cross-reference only; the concept sheet's rendered blueprint (item 05, with visible grid/diagram detail) is not used as style guidance — this project's own "no illegible diagrams at native resolution" constraint already ruled that level of detail out independently.*

- **Asset Name.** Rolled architectural blueprint / drafting paper.
- **Purpose.** `DeskPanel`'s "See the architecture" interaction (shipped Milestone 6) already unrolls a blueprint-style reveal in the panel — but nothing in the physical room hints that this exists before a visitor clicks into a project. This is a real "remove a misleading gap" case, not a cosmetic want: the room currently promises less than the panel delivers.
- **Room.** Desk.
- **Narrative Role.** Engineering / Systems Thinking.
- **Priority.** P2.
- **Suggested Dimensions.** ~10×14px (a small object resting near the desk, not a furniture-scale item).
- **Perspective.** Top-down orthographic.
- **Palette.** Beige/cream paper, thin blue-grey rule lines suggested rather than legible (matching the "no illegible diagrams at this resolution" constraint that ruled out the research-diagram-papers idea) — a rolled tube reads correctly even with zero visible line detail.
- **Shadow Direction.** Match desk sprite.
- **Animation.** None — the actual unroll animation already exists in the panel; this sprite is a static establishing-shot object only.
- **Similar Existing Sprite.** The loose paper stack (now integrated) is flat, not rolled — a genuinely different silhouette, not a substitute.
- **Why reuse is impossible.** No rolled/tube-shaped paper item exists in either pack.
- **Why generation is justified.** Closes a real gap between what the room shows and what the Desk's own shipped interaction actually contains.

### Generation prompt

```
Top-down orthographic pixel art sprite of a rolled architectural
blueprint or drafting paper, tied with a thin string, matching the exact
style of the supplied "Top-Down Retro Interior" asset pack reference
image. 16-bit pixel density identical to the reference. Cream/beige
paper color with a faint blue-grey tint suggesting technical drawing
paper — do not render legible text, lines, or diagrams, the object
should read as "a rolled blueprint" at a glance without any detail small
enough to become illegible pixel noise. Single soft shadow matching the
reference pack's shadow direction and softness. Warm, neutral lighting,
cozy-study palette, no bright or saturated colors. Outline thickness
must exactly match the reference pack's existing dark-brown/maroon
outline weight. Transparent background, natural padding, no tight crop.
Approximately 10×14 pixels at native resolution. No anti-aliasing,
nearest-neighbor hard edges only. Prioritize style consistency with the
reference pack over creative interpretation.
```

---

## Keyboard

*Style Reference: `TopDownHouse_FurnitureState1.png` / `SmallItems.png`, plus the approved Monitor sprite once it exists (palette-matching only). Concept Reference: none used — predates the concept sheet. Corresponds to Concept Sheet item 02 for object-identity/priority cross-reference only.*

- **Asset Name.** Compact keyboard, top-down.
- **Purpose.** Pairs with the Monitor sprite to complete the "this is a working engineer's desk" signal — weak justification in isolation, real justification alongside the monitor.
- **Room.** Desk.
- **Narrative Role.** Engineering.
- **Priority.** P2 (contingent — see note).
- **Suggested Dimensions.** ~14×6px.
- **Perspective.** Top-down orthographic.
- **Palette.** Same dark charcoal-grey as the requested Monitor sprite — must be generated as a matched pair, not independently, or the two will plausibly mismatch in exact grey tone.
- **Shadow Direction.** Match desk sprite.
- **Animation.** None.
- **Similar Existing Sprite.** None.
- **Why reuse is impossible.** Confirmed via full re-scan of both packs.
- **Why generation is justified.** Only if the Monitor sprite is generated first and approved — request this as a follow-up using the approved monitor's exact grey value as a palette reference, rather than generating both blind and risking a mismatch between them.

### Generation prompt

```
Top-down orthographic pixel art sprite of a compact computer keyboard,
matching the exact style of the supplied "Top-Down Retro Interior" asset
pack reference image, AND matching the exact dark charcoal-grey palette
of [insert the approved monitor sprite here as a second reference image]
— the keyboard and monitor must read as one matched set, not two
separately-toned objects. 16-bit pixel density identical to the
reference pack. Single soft shadow matching the reference pack's shadow
direction. Warm, neutral cozy-study lighting. Outline thickness must
exactly match the reference pack's dark-brown/maroon outline weight.
Transparent background, natural padding, no tight crop. Approximately
14×6 pixels at native resolution. No anti-aliasing, nearest-neighbor
hard edges only. Prioritize style and palette consistency over creative
interpretation — this must look like it was cropped from the same sheet
as the monitor sprite.
```

*Blueprint Roll and Keyboard above still use the shorter template from the first drafting pass — same content, not yet expanded to the full Master/Simplified/Negative/per-asset-checklist format the Monitor section now has. Lower priority than the Monitor (P2 vs. P1); will get the same treatment on request or once the Monitor is approved and integrated.*

---

## Concept Sheet Backlog (identity/priority only — no full specs yet)

Triaged against the Decoration Principle and the real pack's actual contents, so this doesn't need re-deriving later. **Not** style-authoritative for any row — see above.

| Concept Item | Verdict | Reason |
|---|---|---|
| 03 Mouse | **Candidate, P1** | Same tier as Keyboard — pairs with Monitor, weak alone. Not yet spec'd. |
| 08 Pencil Cup | **Candidate, P2** | Real Engineering/craftsmanship signal, Desk-appropriate. Not yet spec'd. |
| 09 Mechanical Pencil / 10 Fountain Pen | **Merge into Pencil Cup** | Standalone sprites are redundant if Pencil Cup already contains them. |
| 16 Folder | **Candidate, P2/P3** | Confirmed genuine gap — the real pack's "folder stack" entry turned out to be a treasure chest on inspection (`ENGINEERING_DECISIONS.md`). |
| 21 Desk Lamp | **Candidate, P2/P3** | Genuine gap — the real pack's floor lamp is standing-lamp-scaled, not desk-scaled; using it would misrepresent scale. |
| 04/05 Rolled/Unrolled Blueprint | **Already covered** | Rolled version already spec'd above. Unrolled version rejected — redundant with the panel's own shipped unroll animation, and would hit the same "illegible detail at native resolution" problem already ruled out for research-diagram papers. |
| 11 Coffee Mug | **Reject — duplicate** | Already exists, verified, integrated in the real pack (Coffee Corner). |
| 12 Desk Plant | **Reject — duplicate** | Already exists, verified, used as ambient decoration in the real pack. |
| 24/25 Books | **Reject — duplicate** | Already exists (`bookOpen`, integrated for Research); a second books sprite adds nothing new. |
| 26 Research Papers | **Reject — already ruled out** | Illegible at native resolution, logged in this document's own Discipline section. |
| 27 Open Notebook | **Reject — duplicate** | Redundant with the already-integrated `bookOpen` sprite. |
| 29 Wall Clock | **Reject — reuse exists, no generation needed** | A small round wall clock is already VERIFIED and unused in `SmallItems.png` (`ASSET_REGISTRY.md`) — this is a Phase-1-reuse candidate, not a generation candidate, if it's ever wanted at all. |
| 22 Monitor Stand | **Reject — redundant** | The Monitor sprite's own stand already covers this; a separate stand sprite would double up. |
| 06 Engineering Notebook / 07 Technical Journal | **Hold, unclear** | Risk of redundancy with the Research zone's existing book sprite. Would need a specific, distinct narrative slot (why does the Desk need its own notebook when Research already has one?) before this clears the Decoration Principle bar. |
| 13 Cable Bundle | **Hold, weak justification** | Plausible Engineering-adjacent texture near a Monitor, but no real evidence ties to hardware/cabling specifically. |
| 14 USB Drive / 15 SSD Drive | **Hold, weak justification** | No real project content establishes hardware/storage as a personal interest — would risk inventing a trait, same concern that ruled out the circuit board. |
| 17/18 Closed/Open Binder | **Hold, likely redundant** | Overlaps with book/notebook items already present or under consideration. |
| 19 Sticky Notes | **Reject — already ruled out** | Logged in this document's own Discipline section. |
| 20 Document Tray | **Hold, weak justification** | Mild organizational signal, thin on its own. |
| 23 Mouse Pad | **Hold, weak justification** | Only makes sense paired with Mouse; thin alone. |
| 28 Calculator | **Hold, weak justification** | No real evidence ties to calculator-specific work; Engineering signal is already carried by Monitor/Keyboard. |
| 30 Desk Organizer | **Hold, weak justification** | Generic, thin narrative pull on its own. |

**Not yet written:** full specs (Master/Simplified/Negative prompts + validation checklist) for Mouse, Pencil Cup, Folder, or Desk Lamp — the four items that survived triage as real candidates. Say the word and I'll write those next, against the real pack only.

---

## Asset Validation Review Process (applies once PNGs are supplied)

When a generated PNG is provided, it is **not integrated immediately.** Each one gets reviewed against this project's real, checked evidence — not just eyeballed — and classified as one of:

- **Approved.** Passes every row of the asset-specific validation checklist above. Enters the repository the same way every reused sprite has: cropped/placed via `getSpritePlacement`, registered in `assets.ts`, verified via DOM measurement (`complete: true`, correct `naturalWidth`/`naturalHeight`, click-zone ≥ sprite footprint where relevant), `ASSET_REGISTRY.md` updated.
- **Needs Minor Cleanup.** Fails one checklist row in a way fixable without regenerating — e.g., wrong canvas padding, a stray pixel, background not fully transparent. Fixed directly (PIL crop/pad), then re-validated.
- **Needs Palette Adjustment.** Right shape and composition, wrong grey/brown tone family. A palette shift is attempted only if it can be done honestly (matching the exact hex values already used in the reference pack, not an approximation) — otherwise treated as Reject and Regenerate.
- **Reject and Regenerate.** Fails on perspective, lighting direction, shadow direction, outline style, or general "would stand out" grounds. No attempt to salvage via editing — a wrong perspective or light direction can't be patched, only regenerated correctly.

Every classification comes with the specific checklist row(s) that drove it, not just a verdict — consistent with Evidence Before Summary.

---

## Style Validation Checklist (apply to every generated result before integrating)

| Criterion | Check |
|---|---|
| Palette consistency | Does it use only tones already present in the reference pack's palette family — no new hues introduced? |
| Pixel density | Same apparent pixel size as neighboring sprites at the same zoom — not smoother, not chunkier? |
| Perspective | Genuinely top-down, no 3/4 view or isometric lean? |
| Shadow direction | Matches the established shadow direction of every other furniture sprite? |
| Visual weight | Does it read as the right scale relative to the desk sprite next to it — not oversized, not lost? |
| Scale | Native pixel dimensions match the requested size, and that size is plausible next to the 48×33px desk sprite? |
| Outline style | Same outline thickness and color (dark brown/maroon, not black) as the reference pack? |
| Readability | Recognizable as the intended object at the actual in-scene render size, not just at 8× inspection zoom? |
| Compatibility | Placed next to the desk sprite in a mockup, does it look like it was cropped from the same original sheet? |

**If any criterion fails: regenerate, don't integrate.** A near-miss that "mostly" matches is worse than the current honest gap — it's exactly the kind of inconsistency this whole process exists to prevent, and Asset Truthfulness treats a misleading near-match the same as a wrong one.

---

## Explicitly Not Blocking

None of the three items above block any current milestone or interaction — every shipped hotspot functions correctly without them. Per "do not wait for generated assets unless they block implementation," implementation work continues independent of when or whether these get sourced.
