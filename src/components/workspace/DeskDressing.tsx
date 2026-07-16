"use client";

import Image from "next/image";
import { ASSETS, type RegisteredAsset } from "@/lib/assets";
import { DESK_HOTSPOT, getSpritePlacement } from "@/lib/roomGeometry";

/**
 * Desk surface dressing — Concept Reconciliation, Workspace decoration
 * pass. Pure decorative layer, same non-interactive pattern as the
 * walnut bookshelf / paper stack (no hotspot, no click handler; the
 * Desk hotspot itself stays the sole interactive element, per "do not
 * create new interaction zones").
 *
 * Positions are local pixel offsets from `DESK_HOTSPOT`'s own center,
 * not independent coordinates — matches how the Leadership frames are
 * offset from `LEADERSHIP_HOTSPOT`. Measured against the desk sprite's
 * own 48×33 footprint (the usable surface is roughly the top 28px,
 * before the front lip/legs begin) to keep every item within the desk's
 * drawn bounds. This is a tight fit, not a loose one: 8 items at their
 * minimum-legible size (see assets.ts's comment on the generated desk
 * set) claim most of the usable surface — there was no arrangement with
 * zero overlap once all 8 were required (see CONCEPT_RECONCILIATION.md
 * for the area math).
 *
 * The first placement pass used bounding-box math alone and looked fine
 * on paper (Lamp/Notebook bounding boxes overlapped ~46%), but a real
 * composite render (actual sprites, actual alpha, not boxes — the same
 * "don't trust the math alone" lesson as the rest of this project's
 * verification methodology) showed the Lamp visually swallowing the
 * Notebook's corner. Repositioned based on that render, not the box
 * math: final bounding-box overlaps are Keyboard/Mouse touching at
 * their shared edge (realistic — a mouse sits directly beside a
 * keyboard) and Notebook/Blueprint overlapping by roughly 15% of the
 * Blueprint's own footprint (it "leans against" the Notebook, plausible
 * desk clutter) — both confirmed non-distracting in the composite
 * render, not just computed. Every item is at least ~85% independently
 * visible in the actual rendered result.
 */

interface DeskItem {
  asset: RegisteredAsset;
  offsetX: number;
  offsetY: number;
  alt: string;
}

const DESK_ITEMS: DeskItem[] = [
  { asset: ASSETS.deskMonitor, offsetX: -2, offsetY: -9, alt: "" },
  { asset: ASSETS.deskLamp, offsetX: 13, offsetY: -9, alt: "" },
  { asset: ASSETS.deskPencilCup, offsetX: -19, offsetY: -9, alt: "" },
  { asset: ASSETS.deskCoffeeMug, offsetX: -17, offsetY: 5, alt: "" },
  { asset: ASSETS.deskKeyboard, offsetX: 0, offsetY: 4, alt: "" },
  { asset: ASSETS.deskMouse, offsetX: 11, offsetY: 5, alt: "" },
  { asset: ASSETS.deskNotebook, offsetX: 19, offsetY: 1, alt: "" },
  { asset: ASSETS.deskBlueprintRoll, offsetX: 18, offsetY: 10, alt: "" },
];

export function DeskDressing() {
  return (
    <>
      {DESK_ITEMS.map((item) => {
        const centerXPercent = DESK_HOTSPOT.centerXPercent + (item.offsetX / 288) * 100;
        const centerYPercent = DESK_HOTSPOT.centerYPercent + (item.offsetY / 144) * 100;
        const placement = getSpritePlacement(
          centerXPercent,
          centerYPercent,
          item.asset.width,
          item.asset.height,
        );
        return (
          <Image
            key={item.asset.src}
            src={item.asset.src}
            alt={item.alt}
            width={item.asset.width}
            height={item.asset.height}
            unoptimized
            priority
            className="pixel-art pointer-events-none absolute select-none"
            style={{
              left: `${placement.left}%`,
              top: `${placement.top}%`,
              width: `${placement.width}%`,
              height: `${placement.height}%`,
            }}
          />
        );
      })}
    </>
  );
}
