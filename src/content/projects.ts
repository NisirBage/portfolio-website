/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. This file is the first real "Content" artifact in the codebase;
 * everything before it was infrastructure. Sourced directly from the
 * resume (verified against the actual PDF, not paraphrased from memory).
 *
 * Level 1 only (headline + one-liner), matching CONTENT_HIERARCHY.md's
 * Critical tier. Level 2–4 (architecture, tradeoffs, source links) is
 * Milestone 6's job — this file intentionally doesn't have fields for
 * them yet, rather than adding empty placeholders now.
 */

export interface ProjectSummary {
  id: string;
  title: string;
  oneLiner: string;
}

export const PROJECTS: readonly ProjectSummary[] = [
  {
    id: "industrial-safety-platform",
    title: "Industrial Safety Intelligence Platform",
    oneLiner:
      "AI-powered risk assessment, permit intelligence, and equipment health monitoring with explainable AI workflows.",
  },
  {
    id: "neonatal-simulator",
    title: "Neonatal Resuscitation Training Simulator",
    oneLiner:
      "A full-stack medical training simulator with finite-state-machine-driven clinical decision support.",
  },
  {
    id: "spam-phishing-detector",
    title: "Spam & Phishing Detector",
    oneLiner:
      "Solo-built phishing detection analyzing URLs, emails, and text with probability-based threat scoring.",
  },
] as const;
