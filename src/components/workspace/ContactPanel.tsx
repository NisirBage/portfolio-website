"use client";

import { ASSETS } from "@/lib/assets";
import { CONTACT_INFO } from "@/content/contact";
import { ContactRow } from "./ContactRow";
import type { ToastVariant } from "@/hooks/useToast";

interface ContactPanelProps {
  showToast: (message: string, variant?: ToastVariant) => void;
  onOpenResume: () => void;
}

/**
 * Contact panel content — Phase F.1, Part 6. Opens from the Rolodex,
 * replacing `PersistentActions`' screen-fixed Contact link entirely.
 *
 * Three real, verified rows (Personal Email, GitHub, Resume shortcut).
 * Work Email and LinkedIn are named in the brief but don't exist
 * anywhere in this codebase or the supplied assets — flagged in
 * `MISSING_CONTENT.md`, not filled with a placeholder.
 */
export function ContactPanel({ showToast, onOpenResume }: ContactPanelProps) {
  const copy = (value: string, label: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => showToast(`${label} copied!`, "success"))
      .catch(() => showToast("Couldn't copy — try again", "error"));
  };

  return (
    <div>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">Reach out directly, or grab a link to share.</p>
      <div className="divide-y divide-[var(--panel-wood)]/30">
        <ContactRow
          icon={ASSETS.iconEmail}
          label="Personal Email"
          value={CONTACT_INFO.personalEmail}
          onCopy={() => copy(CONTACT_INFO.personalEmail, "Email")}
          onOpen={() => {
            window.location.href = `mailto:${CONTACT_INFO.personalEmail}`;
          }}
          openLabel="Email"
        />
        <ContactRow
          icon={ASSETS.iconGithub}
          label="GitHub"
          value={CONTACT_INFO.githubLabel}
          onCopy={() => copy(CONTACT_INFO.githubUrl, "GitHub link")}
          onOpen={() => {
            window.open(CONTACT_INFO.githubUrl, "_blank", "noreferrer");
            showToast("Link opened", "info");
          }}
        />
        <ContactRow
          icon={ASSETS.iconResumePdf}
          label="Resume"
          value="View, download, or print"
          onOpen={onOpenResume}
          openLabel="Open"
        />
      </div>
    </div>
  );
}
