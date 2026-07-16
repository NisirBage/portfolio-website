# Narrative Design — Phase D, Part 5

**Status:** One-time design record for how the three narrative panels differentiate themselves without redesigning the shared panel system, per the brief's own explicit constraint.

---

## The constraint

"These three panels should feel slightly different... Do not redesign the panel system. Reuse it. Only adjust the internal presentation." `LayerPanel`'s shared chrome — the paper texture, wood dividers, sharp corners, fixed header/footer with independently-scrolling content, the side-panel/bottom-sheet split — is completely unchanged by this phase. Every difference between Timeline, About Me, and Future lives inside each panel's own content component, not in the shared shell.

## Timeline — warm, reflective, memory

`TimelinePanel.tsx` presents the eight chapters as points on an actual small timeline: a thin wood-toned vertical line runs down the left edge of the list, with a small circular marker at each chapter, the visual language of a memory being traced back through time rather than a generic accordion or card list. Chapter titles use the same amber accent color already established for section markers elsewhere in this project, keeping it visually related to the rest of the site rather than introducing a new accent.

## About Me — cozy, personal, journal

`AboutMePanel.tsx` is deliberately the least structured of the three: plain flowing paragraphs, no dividers, no markers, no visual scaffolding beyond a soft drop-cap treatment on the opening line. This is the one panel where the content itself is meant to carry the entire presentation, the way a page torn from a journal doesn't need section headers to read as personal.

## Future — bright, hopeful, forward-looking

`FuturePanel.tsx` keeps the same plain-paragraph approach as About Me for its first three paragraphs, then gives the closing paragraph (the "impactful life" line) a distinct highlighted callout treatment — a left border and a soft amber background wash. The emphasis is earned by what the content actually says, not decorated onto every paragraph equally; only the one thought meant to be the take-away gets the visual weight.

## What stayed identical on purpose

Section markers (▸), the paper texture, the wood dividers between header/content/footer, the Close/Done controls, the responsive side-panel/bottom-sheet behavior, the animation timing bands — all completely unchanged. The brief asked for three panels that *feel* different, not three different UI systems; consistency at the chrome level is what makes the content-level differences read as intentional rather than accidental.

## Verification

`lint`/`tsc --noEmit`/`next build` clean. Confirmed via direct DOM inspection that all three panels render their expected content (`textContent` checked for a distinguishing phrase from each: "CNC plotter" for Timeline, "Johnny Got His Gun" for About Me, "Kafka" for Future) rather than assumed from the source alone.
