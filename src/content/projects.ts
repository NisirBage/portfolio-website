/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. Sourced directly from verified material, per PROJECT_CONTENT_REVIEW.md:
 * the Neonatal Simulator's content is drawn from its own repository's README
 * (real architecture, real design-pattern rationale, a real GitHub URL);
 * Industrial Safety Platform and Spam/Phishing Detector are resume-sourced
 * only, and their `architecture` fields are deliberately conservative rather
 * than padded to match — see MISSING_CONTENT.md for what would deepen them
 * honestly, rather than inventing it here.
 */

export interface ProjectDetail {
  id: string;
  title: string;
  /** Level 1 — headline read, already shipped in Milestone 5. */
  oneLiner: string;
  /** Level 2 — the architecture-level shape, in plain prose. */
  summary: string;
  /** Level 3 — real design decisions, not a restatement of the one-liner. */
  architecture: readonly string[];
  /** Level 4 — outbound link. Real repo where one exists; profile otherwise. */
  outboundLabel: string;
  outboundHref: string;
}

export const PROJECTS: readonly ProjectDetail[] = [
  {
    id: "industrial-safety-platform",
    title: "Industrial Safety Intelligence Platform",
    oneLiner:
      "AI-powered risk assessment, permit intelligence, and equipment health monitoring with explainable AI workflows.",
    summary:
      "A backend platform that treats industrial safety as four separable concerns — risk assessment, permit intelligence, worker exposure monitoring, and equipment health — rather than one monolithic system. Each capability is a modular REST service, which is what lets a dashboard consume all four without any one of them becoming a bottleneck for the others.",
    architecture: [
      "Modular backend architecture over FastAPI, with REST APIs separating each safety capability into its own service boundary.",
      "A deterministic simulation engine backs the risk-assessment path — deterministic specifically so a given input always reproduces the same assessment, which matters for an audit-relevant domain like industrial safety.",
      "PostgreSQL for persistence, with automated testing covering the backend for scalable deployment.",
      "Real-time dashboards in React surface the output of the above for safety monitoring and decision support.",
    ],
    outboundLabel: "More on GitHub",
    outboundHref: "https://github.com/NisirBage",
  },
  {
    id: "neonatal-simulator",
    title: "Neonatal Resuscitation Training Simulator",
    oneLiner:
      "A full-stack medical training simulator with finite-state-machine-driven clinical decision support.",
    summary:
      "A voice-first clinical training platform that walks a student through the NRP (Neonatal Resuscitation Program) protocol in real time, while an instructor watches the same session from a separate dashboard. The core problem it solves isn't the UI — it's guaranteeing that a safety-critical protocol can never be presented out of order, skipped, or repeated incorrectly, and that every session produces an audit-quality record automatically.",
    architecture: [
      "Finite State Machine: the entire clinical protocol lives in a JSON scenario definition, not in hardcoded logic — the FSM engine enforces valid transitions, so adding a new scenario never means touching application code.",
      "Event Sourcing: every state change is an immutable event. Replay, performance metrics, and all four export formats (PDF, raw CSV, clinical CSV, clinical XLSX) all derive from that single event log — there's exactly one source of truth, not four separate aggregations that could drift apart.",
      "Pub/Sub EventBus decouples the FSM from WebSocket broadcasting, so the broadcaster, the timer scheduler, and persistence each operate independently rather than being wired directly into the simulation logic.",
      "Repository pattern isolates database access — swapping SQLite for PostgreSQL is a one environment-variable change, not a rewrite.",
      "The WebSocket client reconnects with exponential backoff (capped at 30s) so a network blip doesn't require the student to restart; voice input is treated as an enhancement, not a dependency — the simulation is fully functional on manual YES/NO buttons if the microphone is unavailable.",
      "41 backend tests (20 covering clinical timeline export, 21 covering infrastructure/health checks), a 5-job CI pipeline, and a Docker-based deploy to Railway (backend) and Vercel (frontend).",
    ],
    outboundLabel: "View on GitHub",
    outboundHref: "https://github.com/NisirBage/neonatal-resuscitation-simulator",
  },
  {
    id: "spam-phishing-detector",
    title: "Spam & Phishing Detector",
    oneLiner:
      "Solo-built phishing detection analyzing URLs, emails, and text with probability-based threat scoring.",
    summary:
      "A solo-built, end-to-end phishing detection system: URLs, email content, and text messages go in, a probability-based threat score with a plain-language explanation comes out, served through a Flask web app rather than staying a notebook experiment.",
    architecture: [
      "Machine learning and NLP analyze URL, email, and text signals to produce a probability-based threat score, rather than a binary flag — a calibrated score is more useful for triage than a single cutoff.",
      "The Gemini API is part of the pipeline; its exact role (classification support vs. explanation generation) isn't detailed further here rather than guessed at — see MISSING_CONTENT.md.",
      "A Flask backend exposes the scoring pipeline through an API-driven architecture, with a web interface for real-time analysis rather than a batch-only script.",
    ],
    outboundLabel: "More on GitHub",
    outboundHref: "https://github.com/NisirBage",
  },
] as const;
