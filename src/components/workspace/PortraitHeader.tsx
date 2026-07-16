/**
 * Phase H.2, Part 1/2/8 — the portrait-only lightweight header. Fills
 * what used to be dead whitespace above the room with real, intentional
 * content: the same name/subtitle pairing the Save Slot screen already
 * established (`SaveSlot.tsx`'s own baked text — "NISIR SANANG BAGE /
 * AI & Machine Learning Student / Builder"), so the room doesn't feel
 * like a disconnected object dropped onto a blank page — it reads as a
 * continuation of the same intro the visitor just came from.
 *
 * Deliberately compact — one short line plus one small subtitle line,
 * not a second hero moment competing with the room itself for
 * attention. No hook, no state; a static server-renderable component
 * (Workspace.tsx only mounts it when `isPortrait` is true, so it never
 * pays for itself on desktop/landscape).
 */
export function PortraitHeader() {
  return (
    <header className="w-full shrink-0 px-4 pt-3 pb-2 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--panel-ink)] uppercase">Nisir Sanang Bage</p>
      <p className="mt-0.5 text-[10px] tracking-wide text-[var(--panel-ink)] opacity-70">
        AI &amp; Machine Learning Student · Builder
      </p>
      <hr className="panel-divider mx-auto mt-2 w-16" />
    </header>
  );
}
