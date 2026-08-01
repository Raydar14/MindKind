import { detectDistortions } from "./distortions";
import { LENSES, renderLens, type LensKey, type LensResult } from "./lenses";
import { COMMON_PHRASES } from "@/lib/compassion";

export type ReframeInput = {
  thought: string;
  feeling?: string;
  need?: string;
};

export type Reframing = {
  observation: string;
  feeling: string;
  need: string;
  distortions: ReturnType<typeof detectDistortions>;
  lenses: LensResult[];
  anchorPhrase: string;
  identityLine: string;
};

const DEFAULT_FEELING = "tender and stretched";
const DEFAULT_NEED = "kindness, patience, and to be with myself as I am";

export function reframe(input: ReframeInput): Reframing {
  const thought = input.thought.trim();
  const distortions = detectDistortions(thought);

  const feeling = (input.feeling?.trim() || inferFeeling(distortions)).trim();
  const need = (input.need?.trim() || inferNeed(distortions)).trim();

  const ctx = { thought, feeling, need, distortions };
  const lenses = LENSES.map((l) => renderLens(l.key, ctx));

  return {
    observation: thought || "a hard thought passing through",
    feeling,
    need,
    distortions,
    lenses,
    anchorPhrase: pickAnchor(thought),
    identityLine: pickIdentity(distortions),
  };
}

export function reframeOne(input: ReframeInput, lens: LensKey): LensResult {
  const thought = input.thought.trim();
  const distortions = detectDistortions(thought);
  const feeling = (input.feeling?.trim() || inferFeeling(distortions)).trim();
  const need = (input.need?.trim() || inferNeed(distortions)).trim();
  return renderLens(lens, { thought, feeling, need, distortions });
}

function inferFeeling(distortions: ReturnType<typeof detectDistortions>): string {
  const keys = new Set(distortions.map((d) => d.key));
  if (keys.has("catastrophizing")) return "afraid and braced";
  if (keys.has("labeling")) return "ashamed and small";
  if (keys.has("should")) return "pressured and tight";
  if (keys.has("mind-reading")) return "exposed and defensive";
  if (keys.has("helplessness")) return "heavy and stuck";
  if (keys.has("fortune-telling")) return "anxious about what's next";
  if (keys.has("personalizing")) return "guilty and over-responsible";
  return DEFAULT_FEELING;
}

function inferNeed(distortions: ReturnType<typeof detectDistortions>): string {
  const keys = new Set(distortions.map((d) => d.key));
  if (keys.has("catastrophizing")) return "safety, and to know I've faced hard before";
  if (keys.has("labeling")) return "self-respect, and to know my worth isn't on trial";
  if (keys.has("should")) return "space, and to move at my own pace";
  if (keys.has("mind-reading")) return "clarity, and to check what's actually true";
  if (keys.has("helplessness")) return "one small next step, and rest before effort";
  if (keys.has("fortune-telling")) return "presence, and to return from the future to now";
  if (keys.has("personalizing")) return "an honest share of responsibility, no more, no less";
  return DEFAULT_NEED;
}

function pickAnchor(text: string): string {
  const idx = Math.abs(hash(text)) % COMMON_PHRASES.length;
  return COMMON_PHRASES[idx];
}

function pickIdentity(distortions: ReturnType<typeof detectDistortions>): string {
  const keys = new Set(distortions.map((d) => d.key));
  if (keys.has("labeling"))
    return "I am someone who speaks to myself the way I'd speak to someone I love.";
  if (keys.has("should"))
    return "I am learning to choose from care instead of pressure.";
  if (keys.has("all-or-nothing"))
    return "I am someone who can tell one moment from all moments.";
  if (keys.has("helplessness"))
    return "I am someone who can rest and still be moving forward.";
  if (keys.has("catastrophizing"))
    return "I am someone who can be with fear without being led by it.";
  return "I am someone who returns to myself when it gets hard.";
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export { LENSES } from "./lenses";
export type { LensKey, LensResult } from "./lenses";
export type { Distortion } from "./distortions";
