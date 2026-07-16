"use client";

import { useState } from "react";
import type { ProjectDetail } from "@/content/projects";
import { DURATION, EASING } from "@/lib/motion";

/**
 * One project's Level 2-4 depth. Presentational plus its own tiny local
 * state (expanded, architecture shown) — this is expand-in-place within
 * the Desk Layer, not a new Layer-stack entry (ASSUMPTIONS.md A5's
 * decision, now built against for the first time).
 */

interface ProjectAccordionItemProps {
  project: ProjectDetail;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ProjectAccordionItem({ project, isExpanded, onToggle }: ProjectAccordionItemProps) {
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <li className="border-b border-zinc-200 pb-4 last:border-b-0 dark:border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <span>
          <span className="block font-medium text-zinc-900 dark:text-zinc-50">
            <span aria-hidden="true" className="section-marker">
              ▸
            </span>
            {project.title}
          </span>
          <span className="block text-sm text-zinc-600 dark:text-zinc-400">{project.oneLiner}</span>
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
            <p className="text-zinc-700 dark:text-zinc-300">{project.summary}</p>

            {!showArchitecture && (
              <button
                type="button"
                onClick={() => setShowArchitecture(true)}
                className="text-xs font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                See the architecture
              </button>
            )}

            {showArchitecture && (
              <div className="blueprint-unroll rounded border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
                <ul className="list-disc space-y-2 pl-4 text-zinc-700 dark:text-zinc-300">
                  {project.architecture.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a
                  href={project.outboundHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
                >
                  {project.outboundLabel} →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
