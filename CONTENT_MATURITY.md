# Content Maturity — The Studio

**Status:** Living document. Content is versioned like code: maturity increases forward, it doesn't get rewritten to look more finished than the evidence supports. Companion to `PROJECT_CONTENT_REVIEW.md` (the audit) and `MISSING_CONTENT.md` (the gap tracker) — this document is the third leg: where each project actually stands right now, stated plainly.

---

## The Scale

| Level | Name | What it requires |
|---|---|---|
| **M0** | Resume entry | A bullet point exists. Nothing built. |
| **M1** | Summary | A clear-prose paragraph explaining what the system does, sourced from real facts (resume or better), not restating jargon in longer words. |
| **M2** | Architecture | Specific, independently-evidenced design decisions — not a rephrasing of the resume bullet with more nouns. Requires a source beyond the resume: a README, real documentation, or direct access to the system. |
| **M3** | Evidence | A real, verifiable outbound artifact — a working repository link, a live demo, something a reader can independently check. |
| **M4** | Benchmarks | Real numbers — performance, accuracy, scale, test coverage — not adjectives standing in for numbers. |
| **M5** | Reflection | Genuine first-person retrospective: what was hard, what was traded off, what would be done differently. Not a feature list dressed up as a lesson. |

A project's level is the **highest one it has fully earned** — partial progress toward the next level doesn't round up.

---

## Current Levels

### Industrial Safety Intelligence Platform — **M1**

Has a real Level 1 headline and a real Level 2 summary in clear prose. The Level 3 "architecture" content that shipped in Milestone 6 does **not** count as true M2: every point in it is still a rephrasing of the same resume bullets (modular REST services, deterministic simulation engine, automated testing), not an independently-sourced architectural decision. Marking this M1 rather than M2 is the honest call, even though it costs the project a level it might look close to — rounding up would be exactly the "complete speculation" this principle exists to prevent.

**Path to M2.** `MISSING_CONTENT.md`'s highest-priority item: a real architecture sketch and a concrete description of the explainability method, from Nisir directly or from real project documentation.

### Neonatal Resuscitation Training Simulator — **M3**

M1 (real summary) → M2 (real architecture, sourced directly from the project's own README — design-pattern table with stated rationale, not resume paraphrase) → M3 (a real, verified repository link: `github.com/NisirBage/neonatal-resuscitation-simulator`, confirmed reachable). Not yet M4: the README states a real test count (41) but no performance/accuracy benchmark exists in the shipped content. Not yet M5: the architecture content explains *what* decisions were made and *why* in general terms, but doesn't yet reflect on what was actually hard or what would change in hindsight — that's a genuinely different kind of content from what a README provides, and hasn't been written.

**Path to M4/M5.** Would need either real performance data (unlikely to matter much for a training simulator) or, more plausibly, a short first-person reflection — which only Nisir can write, not something inferable from a README.

### Spam & Phishing Detector — **M1**

Same honest assessment as the Safety Platform: real Level 1 and Level 2 content, but the Level 3 "architecture" section is resume-derived, not independently evidenced, so it doesn't count as M2. This project's content additionally flags its own known gap in-line (the Gemini API's actual role, deliberately left unstated rather than guessed).

**Path to M2.** `MISSING_CONTENT.md`: what the Gemini API is actually used for.

---

## What This Confirms

Evidence Parity predicted exactly this outcome before it was measured: the one project with real independent documentation reached M3; the two with resume-only evidence plateau at M1 until more real material exists. That's the system working as intended, not a gap to close by writing more confident-sounding prose.
