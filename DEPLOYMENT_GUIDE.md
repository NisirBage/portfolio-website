# Deployment Guide — The Studio, v1.0

**Status:** New deliverable, Phase H. Written as real, followable steps for you to run yourself — deployment is a real-world, account-level action (creating a public URL, connecting GitHub/Vercel) this pass deliberately didn't take unilaterally. See `ENGINEERING_DECISIONS.md`'s Phase H entry for why, and `VERCEL_SETUP.md` for the Vercel-specific walkthrough this guide leads into.

---

## Before you start

This repository, as of Phase H, has never been committed to git — `git status` shows 140+ uncommitted files and no remote configured (`git remote -v` returns nothing). That's normal for how this project has been built (iteratively, in this session, without a commit workflow) but means the very first step is getting it into git properly, not skipping straight to a push.

## Step 1 — Review, then commit

```bash
cd portfolio-website
git status
```

Skim the list. Everything in it should be real project files — source code, content, documentation, assets. Nothing here should be a secret: `.env.local` (if you ever create one) is already excluded by `.gitignore`'s `.env*` rule, and `.env.example` (safe, placeholder-only) is meant to be committed.

```bash
git add -A
git commit -m "Initial commit: The Studio v1.0"
```

## Step 2 — Create a GitHub repository

1. On GitHub, create a new **empty** repository (no README, no `.gitignore`, no license — you already have all of those locally; adding them on GitHub's side would create a merge conflict with your first push).
2. Copy the repository's URL (either form works):
   - HTTPS: `https://github.com/<your-username>/<repo-name>.git`
   - SSH: `git@github.com:<your-username>/<repo-name>.git`

## Step 3 — Connect and push

```bash
git remote add origin <the-url-you-copied>
git branch -M main
git push -u origin main
```

If this is the first time pushing from this machine, GitHub will prompt for authentication (a browser sign-in, or a personal access token if you're using HTTPS without a credential helper configured).

## Step 4 — Deploy via Vercel

Full click-by-click walkthrough in `VERCEL_SETUP.md`. In short: sign in to Vercel with your GitHub account, import the repository you just pushed, and Vercel auto-detects it as a Next.js project — no configuration needed for the default deploy.

## Step 5 — Set the one required environment variable

Before the deployed site's metadata (Open Graph tags, canonical URL, sitemap) is fully correct, set `NEXT_PUBLIC_SITE_URL` in Vercel's project settings to your real deployed URL (Vercel gives you one automatically, like `https://your-project.vercel.app`, or your custom domain once you've set one up — see `VERCEL_SETUP.md`'s Domain section). Every other variable in `.env.example` (`NEXT_PUBLIC_ENABLE_ANALYTICS`, `NEXT_PUBLIC_ANALYTICS_ID`) can stay unset — the site works correctly with analytics off, which is the default, safe state.

## Step 6 — Verify the live deploy

Once Vercel gives you a URL, walk through `LAUNCH_CHECKLIST.md` against the real, live site — not the local dev server. A few things specifically worth checking on the real deploy that a local server can't fully prove:
- The intro sequence's timing and transitions feel right on a real network connection (not localhost's effectively-zero latency).
- The Resume PDF actually downloads/opens/prints correctly (this exercises a real file fetch, not a local one).
- Share a link to the deployed URL in a private chat to yourself and confirm the Open Graph preview renders (title/description will show; there's no preview image yet — see `MISSING_ASSETS.md`, a known, logged gap, not a bug).

## What "export mode" means, and why this project doesn't use it

The brief says "do not use export mode unless necessary." Next.js's static export (`output: "export"` in `next.config.ts`) produces a fully static HTML/CSS/JS bundle with no server runtime — appropriate for pure static sites, but this project doesn't need it and isn't configured for it: `next.config.ts` has no `output` override, so Vercel deploys it with its default, standard Next.js runtime (server-rendered where needed, static where possible, exactly what the "○ Static" markers in every `next build` output in this project's history already show for all four routes). Nothing about this project requires static export, and forcing it wouldn't change anything meaningful for a site that's already fully static per-route — it's simply not the mode this project uses, consistent with "don't do it unless necessary."

## Ongoing deploys

Once connected, every `git push` to `main` triggers a new production deploy automatically (Vercel's GitHub integration) — you don't need to run any deploy command yourself after this initial setup. Every other branch or pull request gets its own free preview deployment at a unique URL, useful for reviewing a change before merging it to `main`.
