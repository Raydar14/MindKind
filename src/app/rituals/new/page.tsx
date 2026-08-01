"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BLOCK_LIBRARY,
  loadRituals,
  makeId,
  saveRituals,
  type Block,
  type Ritual,
} from "@/lib/rituals";

export default function NewRitualPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [intent, setIntent] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  function add(b: Omit<Block, "id">) {
    setBlocks((prev) => [
      ...prev,
      { ...b, id: `b_${makeId()}` },
    ]);
  }

  function removeAt(idx: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function save() {
    if (!name.trim() || blocks.length === 0) return;
    const ritual: Ritual = {
      id: makeId(),
      name: name.trim(),
      intent: intent.trim() || "I move through this with care.",
      createdAt: Date.now(),
      blocks,
    };
    const all = loadRituals();
    saveRituals([ritual, ...all]);
    router.push(`/rituals/${ritual.id}`);
  }

  const total = blocks.reduce((s, b) => s + b.duration, 0);
  const canSave = name.trim().length > 0 && blocks.length > 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Design a ritual</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Choose the blocks. Set the intent.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Small pieces, in a sequence that meets you. You can build one for a
          hard morning, an after-fight, a sleep transition — anything.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-sand-300/60">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunday reset"
              className="mt-2 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-sand-300/60">
              Intent
            </label>
            <input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. I begin from steadiness."
              className="mt-2 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="surface p-6 sm:p-8">
          <p className="chip">Your sequence</p>
          {blocks.length === 0 ? (
            <p className="mt-6 text-sand-300/70">
              No blocks yet. Add from the library on the right.
            </p>
          ) : (
            <ol className="mt-6 space-y-3">
              {blocks.map((b, i) => (
                <li
                  key={b.id}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-ink-900/50 p-4"
                >
                  <span className="pt-1 font-serif text-moss-300">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-sand-300/60">
                      {b.kind} · {formatSecs(b.duration)}
                    </p>
                    <p className="font-serif text-lg text-sand-200">{b.label}</p>
                    <p className="text-sm text-sand-300/80">{b.cue}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-sand-300/70">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="rounded px-2 py-1 hover:bg-white/10"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="rounded px-2 py-1 hover:bg-white/10"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="rounded px-2 py-1 hover:bg-white/10 hover:text-petal-400"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-6 flex items-center justify-between text-sm text-sand-300/70">
            <span>
              {blocks.length} blocks · {formatSecs(total)}
            </span>
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className="btn-primary disabled:opacity-40"
            >
              Save ritual →
            </button>
          </div>
        </div>

        <aside className="surface-quiet p-6">
          <p className="chip">Library</p>
          <ul className="mt-4 space-y-2">
            {BLOCK_LIBRARY.map((b, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => add(b)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
                >
                  <p className="text-xs uppercase tracking-widest text-sand-300/60">
                    {b.kind} · {formatSecs(b.duration)}
                  </p>
                  <p className="mt-0.5 font-medium text-sand-200">{b.label}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

function formatSecs(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
