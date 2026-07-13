"use client";

import { useCallback, useState } from "react";
import { DURATION } from "@/lib/motion";

/**
 * Content-agnostic camera state. A target is a point to center on plus a
 * scale — nothing here knows what's being focused on. Per Milestone 3's
 * brief: the camera controls translation, scale, framing, and timing,
 * and nothing else. Callers (later milestones) decide what target and
 * duration a given interaction should request.
 */
export interface CameraTarget {
  /** Center point to bring to the viewport's center, percent of canvas. */
  x: number;
  y: number;
  scale: number;
}

export const CAMERA_IDENTITY: CameraTarget = { x: 50, y: 50, scale: 1 };

interface CameraState {
  target: CameraTarget;
  durationMs: number;
}

export function useCamera(initial: CameraTarget = CAMERA_IDENTITY) {
  const [state, setState] = useState<CameraState>({
    target: initial,
    durationMs: DURATION.standard,
  });

  const focus = useCallback((target: CameraTarget, durationMs: number = DURATION.standard) => {
    // Deliberately just replaces the target. No queue, no cancellation
    // flag: a CSS `transition` on `transform` interpolates from whatever
    // is currently rendered to the new target automatically, which is
    // the "cancel gracefully and redirect" behavior a hand-rolled
    // animation queue would otherwise have to implement — see
    // DESIGN_DEBT.md Finding #4 and ENGINEERING_DECISIONS.md.
    setState({ target, durationMs });
  }, []);

  const reset = useCallback(
    (durationMs: number = DURATION.standard) => focus(CAMERA_IDENTITY, durationMs),
    [focus],
  );

  return { target: state.target, durationMs: state.durationMs, focus, reset };
}

/**
 * Translate + scale so that (target.x%, target.y%) of the canvas lands at
 * the viewport's center. Derivation: with `transform-origin: 0 0` and
 * `transform: scale(S) translate(tx%, ty%)`, a point at (px%, py%) maps to
 * (S·(px+tx), S·(py+ty)) — percentages resolve against the element's own
 * box regardless of the scale applied to the result. Solving
 * S·(px+tx) = 50 for tx gives tx = 50/S − px, and identically for ty.
 * Verified empirically against a known target's rendered screen position
 * during Milestone 3 (see ENGINEERING_DECISIONS.md), not assumed correct
 * from the derivation alone.
 */
export function cameraTransform(target: CameraTarget): string {
  const tx = 50 / target.scale - target.x;
  const ty = 50 / target.scale - target.y;
  return `scale(${target.scale}) translate(${tx}%, ${ty}%)`;
}
