"use client";

export type BlockKind =
  | "breath"
  | "body"
  | "sense"
  | "affirmation"
  | "journal"
  | "silence";

export type Block = {
  id: string;
  kind: BlockKind;
  label: string;
  duration: number; // seconds
  cue: string;
};

export type Ritual = {
  id: string;
  name: string;
  intent: string;
  blocks: Block[];
  createdAt: number;
};

export const BLOCK_LIBRARY: Array<Omit<Block, "id">> = [
  {
    kind: "breath",
    label: "4-8 breath",
    duration: 90,
    cue: "Inhale 4. Exhale 8. Soft jaw, soft throat.",
  },
  {
    kind: "breath",
    label: "Box breath",
    duration: 120,
    cue: "In 4, hold 4, out 4, hold 4. Slow, square, steady.",
  },
  {
    kind: "body",
    label: "Shake it out",
    duration: 60,
    cue: "Loose knees. Let the arms fall. Shake for a minute.",
  },
  {
    kind: "body",
    label: "Self-hug sway",
    duration: 90,
    cue: "Arms across. Sway gently, side to side.",
  },
  {
    kind: "sense",
    label: "Warm hands",
    duration: 60,
    cue: "Warm water. Or friction. Notice the temperature return.",
  },
  {
    kind: "sense",
    label: "5-4-3-2-1",
    duration: 120,
    cue: "5 see · 4 feel · 3 hear · 2 smell · 1 taste.",
  },
  {
    kind: "affirmation",
    label: "Identity line",
    duration: 45,
    cue: "Today I choose to act as someone who is ______.",
  },
  {
    kind: "affirmation",
    label: "Compassion trio",
    duration: 60,
    cue: "This is a moment of suffering. Suffering is part of being human. May I be kind to myself.",
  },
  {
    kind: "journal",
    label: "One line",
    duration: 90,
    cue: "One sentence: what I noticed. What I needed. What I chose.",
  },
  {
    kind: "journal",
    label: "OFNR draft",
    duration: 180,
    cue: "Observation, Feeling, Need, Request. Rough is fine.",
  },
  {
    kind: "silence",
    label: "Sit with it",
    duration: 60,
    cue: "Nothing to fix. Nothing to add. Just be with.",
  },
];

const KEY = "mindkind:rituals:v1";

export const SEED_RITUALS: Ritual[] = [
  {
    id: "before-hard-talk",
    name: "Before a hard conversation",
    intent: "I speak from care instead of pressure.",
    createdAt: 0,
    blocks: [
      block("breath", "4-8 breath", 90, "Inhale 4. Exhale 8."),
      block(
        "affirmation",
        "Kind mirror",
        60,
        "May I be kind to myself here. May they be kind to themselves too.",
      ),
      block(
        "journal",
        "OFNR draft",
        180,
        "Observation, Feeling, Need, Request. One sentence each.",
      ),
    ],
  },
  {
    id: "after-fight",
    name: "After a fight",
    intent: "I return to myself first. Repair second.",
    createdAt: 0,
    blocks: [
      block("body", "Shake it out", 60, "Loose knees. Let the arms fall."),
      block(
        "sense",
        "5-4-3-2-1",
        120,
        "5 see · 4 feel · 3 hear · 2 smell · 1 taste.",
      ),
      block(
        "affirmation",
        "Compassion trio",
        60,
        "This is a moment of suffering. Suffering is part of being human. May I be kind to myself.",
      ),
      block("silence", "Sit with it", 60, "Nothing to fix. Just be with."),
    ],
  },
  {
    id: "morning-anchor",
    name: "Morning anchor",
    intent: "I begin from steadiness, not from urgency.",
    createdAt: 0,
    blocks: [
      block(
        "breath",
        "Box breath",
        120,
        "In 4, hold 4, out 4, hold 4.",
      ),
      block(
        "affirmation",
        "Identity line",
        45,
        "Today I choose to act as someone who is calm and patient.",
      ),
      block(
        "sense",
        "Warm hands",
        60,
        "Warm water. Notice the temperature return.",
      ),
      block(
        "journal",
        "One line",
        90,
        "What matters most today, softly?",
      ),
    ],
  },
];

function block(
  kind: BlockKind,
  label: string,
  duration: number,
  cue: string,
): Block {
  return {
    id: `${kind}-${label.toLowerCase().replace(/\s+/g, "-")}`,
    kind,
    label,
    duration,
    cue,
  };
}

export function loadRituals(): Ritual[] {
  if (typeof window === "undefined") return SEED_RITUALS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED_RITUALS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_RITUALS;
    return parsed as Ritual[];
  } catch {
    return SEED_RITUALS;
  }
}

export function saveRituals(rituals: Ritual[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(rituals));
}

export function getRitual(id: string): Ritual | undefined {
  return loadRituals().find((r) => r.id === id);
}

export function makeId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && "randomUUID" in c) return c.randomUUID();
  return `r_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function totalDuration(r: Ritual): number {
  return r.blocks.reduce((sum, b) => sum + b.duration, 0);
}
