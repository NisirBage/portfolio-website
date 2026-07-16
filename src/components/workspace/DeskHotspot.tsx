"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { DESK_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The first real hotspot (Milestone 5) — everything before this was
 * either room dressing or temporary test scaffolding. Renders inside
 * CameraContainer so it pans/zooms with the room like any other layer.
 *
 * The idle pulse (`.idle-pulse`, globals.css) is the discovery-mechanism
 * fix from DESIGN_DEBT.md Finding #2 — something moves without requiring
 * a hover, so a first-time visitor has a reason to believe the scene is
 * interactive at all.
 *
 * Desk sprite added post-Milestone-8 (ASSET_REQUIREMENTS.md P0) — the
 * click zone stays generous beyond the sprite's own footprint (existing
 * accessibility requirement), now rendered mostly transparent at rest so
 * the furniture underneath is visible rather than permanently tinted.
 *
 * *Revised, Phase C, Part 2 (microinteractions).* The sprite is now
 * wrapped in a `.sprite-breathe` div (a very subtle, always-on idle
 * scale pulse — distinct from `.idle-pulse`'s discovery blink, which
 * stays on the button below) and the `<Image>` itself responds to
 * `useHoverState`: a slight lift + brighten + drop-shadow on hover, a
 * quick squash on press. The breathing lives on a *separate* wrapper
 * element from the hover/press transform specifically so the two never
 * fight over the same element's `transform` property — see
 * `useHoverState.ts` and `MICROINTERACTIONS.md`'s Phase C section.
 */

interface DeskHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function DeskHotspot({ onOpen, visited = false }: DeskHotspotProps) {
  const sprite = getSpritePlacement(
    DESK_HOTSPOT.centerXPercent,
    DESK_HOTSPOT.centerYPercent,
    ASSETS.deskSprite.width,
    ASSETS.deskSprite.height,
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
          animationDelay: "0s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.deskSprite.src}
          alt=""
          width={ASSETS.deskSprite.width}
          height={ASSETS.deskSprite.height}
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
        aria-label="Open the Desk — projects"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${DESK_HOTSPOT.centerXPercent}%`,
          top: `${DESK_HOTSPOT.centerYPercent}%`,
          width: "18%",
          height: "26%",
          // Phase C, Part 6: a brief highlight flash on press, distinct
          // from the steady hover tint — coincides with the sprite's own
          // press-squash so "squash + highlight" read as one gesture.
          backgroundColor: isPressed ? "rgba(217, 160, 62, 0.35)" : undefined,
          // Percentage sizing shrinks with the room at narrow viewports —
          // measured 59×43px at 360px wide, 1px under the ~44px touch
          // floor. See Gramophone.tsx for the same fix and reasoning.
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
        <HotspotLabel label="Workspace" visited={visited} active={isHovered || isPressed} priority="primary" />
      </button>
    </>
  );
}
