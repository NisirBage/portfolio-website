# Release Notes — v1.0

**Status:** New deliverable, Phase H. The first tagged release of The Studio — Nisir Sanang Bage's interactive portfolio.

---

## What v1.0 is

An interactive, pixel-art "study" a visitor explores by clicking real room objects — a bookshelf, a leadership wall, a research journal, a desk, a clock, a corkboard, a window, a rolodex-turned-ledger, a leather portfolio, a gramophone — each opening a real panel of content, not a conventional scrolling website. The experience opens with a short, GBA-style boot sequence (a fade, a title card, a save-slot screen with a live play-time counter) before revealing the room.

## Highlights

- **Nine interactive room objects**, each a real hotspot with its own camera framing, opening a real content panel: Leadership, Knowledge, Research, Workspace (Desk/Projects), Timeline, About Me, Future, Contact, Resume.
- **A GBA-inspired intro sequence** — title card, a Save Slot screen with a genuinely live, `localStorage`-persisted Play Time counter, and a real Continue control — fading into the room rather than a hard cut.
- **One ambient piano loop**, gramophone-controlled (on/off, fade in/out, remembers your preference), plus subtle paper-swish/close sound effects on every panel open/close — deliberately simple, no playlist, no volume slider.
- **A real Resume panel** — embedded, scrollable PDF preview, plus Download/Open-in-new-tab/Print, not an immediate forced download.
- **A real Contact panel** — Personal Email and GitHub, each with Copy and Open actions and toast confirmation.
- **Mobile-first responsive design** — bottom-sheet panels on phones, side-docked panels on larger screens, hover-only hotspot labels on desktop and always-visible labels on mobile, verified at 11 breakpoints from 360px phones through 1920px desktops, including three phone-landscape sizes.
- **A parchment-and-wood visual language throughout** — no dark-gray or near-black UI chrome anywhere, "old RPG dialogue button" styling on every interactive control.

## What's honestly not in v1.0

Consistent with this project's own Asset/Content Truthfulness discipline throughout its build: nothing below is a bug, all of it is a deliberate, logged decision to ship honestly rather than fill a gap with something fabricated.

- **Work Email and LinkedIn** are not in the Contact panel — neither exists anywhere in the real content this project was built from. See `MISSING_CONTENT.md`.
- **No custom favicon or Open Graph share image** — both are currently generic (Next.js's own default icon; no preview image for shared links). See `MISSING_ASSETS.md`.
- **No analytics** — the code fully supports turning it on (`NEXT_PUBLIC_ENABLE_ANALYTICS`/`NEXT_PUBLIC_ANALYTICS_ID`), but nothing is connected, and nothing tracks a visitor by default.
- **A minor label-overlap** at one extreme mobile viewport combination (very narrow and very short simultaneously) — see `MOBILE_AUDIT.md`.
- **No real-device testing** for browser engines other than Chromium, or for safe-area-inset handling on notched phones — both flagged honestly as unverified rather than assumed fine.

## The road here

This release is the product of a long, iterative build spanning many phases — a fully spatial/information/composition-blueprinted architecture (Phases 1–3), a milestone-by-milestone room build (Milestones 1–8: workspace, camera, layer engine, Desk, Projects, Knowledge/Research, Leadership), a Production Hardening pass (cross-browser, performance, deployment readiness, repository review), then a sequence of refinement phases (A through H) each adding real polish — visual, audio, mobile, and now production launch readiness — without ever losing the thread of what the room actually is. Full detail for every decision along the way lives in `ENGINEERING_DECISIONS.md`; the current state of the whole project lives in `PROJECT_HEALTH.md`.

## What comes next

Per this phase's own closing instruction: nothing speculative. The next real work on this project should be driven by what actual visitors — recruiters, professors, peers, collaborators — say once they see it. See `POST_LAUNCH_FEEDBACK.md` for how that feedback gets captured and acted on.
