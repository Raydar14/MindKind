"use client";

import Link from "next/link";
import { useState } from "react";
import { DIAL_STATES, getMicroDose, STATE_TO_DOSE } from "@/lib/microdoses";

export default function DialPage() {
  const [state, setState] = useState<string | null>(null);
  const doseId = state ? STATE_TO_DOSE[state] : null;
  const dose = doseId ? getMicroDose(doseId) : null;

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Nervous System Dial</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Where are you right now?
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          No wrong answer. Pick the word closest to your body. The dial picks a
          practice that fits.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DIAL_STATES.map((s) => {
          const active = state === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setState(String(s.key))}
              className={`rounded-2xl border p-5 text-left transition ${
                active
                  ? "border-moss-400/60 bg-moss-500/10 shadow-[0_0_40px_-10px_rgba(154,181,162,0.5)]"
                  : "border-white/5 bg-ink-800/60 hover:border-white/15 hover:bg-ink-800/90"
              }`}
            >
              <p
                className={`font-serif text-xl ${
                  active ? "text-moss-300" : "text-sand-200"
                }`}
              >
                {s.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-sand-300/70">
                {s.hint}
              </p>
            </button>
          );
        })}
      </section>

      {dose && (
        <section className="surface p-6 sm:p-8">
          <p className="chip">Suggested Micro-Dose</p>
          <h2 className="mt-4 font-serif text-2xl text-sand-200">
            {dose.name}
          </h2>
          <p className="mt-2 text-sm text-sand-300/70">
            {Math.round(dose.duration / 60)} min · {dose.skill}
          </p>
          <p className="mt-4 text-sand-300/90">{dose.anchor}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/micro/${dose.id}`} className="btn-primary">
              Begin →
            </Link>
            <Link href="/micro" className="btn-quiet">
              Browse all doses
            </Link>
          </div>
        </section>
      )}

      {!dose && (
        <section className="surface-quiet p-6 sm:p-8">
          <p className="text-sand-300/80">
            Or{" "}
            <Link href="/micro" className="text-moss-300 underline">
              browse the full Micro-Dose menu
            </Link>{" "}
            and choose your own.
          </p>
        </section>
      )}
    </div>
  );
}
