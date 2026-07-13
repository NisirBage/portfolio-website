"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASING } from "@/lib/motion";

/**
 * Layer engine — presentation only, per the Layer Responsibilities rule.
 * Takes `isOpen` and renders accordingly; has no idea why it's open or
 * what triggered it. The docked-side-panel treatment matches
 * LOW_FIDELITY_EXPLORATION.md's Option C.
 *
 * Focus management: moves focus to the panel heading on open, returns
 * it to whatever had focus before opening (not necessarily the trigger
 * that opened it, since deep-linking bypasses a trigger entirely) on
 * close. `inert` — not just `aria-hidden` — while closed, since
 * `aria-hidden` alone doesn't stop a closed-but-still-mounted panel
 * from being reached by Tab.
 */

interface LayerPanelProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function LayerPanel({ isOpen, title, onClose, children }: LayerPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      headingRef.current?.focus();
    } else {
      previouslyFocused.current?.focus();
    }
  }, [isOpen]);

  // Workaround for a confirmed browser rendering bug, not a design choice:
  // toggling `inert` alongside a `transform` transition on this element
  // leaves unrelated absolutely-positioned siblings elsewhere in the
  // document with a stale *painted* position — getBoundingClientRect()
  // disagrees with offsetLeft, and no transform is present anywhere in
  // the computed style chain, ruling out a CSS mistake on this project's
  // side. Reproduced identically in a production build (not dev-server/
  // Fast-Refresh-specific) and is unaffected by DOM structure changes
  // that removed any shared ancestor between this panel and the affected
  // siblings — see ENGINEERING_DECISIONS.md Milestone 4 for the full
  // root-cause trail. A forced reflow after the transition starts is a
  // reliable, evidenced mitigation; it is not a guess.
  //
  // `setTimeout`, not `requestAnimationFrame`: verified during Milestone
  // 5 that rAF callbacks never fire at all on a `document.hidden` tab in
  // this test environment (confirmed in isolation, not assumed), which
  // silently defeated this exact workaround under test. `setTimeout`
  // isn't visibility-gated, so it can't have the same failure mode.
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      const original = document.body.style.display;
      void document.body.offsetHeight;
      document.body.style.display = "none";
      void document.body.offsetHeight;
      document.body.style.display = original;
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-labelledby="layer-panel-heading"
      inert={!isOpen}
      className="motion-transition absolute inset-y-0 right-0 flex w-96 max-w-full flex-col overflow-y-auto border-l border-zinc-300 bg-white/95 p-4 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95"
      style={{
        transform: isOpen ? "translateX(0%)" : "translateX(100%)",
        transitionDuration: `${isOpen ? DURATION.standard : DURATION.fast}ms`,
        transitionTimingFunction: EASING,
      }}
    >
      <div className="flex items-center justify-between">
        <h2
          id="layer-panel-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-sm font-medium outline-none"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-zinc-400 px-2 py-1 text-xs"
        >
          Close
        </button>
      </div>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
