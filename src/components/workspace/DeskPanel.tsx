"use client";

import { useState } from "react";
import { PROJECTS } from "@/content/projects";
import { ProjectAccordionItem } from "./ProjectAccordionItem";

/**
 * Desk panel content — Content layer, per Layer Responsibilities: knows
 * about project data, nothing about how the panel that hosts it opens or
 * closes. Level 1 (headline) shipped in Milestone 5; Milestone 6 adds
 * Level 2 (summary), Level 3 (architecture, the Blueprint reveal), and
 * Level 4 (outbound link) as an accordion — one project expanded at a
 * time, matching LOW_FIDELITY_EXPLORATION.md's Option C.
 */

const BOOT_LINES = ["> workspace ready", "> 3 projects indexed", "> select one to read more"];

export function DeskPanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {BOOT_LINES.map((line, i) => (
          <p key={line} className="boot-line" style={{ animationDelay: `${i * 150}ms` }}>
            {line}
          </p>
        ))}
      </div>
      <ul className="space-y-4">
        {PROJECTS.map((project) => (
          <ProjectAccordionItem
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => setExpandedId((current) => (current === project.id ? null : project.id))}
          />
        ))}
      </ul>
    </div>
  );
}
