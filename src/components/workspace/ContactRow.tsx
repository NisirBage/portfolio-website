"use client";

import Image from "next/image";
import { ASSETS, type RegisteredAsset } from "@/lib/assets";

interface ContactRowProps {
  icon: RegisteredAsset;
  label: string;
  value: string;
  /** Copy `value` to the clipboard. Omit to hide the Copy action (the Resume shortcut row has nothing to copy). */
  onCopy?: () => void;
  /** Open externally — a real navigation (mailto:, an external profile, or switching to the Resume panel). */
  onOpen: () => void;
  openLabel?: string;
}

/**
 * One Rolodex card row — Phase F.1, Part 6. Every row supports Copy,
 * Open externally, and a pixel icon, per the brief. The toast itself is
 * triggered by the caller (`ContactPanel`), not here — this component
 * only renders the row and calls back into the two provided handlers,
 * keeping "what happens on copy/open" a `ContactPanel`-level concern.
 */
export function ContactRow({ icon, label, value, onCopy, onOpen, openLabel = "Open" }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Image
        src={icon.src}
        alt=""
        width={icon.width}
        height={icon.height}
        unoptimized
        className="pixel-art h-6 w-6 shrink-0 select-none"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">{label}</p>
        <p className="truncate text-sm">{value}</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            aria-label={`Copy ${label}`}
            className="panel-button flex min-h-11 min-w-11 items-center justify-center px-2 transition-colors"
          >
            <Image src={ASSETS.iconCopy.src} alt="" width={16} height={16} unoptimized className="pixel-art select-none" />
          </button>
        )}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${openLabel} ${label}`}
          className="panel-button flex min-h-11 min-w-11 items-center justify-center px-2 transition-colors"
        >
          <Image src={ASSETS.iconOpenLink.src} alt="" width={16} height={16} unoptimized className="pixel-art select-none" />
        </button>
      </div>
    </div>
  );
}
