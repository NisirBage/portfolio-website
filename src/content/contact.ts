/**
 * Content — responsible only for information, per the Layer
 * Responsibilities rule. Every value here is real and independently
 * verified against the existing codebase (the email was already the
 * live `PersistentActions` contact address; the GitHub URL is the same
 * one already used as the outbound link for two of the three Desk
 * projects in `content/projects.ts`), not invented for this panel.
 *
 * *Honest gap, not filled in.* The brief's own row list includes a Work
 * Email and a LinkedIn URL — neither exists anywhere in this codebase or
 * was supplied with this request. Per Asset/Content Truthfulness, no
 * placeholder or guessed value is included below; both rows are simply
 * absent from `ContactPanel.tsx` rather than rendered with fabricated
 * content. Logged in `MISSING_CONTENT.md`.
 */
export const CONTACT_INFO = {
  personalEmail: "nisirworks@gmail.com",
  githubUrl: "https://github.com/NisirBage",
  githubLabel: "github.com/NisirBage",
} as const;
