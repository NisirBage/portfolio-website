"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { WINDOW_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Window hotspot — Phase D. Opens the Future panel. Same shared
 * pattern as every other hotspot — see `DeskHotspot.tsx`.
 *
 * *Clouds/daylight, flagged not faked.* The brief's own fallback for
 * this one is explicit: "only if supported by the asset; otherwise keep
 * static." `window.png` is one flattened crop with the sky, clouds, sun,
 * and mountains all baked into a single image — there's no separate
 * cloud layer to drift independently. Kept static, per the brief's own
 * instruction, rather than faking movement by animating the whole
 * window (which would visibly shift the frame and sill along with the
 * sky, the same category of mistake already ruled out for the Clock's
 * pendulum and the Gramophone's horn).
 *
 * *Re-scaled to the source pack's native size, Phase F.2.* The Phase D
 * generated window (40×41) "immediately draws attention away from the
 * room" (the brief's own words) — visually dominant next to furniture
 * drawn at the source pack's real scale. `ASSETS.window` now points at a
 * 25×28 small square window cropped directly from
 * `TopDownHouse_DoorsAndWindows.png`, the pack the room shell itself is
 * built from — chosen over the sheet's other two window variants (a wide
 * 2-pane picture window and a smaller wide arched transom) because it's
 * the one that's actually square in proportion, the plainest and most
 * ordinary-reading of the three. No code here changed to make the sprite
 * swap itself; the click-target `<button>` below was shrunk to match
 * (16%→11%, 22%→15%), proportional to the sprite's own size reduction,
 * with the existing 44px floor unchanged as the absolute minimum.
 */

interface WindowHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function WindowHotspot({ onOpen, visited = false }: WindowHotspotProps) {
  const sprite = getSpritePlacement(
    WINDOW_HOTSPOT.centerXPercent,
    WINDOW_HOTSPOT.centerYPercent,
    ASSETS.window.width,
    ASSETS.window.height,
  );
  const { isHovered, isPressed, handlers } = useHoverState();

  return (
    <>
      <div
        className="sprite-breathe pointer-events-none absolute"
        style={{
          left: `${sprite.left}%`,
          top: `${sprite.top}%`,
          width: `${sprite.width}%`,
          height: `${sprite.height}%`,
          animationDelay: "3.2s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.window.src}
          alt=""
          width={ASSETS.window.width}
          height={ASSETS.window.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none transition-[filter,transform]"
          style={{
            filter: isHovered ? "brightness(1.08) drop-shadow(0 3px 2px rgba(20, 12, 4, 0.35))" : undefined,
            transform: isPressed ? "scale(0.96, 1.04)" : isHovered ? "translateY(-3%) scale(1.015)" : undefined,
            transitionDuration: `${isPressed ? MOTION.instant : MOTION.fast}ms`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open the Window — future"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${WINDOW_HOTSPOT.centerXPercent}%`,
          top: `${WINDOW_HOTSPOT.centerYPercent}%`,
          width: "11%",
          height: "15%",
          minWidth: "44px",
          minHeight: "44px",
          backgroundColor: isPressed ? "rgba(217, 160, 62, 0.35)" : undefined,
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
        <HotspotLabel label="Future" visited={visited} active={isHovered || isPressed} priority="secondary" />
      </button>
    </>
  );
}
