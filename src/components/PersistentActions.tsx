import { DOCUMENTS } from "@/lib/assets";

const CONTACT_EMAIL = "nisirbage7716@gmail.com";

/**
 * Resume and Contact — the two Critical-tier, zero-click affordances
 * from CONTENT_HIERARCHY.md. Rendered once, outside the camera stage
 * and outside any Layer, so they're reachable from every state exactly
 * as EXPERIENCE_ARCHITECTURE.md's Navigation Philosophy requires,
 * without depending on the Desk (or any) hotspot being opened first.
 *
 * Resume: a direct download, deliberately with zero transition ceremony
 * (INTERACTION_SPECIFICATION.md) and not preloaded (only fetched on
 * click) — matching Milestone 5's performance acceptance criterion.
 * Failure mode: the link points at a file verified present in `public/`
 * at build time; there's no client-side fetch/error-handling logic to
 * write for a single static asset link — prevented by construction and
 * confirmed in testing, not defended against at runtime.
 */
export function PersistentActions() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-xs">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="pointer-events-auto rounded border border-zinc-400 bg-white/80 px-2 py-1 dark:bg-zinc-900/80"
      >
        Contact
      </a>
      <a
        href={DOCUMENTS.resume.src}
        download
        className="pointer-events-auto rounded border border-zinc-400 bg-white/80 px-2 py-1 dark:bg-zinc-900/80"
      >
        {DOCUMENTS.resume.label}
      </a>
    </div>
  );
}
