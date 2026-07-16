"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
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
 *
 * *Revised, Phase A (UI/UX Refinement):*
 * - **A real bug fixed, not just polish.** The heading `id` was a
 *   hardcoded string (`"layer-panel-heading"`), but four `LayerPanel`
 *   instances are mounted simultaneously (Desk/Knowledge/Research/
 *   Leadership) — meaning all four `<h2>`s shared one `id`, invalid
 *   HTML, and every panel's `aria-labelledby` pointed at whichever one
 *   the browser resolved first rather than its own heading. Fixed with
 *   `useId()`, which generates a real per-instance unique id.
 * - **Structural layout change**, not just styling: header and footer
 *   are now `shrink-0` outside the scrolling region, only the content
 *   between them scrolls. Previously the entire panel (including the
 *   title and Close button) was one `overflow-y-auto` block, so on a
 *   long panel (Leadership, with four expandable capabilities) scrolling
 *   down scrolled the title and Close control out of view too — a real
 *   usability defect the "never let text become unreadable, support
 *   scrolling inside the panel" requirement exists specifically to catch.
 * - **Outside-click-to-close.** A backdrop behind the panel, covering
 *   the room, closes on click — decorative/non-focusable
 *   (`aria-hidden`, no `tabIndex`) so it can't be tabbed to or announced,
 *   consistent with "no keyboard traps."
 * - **A second, equally-valid close control** (a "✓ Done" button at the
 *   panel's own bottom) alongside the existing corner "✕" — both call
 *   the identical `onClose`, per the explicit "every close action should
 *   behave identically" requirement. Neither is a fabricated pixel
 *   sprite; both are styled text glyphs (✕/✓) in the existing type
 *   scale — no check/close icon sheet was actually supplied (verified by
 *   inspecting every file in the provided asset folder), and inventing
 *   one would violate Asset Truthfulness.
 * - **A real, provided asset used where it earns its place**: the
 *   Escape hint next to the corner Close button uses the actual cropped
 *   `ESC` keycap sprite from the supplied keyboard pack, not a text
 *   approximation — the one place this pass pulled from that pack, per
 *   its own "only use if it materially improves clarity" instruction.
 */

interface LayerPanelProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function LayerPanel({ isOpen, title, onClose, children }: LayerPanelProps) {
  const headingId = useId();
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
    <>
      {/* Outside-click-to-close backdrop. Decorative only — not part of
          the tab order, not announced to assistive tech — a real click
          target, nothing else. Fades on the same timing/easing as the
          panel itself for one consistent open/close rhythm. */}
      <div
        aria-hidden="true"
        onClick={isOpen ? onClose : undefined}
        inert={!isOpen}
        className="motion-transition absolute inset-0"
        style={{
          opacity: isOpen ? 1 : 0,
          // Phase B, Part 7: a very subtle blur behind the open panel —
          // the room stays legible (3px, not a heavy glass-morphism
          // wash), it just reads as "behind" rather than competing with
          // the panel for attention. `backdrop-filter` transitions on
          // the same clock as the dim itself for one consistent feel.
          transitionProperty: "opacity, backdrop-filter",
          transitionDuration: `${isOpen ? DURATION.panelOpen : DURATION.panelClose}ms`,
          transitionTimingFunction: EASING,
          backgroundColor: "rgb(26 18 12 / 0.35)",
          backdropFilter: isOpen ? "blur(3px)" : "blur(0px)",
          WebkitBackdropFilter: isOpen ? "blur(3px)" : "blur(0px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />
      {/*
       * Phase B, Part 4: one shared panel, two positions instead of two
       * components — mobile is a bottom sheet (`inset-x-0 bottom-0`,
       * slides up via `translate-y`), `sm:` and up is the original
       * docked side panel (`sm:right-0`, slides in via `translate-x`).
       * Tailwind's translate utilities compose through shared
       * `--tw-translate-x/y` variables, so the base (mobile) and `sm:`
       * classes each contribute one axis without fighting each other —
       * verified against the compiled CSS rather than assumed.
       *
       * *Revised, Phase H (Part 6, Mobile Panels).* `max-h` lowered from
       * 85vh to 75vh to match the brief's explicit "max-height ≈75vh"
       * requirement — 85vh left too little of the room visible behind
       * an open sheet on short mobile viewports (the brief's own "room
       * visible behind" requirement), and gave less headroom above the
       * sheet for a visitor to tap the backdrop closed one-handed.
       */}
      <div
        role="dialog"
        aria-labelledby={headingId}
        inert={!isOpen}
        className={`panel-paper motion-transition absolute inset-x-0 top-auto bottom-0 flex max-h-[75vh] w-full flex-col sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-96 sm:max-w-full ${
          isOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
        }`}
        style={{
          transitionDuration: `${isOpen ? DURATION.panelOpen : DURATION.panelClose}ms`,
          transitionTimingFunction: EASING,
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 p-5 pb-4">
          <h2
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="text-sm font-semibold tracking-widest uppercase outline-none"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="panel-button flex min-h-11 shrink-0 items-center gap-1.5 px-3 py-1 text-xs transition-colors"
          >
            <Image
              src={ASSETS.keyEsc.src}
              alt=""
              width={ASSETS.keyEsc.width}
              height={ASSETS.keyEsc.height}
              unoptimized
              priority
              className="pixel-art h-3.5 w-auto select-none"
            />
            <span aria-hidden="true" className="text-sm leading-none">
              ✕
            </span>
          </button>
        </div>

        <hr className="panel-divider shrink-0" />

        <div className="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed">{children}</div>

        <hr className="panel-divider shrink-0" />

        <div className="shrink-0 p-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="panel-button min-h-11 w-full px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <span aria-hidden="true">✓</span> Done
          </button>
        </div>
      </div>
    </>
  );
}
