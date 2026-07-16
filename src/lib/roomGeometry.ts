/**
 * Measured geometry of the room shell, in the source asset's own pixel
 * coordinate space (288×144 canvas). Every number here was confirmed by
 * direct pixel inspection of `floors-and-walls.png` during Milestone 2 —
 * not estimated from the earlier low-fidelity sketch. This corrects and
 * supersedes the qualitative door-gap description in SPATIAL_BLUEPRINT.md
 * (Asset Truthfulness Protocol, rule 5: revise on new measurement).
 *
 * See ENGINEERING_DECISIONS.md for how these numbers were produced.
 */

export const ROOM_CANVAS = {
  width: 288,
  height: 144,
} as const;

/** The room's actual drawn content, excluding transparent canvas margin. */
export const ROOM_CONTENT_BOUNDS = {
  x: [12, 275],
  y: [12, 131],
} as const;

/**
 * Zone x-ranges, left to right, measured at a wall row clear of the
 * wainscoting band. Matches SPATIAL_BLUEPRINT.md's Option A assignment:
 * Zone 1 = Leadership, Zone 2 = Desk, Zone 3 = Research, Zone 4 = Coffee.
 */
export const ZONE_BOUNDS_X = {
  leadership: [16, 79],
  desk: [80, 143],
  research: [144, 207],
  coffee: [208, 275],
} as const;

/**
 * The two real door-shaped gaps baked into the room shell. Both were
 * corrected during Milestone 2's implementation: SPATIAL_BLUEPRINT.md
 * described the second gap as "near the boundary between Zone 1 and
 * Zone 2" — precise measurement places it inside Zone 2 (Desk), not at
 * the boundary. Two other candidate regions the initial color scan
 * flagged (around x≈13, y≈97–110, and x≈34–61, y≈129) turned out to be
 * fully transparent (alpha 0) canvas padding that happened to share the
 * gap color's RGB channels, not real openings — confirmed by alpha
 * value, not by eye, before being ruled out.
 */
export const DOOR_GAPS = {
  leftWall: {
    zone: "leadership",
    centerX: 14,
    top: 33,
    bottom: 78,
  },
  frontWall: {
    zone: "desk",
    centerX: 111.5,
    top: 128,
    bottom: 130,
  },
} as const;

/**
 * The Desk hotspot — Milestone 5's first real (non-test-harness) hotspot.
 * Centered on Zone 2 (`ZONE_BOUNDS_X.desk`), matching the target
 * `CameraTestHarness` used for its own "desk" test button, which is now
 * removed in favor of this real one (Design For Deletion: the harness
 * shrinks as real hotspots replace its stand-ins, rather than the two
 * coexisting indefinitely).
 */
export const DESK_HOTSPOT = {
  centerXPercent: 38.7,
  centerYPercent: 50,
  cameraScale: 2.2,
} as const;

/**
 * Knowledge (Bookshelf) and Research (reading stand + journal) hotspots —
 * Milestone 7, repositioned during the Concept Reconciliation pass.
 *
 * *Revised, Concept Reconciliation:* the original Research x-position
 * (67%) placed the bookshelf-only Research sprite close enough to
 * Knowledge's oak bookshelf that their real footprints overlapped once
 * both sprites were actually rendered (the earlier Visual Truthfulness
 * pass fixed visibility, not spacing — this is a distinct bug). The
 * approved concept layout requires a visible gap and two
 * independently-readable objects, so Research moved from 67% to 83% —
 * this pushes it past `ZONE_BOUNDS_X.research`'s own upper bound (207px
 * / 71.875%) into `ZONE_BOUNDS_X.coffee` wall-color territory. Accepted
 * deliberately: Coffee has no rendered dressing of its own (Clock and
 * Coffee focuses are cut from V1 entirely — see VERSION1_SCOPE.md and
 * CameraTestHarness.tsx), so there is no real object to collide with,
 * only an unused zone label. See ENGINEERING_DECISIONS.md's Concept
 * Reconciliation entry for the full footprint math.
 *
 * Knowledge's oak bookshelf (dominant, interactive) keeps its original
 * position — it already cleared the Desk's right edge with margin and
 * the concept doesn't require moving it, only its previously-overlapping
 * neighbor (the decorative walnut bookshelf, see Workspace.tsx).
 *
 * Like DESK_HOTSPOT, these are reasonable-effort placements derived from
 * the zone's measured x-range, not pixel-verified against a specific
 * furniture sprite's exact sub-position — that precision isn't claimed
 * here, consistent with the Asset Truthfulness Protocol.
 */
export const KNOWLEDGE_HOTSPOT = {
  centerXPercent: 55.5,
  centerYPercent: 50,
  cameraScale: 2.4,
} as const;

/**
 * Research is now a compound object — a reading stand (furniture) with an
 * open journal resting on top of it — rather than a single floating book
 * sprite. `centerXPercent`/`centerYPercent` mark the reading stand's own
 * center; the book sits at the same x, offset upward by
 * `RESEARCH_BOOK_Y_OFFSET_PERCENT` so it visually rests on the stand's
 * top surface instead of its physical center.
 *
 * *Revised, Version 1 Launch Readiness (Visual Art Direction pass):*
 * `centerYPercent` moved from 50 to 55.9 — a real, measured grounding
 * fix, not a stylistic tweak. All three floor furniture pieces in this
 * half of the room (Knowledge's oak bookshelf, the decorative walnut
 * bookshelf, this reading stand) were vertically centered on the same
 * 50% line despite having different native heights (49px, 31px, 32px),
 * so their *bases* landed at different canvas heights — the oak
 * bookshelf's base sat 8.5–9px lower than the other two, a visible
 * "floating at the wrong height" defect once compared side by side. Sizes
 * are frozen (Style Reference / Asset Truthfulness — these are real
 * sprite dimensions, not adjustable), so the fix is aligning each
 * object's *base* to a shared floor line (the oak bookshelf's own base,
 * chosen as the anchor since it's the largest, most established sprite)
 * rather than aligning centers. See the walnut bookshelf's placement in
 * Workspace.tsx for the matching adjustment.
 */
export const RESEARCH_HOTSPOT = {
  centerXPercent: 83,
  centerYPercent: 55.9,
  cameraScale: 2.4,
} as const;

/**
 * Vertical offset (percent of ROOM_CANVAS.height) applied to the journal
 * sprite relative to `RESEARCH_HOTSPOT`'s center, so it reads as resting
 * on the reading stand's top surface rather than floating at the stand's
 * physical midpoint. Derived from the stand's own measured height (32px
 * native): the book is shifted up by 8px — a quarter of the stand's
 * height, 8/144 * 100 = 5.5556%. Reasonable-effort placement based on the
 * stand's real dimensions, not a claim of sub-pixel "resting" physics.
 */
export const RESEARCH_BOOK_Y_OFFSET_PERCENT = -5.5556;

/**
 * The Leadership hotspot — Milestone 8. Centered on Zone 1
 * (`ZONE_BOUNDS_X.leadership`), reusing the coordinates
 * `CameraTestHarness`'s own "leadership" test button used, same pattern as
 * `DESK_HOTSPOT` reusing its own prior test-harness value (Design For
 * Deletion: the real hotspot inherits the scaffolding's already-reasonable
 * position rather than a fresh, unrelated guess).
 */
/**
 * The Gramophone — Phase A (UI/UX Refinement). Not a hotspot: it opens no
 * panel and isn't part of the four-hotspot content architecture, so it
 * deliberately has no `cameraScale`/camera target the way DESK_HOTSPOT
 * etc. do. It's a persistent room object (an ambient-audio toggle styled
 * to belong in the scene, per explicit instruction it "should not feel
 * like a floating UI button").
 *
 * Placed in the open floor area right of the Research reading stand
 * (`RESEARCH_HOTSPOT` at x=83%) — measured, not eyeballed: nothing else
 * in the room occupies x > 85.78% (the Notebook's own right edge, the
 * rightmost existing object), so x=90 clears every other sprite with
 * real margin on both axes. y=62 sits below the reading stand's own
 * footprint (stand spans roughly y=44.8–67%) without overlapping it.
 */
export const GRAMOPHONE_PLACEMENT = {
  centerXPercent: 90,
  centerYPercent: 62,
} as const;

export const LEADERSHIP_HOTSPOT = {
  centerXPercent: 16.5,
  centerYPercent: 50,
  cameraScale: 2.2,
} as const;

/**
 * Clock (Timeline), Coffee Corner (About Me), and Window (Future) — Phase D.
 * `CameraTestHarness` originally used these exact x/y/scale values as its
 * own "clock"/"coffee"/"window" test-button targets (Design For Deletion:
 * the real hotspots inherit the scaffolding's positions, same pattern as
 * DESK_HOTSPOT/LEADERSHIP_HOTSPOT before them) — except the floor-level y
 * of 50 that the original test targets used for Clock and Coffee turned
 * out not to be available anymore. Measured, not assumed: the room's
 * floor-level band (y≈44-70%) is packed edge to edge from Leadership's
 * left edge (8.5%) to Gramophone's right edge (94.5%), with a real gap of
 * only ~2.4 points between Knowledge and the walnut bookshelf — nowhere
 * near enough for two more compound objects. Both Clock and Coffee Corner
 * are placed higher on the wall instead (y=22-28), reading as objects on
 * a shelf above the desk/bookshelf line rather than floor furniture —
 * the same placement logic already used for the Leadership frames
 * (offset above LEADERSHIP_HOTSPOT's own y, not sitting on the floor).
 * Window keeps its original y=15 unchanged — it was already wall-height
 * and never competed with the floor line to begin with.
 */
export const CLOCK_HOTSPOT = {
  centerXPercent: 48,
  centerYPercent: 22,
  cameraScale: 2.5,
} as const;

export const COFFEE_HOTSPOT = {
  centerXPercent: 83.9,
  centerYPercent: 28,
  cameraScale: 2.2,
} as const;

export const WINDOW_HOTSPOT = {
  centerXPercent: 38.7,
  centerYPercent: 15,
  cameraScale: 2.5,
} as const;

/**
 * Rolodex (Contact) and Leather Portfolio (Resume) — Phase F.1, Part 6/7.
 * Both replace `PersistentActions`' screen-fixed corner links with real
 * room objects, per the same "the room itself should remain the
 * navigation surface, no duplicate controls" principle Phase D already
 * established for Clock/Coffee/Window. Placed on the same high-wall band
 * as those three (y≈18-25) for the same reason: the floor line has no
 * room left (see `CLOCK_HOTSPOT`'s own comment for the measured gap
 * math), and two more compound objects would need it. Rolodex sits above
 * Leadership's own zone (x≈16.5, clear of Clock at 48 and everything to
 * its right); Portfolio sits in the gap between Knowledge (55.5) and the
 * walnut bookshelf/Corkboard cluster (66.9-90.9), the same gap Phase B's
 * Coffee-placement comment already measured as too narrow for a floor
 * object but genuinely open at wall height, since nothing else occupies
 * that x-range up there.
 */
export const ROLODEX_HOTSPOT = {
  centerXPercent: 16.5,
  centerYPercent: 18,
  cameraScale: 2.4,
} as const;

export const PORTFOLIO_HOTSPOT = {
  centerXPercent: 63,
  centerYPercent: 25,
  cameraScale: 2.5,
} as const;

/** left/top/width/height as percentages of the room canvas, ready for CSS. */
export interface PercentRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function toPercentRect(
  centerX: number,
  top: number,
  spriteWidth: number,
  spriteHeight: number,
): PercentRect {
  return {
    left: ((centerX - spriteWidth / 2) / ROOM_CANVAS.width) * 100,
    top: (top / ROOM_CANVAS.height) * 100,
    width: (spriteWidth / ROOM_CANVAS.width) * 100,
    height: (spriteHeight / ROOM_CANVAS.height) * 100,
  };
}

/**
 * A sprite's placement centered on a hotspot's existing center point,
 * sized to the sprite's real native pixel dimensions relative to the
 * room canvas — added post-Milestone-8, once real furniture sprites
 * existed to place. The hotspot's own centerXPercent/centerYPercent
 * (DESK_HOTSPOT etc.) stay the single source of truth for *where* an
 * object sits; this only adds *how big it actually is*, rather than
 * introducing a second, competing position system.
 */
export function getSpritePlacement(
  centerXPercent: number,
  centerYPercent: number,
  spriteWidth: number,
  spriteHeight: number,
): PercentRect {
  const centerX = (centerXPercent / 100) * ROOM_CANVAS.width;
  const centerY = (centerYPercent / 100) * ROOM_CANVAS.height;
  return {
    left: ((centerX - spriteWidth / 2) / ROOM_CANVAS.width) * 100,
    top: ((centerY - spriteHeight / 2) / ROOM_CANVAS.height) * 100,
    width: (spriteWidth / ROOM_CANVAS.width) * 100,
    height: (spriteHeight / ROOM_CANVAS.height) * 100,
  };
}

/**
 * Door placements as canvas-relative percentages, so they scale with the
 * room shell at any viewport size rather than needing a fixed pixel
 * position. The left-wall door aligns its top edge to the measured gap;
 * the front-wall door aligns its bottom edge to the gap instead, since
 * that gap sits at the room's front threshold rather than partway up a
 * side wall — a reasonable-effort placement based on measured
 * coordinates, not a claim of sub-pixel alignment to a formal spec.
 */
export function getDoorPlacements(spriteWidth: number, spriteHeight: number) {
  return {
    leftWall: toPercentRect(
      DOOR_GAPS.leftWall.centerX,
      DOOR_GAPS.leftWall.top,
      spriteWidth,
      spriteHeight,
    ),
    frontWall: toPercentRect(
      DOOR_GAPS.frontWall.centerX,
      DOOR_GAPS.frontWall.bottom - spriteHeight,
      spriteWidth,
      spriteHeight,
    ),
  };
}
