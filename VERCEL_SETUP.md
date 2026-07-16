# Vercel Setup — The Studio

**Status:** New deliverable, Phase H. The Vercel-specific half of `DEPLOYMENT_GUIDE.md` — follow that guide's Steps 1-3 (git commit, GitHub repo, push) first if you haven't already.

---

## Import the project

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (this is what enables the GitHub integration the brief asks for — Vercel needs permission to see your repositories to import one).
2. Click **Add New → Project**.
3. Select the repository you pushed in `DEPLOYMENT_GUIDE.md`'s Step 3.
4. Vercel auto-detects this as a **Next.js** project — the default build settings are already correct:
   - Framework Preset: Next.js
   - Build Command: `next build` (default, matches this project's own `package.json` script)
   - Output Directory: (leave default — Next.js manages this itself)
   - Install Command: `npm install` (default)
5. Before clicking Deploy, expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SITE_URL` — Vercel will give you a URL like `https://<project-name>.vercel.app` once deployed; you can set this after the first deploy once you know the real URL (or set it to your best guess now — Vercel lets you predict the `.vercel.app` URL from the project name before deploying). Leave `NEXT_PUBLIC_ENABLE_ANALYTICS` and `NEXT_PUBLIC_ANALYTICS_ID` unset for now.
6. Click **Deploy**.

## Production environment

Vercel's default setup already gives you what Part 2 of the brief asks for:

- **Production environment.** Every push to `main` deploys to your project's production URL and (once configured) your custom domain.
- **Preview deployments.** Every other branch and every pull request gets its own unique preview URL automatically — no configuration needed, this is Vercel's default behavior for a GitHub-connected project.
- **GitHub integration.** Already active from the import step above — Vercel comments on pull requests with preview links, and shows deploy status checks on commits.
- **Automatic HTTPS.** Every Vercel deployment, including the default `.vercel.app` domain and any custom domain you add, gets a free, automatically-renewed TLS certificate — no action needed.

## Setting environment variables correctly

Project Settings → Environment Variables. For each of the three variables in `.env.example`:

| Variable | What to set it to |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your real deployed URL, no trailing slash (e.g., `https://nisirbage.vercel.app` or your custom domain once set up) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Leave unset, or `false`, until you've actually connected an analytics provider — the site works correctly either way; see `ENGINEERING_DECISIONS.md`'s Phase H entry for how `src/lib/analytics.ts`/`src/components/Analytics.tsx` are wired |
| `NEXT_PUBLIC_ANALYTICS_ID` | Leave unset until you have a real ID — an empty/placeholder value here would not cause an error (the code checks for a real, non-empty value), but there's no reason to set it before you actually have one |

`NEXT_PUBLIC_`-prefixed variables are the only kind this project uses — Next.js requires that prefix for any environment variable that needs to be readable in client-side code (all three are read in `src/app/layout.tsx` and `src/lib/analytics.ts`, both of which run partly client-side). After changing an environment variable, redeploy for it to take effect (Vercel doesn't hot-reload env vars into an already-built deployment).

## Domain preparation (Part 13)

This project has not been assigned a real domain — nothing below fabricates one. This section documents where each piece would be configured, once you have one.

- **Where the domain gets configured.** Project Settings → Domains, in the Vercel dashboard. Add your domain there; Vercel will show you the exact DNS records to add (either an `A` record pointing at Vercel's IP, or a `CNAME` for a subdomain) — these records are generated per-domain by Vercel at the time you add it, so there's nothing genuine to list here in advance without a real domain to generate them for.
- **HTTPS.** Automatic once the domain's DNS is verified — Vercel issues and renews the certificate itself, no separate action.
- **Redirects.** None currently configured, and none are needed for this project's own routes (one real route, `/`). If you eventually want `www.yourdomain.com` to redirect to the bare domain (or vice versa), Vercel's Domains settings let you set a primary domain and it handles the redirect automatically — again, a dashboard toggle once a real domain exists, not something to pre-build here.
- **Caching.** Vercel's default edge caching applies automatically to this project's static routes (`/`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` are all pre-rendered as static content per the project's own `next build` output) — no custom cache headers are configured in `next.config.ts`, and none are currently needed; the default behavior is already correct for a fully-static single-page site.

## Verifying the deploy

Once deployed, walk through `LAUNCH_CHECKLIST.md` against the real URL. A quick sanity check right after deploying:

```bash
curl -sI https://<your-deployed-url>/manifest.webmanifest
curl -s https://<your-deployed-url>/robots.txt
```

Both should return real content (not a 404) — confirming the metadata routes built in Phase H are live in production, not just working locally.
