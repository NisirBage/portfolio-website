"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { COFFEE_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Corkboard hotspot — Phase D, re-skinned Phase F.1. Opens the About
 * Me panel. Same shared pattern as every other hotspot — see
 * `DeskHotspot.tsx`.
 *
 * *Revised, Phase F.1.* Renamed from `CoffeeHotspot` and re-pointed at
 * `ASSETS.corkboard` — the Phase F.1 asset sheet is the stated visual
 * authority for this pass and explicitly labels this object "ABOUT ME
 * (CORK BOARD)," not a coffee mug scene. The underlying geometry constant
 * (`COFFEE_HOTSPOT`, in `roomGeometry.ts`) and the `"coffee"` layer id
 * used in the URL and `localStorage` are deliberately left unrenamed —
 * changing either would silently break a returning visitor's
 * `the-studio:visited-hotspots` entry or an already-shared `?panel=coffee`
 * link, for a rename that only needed to happen at the presentation
 * layer. The component file is the one place a name should describe
 * what a visitor actually sees, so that's the one place it changed.
 *
 * The steam animation is retired along with the coffee-mug visual — a
 * corkboard has nothing to steam. `CoffeeHotspot.tsx` itself is deleted
 * outright (Design For Deletion, the same precedent `CameraTestHarness`
 * already set — dead component code is removed, not kept around
 * unimported). `ASSETS.coffeeCorner`'s registry entry is the one thing
 * left in place, since `ASSET_REGISTRY.md`'s own convention is to
 * correct an entry's status rather than erase the record of what was
 * once integrated.
 */

interface CorkboardHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function CorkboardHotspot({ onOpen, visited = false }: CorkboardHotspotProps) {
  const sprite = getSpritePlacement(
    COFFEE_HOTSPOT.centerXPercent,
    COFFEE_HOTSPOT.centerYPercent,
    ASSETS.corkboard.width,
    ASSETS.corkboard.height,
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
          animationDelay: "1.9s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.corkboard.src}
          alt=""
          width={ASSETS.corkboard.width}
          height={ASSETS.corkboard.height}
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
        aria-label="Open the Corkboard — about me"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${COFFEE_HOTSPOT.centerXPercent}%`,
          top: `${COFFEE_HOTSPOT.centerYPercent}%`,
          width: "14%",
          height: "18%",
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
        <HotspotLabel label="About Me" visited={visited} active={isHovered || isPressed} />
      </button>
    </>
  );
}
