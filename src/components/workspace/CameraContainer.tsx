"use client";

import { CAMERA_EASING, CAMERA_IDENTITY, cameraTransform, type CameraTarget } from "@/hooks/useCamera";

/**
 * Applies whatever transform/timing it's given via CSS `transition`,
 * per EXPERIENCE_ARCHITECTURE.md's Camera Philosophy. Purely
 * presentational — it takes a target and duration as props and knows
 * nothing about what produced them, per Milestone 3's requirement that
 * the camera stay content-agnostic. `motion-reduce:` collapses the
 * transition to an instant cut; see globals.css for the underlying rule.
 */

interface CameraContainerProps {
  children: React.ReactNode;
  target?: CameraTarget;
  durationMs?: number;
}

export function CameraContainer({
  children,
  target = CAMERA_IDENTITY,
  durationMs = 500,
}: CameraContainerProps) {
  return (
    <div
      className="camera-transition absolute inset-0"
      style={{
        transform: cameraTransform(target),
        transformOrigin: "0 0",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: CAMERA_EASING,
      }}
    >
      {children}
    </div>
  );
}
