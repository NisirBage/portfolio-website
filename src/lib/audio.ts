/**
 * Ambient audio configuration — Phase A, extended Phase C, revised
 * Phase F.1.
 *
 * *Revised, Phase F.1, Part 1.* Phase C built a six-entry `AMBIENCE_TRACKS`
 * catalog in anticipation of future ambience variety, with only one entry
 * ever wired to a real file. This phase's brief is explicit and final on
 * the point: "Remove the idea of multiple ambience selections... No
 * playlist. No music selector. No settings menu." The catalog is removed
 * outright, not just left unused — a real, supplied piano loop now exists,
 * and the brief's own stated design goal ("the gramophone now has one
 * responsibility") is better served by one concrete constant than by a
 * multi-entry structure nothing else reads from. If a genuine second
 * ambience is ever requested, this is a straightforward re-introduction,
 * not a loss of a hard-won abstraction — the six-entry catalog cost one
 * object literal to remove and would cost about the same to re-add.
 */
export const AMBIENT_TRACK_SRC = "/audio/ambient-piano.mp3";

export const AMBIENT_VOLUME = 0.35;

/**
 * *Revised, Phase F.1.* The brief specifies asymmetric fade timing (1.5-2s
 * in, 1s out) — not the same duration in both directions, which is why
 * this is two constants now, not one. `FADE_IN_MS` sits at the low end of
 * the requested range: fast enough that clicking the gramophone reads as
 * responsive, slow enough not to pop in.
 */
export const FADE_IN_MS = 1600;
export const FADE_OUT_MS = 1000;

export const STORAGE_KEY = "the-studio:ambient-audio";

/**
 * Popup open/close SFX — Phase F.1, Parts 2-4. Two real, supplied files,
 * not generated or substituted (`the1957files-paper-swish-ui-529818.mp3`
 * and `litupsubway-ui-close-sfx-513359.mp3`, per explicit "use these
 * assets directly, do not replace them, do not generate alternatives").
 * Deliberately low volume — these are a tactile accent under every panel
 * open/close, not a second music track competing with the gramophone's
 * own ambience.
 */
export const POPUP_OPEN_SRC = "/audio/popup-open.mp3";
export const POPUP_CLOSE_SRC = "/audio/popup-close.mp3";
export const POPUP_SFX_VOLUME = 0.25;
