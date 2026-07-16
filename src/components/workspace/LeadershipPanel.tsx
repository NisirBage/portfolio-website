"use client";

import { useState } from "react";
import { LEADERSHIP_CAPABILITIES } from "@/content/leadership";
import { LeadershipCapabilityItem } from "./LeadershipCapabilityItem";

/**
 * Leadership panel content — rebuilt post-Milestone 8 from an updated,
 * authoritative source. Organized around transferable capabilities
 * (Communication, Diplomacy, Leadership, Case Competitions), not activity
 * types, per user-directed content revision. Accordion pattern reused
 * from DeskPanel/ProjectAccordionItem — one capability expanded at a
 * time, evidence groups nested one level deeper within it.
 */
export function LeadershipPanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Communication, diplomacy, and structured thinking, evidenced rather than claimed.
      </p>
      <ul className="space-y-4">
        {LEADERSHIP_CAPABILITIES.map((capability) => (
          <LeadershipCapabilityItem
            key={capability.id}
            capability={capability}
            isExpanded={expandedId === capability.id}
            onToggle={() =>
              setExpandedId((current) => (current === capability.id ? null : capability.id))
            }
          />
        ))}
      </ul>
    </div>
  );
}
