"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { KNOWLEDGE_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Bookshelf (Knowledge) hotspot — Milestone 7. Follows DeskHotspot's
 * pattern (idle-pulse discovery affordance, generous click target beyond
 * the underlying sprite). Sized smaller than the Desk's own hotspot since
 * a bookshelf reads as a narrower, taller object in the source room shell
 * — a reasonable-effort estimate, not a pixel-verified sprite footprint
 * (see roomGeometry.ts's honesty note on KNOWLEDGE_HOTSPOT/RESEARCH_HOTSPOT).
 *
 * Bookshelf sprite added post-Milestone-8 (ASSET_REQUIREMENTS.md P0).
 *
 * *Revised, Phase C, Part 2* — see DeskHotspot.tsx for the full
 * breathing/hover/press rationale; `animationDelay` offset from Desk's
 * so the two don't visibly pulse in sync.
 */

interface KnowledgeHotspotProps {
  onOpen: () => void;
  /** Phase B, Part 8 — see DeskHotspot.tsx's `visited` prop for the full rationale. */
  visited?: boolean;
}

export function KnowledgeHotspot({ onOpen, visited = false }: KnowledgeHotspotProps) {
  const sprite = getSpritePlacement(
    KNOWLEDGE_HOTSPOT.centerXPercent,
    KNOWLEDGE_HOTSPOT.centerYPercent,
    ASSETS.bookshelfSprite.width,
    ASSETS.bookshelfSprite.height,
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
          animationDelay: "1.3s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.bookshelfSprite.src}
          alt=""
          width={ASSETS.bookshelfSprite.width}
          height={ASSETS.bookshelfSprite.height}
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
        aria-label="Open the Bookshelf — knowledge"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${KNOWLEDGE_HOTSPOT.centerXPercent}%`,
          top: `${KNOWLEDGE_HOTSPOT.centerYPercent}%`,
          width: "18%",
          height: "37%",
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
        <HotspotLabel label="Knowledge" visited={visited} active={isHovered || isPressed} priority="primary" />
      </button>
    </>
  );
}
