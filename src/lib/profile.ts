"use client";

export const VALUES = [
  { key: "calm", label: "Calm", body: "A steady body under pressure." },
  { key: "honesty", label: "Honesty", body: "Say what is, kindly." },
  { key: "kindness", label: "Kindness", body: "To self and to others, without erasing either." },
  { key: "courage", label: "Courage", body: "Move toward what matters, afraid or not." },
  { key: "presence", label: "Presence", body: "This moment, without the future's static." },
  { key: "autonomy", label: "Autonomy", body: "Choose from care, not pressure." },
  { key: "connection", label: "Connection", body: "Bridges without losing self." },
  { key: "creativity", label: "Creativity", body: "Make something. It counts." },
  { key: "curiosity", label: "Curiosity", body: "Meet the mind with interest, not verdict." },
  { key: "boundaried", label: "Boundaried", body: "‘No' as protection of a need." },
  { key: "rest", label: "Rest", body: "Recovery as legitimate work." },
  { key: "growth", label: "Growth", body: "Uncomfortable is part of range-building." },
] as const;

export type ValueKey = (typeof VALUES)[number]["key"];

export const IDENTITY_TEMPLATES = [
  "I am becoming someone who is {value}.",
  "I am learning to act from {value}.",
  "I trust myself to choose {value} today.",
  "I am practicing {value} under pressure.",
];

export type Profile = {
  values: ValueKey[]; // up to 3
  identity: string;
  createdAt: number;
};

const KEY = "mindkind:profile:v1";

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.identity || !Array.isArray(parsed?.values)) return null;
    return parsed as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function valueLabel(k: ValueKey): string {
  return VALUES.find((v) => v.key === k)?.label ?? String(k);
}
