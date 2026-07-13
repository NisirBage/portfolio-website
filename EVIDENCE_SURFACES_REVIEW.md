# Evidence Surfaces Review — Knowledge & Research (Milestone 7)

**Status:** Content review, written before implementation, per the Milestone 6 precedent of reviewing content with the same rigor as code. Applies the Evidence Surfaces template: for each object, the test is "what new evidence becomes visible to the visitor after interacting with this object? If the answer is 'nothing new,' the interaction should be simplified or removed." Both objects below pass that test — see each entry's **Evidence Revealed** field.

---

## Bookshelf (Knowledge)

**Capability Demonstrated.** Continuous, intentional learning across a coherent set of technical domains — not a generic "lifelong learner" claim, but a specific, cross-referenced list.

**Evidence Revealed.** The named domains he actively studies, each one backed by a real artifact that already exists elsewhere in the portfolio rather than asserted in isolation:
- Applied machine learning & explainable AI — evidenced by the Industrial Safety Platform's explainability layer (Desk)
- Deep learning applied to molecular/chemical data — evidenced by the active research relationship under Prof. Supreeti Kamilya (Research Journal)
- Software systems design (finite-state machines, event sourcing, pub-sub, repository pattern) — evidenced by the Neonatal Resuscitation Simulator's real design-pattern table (Desk)
- Applied NLP — evidenced by the Spam & Phishing Detector (Desk)

A visitor who opens the Bookshelf learns *that these are domains of sustained study, not one-off project requirements* — the new information is the throughline connecting projects that otherwise look unrelated, not the domain names themselves (which a visitor could already infer from the Desk).

**Confidence Level.** Medium. Every domain listed is real and independently evidenced elsewhere in the site — this is not fabricated. But it stops at domain-level, not source-level: it doesn't yet name the specific books, papers, or courses that actually shaped his thinking, which is what would make "he learns continuously and intentionally" maximally concrete rather than a reasonable inference from his project list.

**Evidence Type.** Cross-referenced / secondary — each claim points back to primary evidence that lives at the Desk or the Research Journal, rather than standing on its own primary source.

**Missing Evidence.** Specific named influences (books, papers, courses) that shaped his technical thinking. Logged in `MISSING_CONTENT.md` rather than fabricated — same pattern as the Safety Platform's explainability method and the Spam/Phishing Gemini API role.

**Suggested Future Evidence.** A short list (3–5) of specific named sources, once provided directly — would upgrade this surface from domain-level to source-level evidence.

**Section Memory Test.** Target sentence: *"He learns continuously and intentionally."* The domain list is built to produce exactly this takeaway and no more — it deliberately doesn't try to also carry "he has sophisticated taste in research literature," which would require the missing source-level evidence above.

---

## Research Journal (Research)

**Capability Demonstrated.** The ability to formulate a real, narrow research question and run a live investigation with visible methodological rigor — including stating what's still unknown, which is a different and rarer skill than presenting only finished results.

**Evidence Revealed.** A visitor sees, for the first time anywhere in the portfolio, what active research actually looks like in progress:
- **Status.** ● Active
- **Current Question.** How can uric acid interference be reduced while preserving creatinine sensitivity?
- **Current Stage.** Experimental pipeline validation
- **Latest Progress.** Synthetic CV pipeline complete; feature extraction validated; statistical evaluation underway
- **Next Milestone.** Integration with real electrochemical datasets
- **Unknowns.** Generalization to experimental data
- **Pending Decisions.** Choice of explainability workflow

This is qualitatively different evidence from a project summary: it's a snapshot of reasoning-in-progress, including the parts that aren't resolved yet. The "nothing new" test clearly fails to trip here — every field reveals something a resume bullet or a Level 2 summary couldn't carry.

**Confidence Level.** High. This is primary-source, first-person research status, not a secondary rephrasing — the same standard that earned the Neonatal Simulator its M3 rating applies here at the content level (real, checkable specifics, not adjectives standing in for numbers).

**Evidence Type.** Primary — direct self-reported current status of real, ongoing work.

**Missing Evidence.** No external validation yet: no advisor co-sign, no dataset citation, no published or pre-printed result. This is honestly a Status/Stage claim, not a Benchmarks (M4) or Reflection (M5) claim — consistent with `CONTENT_MATURITY.md`'s scale, and not overstated here.

**Suggested Future Evidence.** A link to the lab or advisor's page; a real dataset citation once the "integration with real electrochemical datasets" milestone lands; eventually a preprint or publication link. The content format (Status / Question / Stage / Progress / Next Milestone / Unknowns / Pending Decisions) is built to be genuinely re-edited as these become real, not a one-time snapshot frozen at ship time.

**Section Memory Test.** Target sentence: *"He understands how to formulate and investigate research questions."* The Unknowns and Pending Decisions fields specifically are what earn this sentence — a visitor who only saw the Current Question and Progress fields would walk away with a weaker, more generic "he does research" takeaway instead.

---

## Cross-Surface Note

Knowledge and Research now pass the Evidence Surfaces test independently, which is the actual proof the split was the right call: before Milestone 7, one object was being asked to carry both "where his thinking comes from" and "how he contributes new thinking" at once, and the Research side's evidence (specific, primary, current-status) was categorically stronger than the Knowledge side's (domain-level, secondary) — collapsing them into one panel would have forced the weaker evidence to set the ceiling for both. Separating them lets each surface be honestly rated on its own terms, including the Confidence Level gap between them.
