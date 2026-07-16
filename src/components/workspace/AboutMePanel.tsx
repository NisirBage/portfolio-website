"use client";

import { ABOUT_ME_PARAGRAPHS } from "@/content/aboutMe";

/**
 * About Me panel content — Phase D. Opens from the Coffee Corner. Reuses
 * `LayerPanel`'s shared chrome entirely, per the brief's "only adjust
 * the internal presentation."
 *
 * Mood: cozy, personal, journal. Plain flowing paragraphs rather than
 * the Timeline's structured chapters or the Future's numbered
 * paragraphs below — reads like a page from a journal, not a form. The
 * first line gets a slightly larger opening treatment (a soft nod to a
 * hand-written journal's opening line), and there's no section
 * scaffolding at all beyond that — the prose carries it.
 */
export function AboutMePanel() {
  return (
    <div>
      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400 italic">
        Beyond the resume. In his own words, from a real conversation.
      </p>
      <div className="space-y-4 text-sm leading-relaxed">
        {ABOUT_ME_PARAGRAPHS.map((para, i) => (
          <p key={i} className={i === 0 ? "first-letter:text-2xl first-letter:font-semibold first-letter:text-amber-800 dark:first-letter:text-amber-400" : undefined}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
