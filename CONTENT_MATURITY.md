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

---

## Knowledge and Research (Milestone 7)

The M0–M5 scale above is defined for *project* evidence (architecture, repository, benchmarks, reflection) and doesn't map cleanly onto the Bookshelf or Research Journal — forcing a project-shaped label onto a different kind of content would itself be a small dishonesty. `EVIDENCE_SURFACES_REVIEW.md`'s Confidence Level field does the same honesty job for these two surfaces instead:

- **Bookshelf (Knowledge) — Medium confidence.** Domain-level, cross-referenced to real project/research evidence elsewhere in the site, but not yet backed by specific named sources (books, papers, courses). Path to High: specific named influences, logged as a gap in `MISSING_CONTENT.md`, not fabricated here.
- **Research Journal (Research) — High confidence.** Primary, first-person, current-status content — a real active question, real progress, and real stated unknowns. This is the strongest evidence type this document's scale distinguishes (comparable in kind, though not in form, to what earns a project M3+), specifically because it doesn't hide what's still unresolved.

Same rule as the project scale above: neither rating moves up until new real evidence exists, not when the presentation is polished.

---

## Leadership (Milestone 8, restructured post-Milestone 8)

Leadership gets its own maturity scale, parallel in spirit to the project M0–M5 scale but shaped for achievement content rather than engineering artifacts:

| Level | Name | What it requires |
|---|---|---|
| **L0** | Resume Claim | A bare claim exists, no detail. |
| **L1** | Summary | Clear prose describing what happened, still not independently checkable. |
| **L2** | Evidence | Specific, named, checkable items — tournament names, dates, roles — not an aggregate adjective. |
| **L3** | Reflection | Genuine first-person retrospective on a specific round, committee, or role — what was hard, what would change. |
| **L4** | Artifacts | Certificates, tournament tabs, photographs, invitations, or similar real objects a visitor could see directly. |

### Current levels, per capability

- **Diplomacy — L2.** 36 named items (25 delegate results by tier, 11 individually-named chairing roles), sourced directly from an updated, authoritative CV — see `ENGINEERING_DECISIONS.md`'s "Leadership content evolution" entry for the full delta against the prior version. Not L3: no reflection on any specific committee exists yet. Not L4: no artifacts yet, pending the Google Drive certificate audit (`MISSING_CONTENT.md`).
- **Communication — L2.** 11 named items (debate record + adjudication assignments), same sourcing and same L3/L4 gaps as Diplomacy.
- **Leadership — L1.** Director General (BITMUN 2026) is real and named, but this capability's second item, Joint Secretary (UNESQUO Debating Society), is carried forward at the user's explicit direction despite not appearing in the new source CV — tracked as Pending Secondary Verification (`ASSUMPTIONS.md`). A capability containing an unverified item is rated by its weakest real claim, not its strongest, so this stays L1 rather than L2 until that's resolved.
- **Case Competitions — L2.** Unchanged from Milestone 8 — 2 named placements, not covered by the MUN-specific CV so unaffected by this revision.

**What this replaces.** The previous "Medium confidence, 24 conferences / 6 judged" framing is retired — the aggregate "6 judged, mentoring 200+ participants" claim was removed outright (not merely re-leveled) because the updated CV supports neither number; see the Removed Information entry in `ENGINEERING_DECISIONS.md`.

- **Whiteboard — Not built.** Still the one piece of direct "structures ambiguity into a recommendation" evidence missing from the entire site. Unchanged status; not re-litigated here.

Same rule as above: this rating moves up only when the real framework or per-item detail actually exists, not when the four cluster cards get a visual polish pass.

---

## Timeline, About Me, Future (Phase D)

Like Knowledge/Research and Leadership before them, these three don't map onto the project M0-M5 scale — they're personal narrative, not engineering or achievement evidence. Unlike every other content surface on this site, though, none of it is adapted, sourced, or reconciled from an external document (a resume, a README, a CV) — it comes directly from a genuine one-question-at-a-time interview conducted before any of it was written, with drafts shown back for approval before integration (`INTERVIEW_NOTES.md` is the raw record; `TIMELINE_CONTENT.md`/`ABOUT_ME_CONTENT.md`/`FUTURE_VISION.md` are the approved drafts this content mirrors verbatim). That makes it, by this project's own evidence vocabulary, the highest-confidence content type on the site — primary, first-person, and directly approved by its subject, a stronger evidentiary position than even the Research Journal's "real, first-person, current-status" content, since that content is written by the site (from real underlying facts) rather than by the person it describes.

**Honest limits, not omitted.** Two places in the interview surfaced a genuinely compressed or general answer rather than a specific anecdote (why AI became the throughline; a single defining leadership moment) — the copy stays at that same level of specificity in both cases rather than dramatizing an answer that wasn't given. This is a deliberate content-maturity choice: a true general answer outranks a fabricated specific one, the same principle already governing every other maturity rating in this document.

**What would move this further.** There isn't a "next level" in the way M3→M4 adds a benchmark — this content is already as direct as evidence gets. The one meaningful path forward is more interview depth on the two compressed threads above, if a future session revisits them, not a different kind of evidence being added.
