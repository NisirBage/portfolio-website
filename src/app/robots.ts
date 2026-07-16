import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Single-route site (everything lives at `/`) — nothing to disallow.
 * `NEXT_PUBLIC_SITE_URL` must be set to the real deployed domain before
 * production; see DEPLOYMENT_CHECKLIST.md.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
