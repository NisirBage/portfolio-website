import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * `NEXT_PUBLIC_SITE_URL` drives `metadataBase` (required for Next.js to
 * resolve relative OG/Twitter image URLs into absolute ones) and the
 * sitemap. Deliberately not hardcoded to a real domain — this project
 * hasn't been deployed yet, so any domain here would be fabricated.
 * Falls back to localhost for local dev/build; must be set as a real
 * env var before production deploy (see DEPLOYMENT_CHECKLIST.md).
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const TITLE = "Nisir Sanang Bage";
const DESCRIPTION =
  "Interactive portfolio of Nisir Sanang Bage — AI/ML engineer, researcher, and debate leader.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: TITLE,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

/**
 * `themeColor` moved out of `metadata` into its own `viewport` export —
 * Next.js's own convention since 14, `metadata.themeColor` is deprecated
 * and produces a build warning if used. The value itself is the room's
 * own established dark background tone (`Workspace.tsx`'s
 * `radial-gradient` midpoint, #241a12), not an arbitrary brand color —
 * so a mobile browser's chrome/status bar matches what the room already
 * looks like rather than introducing a color that's never otherwise
 * used in this project.
 */
export const viewport: Viewport = {
  themeColor: "#241a12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
