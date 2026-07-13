import { PROJECTS } from "@/content/projects";

/**
 * Desk panel content — Content layer, per Layer Responsibilities: this
 * component only knows about project data, nothing about how the panel
 * that hosts it opens or closes. Level 1 only (headline + one-liner),
 * matching CONTENT_HIERARCHY.md's Critical tier — expand-in-place depth
 * (Level 2-4, the accordion, Blueprint) is Milestone 6, intentionally
 * not built here yet rather than stubbed with empty expand buttons.
 */

const BOOT_LINES = ["> workspace ready", "> 3 projects indexed", "> select one to read more"];

export function DeskPanel() {
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
          <li key={project.id}>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{project.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{project.oneLiner}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
