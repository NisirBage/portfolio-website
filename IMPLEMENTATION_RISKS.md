# Implementation Risks — The Studio

**Status:** Every major feature classified by real engineering, testing, accessibility, maintenance, and performance cost — not by how interesting it was to design. Several classifications here are more conservative than the tone of the documents that originally proposed the feature, which is the point of a risk review done after the fact rather than during design.

---

## Persistent Workspace + Camera Pan/Zoom Engine

| Dimension | Rating |
|---|---|
| Engineering complexity | **Medium-High** — a state machine plus transform math plus easing curves is real work, even without WebGL |
| Testing complexity | **Medium** — six anchor points, each needs verification at multiple viewport sizes |
| Accessibility complexity | **High** — every camera move needs a reduced-motion instant-cut equivalent, and the whole system is irrelevant to the screen-reader parallel path, which has to be built and tested as a fully separate track |
| Maintenance complexity | **Medium** — stable once built, but any future Focus state addition touches this system |
| Performance impact | **Low-Medium** if CSS transforms stay GPU-accelerated; **Medium-High** risk if pixel-art scaling isn't handled with `image-rendering: pixelated` at every zoom level, which no document has specified as a hard requirement until now |
| Asset dependency | **Low** — uses the already-verified room asset |
| **Version recommendation** | **Must Have**, but see `DESIGN_DEBT.md` Finding #4 — timing needs to be revisited against the 90-second recruiter priority before this is built, not after |

## Layer/Panel Stacking System

| Dimension | Rating |
|---|---|
| Engineering complexity | **Medium** |
| Testing complexity | **Medium-High** — combinatorial: six Focus states × up to four Layer depths each means dozens of distinct reachable states to verify, including browser back/forward at each one |
| Accessibility complexity | **Medium** — the docked-panel pattern is well-understood, but focus management when a Layer opens (where does focus land? where does it return to on close?) needs explicit, tested behavior, not just an assumption |
| Maintenance complexity | **Low** once built — this is the most reusable, best-isolated piece of the whole system |
| Performance impact | **Low** |
| Asset dependency | **None** — pure UI |
| **Version recommendation** | **Must Have** — this is the connective tissue everything else depends on; build and prove it early (Milestone 4) |

## Leadership Cluster Fan-Out Gallery

| Dimension | Rating |
|---|---|
| Engineering complexity | **High** — the single most complex individual interaction in the spec: variable-count clustering, staggered timing, arc positioning, and the keyboard-order-vs-visual-position decoupling already flagged in `LOW_FIDELITY_EXPLORATION.md` |
| Testing complexity | **Medium-High** |
| Accessibility complexity | **High** — overlapping arc-positioned cards risk ambiguous focus-ring visibility, a real WCAG concern not yet resolved, only the keyboard-order issue was caught previously |
| Maintenance complexity | **Medium** |
| Performance impact | **Medium** — many animated DOM elements at once for the largest cluster (24 Model UN entries) |
| Asset dependency | **Medium** — still blocked on the two large certificate PDFs never fully catalogued (`MISSING_ASSETS.md`-adjacent gap, still open) |
| **Version recommendation** | **Should Have** at fan-out fidelity; **Must Have** at the simpler grid fallback (Low-Fi Option A, previously rejected on aesthetic grounds, now the pragmatic scope-reduction target — see `VERSION1_SCOPE.md`) |

## Screen-Reader Parallel Linear Document

| Dimension | Rating |
|---|---|
| Engineering complexity | **Medium** to build once; **High** to maintain |
| Testing complexity | **High** — requires actual screen-reader testing (VoiceOver/NVDA), not just automated audits, which nothing in this project has scoped time for yet |
| Accessibility complexity | This *is* the accessibility feature — by definition maximal importance |
| Maintenance complexity | **High**, ongoing — every future content change (new project, new certificate) must be added to both the visual scene and this parallel document, forever, or they drift out of sync |
| Performance impact | **Low** |
| Asset dependency | **None** |
| **Version recommendation** | **Must Have**, non-negotiable — but the ongoing maintenance cost should be budgeted as a recurring tax on every future content update, not a one-time build cost |

## Mobile Scroll-Snap Fallback

| Dimension | Rating |
|---|---|
| Engineering complexity | **Medium-High** if built to the same spatial/compositional fidelity as desktop (effectively a second layout system); **Low** if the plain-list fallback from `VERSION1_SCOPE.md`'s Feature Removal Review is accepted instead |
| Testing complexity | **Medium** |
| Accessibility complexity | **Low-Medium** — arguably easier than desktop, since it's already closer to a linear document |
| Maintenance complexity | **Medium-High** at full fidelity, **Low** at the plain-list fallback |
| Performance impact | **Low** |
| Asset dependency | **Low** |
| **Version recommendation** | **Must Have** at the plain-list fallback; full spatial fidelity on mobile is explicitly **Version 2** |

## Ambient Audio System

| Dimension | Rating |
|---|---|
| Engineering complexity | **Low** for the toggle itself |
| Testing complexity | **Low** |
| Accessibility complexity | **Low**, but non-zero for zero current benefit — see `DESIGN_DEBT.md` Finding #10 |
| Maintenance complexity | **Low** |
| Performance impact | **None** currently (nothing to load) |
| Asset dependency | **Blocked** — zero source audio files exist, no sourcing owner or timeline |
| **Version recommendation** | **Cut from Version 1 entirely** (escalated from the earlier "ship disabled" recommendation) |

## Environmental Storytelling (visited-glow, Narrative States lighting)

| Dimension | Rating |
|---|---|
| Engineering complexity | **Low-Medium** — CSS filter/opacity shifts driven by an engagement counter |
| Testing complexity | **Low** |
| Accessibility complexity | **Low** — purely visual, doesn't gate content |
| Maintenance complexity | **Low** |
| Performance impact | **Low** |
| Asset dependency | **None** |
| **Version recommendation** | **Should Have** — cheap enough to keep, but see Feature Removal Review for what gets simplified first if time runs out |

## Deep Linking / Shareable State

| Dimension | Rating |
|---|---|
| Engineering complexity | **Not yet scoped anywhere in this project** — no document has addressed whether a specific Layer (e.g., the Neonatal Simulator's Blueprint) is reachable via a direct URL a recruiter could forward to a colleague |
| **Version recommendation** | **Should Have**, newly identified in this review rather than carried forward from earlier docs — real product value (recruiters do forward interesting candidates internally) at what should be low-to-medium cost if the Layer state machine is built with URL-syncing in mind from Milestone 4 onward, much higher cost if retrofitted later |
