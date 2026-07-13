/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. Real, current research status, confirmed by the user as real
 * content (not a format placeholder) — Milestone 7. Structured to be
 * genuinely re-edited as the actual research moves, not a one-time
 * snapshot: every field below is a fact about where the work stands
 * today, not a finished-publication summary.
 */

export interface ResearchStatus {
  status: string;
  title: string;
  advisor: string;
  domain: string;
  currentQuestion: string;
  currentStage: string;
  latestProgress: readonly string[];
  nextMilestone: string;
  unknowns: readonly string[];
  pendingDecisions: readonly string[];
}

export const RESEARCH: ResearchStatus = {
  status: "Active",
  title: "Creatinine CV Biosensor Research",
  advisor: "Prof. Supreeti Kamilya",
  domain: "Electrochemical biosensing, deep learning on molecular data",
  currentQuestion: "How can uric acid interference be reduced while preserving creatinine sensitivity?",
  currentStage: "Experimental pipeline validation",
  latestProgress: [
    "Synthetic CV pipeline complete",
    "Feature extraction validated",
    "Statistical evaluation underway",
  ],
  nextMilestone: "Integration with real electrochemical datasets",
  unknowns: ["Generalization to experimental data"],
  pendingDecisions: ["Choice of explainability workflow"],
} as const;
