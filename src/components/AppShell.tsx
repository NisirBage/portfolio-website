"use client";

import { useState } from "react";
import { Workspace } from "@/components/workspace/Workspace";
import { IntroSequence } from "@/components/intro/IntroSequence";

/**
 * Phase G — hosts the boot sequence in front of the room. `Workspace` is
 * mounted for this component's entire lifetime, `inert` while the intro
 * is showing (the same mechanism `LayerPanel` already uses for closed
 * panels) so a keyboard user can't tab into a hotspot that's still
 * hidden behind the intro overlay. Once `IntroSequence` calls
 * `onComplete`, it unmounts itself and `inert` is lifted — the room was
 * never re-mounted or re-initialized, just revealed, which is what lets
 * `IntroSequence`'s own final fade read as "fading into the room" rather
 * than a hard cut to a freshly-mounted one.
 *
 * *Fixed, Phase H (Part 6, Mobile Panels audit).* The wrapper `<div>`
 * had no sizing classes of its own. `page.tsx`'s `<main>` is
 * `flex flex-1 flex-col`, and `Workspace`'s own root relies on `h-full`
 * to fill it — a bare, unstyled `<div>` inserted between them as a flex
 * item with no `flex: 1` sizes to its own content instead of stretching
 * to fill `main`, so `h-full` inside it resolved against an
 * indeterminate (auto) height and collapsed to 0. Every element inside,
 * including the room's own aspect-ratio box, measured 0×0 as a result —
 * not a cosmetic issue, a real layout collapse this audit's own
 * `getBoundingClientRect()` checks caught directly, that JSX presence
 * checks (`querySelector` still finds a 0-sized element) had missed
 * throughout Phase G. Fixed by giving the wrapper the same `flex flex-1
 * flex-col` shape `main` itself uses, restoring the height chain.
 */
export function AppShell() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}
      <div className="flex flex-1 flex-col" inert={!introDone}>
        <Workspace />
      </div>
    </>
  );
}
