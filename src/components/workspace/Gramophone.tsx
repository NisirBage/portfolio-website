"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { GRAMOPHONE_PLACEMENT, getSpritePlacement } from "@/lib/roomGeometry";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useHoverState } from "@/hooks/useHoverState";
import { MOTION } from "@/lib/motion";
import { HotspotLabel } from "./HotspotLabel";

/**
 * The Gramophone — Phase A, revised Phase B and Phase C. A real room
 * object, not a floating UI button: rendered at native sprite scale
 * inside the same camera-panned layer every other piece of furniture
 * lives in, so it pans and scales with the room like the desk or the
 * bookshelf, not like `PersistentActions`' screen-fixed corner links.
 *
 * Deliberately not a hotspot — no panel, no `LayerPanel`, no camera
 * focus target. `useAmbientAudio` is the single source of truth for
 * play/mute state; this component is purely presentational plus the
 * click/keyboard handler that calls `toggle`.
 *
 * *Revised, Phase B (ghost-popup fix):* the state badge was originally
 * offset beside the gramophone with a visible gap and sized 14×17px —
 * large and disconnected enough that a dark box with a bold red X read
 * as stray floating UI chrome, reported as a "ghost popup." Measured,
 * not just re-judged by eye: its right edge landed past
 * `ROOM_CONTENT_BOUNDS`, genuinely clipped off the drawn room. A first
 * fix (shrink to 10px, position touching the gramophone's edge) was
 * re-composited and inspected rather than assumed sufficient — it still
 * read as a separate small object next to the gramophone, not an
 * attached badge. Shrunk further to 8px and moved to substantially
 * overlap the gramophone's own horn (not just touch its edge) — the
 * same visual language as a notification dot stamped on an app icon,
 * not a second neighboring object. Confirmed within content bounds at
 * the final position (see the offset comment below for the math).
 *
 * *Revised, Phase C, Part 1 (audio experience completion):*
 * - **Hover/press state** now comes from the shared `useHoverState`
 *   hook rather than local state — see that hook's own comment for why
 *   this stayed JS-driven rather than moving to CSS `group-hover`.
 * - **A native tooltip** (`title`, "Ambient Audio: On"/"Off") — the
 *   brief asked for this exact text on hover; `title` is the one
 *   mechanism that produces a real browser tooltip without inventing a
 *   custom tooltip component for a single element.
 * - **Desaturation when muted.** The brief's OFF-state spec ("record
 *   still, small desaturated appearance") is a real, checkable visual
 *   difference now — `grayscale(65%)` applied only while muted, lifted
 *   on hover/playing so the object doesn't read as "broken" when engaged.
 * - **Musical note particles**, playing-state only: two `♪`/`♫` text
 *   glyphs (styled text, not a fabricated sprite — consistent with this
 *   codebase's existing ✕/✓ glyph precedent), staggered so they don't
 *   rise in sync, `aria-hidden` since they're decorative, removed
 *   entirely under `prefers-reduced-motion` rather than slowed down.
 * - **Record rotation — flagged, not faked.** The brief asks for the
 *   record disc to rotate slowly while the horn stays still. The
 *   current `gramophone.png` is one flattened crop with the horn,
 *   cabinet, and record disc baked into a single image (documented
 *   since Phase A) — there is no separate disc-only sprite to rotate
 *   independently, and rotating the *whole* image would visibly spin
 *   the horn too, which Phase B already established as mechanically
 *   wrong and which this phase's own brief repeats ("do not rotate the
 *   horn"). Per "flag missing assets, continue implementation where
 *   possible": recommended in `AUDIO_DESIGN.md` — a small (~8-10px),
 *   circular, transparent-background record-disc sprite that could be
 *   layered under/over the existing body and rotated on its own. Until
 *   that exists, the playing state keeps Phase B's bounce + glow, which
 *   is the sanctioned substitute this project's brief has now twice
 *   explicitly allowed ("small rotation OR bounce").
 */
export function Gramophone() {
  const { isPlaying, toggle } = useAmbientAudio();
  const { isHovered, isPressed, handlers } = useHoverState();

  const body = getSpritePlacement(
    GRAMOPHONE_PLACEMENT.centerXPercent,
    GRAMOPHONE_PLACEMENT.centerYPercent,
    ASSETS.gramophone.width,
    ASSETS.gramophone.height,
  );

  const badgeAsset = isPlaying ? ASSETS.gramophoneBadgePlaying : ASSETS.gramophoneBadgeMuted;
  // Overlaps the gramophone's own horn (gramophone spans roughly
  // x:[86.9,93.1]%, y:[54.7,69.3]% at its 18×21 native size) — offset
  // (+1.7,-4.5) puts the badge's own center well inside that footprint,
  // not touching its edge. Badge right edge at this position: 91.7 +
  // (8/288/2*100) ≈ 93.1%, inside `ROOM_CONTENT_BOUNDS`'s 95.49% right
  // edge, with real margin (not just barely clearing it).
  const badge = getSpritePlacement(
    GRAMOPHONE_PLACEMENT.centerXPercent + 1.7,
    GRAMOPHONE_PLACEMENT.centerYPercent - 4.5,
    badgeAsset.width,
    badgeAsset.height,
  );

  const tooltip = isPlaying ? "Ambient Audio: On" : "Ambient Audio: Off";

  return (
    <div
      className="pointer-events-none absolute inset-0 sprite-breathe"
      style={{
        animationDelay: "4.8s",
        // Paused whenever something more specific is already animating
        // this element — hover/press feedback, or the playing-state
        // bounce — so the breathing keyframe's own `transform` never
        // fights either of those for the same CSS property.
        animationPlayState: isHovered || isPressed || isPlaying ? "paused" : "running",
      }}
    >
      <Image
        src={ASSETS.gramophone.src}
        alt=""
        width={ASSETS.gramophone.width}
        height={ASSETS.gramophone.height}
        unoptimized
        priority
        className={`pixel-art pointer-events-none absolute select-none transition-[filter,transform] ${isPlaying ? "gramophone-playing" : ""}`}
        style={{
          left: `${body.left}%`,
          top: `${body.top}%`,
          width: `${body.width}%`,
          height: `${body.height}%`,
          filter: isPlaying
            ? isHovered
              ? "brightness(1.25)"
              : undefined
            : isHovered
              ? "brightness(1.15) grayscale(20%)"
              : "grayscale(65%)",
          transform: isPressed ? "scale(0.94, 1.06)" : isHovered ? "translateY(-3%) scale(1.03)" : undefined,
          transitionDuration: `${isPressed ? MOTION.instant : MOTION.fast}ms`,
        }}
      />
      <Image
        src={badgeAsset.src}
        alt=""
        width={badgeAsset.width}
        height={badgeAsset.height}
        unoptimized
        priority
        className="pixel-art pointer-events-none absolute select-none"
        style={{
          left: `${badge.left}%`,
          top: `${badge.top}%`,
          width: `${badge.width}%`,
          height: `${badge.height}%`,
        }}
      />
      {isPlaying && (
        <>
          <span aria-hidden="true" className="note-particle" style={{ left: `${body.left + body.width * 0.3}%`, top: `${body.top}%`, animationDelay: "0s" }}>
            ♪
          </span>
          <span aria-hidden="true" className="note-particle" style={{ left: `${body.left + body.width * 0.6}%`, top: `${body.top}%`, animationDelay: "2.6s" }}>
            ♫
          </span>
        </>
      )}
      <button
        type="button"
        onClick={toggle}
        title={tooltip}
        aria-label={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
        aria-pressed={isPlaying}
        {...handlers}
        className="pointer-events-auto absolute flex items-center justify-center rounded-sm border-2 border-transparent outline-offset-2 transition-colors hover:border-amber-400/70 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
        style={{
          left: `${GRAMOPHONE_PLACEMENT.centerXPercent}%`,
          top: `${GRAMOPHONE_PLACEMENT.centerYPercent}%`,
          width: "9%",
          height: "17%",
          // Percentage sizing shrinks with the room at narrow viewports —
          // at 540px wide this button measured 43px tall, 1px under the
          // ~44px touch floor. `min-width`/`min-height` guarantee the
          // floor without discarding the percentage sizing that keeps it
          // proportionate to the gramophone sprite at larger sizes.
          minWidth: "44px",
          minHeight: "44px",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Phase F.1, Part 8: "Music" — no visited checkmark here, since
            the Gramophone is a toggle (on/off), not a panel a visitor
            "visits" once. A checkmark would misleadingly imply a
            one-time achievement rather than a reversible state. */}
        <HotspotLabel label="Music" active={isHovered || isPressed} />
      </button>
    </div>
  );
}
