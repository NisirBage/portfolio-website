/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. Sourced entirely from a genuine interview — see `INTERVIEW_NOTES.md`
 * for the raw record and `ABOUT_ME_CONTENT.md` for the approved draft this
 * mirrors verbatim. Written to show rather than announce, per explicit
 * instruction: no "I am passionate about," no "I love technology."
 *
 * *Condensed, post-Phase-H.2.* The original was seven paragraphs — real,
 * approved content, but long enough that an employer skimming a portfolio
 * briefly wouldn't get through it. Cut to two per explicit instruction
 * ("keep it concise and to the point"): no facts invented or altered, just
 * trimmed to the throughline (what he's drawn to and why the room looks
 * the way it does; what actually pulls him into work) and the specific
 * book/artist name-dropping and the French/baking aside removed as the
 * least employer-relevant material to cut first. The full original stays
 * on record in `INTERVIEW_NOTES.md` and `ABOUT_ME_CONTENT.md`'s own
 * revision history, not deleted, per this project's "corrected, not
 * erased" convention.
 */

export const ABOUT_ME_PARAGRAPHS: readonly string[] = [
  "I read widely and unapologetically: subaltern literature, philosophy, fiction from anywhere, told through whatever technique the story demands. The same appetite carries into art, where I'm drawn to work that commits to a real point of view rather than playing it safe. That's part of why this portfolio looks the way it does: I'd rather build something that reflects that than default to a clean, corporate-minimalist template.",
  "What actually pulls me into a project is whether it can go somewhere real, not just prove a point on paper; I'll take a problem with real context over an isolated exercise every time. Success, to me, isn't a title. It's solving something I'm genuinely invested in while still making a living doing it. And what I notice in other people is the same thing: passion, in any trade, that adds up to a purposeful life.",
] as const;
