"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import {
  RESEARCH_HOTSPOT,
  RESEARCH_BOOK_Y_OFFSET_PERCENT,
  getSpritePlacement,
} from "@/lib/roomGeometry";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Research hotspot — Milestone 7, rebuilt as a compound object during
 * Concept Reconciliation.
 *
 * *Revised, Concept Reconciliation:* the journal previously floated alone
 * with no supporting furniture — a real defect the concept called out
 * directly, not a cosmetic complaint. Fixed by adding a reading stand
 * (a genuine, previously-unused pack asset — a round pedestal side
 * table, see ASSETS.readingStand) beneath it, and shifting the journal
 * upward by `RESEARCH_BOOK_Y_OFFSET_PERCENT` so it visually rests on the
 * stand's top surface rather than sitting at its physical center.
 *
 * The click zone now encompasses both sprites' combined bounding box
 * (stand: 16x32 centered on RESEARCH_HOTSPOT; book: 16x16 offset above
 * it) with margin, per the Visual Truthfulness rule that a button must
 * cover ≥ the sprite footprint it represents — re-measured from scratch
 * rather than reused from the single-sprite version.
 *
 * *Revised, Phase C, Part 2* — both sprites share one `animationDelay`
 * so the stand and the book breathe as a single rigid compound object,
 * not two independently-drifting pieces. See DeskHotspot.tsx for the
 * full breathing/hover/press rationale.
 */

interface ResearchHotspotProps {
  onOpen: () => void;
  /** Phase B, Part 8 — see DeskHotspot.tsx's `visited` prop for the full rationale. */
  visited?: boolean;
}

export function ResearchHotspot({ onOpen, visited = false }: ResearchHotspotProps) {
  const stand = getSpritePlacement(
    RESEARCH_HOTSPOT.centerXPercent,
    RESEARCH_HOTSPOT.centerYPercent,
    ASSETS.readingStand.width,
    ASSETS.readingStand.height,
  );
  const book = getSpritePlacement(
    RESEARCH_HOTSPOT.centerXPercent,
    RESEARCH_HOTSPOT.centerYPercent + RESEARCH_BOOK_Y_OFFSET_PERCENT,
    ASSETS.bookOpen.width,
    ASSETS.bookOpen.height,
  );
  const { isHovered, isPressed, handlers } = useHoverState();
  const animationDelay = "2.6s";
  const animationPlayState = isHovered || isPressed ? "paused" : "running";
  const hoverFilter = isHovered ? "brightness(1.08) drop-shadow(0 3px 2px rgba(20, 12, 4, 0.35))" : undefined;
  const pressTransform = isPressed ? "scale(0.96, 1.04)" : isHovered ? "translateY(-3%) scale(1.015)" : undefined;
  const spriteTransitionMs = isPressed ? MOTION.instant : MOTION.fast;

  return (
    <>
      <div
        className="sprite-breathe pointer-events-none absolute"
        style={{
          left: `${stand.left}%`,
          top: `${stand.top}%`,
          width: `${stand.width}%`,
          height: `${stand.height}%`,
          animationDelay,
          animationPlayState,
        }}
      >
        <Image
          src={ASSETS.readingStand.src}
          alt=""
          width={ASSETS.readingStand.width}
          height={ASSETS.readingStand.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none transition-[filter,transform]"
          style={{ filter: hoverFilter, transform: pressTransform, transitionDuration: `${spriteTransitionMs}ms` }}
        />
      </div>
      <div
        className="sprite-breathe pointer-events-none absolute"
        style={{
          left: `${book.left}%`,
          top: `${book.top}%`,
          width: `${book.width}%`,
          height: `${book.height}%`,
          animationDelay,
          animationPlayState,
        }}
      >
        <Image
          src={ASSETS.bookOpen.src}
          alt=""
          width={ASSETS.bookOpen.width}
          height={ASSETS.bookOpen.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none transition-[filter,transform]"
          style={{ filter: hoverFilter, transform: pressTransform, transitionDuration: `${spriteTransitionMs}ms` }}
        />
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open the Research Journal"
        {...handlers}
        className={`absolute flex items-center justify-center rounded-sm border-2 outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${visited ? "border-amber-400/40" : "idle-pulse border-transparent"}`}
        style={{
          left: `${RESEARCH_HOTSPOT.centerXPercent}%`,
          top: `${RESEARCH_HOTSPOT.centerYPercent}%`,
          width: "10%",
          height: "25%",
          backgroundColor: isPressed ? "rgba(217, 160, 62, 0.35)" : undefined,
          minWidth: "44px",
          minHeight: "44px",
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
        <HotspotLabel label="Research" visited={visited} active={isHovered || isPressed} />
      </button>
    </>
  );
}
