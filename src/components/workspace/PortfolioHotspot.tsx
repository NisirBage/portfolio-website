"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { PORTFOLIO_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Leather Portfolio hotspot — Phase F.1, Part 7. Opens the Resume
 * panel, replacing `PersistentActions`' screen-fixed Resume download
 * link entirely. Same shared pattern as every other hotspot — see
 * `DeskHotspot.tsx`.
 *
 * *Re-sprited twice, post-Phase-H.2.* Phase F.2 replaced the Rolodex
 * hotspot's AI-generated sprite with `ASSETS.ledger` — a small book
 * cropped from the native "Top-Down Retro Interior" pack — because the
 * old AI-generated sprite read as visually imported from a different
 * style than the room's real furniture. That pass never touched this
 * hotspot, so it kept rendering `ASSETS.portfolio` (26×26, the original
 * AI-generated sprite) at roughly 4x `ASSETS.ledger`'s footprint —
 * exactly the disproportion Phase F.2 existed to fix, just missed here.
 * First fixed by pointing this hotspot at `ASSETS.ledger` too (same
 * crop as Contact). Within that same phase, real user-supplied art
 * arrived for this hotspot specifically — a red document folder — so it
 * now renders `ASSETS.resumeFolder` instead, a purpose-made asset rather
 * than reusing Contact's own. `ASSETS.portfolio` and the brief interim
 * use of `ASSETS.ledger` are both left on record, not deleted, per this
 * registry's "corrected, not erased" convention.
 */

interface PortfolioHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function PortfolioHotspot({ onOpen, visited = false }: PortfolioHotspotProps) {
  const sprite = getSpritePlacement(
    PORTFOLIO_HOTSPOT.centerXPercent,
    PORTFOLIO_HOTSPOT.centerYPercent,
    ASSETS.resumeFolder.width,
    ASSETS.resumeFolder.height,
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
          animationDelay: "5.7s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.resumeFolder.src}
          alt=""
          width={ASSETS.resumeFolder.width}
          height={ASSETS.resumeFolder.height}
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
        aria-label="Open the Leather Portfolio — resume"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${PORTFOLIO_HOTSPOT.centerXPercent}%`,
          top: `${PORTFOLIO_HOTSPOT.centerYPercent}%`,
          width: "12%",
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
            className="visited-badge-pop pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-amber-500/70 bg-amber-100/95 text-[9px] leading-none text-amber-800 dark:bg-amber-950/90 dark:text-amber-300"
          >
            ✓
          </span>
        )}
        <HotspotLabel label="Resume" visited={visited} active={isHovered || isPressed} priority="secondary" />
      </button>
    </>
  );
}
