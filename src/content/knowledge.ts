/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. Milestone 7: domain-level, not source-level (see MISSING_CONTENT.md
 * — specific named influences aren't available yet, so this deliberately
 * stops at "what he studies," each cross-referenced to the real project or
 * research artifact that evidences it, rather than inventing named books
 * or papers to sound more finished than the evidence supports.
 */

export interface KnowledgeDomain {
  id: string;
  domain: string;
  evidence: string;
}

export const KNOWLEDGE_DOMAINS: readonly KnowledgeDomain[] = [
  {
    id: "explainable-ai",
    domain: "Applied machine learning & explainable AI",
    evidence: "Evidenced by the Industrial Safety Platform's explainability layer.",
  },
  {
    id: "molecular-dl",
    domain: "Deep learning applied to molecular & chemical data",
    evidence: "Evidenced by ongoing research under Prof. Supreeti Kamilya — see the Research Journal.",
  },
  {
    id: "systems-design",
    domain: "Software systems design — finite-state machines, event sourcing, pub/sub",
    evidence: "Evidenced by the Neonatal Resuscitation Simulator's architecture.",
  },
  {
    id: "applied-nlp",
    domain: "Applied natural language processing",
    evidence: "Evidenced by the Spam & Phishing Detector.",
  },
] as const;
