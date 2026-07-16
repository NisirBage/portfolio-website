# Launch Checklist — The Studio, v1.0

**Status:** New deliverable, Phase H. A real, actionable checklist for you to run through before and immediately after the actual deploy — distinct from `PRODUCTION_VERIFICATION.md` (what was already verified against the local build) and `DEPLOYMENT_GUIDE.md` (how to actually deploy).

---

## Before you deploy

- [ ] `npm run lint` — clean (re-confirmed as of Phase H: yes)
- [ ] `npx tsc --noEmit` — clean (re-confirmed: yes)
- [ ] `npm run build` — clean (re-confirmed: yes)
- [ ] `.env.example` exists and contains no real values (confirmed: yes — placeholders only)
- [ ] No `.env.local` or any real secrets file is about to be committed (`git status` should show none; `.gitignore` already excludes `.env*`)
- [ ] `git status` reviewed — nothing unexpected staged (no stray temp files, no personal files outside the project)

## Deploying

- [ ] Followed `DEPLOYMENT_GUIDE.md` Steps 1–3 (commit, GitHub repo, push)
- [ ] Followed `VERCEL_SETUP.md` (import project, first deploy)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real deployed URL in Vercel's environment variables
- [ ] Redeployed after setting the env var (env var changes don't apply retroactively to an already-built deployment)

## Immediately after deploying — verify the real, live site

- [ ] Load the real URL, confirm the intro sequence plays (title → Save Slot → Continue → room)
- [ ] Confirm the room renders correctly — no 0-sized/collapsed layout (the exact bug `MOBILE_AUDIT.md` found and fixed locally; worth one real confirmation on the actual production deploy too, not just the local build)
- [ ] Click through every hotspot once: Leadership, Knowledge, Research, Workspace, Timeline, About Me, Future, Contact, Resume
- [ ] Toggle the Gramophone — confirm audio plays, confirm it remembers state on refresh
- [ ] Resize the browser window through a few widths — confirm no horizontal scrollbar appears
- [ ] Open DevTools → Console — confirm zero errors on the real deploy
- [ ] `curl -sI https://<your-url>/manifest.webmanifest` and `curl -s https://<your-url>/robots.txt` — both return real content
- [ ] Share the URL to yourself in a private message (Slack DM, iMessage, etc.) and confirm a link preview appears with the correct title/description (no image yet — expected, see `MISSING_ASSETS.md`)

## Before telling anyone about it

- [ ] Re-read the room's own content once more for typos or anything that reads as a placeholder (this project's own Asset/Content Truthfulness discipline means everything currently shown should already be real — this is a final human read, not expected to find anything)
- [ ] Confirm the Resume PDF is actually your current resume, not a stale version
- [ ] Confirm the Contact panel's Personal Email and GitHub link are both ones you want a stranger to use
- [ ] Decide whether the Work Email/LinkedIn gap (`MISSING_CONTENT.md`) matters enough to fill in before sharing, or is fine to leave for now

## Who to share it with, and what you're asking of them

This matches the brief's own closing instruction: the point of this release is to gather real feedback, not to ship something "finished." When you share the URL with recruiters, professors, peers, or collaborators, consider asking them something more specific than "what do you think" — e.g., "did you find my [Leadership/Research/Resume] section," or "did the intro feel like a fun start or an obstacle before the content." See `POST_LAUNCH_FEEDBACK.md` for a structure to actually capture what comes back.
