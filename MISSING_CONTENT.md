# Missing Content — The Studio

**Status:** Living document, the content-equivalent of `MISSING_ASSETS.md`. Same rule: never invent a specific technical claim to fill a gap. Log it, ask for it, ship honestly without it in the meantime.

---

### Industrial Safety Intelligence Platform — architecture detail

- **Content needed.** A real architecture sketch (services, data flow) and a one-line description of what the explainability method actually is (SHAP? attention-based? a rules engine?) and what "multi-agent reasoning" concretely means in this system.
- **Why it matters.** `PROJECT_CONTENT_REVIEW.md` flags "explainable AI workflows, multi-agent reasoning" as the highest misinterpretation risk in the entire content set — vague enough to read as inflated to the exact technical audience it's meant to impress.
- **Priority.** High — this is the project most likely to be scrutinized by an ML-specific reviewer, and currently has the thinnest ML-specific evidence.
- **Current substitute.** Level 3 content describes only the evidenced structure (modular REST services, automated testing, dashboards) without restating the AI language in different words.
- **User action required.** Yes — a short written explanation from Nisir, or a link to real documentation/repo, before this project's Level 3 depth goes further than what ships in Milestone 6.

### Industrial Safety Intelligence Platform — repository link

- **Content needed.** A real, specific GitHub repository URL.
- **Priority.** Medium.
- **Current substitute.** Links to the GitHub profile (`github.com/NisirBage`) instead of a fabricated repo URL.
- **User action required.** Yes, if/when the repo is public.

### Spam & Phishing Detector — Gemini API's actual role

- **Content needed.** What the Gemini API is actually used for in the pipeline (classification, explanation generation, both, something else).
- **Why it matters.** This is the one concrete, specific technical fact available for this project; leaving its role unstated wastes it, but inventing a role would violate Content Truthfulness.
- **Priority.** Medium.
- **Current substitute.** Level 3 names the three stated capabilities (URL/email/text analysis, probability-based scoring, Flask API interface) without asserting Gemini's specific role.
- **User action required.** Yes — one sentence would resolve this.

### Spam & Phishing Detector — metrics and repository link

- **Content needed.** Any accuracy/precision/recall figures, approximate dataset size or source, and a real repository URL.
- **Priority.** Low-Medium.
- **Current substitute.** GitHub profile link; no fabricated numbers anywhere in the content.
- **User action required.** Optional — nice-to-have for credibility, not blocking.

### Neonatal Resuscitation Simulator — screenshots and live demo URL

- **Content needed.** Product screenshots and a confirmed-reachable live demo URL.
- **Why it matters.** The project's own README already flags these as pending a public demo — not a gap introduced by the portfolio, just inherited honestly.
- **Priority.** Low — this project's Level 3 content is otherwise the richest and most evidenced of the three; this is a polish gap, not a credibility gap.
- **Current substitute.** None needed yet; Level 4 links to the real repository, which is sufficient evidence on its own.
- **User action required.** No, not for Version 1.

### Bookshelf (Knowledge) — specific named influences

- **Content needed.** The specific books, papers, or courses that actually shaped his technical thinking, not just the domains he works in.
- **Why it matters.** `EVIDENCE_SURFACES_REVIEW.md`'s Milestone 7 review rates this surface's confidence as Medium rather than High for exactly this reason: the current content is domain-level (explainable AI, deep learning on molecular data, systems design, applied NLP), each backed by a real project or research relationship elsewhere in the site, but it stops short of naming a single source — which is what would make "he learns continuously and intentionally" concrete rather than inferred.
- **Priority.** Low-Medium — the domain-level version is honest and evidenced, not misleading; this is an upgrade opportunity, not a credibility gap.
- **Current substitute.** A short list of study domains, each explicitly cross-referenced to the real project or research artifact that evidences it.
- **User action required.** Optional — a short list (3–5 items) of specific named influences, if and when Nisir wants to provide them.

### Leadership Wall — Whiteboard case-competition framework

- **Content needed.** The actual worked framework/recommendation from one real case competition (UNESQUO × 180DC or Consilium 2025) — what the analysis argued, not just that it placed.
- **Why it matters.** `INTERACTION_SPECIFICATION.md` names this as "the only piece of direct evidence for 'can structure ambiguity into a recommendation'" — every other Leadership claim is a placement or a role, not a demonstration of the reasoning itself. Without it, that specific claim rests on inference from the placement, not direct evidence.
- **Priority.** Medium — it's the one Consulting-Recruiter-specific artifact in the whole scene, but the four cluster headlines still carry real, honest evidence on their own without it.
- **Current substitute.** None. The Whiteboard sub-interaction isn't built for Milestone 8 rather than shipped with an invented framework standing in for it — moved to Should Have in `VERSION1_SCOPE.md`.
- **User action required.** Yes, if this is wanted for Version 1 — a short write-up (or even rough notes) of the actual framework used in one of the two case comps.

### Leadership Wall — per-item reflection copy

- **Content needed.** What each specific MUN conference, debate round, or judged event actually involved — the Level 3 depth `INTERACTION_SPECIFICATION.md`'s original fan-out spec calls "reflection copy... not just the certificate scan."
- **Why it matters.** Milestone 8 ships cluster-level facts only (real, quantified, resume-sourced); per-item narrative detail would deepen this the same way the Neonatal Simulator's README deepened its project content beyond a resume paraphrase.
- **Priority.** Low — cluster-level content is honest and sufficient for the grid fallback; this matters more once the fan-out (which opens individual frames) is actually built.
- **Current substitute.** Cluster-level headline + one-line detail only.
- **User action required.** Optional, and only relevant once/if the fan-out upgrade is scheduled.

### Rolodex (Contact) — Work Email and LinkedIn

- **Content needed.** A real work/professional email address distinct from the personal one, and a real LinkedIn profile URL.
- **Why it matters.** Phase F.1's brief specified the Contact popup should contain "Personal Email, Work Email, LinkedIn, GitHub, Resume shortcut" — five rows. `src/content/contact.ts` only defines `personalEmail` and `githubUrl`; Work Email and LinkedIn have no real value anywhere in the repository to draw from. Per Asset Truthfulness (content extension), neither was fabricated — `ContactPanel.tsx` renders three rows (Personal Email, GitHub, Resume shortcut), not five, rather than invent a placeholder address or profile URL that would read as real.
- **Priority.** Medium, raised from the original log — Phase G's brief independently asked for the same five-row layout ("Personal Email, Work Email, LinkedIn, GitHub, Resume download"), confirming this isn't a one-off oversight in a single brief but a recurring, reasonable expectation.
- **Current substitute.** None. The two rows are simply not rendered.
- **User action required.** Yes — a real work email (if one exists separately from the personal address) and a real LinkedIn profile URL would each add one row to `ContactPanel.tsx` via `CONTACT_INFO` in `src/content/contact.ts`.
