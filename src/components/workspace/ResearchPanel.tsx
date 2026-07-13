"use client";

import type { ReactNode } from "react";
import { RESEARCH } from "@/content/research";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

/**
 * Research Journal panel content — Milestone 7. Status is conveyed by
 * both a dot and a real text label, never color alone (Accessibility
 * Checklist requirement). Every field maps directly to
 * EVIDENCE_SURFACES_REVIEW.md's "Evidence Revealed" list — nothing here
 * is decorative.
 */
export function ResearchPanel() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {RESEARCH.status}
        </span>
      </div>
      <h3 className="mb-1 text-sm font-semibold">{RESEARCH.title}</h3>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        {RESEARCH.advisor} · {RESEARCH.domain}
      </p>

      <Field label="Current Question">{RESEARCH.currentQuestion}</Field>
      <Field label="Current Stage">{RESEARCH.currentStage}</Field>
      <Field label="Latest Progress">
        <ul className="list-inside list-disc space-y-1">
          {RESEARCH.latestProgress.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Field>
      <Field label="Next Milestone">{RESEARCH.nextMilestone}</Field>
      <Field label="Unknowns">
        <ul className="list-inside list-disc space-y-1">
          {RESEARCH.unknowns.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Field>
      <Field label="Pending Decisions">
        <ul className="list-inside list-disc space-y-1">
          {RESEARCH.pendingDecisions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Field>
    </div>
  );
}
