import type { Distortion } from "./distortions";

export type LensKey = "cbt" | "act" | "nvc" | "compassion" | "stoic" | "buddhist";

export type Lens = {
  key: LensKey;
  name: string;
  tagline: string;
  tradition: string;
};

export const LENSES: Lens[] = [
  {
    key: "cbt",
    name: "Cognitive",
    tagline: "Spot the distortion. Try a truer sentence.",
    tradition: "CBT · Beck / Burns",
  },
  {
    key: "act",
    name: "Defusion",
    tagline: "The thought is a passenger, not the driver.",
    tradition: "ACT · Hayes",
  },
  {
    key: "nvc",
    name: "Needs",
    tagline: "Underneath the sharp voice: a feeling, a need, a request.",
    tradition: "NVC · Rosenberg",
  },
  {
    key: "compassion",
    name: "Compassion",
    tagline: "Kind mirror · shared humanity · self-kindness.",
    tradition: "Self-Compassion · Neff",
  },
  {
    key: "stoic",
    name: "Stoic",
    tagline: "What is mine to control? What is not?",
    tradition: "Stoicism · Aurelius / Epictetus",
  },
  {
    key: "buddhist",
    name: "Non-attachment",
    tagline: "What am I clinging to? What can I let pass through?",
    tradition: "Buddhism · Anapanasati / Thich Nhat Hanh",
  },
];

export type LensResult = {
  lens: LensKey;
  headline: string;
  lines: string[];
  practice: string;
};

type Ctx = {
  thought: string;
  feeling: string;
  need: string;
  distortions: Distortion[];
};

export function renderLens(key: LensKey, ctx: Ctx): LensResult {
  switch (key) {
    case "cbt":
      return cbt(ctx);
    case "act":
      return act(ctx);
    case "nvc":
      return nvc(ctx);
    case "compassion":
      return compassion(ctx);
    case "stoic":
      return stoic(ctx);
    case "buddhist":
      return buddhist(ctx);
  }
}

function cbt(ctx: Ctx): LensResult {
  const dNames = ctx.distortions.map((d) => d.name);
  const spotted = dNames.length
    ? `I notice: ${dNames.join(", ")}.`
    : "This thought is loud, but not necessarily true.";
  const truer = truerSentence(ctx);
  return {
    lens: "cbt",
    headline: "Try a truer sentence.",
    lines: [
      spotted,
      `Evidence for it: __________`,
      `Evidence against it: __________`,
      `A truer, kinder sentence: "${truer}"`,
    ],
    practice:
      "Write both columns. The thought does not have to disappear — it has to lose the last word.",
  };
}

function act(ctx: Ctx): LensResult {
  const t = ctx.thought.replace(/^["'“”]|["'“”]$/g, "");
  return {
    lens: "act",
    headline: "You are the sky. The thought is weather.",
    lines: [
      `Notice: "I'm having the thought that ${lowerFirst(t)}"`,
      `Now: "I notice I'm having the thought that ${lowerFirst(t)}"`,
      `Ask: does this thought move me toward my values, or away from them?`,
      `Choose one small values-aligned action for the next hour.`,
    ],
    practice:
      "You don't have to argue with the thought. You just have to stop letting it drive.",
  };
}

function nvc(ctx: Ctx): LensResult {
  const feeling = ctx.feeling.trim() || "tender and stretched";
  const need = ctx.need.trim() || "kindness, patience, and to be with myself as I am";
  return {
    lens: "nvc",
    headline: "Observation → Feeling → Need → Request.",
    lines: [
      `When I notice: "${ctx.thought}"`,
      `I feel: ${feeling}.`,
      `Because I am needing: ${need}.`,
      `A small request I can make of myself: __________`,
    ],
    practice:
      "Blame points outward; needs point home. Speak the need, not the accusation.",
  };
}

function compassion(_: Ctx): LensResult {
  return {
    lens: "compassion",
    headline: "The three-part Kind Mirror.",
    lines: [
      "Kind Mirror — this is a moment of suffering.",
      "Shared humanity — suffering is part of being human. I am not alone in this.",
      "Self-kindness — may I be kind to myself in this moment.",
    ],
    practice:
      "Say it slowly. Once for yourself. Once for someone else quietly holding the same shape.",
  };
}

function stoic(ctx: Ctx): LensResult {
  return {
    lens: "stoic",
    headline: "Sort by what is yours.",
    lines: [
      `What here is up to me: my attention, my next action, my response.`,
      `What here is not up to me: outcomes, others' opinions, the past.`,
      `The thought "${trim(ctx.thought, 90)}" is often about the second column.`,
      `Return to the first. Choose one virtue: courage · justice · wisdom · temperance.`,
    ],
    practice:
      "‘Some things are up to us and some are not.' — Epictetus. Sort. Then act on what is.",
  };
}

function buddhist(ctx: Ctx): LensResult {
  const clinging = ctx.thought.trim();
  return {
    lens: "buddhist",
    headline: "What am I clinging to?",
    lines: [
      `Grasping: what do I want that isn't here?`,
      `Aversion: what is here that I don't want?`,
      `Notice the thought: "${trim(clinging, 90)}" — is this me, or is this passing weather?`,
      `Inhale, I know I am breathing in. Exhale, I know I am breathing out.`,
    ],
    practice:
      "This too is impermanent. Softening around it is not defeat — it is contact with what is.",
  };
}

function truerSentence({ thought, distortions }: Ctx): string {
  const keys = new Set(distortions.map((d) => d.key));
  if (keys.has("all-or-nothing"))
    return "Sometimes this happens. Not always. Not everyone. Not everything.";
  if (keys.has("catastrophizing"))
    return "This is hard. It is not the end of me. I have handled hard before.";
  if (keys.has("labeling"))
    return "I did a hard thing imperfectly. That does not make me the label my fear reached for.";
  if (keys.has("should"))
    return "I would prefer this were different. And I can choose from care, not pressure.";
  if (keys.has("mind-reading"))
    return "I don't actually know what they think. I can act on what I know, and ask if I need to.";
  if (keys.has("fortune-telling"))
    return "I don't know the future. I know I can take one steady next step.";
  if (keys.has("personalizing"))
    return "Some of this is mine. Not all of it is. I can hold my part with honesty.";
  if (keys.has("helplessness"))
    return "I feel stuck. Stuck is a feeling, not a fact. One small next step is available.";
  if (keys.has("discounting-positive"))
    return "It counts. It counts even if it was small. It counts even if I was afraid.";
  if (keys.has("emotional-reasoning"))
    return "The feeling is real. That does not make the story true.";
  return trim(thought, 120);
}

function lowerFirst(s: string): string {
  if (!s) return s;
  return s[0].toLowerCase() + s.slice(1);
}

function trim(s: string, n: number): string {
  s = s.trim();
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
