/**
 * Timing bands and easing from MICROINTERACTIONS.md — project-wide, not
 * owned by any one engine. Originally defined inside useCamera.ts; moved
 * here in Milestone 4 because the Layer engine needs the same bands and
 * importing them from a camera-specific file would have coupled Layer
 * presentation to Camera geometry, violating the Layer Responsibilities
 * rule. See ENGINEERING_DECISIONS.md.
 */

export const DURATION = {
  fast: 200,
  standard: 500,
  slow: 700,
} as const;

/** Decelerates into the target, per EXPERIENCE_ARCHITECTURE.md's Camera Philosophy. */
export const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
