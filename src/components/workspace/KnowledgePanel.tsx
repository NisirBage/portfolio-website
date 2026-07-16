"use client";

import { KNOWLEDGE_DOMAINS } from "@/content/knowledge";

/**
 * Bookshelf (Knowledge) panel content — Milestone 7. Deliberately small:
 * a domain-level list, each entry cross-referenced to where it's actually
 * evidenced elsewhere in the site, rather than standing alone. See
 * EVIDENCE_SURFACES_REVIEW.md for why this stops at domain-level.
 */
export function KnowledgePanel() {
  return (
    <div>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        What shapes his thinking, independent of what he&apos;s actively producing.
      </p>
      <ul className="space-y-3">
        {KNOWLEDGE_DOMAINS.map((item) => (
          <li key={item.id} className="border-b border-zinc-200 pb-3 last:border-0 dark:border-zinc-800">
            <p className="text-sm font-medium">
              <span aria-hidden="true" className="section-marker">
                ▸
              </span>
              {item.domain}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.evidence}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
