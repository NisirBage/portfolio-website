"use client";

import { usePortraitHint } from "@/hooks/usePortraitHint";

/**
 * Phase H.2, Part 4/9 — the portrait-only footer, replacing what used
 * to be dead whitespace below the room with two small, sequential
 * pieces of real content sharing one fixed-height slot (so nothing
 * shifts layout when one replaces the other):
 *
 * 1. **First visit only** — "Explore the room," `usePortraitHint`'s own
 *    one-time, `localStorage`-gated reveal (~2.4s, then gone for good).
 * 2. **Every other time** — a quiet, permanent status line ("Tap
 *    objects to explore"). Deliberately not wired to the Gramophone's
 *    own playing state for a dynamic "🎵 Study Theme Playing" — that
 *    would mean a second `useAmbientAudio()` subscription outside the
 *    Gramophone itself for a footer line that's easy to miss anyway;
 *    the static prompt says the one thing this footer actually needs
 *    to say.
 */
export function PortraitFooter() {
  const hintVisible = usePortraitHint();

  return (
    <footer className="flex w-full shrink-0 items-center justify-center px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <p
        className="motion-transition text-[10px] tracking-wide text-[var(--panel-ink)]"
        style={{ opacity: hintVisible ? 1 : 0.55, transitionDuration: "400ms" }}
      >
        {hintVisible ? "Explore the room" : "Tap objects to explore"}
      </p>
    </footer>
  );
}
