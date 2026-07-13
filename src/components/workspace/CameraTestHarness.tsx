"use client";

import { type CameraTarget } from "@/hooks/useCamera";
import { DURATION } from "@/lib/motion";

/**
 * TEMPORARY Milestone 3 verification scaffolding for the zones that
 * still have no real content. "desk" was removed here in Milestone 5
 * once `DeskHotspot` replaced it with a real, content-backed hotspot;
 * "research" was removed in Milestone 7 once `KnowledgeHotspot` and
 * `ResearchHotspot` replaced it with two real, content-backed hotspots —
 * Design For Deletion in practice: this harness shrinks as real
 * hotspots replace its stand-ins, rather than the two coexisting
 * indefinitely. The remaining three will be removed the same way as
 * later milestones build their real content.
 *
 * Coordinates are approximate zone-center points derived from
 * roomGeometry.ts's measured zone bounds — reasonable for testing the
 * camera mechanism, not a claim of pixel-verified hotspot placement.
 */
const TEST_TARGETS: Record<string, CameraTarget> = {
  leadership: { x: 16.5, y: 50, scale: 2.2 },
  clock: { x: 49.8, y: 50, scale: 2.5 },
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
          onClick={() => onFocus(target, name === "window" ? DURATION.slow : DURATION.standard)}
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
