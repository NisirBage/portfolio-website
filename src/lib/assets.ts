/**
 * Typed pointer to every verified game asset actually wired into the
 * codebase. This mirrors ASSET_REGISTRY.md — it exists so future
 * milestones import a path from one place instead of hardcoding
 * `"/assets/..."` strings ad hoc, which is how registry and code drift
 * apart. Per the Asset Truthfulness Protocol, nothing is added here
 * until the source file has been copied into `public/` and verified.
 */

export interface RegisteredAsset {
  /** Path under `public/`, usable directly as an <img> src. */
  readonly src: string;
  /** Native pixel dimensions, confirmed via direct file inspection. */
  readonly width: number;
  readonly height: number;
  /** Where this asset is documented in the frozen architecture. */
  readonly registryRef: string;
}

export const ASSETS = {
  roomShell: {
    src: "/assets/rooms/floors-and-walls.png",
    width: 288,
    height: 144,
    registryRef: "ASSET_REGISTRY.md#floorsandwallspng",
  },
  doorClosed: {
    src: "/assets/architecture/door-closed.png",
    width: 26,
    height: 40,
    registryRef: "ASSET_REGISTRY.md#doorsandwindowspng",
  },
} as const satisfies Record<string, RegisteredAsset>;

/**
 * Non-image assets — no width/height, so they don't fit RegisteredAsset.
 * Separate, honestly-typed registry rather than forcing a PDF into an
 * interface built for sprites.
 */
export const DOCUMENTS = {
  resume: {
    src: "/documents/nisir-sanang-bage-resume.pdf",
    label: "Resume (PDF)",
  },
} as const;
