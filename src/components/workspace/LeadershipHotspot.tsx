"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { LEADERSHIP_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Leadership Wall hotspot — Milestone 8. Follows DeskHotspot's pattern.
 * Sized to cover the frame-wall area rather than a single small item, since
 * this hotspot represents a cluster of frames, not one object — a
 * reasonable-effort estimate, not a pixel-verified sprite footprint.
 *
 * Two frame sprites added post-Milestone-8 (ASSET_REQUIREMENTS.md P1) —
 * offset left/right within the hotspot zone to read as a small gallery
 * rather than one frame, which is honest to the panel's real content
 * (four capabilities, not one item) without claiming a fan-out that
 * isn't built.
 *
 * *Revised, Concept Reconciliation:* re-measuring the click zone against
 * the two frames' real footprints (Visual Truthfulness — button must
 * cover ≥ sprite bounds, not just visually approximate it) found the
 * left frame's left edge extended about 0.3% past the button's own left
 * edge. Widened from 14% to 16% to fully enclose both frames with margin.
 * Placement/spacing/balance otherwise already matched the concept —
 * frames read as a small wall gallery, distinct objects, no overlap.
 *
 * *Revised, Phase C, Part 2* — both frames share one `animationDelay` so
 * the gallery breathes as one wall unit, not two independently-drifting
 * frames. See DeskHotspot.tsx for the full breathing/hover/press
 * rationale.
 */

interface LeadershipHotspotProps {
  onOpen: () => void;
  /** Phase B, Part 8 — see DeskHotspot.tsx's `visited` prop for the full rationale. */
  visited?: boolean;
}

export function LeadershipHotspot({ onOpen, visited = false }: LeadershipHotspotProps) {
  const frameOffsetPercent = 4.5;
  const frameLeft = getSpritePlacement(
    LEADERSHIP_HOTSPOT.centerXPercent - frameOffsetPercent,
    LEADERSHIP_HOTSPOT.centerYPercent - 6,
    ASSETS.frameAbstract.width,
    ASSETS.frameAbstract.height,
  );
  const frameRight = getSpritePlacement(
    LEADERSHIP_HOTSPOT.centerXPercent + frameOffsetPercent,
    LEADERSHIP_HOTSPOT.centerYPercent - 6,
    ASSETS.frameLandscape.width,
    ASSETS.frameLandscape.height,
  );
  const { isHovered, isPressed, handlers } = useHoverState();
  const animationDelay = "3.9s";
  const animationPlayState = isHovered || isPressed ? "paused" : "running";
  const hoverFilter = isHovered ? "brightness(1.08) drop-shadow(0 3px 2px rgba(20, 12, 4, 0.35))" : undefined;
  const pressTransform = isPressed ? "scale(0.96, 1.04)" : isHovered ? "translateY(-3%) scale(1.015)" : undefined;
  const spriteTransitionMs = isPressed ? MOTION.instant : MOTION.fast;

  return (
    <>
      <div
        className="sprite-breathe pointer-events-none absolute"
        style={{
          left: `${frameLeft.left}%`,
          top: `${frameLeft.top}%`,
          width: `${frameLeft.width}%`,
          height: `${frameLeft.height}%`,
          animationDelay,
          animationPlayState,
        }}
      >
        <Image
          src={ASSETS.frameAbstract.src}
          alt=""
          width={ASSETS.frameAbstract.width}
          height={ASSETS.frameAbstract.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none transition-[filter,transform]"
          style={{ filter: hoverFilter, transform: pressTransform, transitionDuration: `${spriteTransitionMs}ms` }}
        />
      </div>
      <div
        className="sprite-breathe pointer-events-none absolute"
        style={{
          left: `${frameRight.left}%`,
          top: `${frameRight.top}%`,
          width: `${frameRight.width}%`,
          height: `${frameRight.height}%`,
          animationDelay,
          animationPlayState,
        }}
      >
        <Image
          src={ASSETS.frameLandscape.src}
          alt=""
          width={ASSETS.frameLandscape.width}
          height={ASSETS.frameLandscape.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none transition-[filter,transform]"
          style={{ filter: hoverFilter, transform: pressTransform, transitionDuration: `${spriteTransitionMs}ms` }}
        />
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open the Leadership Wall"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${LEADERSHIP_HOTSPOT.centerXPercent}%`,
          top: `${LEADERSHIP_HOTSPOT.centerYPercent}%`,
          width: "16%",
          height: "26%",
          backgroundColor: isPressed ? "rgba(217, 160, 62, 0.35)" : undefined,
          minWidth: "44px",
          minHeight: "44px",
          transform: "translate(-50%, -50%)",
        }}
      >
        {visited && (
          <span
            aria-hidden="true"
            className="visited-badge-pop pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-amber-500/70 bg-amber-100/95 text-[9px] leading-none text-amber-800 dark:bg-amber-950/90 dark:text-amber-300"
          >
            ✓
          </span>
        )}
        <HotspotLabel label="Leadership" visited={visited} active={isHovered || isPressed} priority="primary" />
      </button>
    </>
  );
}
