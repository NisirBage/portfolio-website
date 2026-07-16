"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { CLOCK_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Clock hotspot — Phase D. Opens the Timeline panel. Follows the same
 * pattern as every other hotspot (idle-pulse discovery affordance,
 * `.sprite-breathe` idle animation, `useHoverState`-driven lift/press,
 * a visited-state badge) — see `DeskHotspot.tsx` for the full rationale.
 *
 * *Pendulum motion, flagged not faked.* The brief asks for a gentle
 * pendulum swing. `clock.png` is one flattened crop with the case, face,
 * and pendulum baked into a single image — there is no separate
 * pendulum-only layer to swing independently, and animating the whole
 * sprite would swing the case and face along with it, which is
 * mechanically wrong (the same reasoning already established for the
 * Gramophone's horn). Per the brief's own explicit fallback ("otherwise
 * keep them static"), the clock stays static. A follow-up asset request
 * (a pendulum-only sprite, transparent background, positioned to overlay
 * the case) is the real fix if this becomes a priority.
 *
 * *Re-scaled to the source pack's native size, Phase F.2.* The Phase D
 * generated clock (32×43) read as visually dominant against the room's
 * real furniture, all drawn at the "Top-Down Retro Interior" pack's own
 * scale. `ASSETS.clock` now points at a 15×15 wall-clock sprite cropped
 * directly from that pack — no code here changed to make the sprite
 * swap itself, since `getSpritePlacement` derives sizing straight from
 * `ASSETS.clock.width`/`.height`. The click-target `<button>` below was
 * shrunk to match (14%→8%, 22%→10%), proportional to the sprite's own
 * size reduction, with the existing 44px floor unchanged as the
 * absolute minimum.
 */

interface ClockHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function ClockHotspot({ onOpen, visited = false }: ClockHotspotProps) {
  const sprite = getSpritePlacement(
    CLOCK_HOTSPOT.centerXPercent,
    CLOCK_HOTSPOT.centerYPercent,
    ASSETS.clock.width,
    ASSETS.clock.height,
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
          animationDelay: "0.6s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.clock.src}
          alt=""
          width={ASSETS.clock.width}
          height={ASSETS.clock.height}
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
        aria-label="Open the Clock — timeline"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${CLOCK_HOTSPOT.centerXPercent}%`,
          top: `${CLOCK_HOTSPOT.centerYPercent}%`,
          width: "8%",
          height: "10%",
          minWidth: "44px",
          minHeight: "44px",
          backgroundColor: isPressed ? "rgba(217, 160, 62, 0.35)" : undefined,
          transform: "translate(-50%, -50%)",
        }}
      >
        {visited && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-amber-500/70 bg-amber-100/95 text-[9px] leading-none text-amber-800 dark:bg-amber-950/90 dark:text-amber-300"
          >
            ✓
          </span>
        )}
        <HotspotLabel label="Timeline" visited={visited} active={isHovered || isPressed} />
      </button>
    </>
  );
}
