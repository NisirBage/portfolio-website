"use client";

import { useState } from "react";
import type { LeadershipCapability } from "@/content/leadership";
import { DURATION, EASING } from "@/lib/motion";

/**
 * One capability's headline/summary plus its own expand-in-place evidence
 * list — same pattern as ProjectAccordionItem (local state, no new Layer),
 * reused here rather than invented fresh now that Leadership has enough
 * real content to warrant progressive disclosure too.
 *
 * *Revised, Phase C, Part 4* — both the capability's own expand and the
 * nested per-evidence-group expand now animate via `.accordion-collapse`
 * (see `ProjectAccordionItem.tsx` and `globals.css` for the mechanism),
 * instead of an instant show/hide.
 */

const MATURITY_LABEL: Record<LeadershipCapability["maturity"], string> = {
  L0: "L0 — Resume Claim",
  L1: "L1 — Summary",
  L2: "L2 — Evidence",
  L3: "L3 — Reflection",
  L4: "L4 — Artifacts",
};

interface LeadershipCapabilityItemProps {
  capability: LeadershipCapability;
  isExpanded: boolean;
  onToggle: () => void;
}

export function LeadershipCapabilityItem({
  capability,
  isExpanded,
  onToggle,
}: LeadershipCapabilityItemProps) {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  return (
    <li className="border-b border-zinc-200 pb-4 last:border-b-0 dark:border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <span>
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <span aria-hidden="true" className="section-marker">
              ▸
            </span>
            {capability.title}
          </span>
          <span className="block font-medium text-zinc-900 dark:text-zinc-50">
            {capability.headline}
          </span>
          <span className="block text-sm text-zinc-600 dark:text-zinc-400">
            {capability.summary}
          </span>
        </span>
        <span className="mt-1 shrink-0 text-xs text-zinc-400" aria-hidden="true">
          {isExpanded ? "−" : "+"}
        </span>
      </button>

      <div
        className="accordion-collapse"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transitionDuration: `${isExpanded ? DURATION.panelOpen : DURATION.panelClose}ms`,
          transitionTimingFunction: EASING,
        }}
      >
        <div className="overflow-hidden" inert={!isExpanded}>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-xs text-zinc-400">{MATURITY_LABEL[capability.maturity]}</p>
            {capability.evidence.map((group) => {
              const groupOpen = openGroupId === group.id;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => setOpenGroupId((current) => (current === group.id ? null : group.id))}
                    aria-expanded={groupOpen}
                    className="text-xs font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
                  >
                    {groupOpen ? "Hide" : "Show"} {group.label}
                  </button>
                  <div
                    className="accordion-collapse"
                    style={{
                      gridTemplateRows: groupOpen ? "1fr" : "0fr",
                      transitionDuration: `${groupOpen ? DURATION.panelOpen : DURATION.panelClose}ms`,
                      transitionTimingFunction: EASING,
                    }}
                  >
                    <div className="overflow-hidden" inert={!groupOpen}>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-zinc-700 dark:text-zinc-300">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </li>
  );
}
