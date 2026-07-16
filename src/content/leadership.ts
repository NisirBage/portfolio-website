/**
 * Content — responsible only for information, per the Layer Responsibilities
 * rule. Rebuilt post-Milestone 8 from an updated, authoritative Debate/MUN
 * CV (see ENGINEERING_DECISIONS.md's "Leadership content evolution" entry
 * for the full delta against the previous version). Organized around
 * transferable capabilities, not activity types — Communication, Diplomacy,
 * Leadership, Case Competitions — per user-directed content revision.
 * Evidence determines prominence: Diplomacy carries the most real evidence
 * (36 named items) and is presented that way, not artificially balanced
 * against Case Competitions' 2.
 *
 * Maturity follows the same L0-L4 scale CONTENT_MATURITY.md defines for
 * this surface: L0 Resume Claim, L1 Summary, L2 Evidence (named,
 * checkable items — where every cluster here currently sits), L3
 * Reflection, L4 Artifacts. Nothing here claims L3/L4 — no first-person
 * reflection or certificate/photo artifacts exist yet.
 */

export type LeadershipMaturity = "L0" | "L1" | "L2" | "L3" | "L4";

export interface LeadershipEvidenceGroup {
  id: string;
  label: string;
  items: readonly string[];
}

export interface LeadershipCapability {
  id: string;
  title: string;
  headline: string;
  summary: string;
  maturity: LeadershipMaturity;
  evidence: readonly LeadershipEvidenceGroup[];
}

export const LEADERSHIP_CAPABILITIES: readonly LeadershipCapability[] = [
  {
    id: "diplomacy",
    title: "Diplomacy",
    headline: "25 conferences as delegate, 11 as chair",
    summary:
      "Represented and presided — the full range of Model UN participation, from delegate results at 25 conferences to chairing UNHRC, UNODC, and WTO committees at national-level conferences.",
    maturity: "L2",
    evidence: [
      {
        id: "delegate",
        label: "Delegate Experience (25 conferences)",
        items: [
          "2 Best Delegate",
          "3 High Commendation",
          "5 Special Mention",
          "2 Honourable Mention",
          "6 Verbal Mention",
          "7 further conferences attended without a placed result",
        ],
      },
      {
        id: "chairing",
        label: "Chairing (11 roles, 2025–2026)",
        items: [
          "Chairperson, HCC — BITMUN 2026",
          "Chairperson, UNHRC — NUSRL Ranchi Avirbhaav 2026",
          "Chairperson, UNHRC — Rashtra Manthan 2026",
          "Chairperson, UNHRC — Agrani DPS Bokaro MUN 2026",
          "Chairperson, UNODC — RMUN 2026",
          "Chairperson, WTO — Oxford School MUN 2026",
          "Chairperson, IPL — JHMUN Ranchi 2025",
          "Vice Chairperson, UNSC — DPSRMUN 2025",
          "Vice Chair, IPL — IIMUN Jamshedpur 2025",
          "Rapporteur, Sokovia Accords Draft Commission — MINIMUN 2025",
          "Speaker, Lok Sabha — Rostra Youth Parliament 2026",
        ],
      },
    ],
  },
  {
    id: "communication",
    title: "Communication",
    headline: "2 Open Finals wins, 5 adjudication assignments",
    summary:
      "Competitive debate across Asian and British Parliamentary formats, on both sides of the podium — competing, and later judging.",
    maturity: "L2",
    evidence: [
      {
        id: "debate",
        label: "Debate record",
        items: [
          "Open Finals Winner — NUSRL Avirbhaav APD 2024",
          "Open Finals Winner — BIT Mesra Genesis BPD 2024",
          "4th Best Speaker — BIT Mesra Genesis BPD 2024",
          "Competed — BITS QED 2024",
          "Competed — DTU Summers 2025",
          "Competed — NUSRL Kurukshetra APD 2023",
        ],
      },
      {
        id: "adjudication",
        label: "Adjudication",
        items: [
          "Breaking Adjudicator & Open Semis Judge — 15th CNLU APD 2024",
          "Judge — Muntazar APD 2024",
          "Judge — 18th IIT Bombay BPD 2024",
          "Judge — IIT BHU APD 2025",
          "Judge — RBPD BPD 2025",
        ],
      },
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    headline: "Director General, BITMUN 2026",
    summary:
      "Organisational leadership beyond any single committee — running an entire conference, and a standing role in a debating society.",
    maturity: "L1",
    evidence: [
      {
        id: "roles",
        label: "Roles",
        items: [
          "Director General — BITMUN 2026",
          "Joint Secretary — UNESQUO Debating Society",
        ],
      },
    ],
  },
  {
    id: "case-competitions",
    title: "Case Competitions",
    headline: "2 podium finishes",
    summary: "Structured business problem-solving under real constraints.",
    maturity: "L2",
    evidence: [
      {
        id: "placements",
        label: "Placements",
        items: ["2nd place — UNESQUO × 180DC", "3rd place — Consilium 2025"],
      },
    ],
  },
] as const;
