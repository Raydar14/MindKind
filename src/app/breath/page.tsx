"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveTouchstone } from "@/lib/storage";

type Pattern = {
  key: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdOut: number;
  purpose: string;
};

const PATTERNS: Pattern[] = [
  {
    key: "vagus",
    name: "4-in · 8-out",
    inhale: 4,
    hold: 0,
    exhale: 8,
    holdOut: 0,
    purpose:
      "Extended exhale — nudges parasympathetic activation. Good when the body is over-activated.",
  },
  {
    key: "box",
    name: "Box breath",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdOut: 4,
    purpose:
      "Even, square, steady. Good for focus and for a scattered mind.",
  },
  {
    key: "coherent",
    name: "Coherent 5.5",
    inhale: 5,
    hold: 0,
    exhale: 5,
    holdOut: 0,
    purpose:
      "Rhythmic, matched in and out — associated with heart-rate variability entrainment.",
  },
  {
    key: "physio-sigh",
    name: "Physiological sigh",
    inhale: 3,
    hold: 1,
    exhale: 6,
    holdOut: 0,
    purpose:
      "A short second inhale on top of the first, then a long exhale. Useful for a quick calm-down.",
  },
];

type Phase = "in" | "hold" | "out" | "holdOut";

const TEXTURES = [
  "smooth", "grainy", "wide", "tight", "warm", "cool", "shallow",
  "deep", "shaky", "steady", "quiet", "loud", "distant", "close",
];

export default function BreathPage() {
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("in");
  const [phaseSec, setPhaseSec] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [target, setTarget] = useState(6);
  const [texture, setTexture] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const phaseRef = useRef<Phase>("in");
  const phaseStartRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    phaseRef.current = "in";
    phaseStartRef.current = Date.now();
    setPhase("in");
    setPhaseSec(0);

    const id = window.setInterval(() => {
      const elapsed = (Date.now() - phaseStartRef.current) / 1000;
      const phaseLen = lenFor(pattern, phaseRef.current);
      if (elapsed >= phaseLen) {
        const nextPhase = nextPhaseFor(pattern, phaseRef.current);
        phaseRef.current = nextPhase;
        phaseStartRef.current = Date.now();
        setPhase(nextPhase);
        setPhaseSec(0);
        if (nextPhase === "in") {
          setRounds((r) => {
            const next = r + 1;
            if (next >= target) {
              window.clearInterval(id);
              setRunning(false);
            }
            return next;
          });
        }
      } else {
        setPhaseSec(Math.floor(elapsed));
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pattern, target]);

  function toggleTexture(t: string) {
    setTexture((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function save() {
    saveTouchstone({
      kind: "dose",
      title: `Breath: ${pattern.name} × ${rounds || target} rounds`,
      body: [
        texture.length > 0 ? `Texture: ${texture.join(", ")}` : null,
        note || null,
      ]
        .filter(Boolean)
        .join("\n"),
      meta: {
        kind: "breath",
        pattern: pattern.key,
        rounds: String(rounds || target),
      },
    });
    setSaved(true);
  }

  const orbScale =
    phase === "in"
      ? 0.6 + (0.7 * phaseSec) / Math.max(1, pattern.inhale)
      : phase === "hold"
      ? 1.3
      : phase === "out"
      ? 1.3 - (0.7 * phaseSec) / Math.max(1, pattern.exhale)
      : 0.6;

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Mindful Breathing · Anapanasati</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Breathe, and notice.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Not to fix — to feel. Follow the shape of the breath and the texture
          around it. When your attention leaves, come back kindly.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {PATTERNS.map((p) => {
          const active = p.key === pattern.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setPattern(p)}
              disabled={running}
              className={`rounded-2xl border p-5 text-left transition ${
                active
                  ? "border-moss-400/60 bg-moss-500/10"
                  : "border-white/5 bg-ink-800/60 hover:border-white/15 hover:bg-ink-800/90"
              } disabled:opacity-60`}
            >
              <p className="font-serif text-xl text-sand-200">{p.name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-sand-300/60">
                {p.inhale}s in {p.hold ? `· ${p.hold}s hold ` : ""}·{" "}
                {p.exhale}s out {p.holdOut ? `· ${p.holdOut}s hold` : ""}
              </p>
              <p className="mt-2 text-sm text-sand-300/70">{p.purpose}</p>
            </button>
          );
        })}
      </section>

      <section className="surface flex flex-col items-center gap-6 p-8 sm:p-12">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <div
            aria-hidden
            className="absolute rounded-full bg-gradient-to-br from-moss-400/50 via-dusk-400/40 to-petal-400/40 blur-xl transition-transform duration-1000"
            style={{
              width: "80%",
              height: "80%",
              transform: `scale(${orbScale.toFixed(3)})`,
            }}
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 text-sm uppercase tracking-widest text-sand-200">
            {phaseLabel(phase)}
          </div>
        </div>

        <p className="font-mono text-xs text-sand-300/60">
          round {rounds} / {target}
        </p>

        {!running && (
          <div className="flex items-center gap-2 text-xs text-sand-300/70">
            <label>rounds</label>
            <input
              type="number"
              min={1}
              max={40}
              value={target}
              onChange={(e) =>
                setTarget(Math.max(1, Math.min(40, Number(e.target.value) || 1)))
              }
              className="w-16 rounded-md border border-white/10 bg-ink-900/80 px-2 py-1 text-sand-200 outline-none focus:border-moss-500/60"
            />
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={() => {
                setRounds(0);
                setSaved(false);
                setRunning(true);
              }}
              className="btn-primary"
            >
              Begin →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRunning(false)}
              className="btn-quiet"
            >
              End early — kindly
            </button>
          )}
        </div>
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">Texture — what did the breath feel like?</p>
        <p className="mt-2 text-sm text-sand-300/70">
          More useful than "good/bad." Tap what fits, in any combination.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TEXTURES.map((t) => {
            const active = texture.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTexture(t)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  active
                    ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                    : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="One line about what you noticed (optional)."
          className="mt-4 w-full resize-none rounded-lg border border-white/10 bg-ink-900/80 p-3 text-sand-200 outline-none focus:border-moss-500/60"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saved}
            className="btn-primary disabled:opacity-60"
          >
            {saved ? "Logged ✓" : "Log this sit"}
          </button>
          <Link href="/log" className="btn-quiet">
            See log
          </Link>
        </div>
      </section>
    </div>
  );
}

function lenFor(p: Pattern, phase: Phase): number {
  return phase === "in"
    ? p.inhale
    : phase === "hold"
    ? p.hold
    : phase === "out"
    ? p.exhale
    : p.holdOut;
}

function nextPhaseFor(p: Pattern, phase: Phase): Phase {
  const order: Phase[] = ["in", "hold", "out", "holdOut"];
  const i = order.indexOf(phase);
  for (let step = 1; step <= 4; step++) {
    const next = order[(i + step) % 4];
    if (lenFor(p, next) > 0) return next;
  }
  return "in";
}

function phaseLabel(p: Phase): string {
  return p === "in"
    ? "in"
    : p === "hold"
    ? "hold"
    : p === "out"
    ? "out"
    : "still";
}
