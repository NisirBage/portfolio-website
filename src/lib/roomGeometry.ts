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
 * Knowledge (Bookshelf) and Research Journal hotspots — Milestone 7.
 * Both sit within `ZONE_BOUNDS_X.research` ([144, 207]) but at distinct
 * x-positions, since Milestone 7 splits what was one "Research" concept
 * into two peer objects sharing a zone (see NARRATIVE_SYSTEM.md). Knowledge
 * is placed nearer the Desk (left side of the zone), Research Journal
 * further in — matching the zone's original "physically nearest the Desk"
 * framing for the Bookshelf specifically, now that it's the Knowledge
 * object rather than Research.
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

export const RESEARCH_HOTSPOT = {
  centerXPercent: 67,
  centerYPercent: 50,
  cameraScale: 2.4,
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
