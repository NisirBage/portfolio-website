"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ROLODEX_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Rolodex hotspot — Phase F.1, Part 6. Opens the Contact panel,
 * replacing `PersistentActions`' screen-fixed Contact link entirely.
 * Same shared pattern as every other hotspot — see `DeskHotspot.tsx`.
 *
 * *Re-scaled and re-sprited, Phase F.2.* The Phase F.1 Rolodex sprite
 * (30×26, AI-generated) read as visually imported from a different style
 * than the room's real, native-pack furniture. `ASSETS.ledger` now
 * renders here instead — a small closed book cropped directly from
 * `TopDownHouse_SmallItems.png` — per the brief's stated preference
 * order (Address Book, Ledger, Clipboard, Memo Board); a direct
 * inspection of that sheet found no address book, clipboard, or memo
 * board, only two book sprites, so the closed book stands in as the
 * Ledger (see `ASSETS.ledger`'s own comment in `assets.ts`). The
 * component file itself keeps its `RolodexHotspot` name — renaming a
 * file is a code-organization change, out of scope for a sprite-only
 * pass — but the `aria-label` below now says "Ledger," matching what a
 * visitor actually sees, since leaving it saying "Rolodex" over a
 * ledger sprite would tell screen-reader users something the sighted
 * view no longer shows.
 */

interface RolodexHotspotProps {
  onOpen: () => void;
  visited?: boolean;
}

export function RolodexHotspot({ onOpen, visited = false }: RolodexHotspotProps) {
  const sprite = getSpritePlacement(
    ROLODEX_HOTSPOT.centerXPercent,
    ROLODEX_HOTSPOT.centerYPercent,
    ASSETS.ledger.width,
    ASSETS.ledger.height,
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
          animationDelay: "4.4s",
          animationPlayState: isHovered || isPressed ? "paused" : "running",
        }}
      >
        <Image
          src={ASSETS.ledger.src}
          alt=""
          width={ASSETS.ledger.width}
          height={ASSETS.ledger.height}
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
        aria-label="Open the Ledger — contact"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${ROLODEX_HOTSPOT.centerXPercent}%`,
          top: `${ROLODEX_HOTSPOT.centerYPercent}%`,
          width: "6%",
          height: "8%",
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
        <HotspotLabel label="Contact" visited={visited} active={isHovered || isPressed} />
      </button>
    </>
  );
}
