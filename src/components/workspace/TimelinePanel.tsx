"use client";

import { TIMELINE_CHAPTERS } from "@/content/timeline";

/**
 * Timeline panel content — Phase D. Opens from the Clock. Reuses
 * `LayerPanel`'s shared chrome entirely (per the brief's own "do not
 * redesign the panel system, only adjust the internal presentation") —
 * everything below is content-level styling specific to this panel.
 *
 * Mood: warm, reflective, memory. A thin connecting line runs down the
 * left edge of the chapter list, each chapter's marker sitting on it
 * like a point in time — a literal small timeline, not just a section
 * list, matching what a Clock hotspot should feel like it opens into.
 */
export function TimelinePanel() {
  return (
    <div>
      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
        Not a resume. What moments actually changed the direction of things.
      </p>
      <ol className="relative ml-1 border-l-2 border-[var(--panel-wood)] pl-5">
        {TIMELINE_CHAPTERS.map((chapter) => (
          <li key={chapter.id} className="relative mb-7 last:mb-0">
            <span
              aria-hidden="true"
              className="absolute top-1 -left-[26px] h-2.5 w-2.5 rounded-full border-2 border-[var(--panel-wood)] bg-[var(--panel-paper)]"
            />
            <h3 className="mb-1.5 text-xs font-semibold tracking-widest text-amber-800 uppercase dark:text-amber-400">
              {chapter.title}
            </h3>
            {chapter.body.split("\n\n").map((para, i) => (
              <p key={i} className="mb-2 text-sm leading-relaxed last:mb-0">
                {para}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
