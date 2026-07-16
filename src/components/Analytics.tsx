import Script from "next/script";
import { analyticsActive, inferredProvider, ANALYTICS_ID } from "@/lib/analytics";

/**
 * Renders nothing — not even a `<script>` tag — unless both
 * `NEXT_PUBLIC_ENABLE_ANALYTICS=true` and a real `NEXT_PUBLIC_ANALYTICS_ID`
 * are set at build time (see `lib/analytics.ts`). A server component:
 * the gating decision is made from build-time env vars, so there's
 * nothing here that needs to run client-side just to decide whether to
 * render.
 *
 * Only Google Analytics is actually wired to a real script tag — its ID
 * format (`G-XXXXXXX`) is the one case `inferredProvider` can detect
 * without an extra disambiguating env var. Plausible and Umami are
 * genuinely supported by this module's *shape* (nothing about
 * `analyticsActive`/`ANALYTICS_ID` is Google-specific), but wiring their
 * actual `<script>` tags without ever having a real site to point them
 * at would be exactly the kind of speculative build-ahead this
 * project's engineering rules warn against — add the second `<Script>`
 * block here when one is actually connected.
 */
export function Analytics() {
  if (!analyticsActive) return null;

  const provider = inferredProvider();
  if (provider !== "google-analytics") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ANALYTICS_ID}');
        `}
      </Script>
    </>
  );
}
