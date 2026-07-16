# Zone Success Matrix — The Studio

**Status:** Draft for review. Five zones (the Desk absorbs what would otherwise be a separate Engineering zone, per [CONTENT_HIERARCHY.md](CONTENT_HIERARCHY.md)'s removal of a standalone Analytics/Data Lab). Each zone answers one specific hiring decision — not "what information belongs here," per your instruction.

---

## The Desk (Hub + Engineering)

- **Primary goal.** Answer "can this person build software?" as fast as possible.
- **Secondary goal.** Get the visitor to Resume or Contact with zero friction, from anywhere in the session.
- **Target recruiter.** Software Engineer Recruiter, ML Recruiter, Hackathon Judge.
- **Expected time spent.** 20 seconds (Level 1–2 skim) to 3 minutes (Level 3–4 on one project).
- **Critical interaction.** Opening one project to the Blueprint/architecture depth.
- **Desired takeaway.** "I would trust them to own a production feature."
- **Potential improvements.** Once V4's live GitHub integration ships, recent commit activity gives this zone a "still building, right now" signal that a static project list can't.
- **Risk of information overload.** Low at Level 1–2, moderate at Level 3–4 if all three projects are opened to full depth in one sitting — mitigated by each project panel being independently collapsible, so depth on one project never forces depth on the others.

---

## Bookshelf (Knowledge)

*Revised, Milestone 7 — split from the former "Research (Bookshelf)" zone; see `NARRATIVE_SYSTEM.md`.*

- **Primary goal.** Answer "does this person learn continuously and intentionally, beyond what a course requires?"
- **Secondary goal.** Signal that the technical work (Desk) rests on real intellectual foundations, not just applied skill.
- **Target recruiter.** Professor, Research Scientist, ML Recruiter.
- **Expected time spent.** 20–30 seconds (Level 1–2) — this zone is meant to be quickly legible, not a deep read.
- **Critical interaction.** Opening the book at Level 2 and recognizing a real, specific influence rather than a generic "lifelong learner" claim.
- **Desired takeaway.** "He learns continuously and intentionally." (Section Memory Test.)
- **Potential improvements.** A reading-list or reflections layer, if that content becomes real — logged in `MISSING_CONTENT.md`, not built speculatively.
- **Risk of information overload.** Low — deliberately small, single-panel content.

## Research Journal (Research)

*Promoted from a Bookshelf sub-interaction to its own peer zone, Milestone 7.*

- **Primary goal.** Answer "can this person conduct real research, independently?"
- **Secondary goal.** Signal that the technical work (Desk) isn't purely applied — there's a research instinct underneath it, and it's active right now, not archived.
- **Target recruiter.** Professor, Research Scientist.
- **Expected time spent.** 30 seconds (Level 1–2) to 2 minutes for a genuinely interested Research Scientist reading the full current-status detail.
- **Critical interaction.** Reading the current research status (question, stage, progress, unknowns) — this alone should be enough to justify a real conversation for the right persona.
- **Desired takeaway.** "He understands how to formulate and investigate research questions." (Section Memory Test.)
- **Potential improvements.** Published results or external validation, once real — logged in `MISSING_CONTENT.md`, not fabricated now.
- **Risk of information overload.** Low — this zone has the least content of any evidence surface, and Content Hierarchy keeps it at Optional tier so it never competes with the Desk's Level 2 summary for attention.

---

## Leadership Wall

- **Primary goal.** Answer "can this person lead, communicate, and structure ambiguity?"
- **Secondary goal.** Deliver the site's central surprise — the same person who builds explainable-AI systems also runs a 400-person conference.
- **Target recruiter.** Consulting Recruiter, any hiring manager weighing leadership/culture fit, grad admissions committees.
- **Expected time spent.** 1–4 minutes, the widest range of any zone — this is where persona divergence is largest (an SWE recruiter may glance; a Consulting recruiter may spend the most time on the whole site here).
- **Critical interaction.** Opening the Whiteboard sub-object (the one worked case-competition example) — it's the only piece of evidence in the entire scene built specifically for the Consulting Recruiter persona.
- **Desired takeaway.** "Can structure ambiguity into a recommendation, and can lead people through it."
- **Potential improvements.** Once the two large certificate PDFs are catalogued (pending, per the Strategy doc), this zone should be re-audited for any single achievement strong enough to warrant Important-tier promotion.
- **Risk of information overload.** **Highest of any zone.** 25 MUN conferences as delegate, 11 as chair, 6 debate tournaments, 5 judging assignments, and 2 case-comp placements is a lot of raw material — *revised, post-Milestone 8: even more raw material than originally estimated, now that the real count is known precisely rather than approximated.* Mitigated by clustering around transferable capabilities (Diplomacy / Communication / Leadership / Case Competitions, revised from the original activity-type clusters) rather than a flat list, by aggregating the 25 delegate results into a tiered summary rather than 25 line items, and by keeping the full certificate gallery at Optional tier — each capability's quantified headline carries the Important-tier signal on its own, so a visitor never has to expand anything to get it.

---

## Coffee Corner

- **Primary goal.** Give the Collaborator/Peer persona a place to land that isn't a pitch.
- **Secondary goal.** Humanize the rest of the experience — proof that the person behind the systems and the leadership roles is someone approachable.
- **Target recruiter.** None directly — this zone is explicitly not built to move a hiring decision (see Interaction Specification's Coffee Mug entry).
- **Expected time spent.** ~30 seconds; genuinely optional.
- **Critical interaction.** None load-bearing — by design, nothing here is Critical or Important tier.
- **Desired takeaway.** "Seems like a genuinely good person to work with."
- **Potential improvements.** Blog posts or talks (V6 roadmap) would give this zone more substance without changing its low-stakes tone.
- **Risk of information overload.** None — this is the one zone where the risk runs the other way (too little content to feel worth a visit at all). Acceptable, since its job is to be *available*, not to be visited by everyone.

---

## Window / Observatory

- **Primary goal.** Close the experience on direction, not retrospective — answer "where is this person headed?"
- **Secondary goal.** Convert accumulated trust (from the other four zones) into an action: resume, GitHub, or contact.
- **Target recruiter.** Professor, Research Scientist, Startup Founder — anyone evaluating trajectory over track record; secondarily, everyone, as the closing beat.
- **Expected time spent.** 1–2 minutes, always at the end of a session, per the storyboard's deliberate pacing.
- **Critical interaction.** The Contact/GitHub click-through from this panel — the single most important conversion metric on the entire site (Strategy doc Section 12).
- **Desired takeaway.** "This is someone I want to interview" — the final emotional checkpoint from the Narrative System.
- **Potential improvements.** V7's visitor personalization could tailor this panel's "what's next" content to the persona the visitor has revealed through their session (e.g., research-forward language for a visitor who spent most time on the Bookshelf).
- **Risk of information overload.** Low — this panel is deliberately short. Its power comes from timing (it's the last thing seen) and restraint, not from volume of content.
