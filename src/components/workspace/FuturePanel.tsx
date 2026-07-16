"use client";

import { FUTURE_PARAGRAPHS } from "@/content/future";

/**
 * Future panel content — Phase D. Opens from the Window. Reuses
 * `LayerPanel`'s shared chrome entirely, per the brief's "only adjust
 * the internal presentation."
 *
 * Mood: bright, hopeful, forward-looking — kept optimistic without
 * turning corporate, per explicit instruction. The closing paragraph
 * (the "impactful life" line) gets a distinct, lightly-highlighted
 * callout treatment, reading as the one thing to walk away with, while
 * the paragraphs leading up to it stay as plain flowing text like the
 * other two panels — the emphasis is earned by the content, not
 * decorated onto every line.
 */
export function FuturePanel() {
  const [lead, ...rest] = FUTURE_PARAGRAPHS;
  const closing = rest[rest.length - 1];
  const middle = rest.slice(0, -1);

  return (
    <div>
      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
        What&apos;s next. Vision, not a roadmap.
      </p>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>{lead}</p>
        {middle.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-5 border-l-2 border-amber-500/60 bg-amber-500/10 py-3 pr-2 pl-4 text-sm leading-relaxed dark:bg-amber-400/10">
        {closing}
      </div>
    </div>
  );
}
