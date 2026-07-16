"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { usePlayTime } from "@/hooks/usePlayTime";

interface SaveSlotProps {
  onContinue: () => void;
}

/**
 * Phase G — the Save Slot screen, Stage 3 of the intro sequence. Built
 * around `ASSETS.saveSlotFrame`/`ASSETS.continueButton`, two crops from
 * the same source region of the Tier-2 sheet's Standard frame — see
 * `assets.ts`'s own comment for why the baked "Play Time  00:00:00" and
 * "▶ Continue" pixels were surgically erased and rebuilt as real DOM
 * elements (a live-updating value can't be baked into a static image,
 * and a clickable control has to be a real, focusable `<button>`, not a
 * flat picture of one) while the baked name/subtitle/builder/header text
 * was left untouched and paired with an equivalent screen-reader-only
 * block instead of re-rendered on top of already-correct pixels.
 *
 * Positioning the live overlays: both blanked regions were erased at
 * exact, known pixel coordinates within the 399×371 frame (documented in
 * `ENGINEERING_DECISIONS.md`), so the overlay `<div>`s below are
 * positioned as percentages of the frame's own box — not eyeballed —
 * making them track the frame at any responsive size without drifting
 * out of alignment.
 */
export function SaveSlot({ onContinue }: SaveSlotProps) {
  const { formatted } = usePlayTime();
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continueRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") onContinue();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  const frame = ASSETS.saveSlotFrame;
  // Percentages of the 399×371 frame, derived from the exact erase
  // regions in ENGINEERING_DECISIONS.md — not eyeballed twice.
  const playTimeBox = { left: (112 / frame.width) * 100, top: (228 / frame.height) * 100, width: ((230 - 112) / frame.width) * 100, height: ((286 - 228) / frame.height) * 100 };
  const buttonBox = { left: (22 / frame.width) * 100, top: (291 / frame.height) * 100, width: ((378 - 22) / frame.width) * 100, height: ((347 - 291) / frame.height) * 100 };

  return (
    <div
      className="save-slot-enter relative mx-auto w-full max-w-[399px]"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
    >
      <Image
        src={frame.src}
        alt=""
        width={frame.width}
        height={frame.height}
        unoptimized
        priority
        className="pixel-art pointer-events-none absolute inset-0 h-full w-full select-none"
      />
      {/* Real, accessible equivalent of the frame's own baked name/subtitle/
          builder text — the image itself is decorative (`alt=""`) since
          this covers the same information without rendering it twice. */}
      <span className="sr-only">
        Save Slot 01. Nisir Sanang Bage. AI &amp; Machine Learning Student. Builder.
      </span>

      <div
        className="absolute flex items-center gap-2"
        style={{ left: `${playTimeBox.left}%`, top: `${playTimeBox.top}%`, width: `${playTimeBox.width}%`, height: `${playTimeBox.height}%` }}
      >
        <div className="flex flex-col justify-center leading-tight" style={{ fontFamily: "var(--font-geist-mono)" }}>
          <span className="text-[11px] font-semibold text-[#3a2c1c]">Play Time</span>
          <span aria-live="off" className="text-[13px] font-bold tracking-wide text-[#3a2c1c]">
            {formatted}
          </span>
        </div>
      </div>

      <button
        ref={continueRef}
        type="button"
        onClick={onContinue}
        aria-label="Continue"
        className="save-slot-continue-button absolute flex items-center justify-center outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
        style={{ left: `${buttonBox.left}%`, top: `${buttonBox.top}%`, width: `${buttonBox.width}%`, height: `${buttonBox.height}%` }}
      >
        <Image
          src={ASSETS.continueButton.src}
          alt=""
          width={ASSETS.continueButton.width}
          height={ASSETS.continueButton.height}
          unoptimized
          priority
          className="pixel-art pointer-events-none h-full w-full select-none"
        />
      </button>
    </div>
  );
}
