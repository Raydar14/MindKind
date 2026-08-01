"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadRituals, totalDuration, type Ritual } from "@/lib/rituals";

export default function RitualsIndex() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  useEffect(() => {
    setRituals(loadRituals());
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Ritual Builder</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Sacred rhythm, gently designed.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Compose your own openings, resets, and repairs. Breath · body · sense ·
          affirmation · journal · silence — in whatever order meets you.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link href="/rituals/new" className="btn-primary">
          Design a new ritual →
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {rituals.map((r) => (
          <li key={r.id}>
            <div className="surface flex h-full flex-col p-6">
              <p className="chip w-fit">
                {r.blocks.length} blocks · {Math.round(totalDuration(r) / 60) || 1} min
              </p>
              <h2 className="mt-4 font-serif text-2xl text-sand-200">{r.name}</h2>
              <p className="mt-2 font-serif italic text-sand-300/80">
                “{r.intent}”
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {r.blocks.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sand-300"
                  >
                    {b.label}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link href={`/rituals/${r.id}`} className="btn-primary">
                  Begin →
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
