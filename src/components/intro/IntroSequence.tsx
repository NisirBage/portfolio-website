"use client";

import { useEffect, useState } from "react";
import { SaveSlot } from "./SaveSlot";
import { INTRO, EASING } from "@/lib/motion";

type Stage = "title" | "save-slot" | "exiting" | "done";

/**
 * Phase G — the GBA-style boot sequence gating the room. A state
 * machine, not a single animated component, because each stage has a
 * genuinely different shape (a bare heading, an interactive panel)
 * rather than one element animating through several looks.
 *
 * Sequence, per the brief: fade in from black (500–700ms) → title card
 * alone, held ~1s, then fades → Save Slot with a live Play Time and a
 * real Continue control → on Continue, fade out to reveal the room
 * (600–800ms). Stage 1 and the start of Stage 2 are the same motion, not
 * two separate ones: the backdrop is solid black for the entire intro,
 * so "fading in from black" *is* the title's own opacity transition from
 * 0 to 1 over the mount — there's nothing else in the frame yet for a
 * separate black-to-something fade to reveal.
 *
 * `Workspace` is mounted underneath for this component's entire
 * lifetime (see `page.tsx`) — "fading into the room" is this overlay's
 * own opacity going to 0 over the already-rendered room, not a separate
 * reveal animation on the room itself, which is what keeps the
 * transition from ever needing to coordinate two components' timing
 * against each other.
 *
 * All motion here is opacity/transform CSS transitions on values this
 * component already owns — no animation library, consistent with
 * `MOTION`/`DURATION`'s existing project-wide bands (`lib/motion.ts`)
 * and this project's standing "CSS transitions, not a library" choice.
 * The brief's own Performance section lists "Framer Motion (already
 * used)" as an allowed exception — checked against `package.json`
 * directly, it isn't actually a dependency, so nothing here reaches for
 * it: adding a new library to do what a few lines of CSS transition
 * already handle everywhere else in this codebase would cut against the
 * brief's own "reuse existing architecture, prefer refactoring over
 * rewriting" rule.
 */
export function IntroSequence({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState<Stage>("title");
  const [titleVisible, setTitleVisible] = useState(false);

  // Title: mount at opacity 0, flip to 1 a tick later so the browser has
  // a frame to transition from (the same "mount closed, open next tick"
  // pattern `LayerPanel` already relies on for its own entrance).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setTitleVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (stage !== "title") return;
    // Fade-in + hold, then start the fade-out; Save Slot takes over once
    // that fade-out transition finishes.
    const hideAt = setTimeout(() => setTitleVisible(false), INTRO.titleFadeIn + INTRO.titleHold);
    const advanceAt = setTimeout(
      () => setStage("save-slot"),
      INTRO.titleFadeIn + INTRO.titleHold + INTRO.titleFadeOut,
    );
    return () => {
      clearTimeout(hideAt);
      clearTimeout(advanceAt);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "exiting") return;
    const t = setTimeout(() => setStage("done"), INTRO.roomTransition);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage === "done") onComplete?.();
  }, [stage, onComplete]);

  if (stage === "done") return null;

  const overlayVisible = stage !== "exiting";

  return (
    <div
      role="presentation"
      className="intro-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6"
      style={{
        opacity: overlayVisible ? 1 : 0,
        transitionProperty: "opacity",
        transitionDuration: `${INTRO.roomTransition}ms`,
        transitionTimingFunction: EASING,
      }}
    >
      {stage === "title" && (
        <h1
          tabIndex={-1}
          className="intro-title text-center text-2xl font-semibold tracking-[0.3em] text-amber-100 uppercase sm:text-4xl"
          style={{
            opacity: titleVisible ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: `${titleVisible ? INTRO.titleFadeIn : INTRO.titleFadeOut}ms`,
            transitionTimingFunction: EASING,
          }}
        >
          Nisir Sanang Bage
        </h1>
      )}

      {stage === "save-slot" && (
        <div className="intro-save-slot-wrap w-full">
          <SaveSlot onContinue={() => setStage("exiting")} />
        </div>
      )}
    </div>
  );
}
