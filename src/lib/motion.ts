/**
 * Timing bands and easing from MICROINTERACTIONS.md — project-wide, not
 * owned by any one engine. Originally defined inside useCamera.ts; moved
 * here in Milestone 4 because the Layer engine needs the same bands and
 * importing them from a camera-specific file would have coupled Layer
 * presentation to Camera geometry, violating the Layer Responsibilities
 * rule. See ENGINEERING_DECISIONS.md.
 */

/**
 * *Revised, Phase C, Part 6 (Motion Specification).* The brief replaced
 * Phase B's four bespoke bands with five canonical, explicitly-ranged
 * ones — Instant/Fast/Standard/Slow/Idle — and an explicit "nothing
 * outside these bands without justification" rule. `MOTION` is that
 * canonical scale, one number per band, each a defensible midpoint of
 * its own range. `DURATION` maps every real interaction in the codebase
 * onto one of those five bands by name, so a call site reads "this is a
 * Standard-band interaction" rather than an opaque number that could
 * silently drift out of its intended range over time — exactly the
 * failure this same rework fixed once already in Phase B (`panelClose`
 * had drifted to 200ms, outside both the old and new "quick" bands).
 *
 * `DURATION.slow` (the old 700ms dev-harness-only value) is retired
 * outright rather than kept as a sanctioned exception: the harness's
 * "window" demo case had no real UX reason to be slower than every
 * other camera pan, so it now uses `DURATION.camera` like the rest —
 * one fewer unjustified number, not a new exception carved into the
 * five-band rule on day one.
 */
export const MOTION = {
  /** 80-120ms — press/squash feedback, the instant before a slower consequence begins. */
  instant: 100,
  /** 120-180ms — hover/focus response. */
  fast: 150,
  /** 220-300ms — the default for any deliberate state change (panel/accordion opening). */
  standard: 260,
  /** 350-450ms — camera pans; panel/accordion closing stays in Fast, not Slow (exits read faster than entrances). */
  slow: 400,
  /** 2-4s — idle/ambient loops (gramophone bounce, sprite breathing, note particles). */
  idleSeconds: 3,
} as const;

export const DURATION = {
  /** Press/squash on click, before the camera/panel consequence begins. Instant band. */
  instant: MOTION.instant,
  /** Hover/focus micro-interactions — colors, borders, filters, sprite lift. Fast band. */
  hover: MOTION.fast,
  /** Panel and accordion opening. Standard band. */
  panelOpen: MOTION.standard,
  /** Panel and accordion closing — deliberately quicker than opening. Fast band. */
  panelClose: MOTION.fast,
  /** Camera pans/zooms between the establishing shot and a hotspot. Slow band. */
  camera: MOTION.slow,
} as const;

/** Decelerates into the target, per EXPERIENCE_ARCHITECTURE.md's Camera Philosophy. */
export const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Intro-sequence timing — Phase G. Deliberately its own named group, not
 * folded into `DURATION`'s five UI-interaction bands: a boot sequence is
 * a one-time cinematic beat a visitor sees once per page load, not a
 * repeated interaction pattern the Instant/Fast/Standard/Slow/Idle scale
 * was built to keep consistent across many call sites. Each number below
 * is a defensible midpoint of the brief's own stated range, the same
 * reasoning `MOTION`'s bands already use.
 */
export const INTRO = {
  /** 500-700ms range — the title's own fade-in *is* "fading in from black" (see IntroSequence.tsx). */
  titleFadeIn: 600,
  /** "~1 second" hold before the title starts fading out. */
  titleHold: 1000,
  /** Title fade-out, kept brisk relative to its own fade-in — exits read faster than entrances, the same asymmetry `DURATION.panelClose` already establishes. */
  titleFadeOut: 400,
  /** 600-800ms range — the save slot's fade into the already-mounted room. */
  roomTransition: 700,
} as const;
