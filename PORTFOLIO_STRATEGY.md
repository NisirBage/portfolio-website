# Portfolio Strategy — Nisir Sanang Bage

**Status:** Draft for review. No code has been written. This document and [Phase 1 — Creative Direction](https://claude.ai/code/artifact/0e662cc4-33f2-49d6-b9e3-cb14a1787068) share the same working structure ("The Study," five zones: Engineering Desk, Research Library, Leadership & Awards Corner, Coffee Corner, Future Goals mezzanine) — that layout is still open per Phase 1's Question 3, and this document doesn't re-decide it, it builds the content strategy on top of it.

The portfolio is treated as a product with one job: **make a recruiter, professor, or founder more confident in hiring/collaborating with Nisir than they were 90 seconds ago.** Everything below is in service of that, not of decoration.

---

## 1. Product Vision

**Why this exists.** A resume is a claims list — it says "led," "built," "won" and asks the reader to trust it. Most portfolios just restate the same claims with nicer fonts. This one exists to do the thing a resume structurally can't: let the visitor *watch the work happen* — open the actual architecture of a project, read the actual reasoning behind a debate win, see the actual certificate instead of a bullet that says "24 MUN conferences." Proof replaces assertion.

**What differentiates it from traditional portfolios.** Two things, both concrete, neither cosmetic:
1. It is organized around *how Nisir actually spends his time* (a desk, a library, a wall of frames, a kitchen counter) rather than around resume section headers (Education / Experience / Skills). The structure itself is evidence of systems thinking — someone designed a coherent world instead of copy-pasting a template.
2. Every claim resolves to an artifact one click away: a project claim resolves to an architecture writeup, a leadership claim resolves to an actual certificate image, a research claim resolves to what he's actually working on this month under Prof. Kamilya.

**Why 5–10 minutes instead of a 30-second skim.** Because the first 90 seconds does the same job a resume does (fast, scannable, credible) — the additional minutes are opt-in depth for the subset of visitors who are actually deciding whether to interview, fund, or collaborate. The site never *requires* 10 minutes; it *rewards* it. That's the difference between an interactive resume and an interactive time-sink.

**What visitors should remember after leaving.** Not "he used pixel art." Not any single project. The residue should be a sentence like: *"That guy runs a 400-person MUN conference, does explainable-AI safety systems work, and still ships side projects — and he clearly thinks carefully about how things are put together, including his own website."* Range + rigor + follow-through, in one impression.

---

## 2. Unique Value Proposition

A typical AI/ML undergraduate portfolio shows: coursework, 2–3 ML projects with a Jupyter-notebook screenshot, a GitHub link, maybe a Kaggle badge. That's the baseline this portfolio is competing against — and against which Nisir's actual profile is unusual in a specific, provable way:

- **Systems builder, not just model-fitter.** [Industrial Safety Intelligence Platform](.) and the [Neonatal Resuscitation Simulator](.) aren't notebooks — they're full-stack systems with REST APIs, deterministic simulation engines, FSM-driven state, explainable-AI workflows, and automated testing. That's engineering discipline layered on top of ML knowledge, which is exactly the gap most undergrad portfolios expose.
- **Live research, not just coursework.** Summer Research Trainee under Prof. Supreeti Kamilya, applying deep learning to molecular/chemical data — an active research relationship, not a listed course.
- **Elite-tier competitive communication.** Open Finals wins at NUSRL Avirbhaav APD 2024 and Genesis BPD 2024, 24 Model UN conferences attended, 6 judged (200+ participants mentored), Director General of an entire MUN conference (BITMUN 2026). This is not "was on the debate team" — it's tournament-level performance *and* the organizational responsibility of running the tournament.
- **Applied strategic thinking outside CS.** Podium finishes in case-competition environments (2nd, UNESQUO × 180DC; 3rd, Consilium 2025) — evidence of structured problem-solving under business constraints, not just technical constraints.

**The combination is the story, not any one piece of it.** Separately, each achievement is common among strong undergraduates. Together, they describe someone who can operate competently in ambiguous, high-stakes situations whether the ambiguity is a system architecture decision, a committee floor at 2am, or a live case-comp brief — which is precisely the trait senior technical and consulting interviews are designed to screen for, and precisely what a bullet-point resume cannot demonstrate.

---

## 3. Target Personas

### Software Engineer Recruiter
- **Goals:** Filter for real engineering ability fast; avoid false positives from ML-heavy, engineering-light candidates.
- **Questions:** Can they design a system, not just call an API? Do they test? Do they understand tradeoffs?
- **Pain points:** Portfolios that show *what* was built but never *why* a decision was made.
- **Values:** Architecture diagrams, API design, testing strategy, explicit tradeoffs.
- **Ideal path:** Engineering Desk → Industrial Safety Platform → architecture + tradeoffs panel.
- **Desired impression:** "This person can own a backend service in production."

### Machine Learning Recruiter
- **Goals:** Distinguish "used sklearn in a notebook" from "understands the ML lifecycle."
- **Questions:** Do they understand data quality, evaluation, and deployment — not just model choice?
- **Pain points:** Portfolios that list frameworks (TensorFlow, PyTorch) with no evidence of judgment.
- **Values:** Explainable-AI workflow in the Safety Platform; active molecular-data research.
- **Ideal path:** Engineering Desk (Safety Platform's explainable-AI layer) → Research Library (Kamilya lab work).
- **Desired impression:** "This person thinks about models as part of a system, not in isolation."

### Data Analytics Recruiter
- **Goals:** Verify comfort with real pipelines and dashboards, not just charts.
- **Questions:** Can they turn raw signals into a decision-support view?
- **Pain points:** Static screenshots with no sense of the underlying pipeline.
- **Values:** Real-time dashboard visualisations in the Safety Platform; risk/exposure monitoring design.
- **Ideal path:** Engineering Desk → Safety Platform dashboard walkthrough.
- **Desired impression:** "Data becomes a decision here, not just a chart."

### Consulting Recruiter
- **Goals:** Assess structured problem-solving under ambiguity and time pressure.
- **Questions:** Can they frame a problem, build a defensible recommendation, and present it?
- **Pain points:** Case-comp results with no visibility into the actual framework used.
- **Values:** UNESQUO × 180DC (2nd), Consilium 2025 (3rd) — framed as problem → constraints → framework → recommendation, not just a placement.
- **Ideal path:** Leadership & Awards Corner → case-comp cluster → one worked example.
- **Desired impression:** "This person can structure ambiguity into a decision."

### Professor / Grad School Faculty
- **Goals:** Judge research maturity and independent curiosity.
- **Questions:** Do they read papers unprompted? Can they articulate a research direction?
- **Pain points:** Vague "interested in AI" statements with nothing to back them.
- **Values:** Specific current research (deep learning for computational chemistry), reading list, stated open questions.
- **Ideal path:** Research Library → current research → Future Goals mezzanine (what's next).
- **Desired impression:** "This student already thinks like an early-stage researcher."

### Research Scientist / Lab Collaborator
- **Goals:** Gauge technical depth fast, decide if worth a real conversation.
- **Questions:** Is the research description specific enough to be real, or generic?
- **Pain points:** Buzzword research blurbs.
- **Values:** Named advisor, named domain (molecular/chemical data), named method direction (neural architectures for predictive modelling).
- **Ideal path:** Research Library, straight to the current-research detail panel.
- **Desired impression:** "Worth a real conversation about the work."

### Startup Founder
- **Goals:** Assess speed, ownership, and range — can this person operate without a large team around them?
- **Questions:** Have they shipped something end-to-end, alone?
- **Pain points:** Group-project-only portfolios with unclear individual contribution.
- **Values:** Solo-built, end-to-end projects (Spam & Phishing Detector: Flask + ML + NLP + Gemini API, shipped as a working web app).
- **Ideal path:** Engineering Desk → Spam & Phishing Detector → "built alone, end to end" framing.
- **Desired impression:** "Could hand this person real ambiguity and they'd ship something."

### Hackathon Judge
- **Goals:** Quickly separate polish from substance.
- **Questions:** Does the demo work? Is there a real technical decision underneath it?
- **Pain points:** Slideware with no working system behind it.
- **Values:** Working projects with real architecture, not concept slides.
- **Ideal path:** Engineering Desk, fast — judges don't linger.
- **Desired impression:** "Ships real things, not just pitches."

### Collaborator / Peer
- **Goals:** Decide whether Nisir is someone worth teaming up with.
- **Questions:** What's he like to work with under pressure? Is he reliable?
- **Pain points:** Portfolios that feel like corporate marketing, not a person.
- **Values:** The Coffee Corner's informality, the "currently exploring" personality layer, the honesty of the Future Goals section.
- **Ideal path:** Coffee Corner → About → contact.
- **Desired impression:** "Seems like a genuinely good person to build something with."

---

## 4. Recruiter Questions → Where They're Answered

| Question | Answered where | How |
|---|---|---|
| Can this person code? | Engineering Desk | Three real projects, each with architecture + code decisions, not just a GitHub link |
| Can they build large systems? | Engineering Desk | Industrial Safety Platform: modular backend, REST APIs, simulation engine, DB, automated testing |
| Can they communicate? | Leadership & Awards Corner | Debate Open Finals wins, judged conferences, reflection copy in each cluster |
| Can they learn independently? | Research Library | Active research under a named advisor, in a domain outside typical CS coursework (computational chemistry) |
| Can they analyze data? | Engineering Desk | Safety Platform's risk/exposure dashboards and explainable-AI layer |
| Can they work in teams? | Leadership & Awards Corner | 24 MUN conferences as delegate — a role that only works through negotiation with others |
| Can they lead? | Leadership & Awards Corner | Director General, BITMUN 2026; Joint Secretary, UNESQUO Debating Society; 6 conferences judged/mentored |
| Can they conduct research? | Research Library | Named advisor, named domain, ongoing — not a closed-out course project |
| Can they explain technical decisions? | Engineering Desk detail panels | "Design Decisions" and "Lessons Learned" fields on every project, not just a feature list |
| Can they own ambiguity? | Engineering Desk + Leadership Corner | Solo-built Spam/Phishing Detector; running an entire conference as DG |

---

## 5. Evidence Matrix

Never claim a skill without a location the visitor can click into.

| Skill | Evidence | Location | Interaction | Desired takeaway |
|---|---|---|---|---|
| System design | Industrial Safety Intelligence Platform | Engineering Desk | Open project → architecture diagram + tradeoffs | "Can design scalable systems" |
| Applied ML / explainability | Explainable-AI risk workflows in the Safety Platform | Engineering Desk | Open project → ML section (data → model → evaluation → deployment) | "Treats models as part of a system, not a demo" |
| Full-stack execution | Neonatal Resuscitation Simulator | Engineering Desk | Open project → FSM + REST sync diagram | "Ships working, stateful software" |
| Independent shipping | Spam & Phishing Detector (solo, Flask + NLP + Gemini API) | Engineering Desk | Open project → "built solo" badge | "Can own a project start to finish" |
| Research aptitude | Deep learning for chemical/molecular data, under Prof. Kamilya | Research Library | Open research panel | "Already operates like an early researcher" |
| Communication under pressure | Open Finals Winner, NUSRL Avirbhaav APD 2024 | Leadership & Awards Corner | Certificate + one-line reflection on the round | "Can think and speak clearly live" |
| Leadership / ownership | Director General, BITMUN 2026 | Leadership & Awards Corner | Positions cluster | "Can run something end to end, not just attend it" |
| Mentoring / teaching | Judged 6 MUN conferences, 200+ participants mentored | Leadership & Awards Corner | Judging cluster | "Invests in other people's growth" |
| Structured business thinking | 2nd, UNESQUO × 180DC; 3rd, Consilium 2025 | Leadership & Awards Corner | Case-comp cluster, worked example | "Can structure ambiguity into a recommendation" |
| Curiosity / range | Content writing (tech/politics/current affairs), Tribal Design Forum membership | Coffee Corner | About panel | "Interests extend past the CS curriculum" |
| Forward direction | Stated research interests, what's next | Future Goals mezzanine | Window panel | "Knows where he's headed, not just where he's been" |

---

## 6. Information Priority

| Tier | Content |
|---|---|
| **Critical** | Name + one-line identity, 3 core projects (with architecture detail), current research, resume PDF, contact method, GitHub |
| **Important** | Leadership positions (DG/Joint Secretary/Deputy EIC), debate Open Finals wins, case-comp placements, LeetCode |
| **Optional** | Full MUN certificate gallery (24 + 6 judged), reading list, "currently exploring," blog/talks (future) |
| **Decorative** | Ambient room details (plants, mugs, rugs), cursor styling, hover micro-copy |

Rule: if a piece of content doesn't move a visitor from *Important* down to something they can act on (interview, email, follow), it's Optional at best. Nothing in Decorative competes for attention with Critical — decorative elements set mood, they never gate information.

---

## 7. The 90-Second Experience

A recruiter who gives this 90 seconds and nothing more should still leave with everything a resume would have given them, faster:

- **Definitely see:** Name + identity line, one flagship project (Industrial Safety Platform) at a glance, one leadership signal (Director General / debate win), a visible path to resume and contact.
- **Definitely remember:** "Builds real systems" + "leads at scale" — the two-word version of the whole site.
- **Essential interactions:** One click to open a project card into its architecture summary; one click to reach resume/contact. Nothing should require more than two clicks to reach a hiring-relevant fact.

---

## 8. The 5-Minute Experience

A visitor who stays five minutes should walk away with:
- Real understanding of *how* the Safety Platform and Neonatal Simulator are architected, not just that they exist.
- A sense of the leadership range (DG of a conference vs. delegate vs. judge — three different postures, all demonstrated).
- Visibility into the active research thread and why it matters (computational chemistry via deep learning is a specific, checkable claim).

---

## 9. The 10-Minute Experience

The full explorer — every zone, every frame, every project — should leave with an emotional throughline, not just an information download:

**Curiosity → Craftsmanship → Systems Thinking → Professionalism → Leadership → Continuous Learning**

The Future Goals mezzanine is the deliberate last stop: after seeing everything he's already done, the visitor sees where he's headed next — closing on momentum, not a retrospective.

---

## 10. Emotional Design

| Stage | Emotion | Mechanism |
|---|---|---|
| Beginning | Warmth, curiosity | Walking into a lived-in room, not a loading screen or a hero banner |
| Discovery | Delight | Clicking the desk reveals real engineering depth, not a placeholder card |
| Understanding | Respect | Realizing the breadth — debate *and* research *and* production-shaped systems |
| Respect | Trust | The site's own craftsmanship (the pixel/modern-UI duality, the writing quality) is itself evidence of the care claimed in the content |
| Inspiration | Motivation to reach out | Future Goals mezzanine ends the journey on direction, not summary |

Tone throughout: **warm, intentional, thoughtful, professional.** Never childish — pixel art is the material, not the register. No exclamation points doing the enthusiasm's job; the writing should read the way a well-run engineering standup sounds, not a game's tutorial pop-up.

---

## 11. Competitive Analysis

Researched rather than assumed — three reference points, what each teaches, and what we're deliberately *not* copying.

**[Bruno Simon's portfolio](https://bruno-simon.com/)** ([case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b)) rebuilds the entire UI as 3D objects in a WebGL world, uses environmental cues (paths, tiles) to signal explorability without instructions, and layers in a gamified achievement system with unlockable rewards.
- **What works, and what we're taking:** environmental wayfinding — the room itself should make "click here" obvious without a tutorial overlay, the same way Bruno Simon's paths do.
- **What we're explicitly not taking:** the achievement/unlock system. Bruno Simon's audience is other creative developers evaluating craft-as-entertainment; ours is recruiters evaluating hireability under real time pressure. XP and unlockables read as *game*, and Section 16 of the brief already rules that register out.

**[Robby Leonardi's Interactive Resume](http://www.rleonardi.com/interactive-resume/)** structures an entire CV as a side-scrolling platformer, banking on the idea that people will play a small game to the end and therefore read the whole resume.
- **What works, and what we're taking:** turning passive reading into an active traversal is genuinely more memorable than a scroll of text — that's the core justification for a room-based layout at all.
- **What we're explicitly not taking:** platformer mechanics, "levels," or anything resembling gameplay skill. A recruiter should never feel like they have to be *good at the site* to get the information; that's a barrier, not a hook, for this audience.

**ML/data-science portfolios surveyed** (James Le, Tim Hopper, and similar) trend toward a blog-plus-project-index format: papers, talks, and project writeups organized by theme, with heavy emphasis on demonstrating the full problem → research → build → evaluate → ship lifecycle rather than a finished-model showcase.
- **What works, and what we're taking:** treating each project as a *lifecycle*, not a screenshot — this is why every Engineering Desk entry needs a Problem / Architecture / Tradeoffs / Lessons Learned structure, not a feature list.
- **Gap this portfolio fills that theirs don't:** none of the surveyed ML portfolios integrate a leadership/communication narrative at all — they're technical-only. Nisir's actual differentiation (Section 2) is the combination, so the site format has to hold both halves in one coherent world, which none of the reference sites need to do.

**Sources:** [Bruno Simon](https://bruno-simon.com/) · [Bruno Simon case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b) · [Robby Leonardi Interactive Resume](http://www.rleonardi.com/interactive-resume/) · [The Making of Robby Leonardi's Interactive Resume](https://thefwa.com/article/the-making-of-robby-leonardi-s-interactive-resume) · [Awwwards Portfolio winners](https://www.awwwards.com/websites/winner_category_portfolio/) · [Springboard: Building a Machine Learning Portfolio](https://www.springboard.com/blog/data-science/machine-learning-portfolio/)

---

## 12. Success Metrics

All metrics privacy-respecting (no PII, no cross-site tracking) — tooling choice deferred to Phase 3.

- Average session duration (target: median above 90 seconds, meaningful tail past 5 minutes)
- Project-panel open rate (% of sessions that open at least one project in depth)
- Resume PDF download count
- GitHub click-through rate
- LeetCode click-through rate
- Contact-method conversion rate (clicks on email/contact CTA)
- Zone completion rate (% of sessions visiting all five zones vs. Engineering-Desk-only)
- Most-explored zone / least-explored zone (informs future content investment)

---

## 13. Future Roadmap

- **V1 — Core experience:** the five-zone Study, three flagship projects, research panel, awards corner, contact.
- **V2 — Interactive AI assistant:** a lightweight in-world guide that can answer "tell me about the Safety Platform's architecture" in Nisir's own voice/content, not a generic chatbot.
- **V3 — Knowledge graph:** surface the actual connective tissue between projects, research, and leadership roles (e.g., "risk assessment" appears in both the Safety Platform and case-comp work).
- **V4 — Live GitHub integration:** real commit activity / recent repos surfaced in the Engineering Desk, not a static list.
- **V5 — Project analytics dashboard:** turn Section 12's metrics into a public-facing "how people explore this" panel — itself a data-viz portfolio piece.
- **V6 — Research publication explorer:** once there's published work, a dedicated reading/citation view in the Research Library.
- **V7 — Visitor personalization:** let a visitor self-identify persona (recruiter / professor / collaborator) and reorder zone emphasis accordingly.

---

## 14. Long-Term Maintainability

The portfolio must grow with the career without architecture changes. This means **every room's content is data, not markup** — new projects, publications, internships, awards, blog posts, talks, and experiences are new entries in typed JSON/content files (`projects.json`, `research.json`, `certificates.json`, `positions.json`, `timeline.json`), never new components. A new certificate should be addable by editing one JSON entry and dropping in one image — never by touching room layout, interaction logic, or styling. This constraint gets formalized as a schema in Phase 3.

---

## 15. Brand Identity

- **Professional personality:** builder, analyst, researcher, strategist, leader — in that rough order of how the site introduces him (systems first, because that's the highest-leverage first impression for the primary audience).
- **Writing style:** plain, specific, active voice. Numbers over adjectives ("24 MUN conferences, 6 judged" beats "extensive MUN experience"). No resume-speak ("leveraged," "spearheaded") inside the interactive panels — write the way he'd explain it to a colleague.
- **Visual language:** the two-layer pixel-world / modern-glass-UI split defined in Phase 1 — warm wood tones for the world, cool glass panels for the substance.
- **Interaction philosophy:** every clickable object has one clear job and one clear result; no dead clicks, no decorative-only interactivity that returns nothing.
- **Animation philosophy:** motion earns its place by clarifying state change (a panel opening, a room transition) — never ambient animation competing for attention with content. Respect `prefers-reduced-motion`.
- **Typography philosophy:** the pixel font stays inside the pixel canvas only (ambient labels); all substantive reading uses the modern serif/sans pairing established in Phase 1 — legibility for the reader always outranks thematic consistency.
- **Photography rules:** no stock photography, ever. Every image is either the actual pixel-art asset set, an actual certificate, or an actual project screenshot/diagram. If there's nothing real to show, the section doesn't get a placeholder image — it gets cut.
- **Color palette philosophy:** warm wood/terracotta/sage for the world (drawn directly from the real asset packs, not invented), cool slate/parchment/glass for the UI — the contrast between the two palettes is itself the "premium" signal, not any single color choice.

---

## 16. Final Design Principle

> Every interaction should answer one question: **"Does this make a recruiter more confident in hiring me?"**
> If the answer is no, remove or redesign the interaction.

This is the filter every subsequent phase (IA, wireframes, architecture, build) gets run through. Anything that survives on "it looks cool" alone doesn't ship.
