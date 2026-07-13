"use client";

import { CAMERA_IDENTITY, cameraTransform, type CameraTarget } from "@/hooks/useCamera";
import { EASING } from "@/lib/motion";

/**
 * Applies whatever transform/timing it's given via CSS `transition`,
 * per EXPERIENCE_ARCHITECTURE.md's Camera Philosophy. Purely
 * presentational — it takes a target and duration as props and knows
 * nothing about what produced them, per Milestone 3's requirement that
 * the camera stay content-agnostic. `.motion-transition` (globals.css)
 * collapses to an instant cut under `prefers-reduced-motion: reduce`.
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
      className="motion-transition absolute inset-0"
      style={{
        transform: cameraTransform(target),
        transformOrigin: "0 0",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: EASING,
      }}
    >
      {children}
    </div>
  );
}
