export type FeelingState =
  | "panic"
  | "anxious"
  | "numb"
  | "overwhelmed"
  | "angry"
  | "grief"
  | "ruminating"
  | "shame"
  | "exhausted"
  | "activated"
  | "curious"
  | "unclear";

export const STATE_LABELS: Array<{ key: FeelingState; label: string; hint: string }> = [
  { key: "panic", label: "Panic", hint: "heart pounding, can't catch breath" },
  { key: "anxious", label: "Anxious", hint: "looping worry, chest fluttering" },
  { key: "numb", label: "Numb", hint: "flat, faded, far from the body" },
  { key: "overwhelmed", label: "Overwhelmed", hint: "too much, too fast, can't sort" },
  { key: "angry", label: "Angry", hint: "hot, protective, pressure building" },
  { key: "grief", label: "Grief", hint: "loss, heaviness, tears near the surface" },
  { key: "ruminating", label: "Stuck in a loop", hint: "same thought again and again" },
  { key: "shame", label: "Shame", hint: "wanting to disappear, ‘I am bad'" },
  { key: "exhausted", label: "Exhausted", hint: "depleted, dark, done" },
  { key: "activated", label: "Activated / triggered", hint: "old fear or old fight woke up" },
  { key: "curious", label: "Curious", hint: "resourced, wanting to understand" },
];

const URGENCY_PATTERNS: RegExp[] = [
  /\b(kill(ing)? myself|end (it|my life)|suicid(e|al)|want to die|don'?t want to (live|be here)|take my (own )?life)\b/i,
  /\b(hurt myself|self[- ]?harm|cut(ting)? myself)\b/i,
  /\b(hurt (him|her|them|someone)|kill (him|her|them)|attack (him|her|them))\b/i,
  /\b(voices? (are )?(telling|saying)|command(ing)? me to|hear voices)\b/i,
  /\b(overdose|took (too many|a bunch of) (pills|meds))\b/i,
  /\b(can'?t breathe (right|at all)|passing out|about to pass out)\b/i,
  /\b(being (attacked|abused|hit|hurt) right now|he'?s here|she'?s here) and\b/i,
];

export function detectUrgency(text: string): boolean {
  return URGENCY_PATTERNS.some((r) => r.test(text));
}

export type ConvoTurn = {
  role: "user" | "assistant";
  content: string;
  at: number;
  state?: FeelingState;
};

const KEY = "mindkind:companion:v1";
const MAX_TURNS = 40;

export function loadConvo(): ConvoTurn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ConvoTurn[]) : [];
  } catch {
    return [];
  }
}

export function saveConvo(turns: ConvoTurn[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    KEY,
    JSON.stringify(turns.slice(-MAX_TURNS)),
  );
}

export function clearConvo() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
