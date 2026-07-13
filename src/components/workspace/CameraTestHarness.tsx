"use client";

import { CAMERA_DURATION, type CameraTarget } from "@/hooks/useCamera";

/**
 * TEMPORARY Milestone 3 verification scaffolding — exists only to prove
 * "all six SPATIAL_BLUEPRINT.md anchors are reachable" and to give the
 * accessibility/keyboard checks something real to exercise. This is
 * explicitly the "placeholder hotspots (unstyled boxes are fine)" the
 * plan calls for, not the real hotspot system. It will be removed once
 * Milestone 5+ builds actual hotspots with real content — at which point
 * these six numbers should be re-verified against real sprite positions
 * the same way the door gaps were, not assumed still correct.
 *
 * Coordinates are approximate zone-center points derived from
 * roomGeometry.ts's measured zone bounds — reasonable for testing the
 * camera mechanism, not a claim of pixel-verified hotspot placement.
 */
const TEST_TARGETS: Record<string, CameraTarget> = {
  leadership: { x: 16.5, y: 50, scale: 2.2 },
  desk: { x: 38.7, y: 50, scale: 2.2 },
  clock: { x: 49.8, y: 50, scale: 2.5 },
  research: { x: 60.9, y: 50, scale: 2.2 },
  coffee: { x: 83.9, y: 50, scale: 2.2 },
  window: { x: 38.7, y: 15, scale: 2.5 },
};

interface CameraTestHarnessProps {
  onFocus: (target: CameraTarget, durationMs?: number) => void;
  onReset: () => void;
}

export function CameraTestHarness({ onFocus, onReset }: CameraTestHarnessProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-2 text-xs">
      {Object.entries(TEST_TARGETS).map(([name, target]) => (
        <button
          key={name}
          type="button"
          onClick={() =>
            onFocus(target, name === "window" ? CAMERA_DURATION.slow : CAMERA_DURATION.standard)
          }
          className="rounded border border-zinc-400 bg-white/80 px-2 py-1 capitalize dark:bg-zinc-900/80"
        >
          {name}
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="rounded border border-zinc-400 bg-white/80 px-2 py-1 dark:bg-zinc-900/80"
      >
        Reset
      </button>
    </div>
  );
}
