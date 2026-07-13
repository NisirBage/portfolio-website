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
