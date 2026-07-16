"use client";

import { useRef } from "react";
import Image from "next/image";
import { ASSETS, DOCUMENTS } from "@/lib/assets";
import type { ToastVariant } from "@/hooks/useToast";

interface ResumePanelProps {
  showToast: (message: string, variant?: ToastVariant) => void;
}

/**
 * Resume panel content — Phase F.1, Part 7. Opens from the Leather
 * Portfolio, replacing `PersistentActions`' screen-fixed download link
 * entirely. Per explicit instruction — "Do not immediately download.
 * Allow visitors to preview first" — the resume is embedded inline via
 * an `<iframe>` pointing at the same real, build-time-verified PDF
 * `PersistentActions` already linked to, with Download/Open-in-new-tab/
 * Print as separate, deliberate actions a visitor takes after previewing,
 * not the panel's own default behavior.
 *
 * *Print, reasoned through rather than assumed.* `iframe.contentWindow
 * .print()` is used directly rather than opening a second tab and
 * guessing when it's finished loading before calling `.print()` on it —
 * the iframe's PDF is same-origin (served from this site's own
 * `/documents/` path), so `contentWindow` is reachable, and the PDF is
 * already loaded by the time a visitor could click Print, since it's
 * the same document they're previewing.
 *
 * No separate in-panel "Close" control — `LayerPanel`'s own shared
 * Close/Done chrome already covers that identically to every other
 * panel; duplicating it here would be a second way to do the same
 * thing, not a new capability.
 */
export function ResumePanel({ showToast }: ResumePanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.focus();
      win.print();
    } else {
      showToast("Couldn't open print dialog — try Open in new tab instead", "error");
    }
  };

  const handleOpenNewTab = () => {
    window.open(DOCUMENTS.resume.src, "_blank", "noreferrer");
    showToast("Opened in a new tab", "info");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap gap-2">
        <a
          href={DOCUMENTS.resume.src}
          download
          className="panel-button flex min-h-11 items-center gap-1.5 px-3 text-xs transition-colors"
        >
          <Image src={ASSETS.iconDownload.src} alt="" width={16} height={16} unoptimized className="pixel-art select-none" />
          Download
        </a>
        <button
          type="button"
          onClick={handleOpenNewTab}
          className="panel-button flex min-h-11 items-center gap-1.5 px-3 text-xs transition-colors"
        >
          <Image src={ASSETS.iconOpenLink.src} alt="" width={16} height={16} unoptimized className="pixel-art select-none" />
          Open in new tab
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="panel-button flex min-h-11 items-center gap-1.5 px-3 text-xs transition-colors"
        >
          <Image src={ASSETS.iconResumePdf.src} alt="" width={16} height={16} unoptimized className="pixel-art select-none" />
          Print
        </button>
      </div>
      <div className="min-h-[50vh] flex-1 overflow-hidden border-2 border-[var(--panel-wood)]">
        <iframe
          ref={iframeRef}
          src={DOCUMENTS.resume.src}
          title="Resume preview"
          className="h-full min-h-[50vh] w-full"
        />
      </div>
    </div>
  );
}
