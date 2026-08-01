"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MicroDose } from "@/lib/microdoses";
import { saveTouchstone } from "@/lib/storage";

type Phase = "idle" | "running" | "done";

export default function MicroDoseRunner({ dose }: { dose: MicroDose }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [logged, setLogged] = useState(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    startedAt.current = Date.now();
    const id = window.setInterval(() => {
      const started = startedAt.current ?? Date.now();
      const secs = Math.floor((Date.now() - started) / 1000);
      setElapsed(secs);
      if (secs >= dose.duration) {
        setPhase("done");
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, dose.duration]);

  const stepIndex = Math.min(
    dose.steps.length - 1,
    Math.floor((elapsed / dose.duration) * dose.steps.length),
  );

  function logDose() {
    saveTouchstone({
      kind: "dose",
      title: dose.name,
      body: dose.closing,
      meta: { skill: dose.skill, duration: String(dose.duration) },
    });
    setLogged(true);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">{Math.round(dose.duration / 60) || 1} min · {dose.skill}</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          {dose.name}
        </h1>
        <p className="mt-3 text-sand-300/80">{dose.anchor}</p>
      </header>

      <section className="surface relative flex flex-col items-center overflow-hidden p-8 sm:p-12">
        <BreathOrb phase={phase} />

        <div className="mt-8 min-h-[3.5rem] max-w-xl text-center font-serif text-xl leading-relaxed text-sand-200">
          {phase === "idle" && (
            <p className="text-sand-300/80">
              When you're ready, press begin. Let the words meet you.
            </p>
          )}
          {phase === "running" && <p>{dose.steps[stepIndex]}</p>}
          {phase === "done" && <p className="italic">“{dose.closing}”</p>}
        </div>

        <div className="mt-8 text-sm tabular-nums text-sand-300/60">
          {formatSecs(Math.min(elapsed, dose.duration))} / {formatSecs(dose.duration)}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {phase === "idle" && (
            <button
              type="button"
              onClick={() => setPhase("running")}
              className="btn-primary"
            >
              Begin
            </button>
          )}
          {phase === "running" && (
            <button
              type="button"
              onClick={() => setPhase("done")}
              className="btn-quiet"
            >
              End early — kindly
            </button>
          )}
          {phase === "done" && (
            <>
              <button
                type="button"
                onClick={logDose}
                disabled={logged}
                className="btn-primary disabled:opacity-60"
              >
                {logged ? "Logged ✓" : "Log this moment"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  setElapsed(0);
                  setLogged(false);
                }}
                className="btn-quiet"
              >
                Again
              </button>
              <Link href="/dial" className="btn-quiet">
                Back to dial
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-sand-300/60">
          The full sequence
        </p>
        <ol className="mt-4 space-y-2 text-sand-300/90">
          {dose.steps.map((s, i) => (
            <li key={s} className="leading-relaxed">
              <span className="font-serif text-moss-300">{i + 1}.</span> {s}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function BreathOrb({ phase }: { phase: Phase }) {
  const state = phase === "running" ? "animate-breathe" : "";
  return (
    <div
      className={`relative flex h-40 w-40 items-center justify-center ${state}`}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-moss-400/40 via-dusk-400/30 to-petal-400/30 blur-2xl" />
      <div className="relative h-24 w-24 rounded-full border border-white/20 bg-ink-900/60 shadow-[0_0_60px_-10px_rgba(154,181,162,0.6)]" />
    </div>
  );
}

function formatSecs(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
