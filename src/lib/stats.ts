"use client";

import { loadLog, type Touchstone } from "./storage";

export type WeeklyStats = {
  totalDays: number;
  activeDays: number;
  cRating: number; // 0..1
  totalEntries: number;
  byKind: Record<Touchstone["kind"], number>;
  streakForward: number;
  latest: Touchstone | null;
};

const DAY = 24 * 60 * 60 * 1000;

export function weeklyStats(): WeeklyStats {
  const log = loadLog();
  const now = Date.now();
  const cutoff = now - 7 * DAY;
  const recent = log.filter((t) => t.createdAt >= cutoff);

  const days = new Set<string>();
  for (const t of recent) {
    days.add(new Date(t.createdAt).toDateString());
  }

  const byKind: Record<Touchstone["kind"], number> = {
    reframe: 0,
    moment: 0,
    dose: 0,
  };
  for (const t of recent) byKind[t.kind] = (byKind[t.kind] ?? 0) + 1;

  // Consecutive active days ending today, walking backwards.
  let streak = 0;
  const bucket = new Set<string>();
  for (const t of log) bucket.add(new Date(t.createdAt).toDateString());
  for (let i = 0; i < 60; i++) {
    const d = new Date(now - i * DAY).toDateString();
    if (bucket.has(d)) streak++;
    else if (i === 0) continue;
    else break;
  }

  return {
    totalDays: 7,
    activeDays: days.size,
    cRating: days.size / 7,
    totalEntries: recent.length,
    byKind,
    streakForward: streak,
    latest: log[0] ?? null,
  };
}

export function suggestion(): {
  href: string;
  label: string;
  reason: string;
} {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay();
  // Sunday evening → review
  if (day === 0 && h >= 17)
    return {
      href: "/review",
      label: "Weekly review",
      reason: "Sunday. A quiet look at the week — a signal, not a grade.",
    };
  if (h < 10)
    return {
      href: "/rituals/morning-anchor",
      label: "Morning anchor",
      reason: "Begin from steadiness, not urgency.",
    };
  if (h < 14)
    return {
      href: "/breath",
      label: "Breathing Dojo",
      reason: "Midday. Breathe, and notice the texture.",
    };
  if (h < 18)
    return {
      href: "/focus",
      label: "ON the Clock",
      reason: "One focused block. Not alone at the desk.",
    };
  if (h < 21)
    return {
      href: "/companion",
      label: "Talk with the Companion",
      reason: "End of day — one thing to notice, name, and set down.",
    };
  return {
    href: "/micro/kind-mirror",
    label: "Kind Mirror",
    reason: "Close the day with self-kindness, not review.",
  };
}
