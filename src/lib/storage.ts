"use client";

export type TouchstoneKind = "reframe" | "moment" | "dose";

export type Touchstone = {
  id: string;
  kind: TouchstoneKind;
  createdAt: number;
  title: string;
  body?: string;
  meta?: Record<string, string>;
};

const KEY = "mindkind:log:v1";

export function loadLog(): Touchstone[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Touchstone[];
  } catch {
    return [];
  }
}

export function saveTouchstone(t: Omit<Touchstone, "id" | "createdAt">): Touchstone {
  const entry: Touchstone = {
    id: cryptoId(),
    createdAt: Date.now(),
    ...t,
  };
  const all = loadLog();
  all.unshift(entry);
  window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 500)));
  return entry;
}

export function deleteTouchstone(id: string) {
  const next = loadLog().filter((t) => t.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearLog() {
  window.localStorage.removeItem(KEY);
}

function cryptoId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && "randomUUID" in c) return c.randomUUID();
  return `t_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
