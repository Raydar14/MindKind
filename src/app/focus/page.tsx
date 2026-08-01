"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveTouchstone } from "@/lib/storage";

type Phase = "idle" | "running" | "paused" | "done";

const PRESETS = [
  { label: "10 min", seconds: 10 * 60 },
  { label: "25 min", seconds: 25 * 60 },
  { label: "50 min", seconds: 50 * 60 },
  { label: "90 min", seconds: 90 * 60 },
];

const CUES = [
  "Long exhale. Soft shoulders.",
  "Feet on the floor.",
  "Unclench the jaw.",
  "One breath. Then the next line of work.",
  "Notice the sit. Return to the task.",
];

export default function FocusPage() {
  const [target, setTarget] = useState(25 * 60);
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [intent, setIntent] = useState("");
  const [cue, setCue] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const startedAt = useRef<number | null>(null);
  const pausedAcc = useRef(0);
  const pauseStart = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    if (startedAt.current == null) startedAt.current = Date.now();
    const id = window.setInterval(() => {
      const started = startedAt.current ?? Date.now();
      const secs = Math.floor(
        (Date.now() - started - pausedAcc.current) / 1000,
      );
      setElapsed(secs);
      if (secs >= target) {
        setPhase("done");
        window.clearInterval(id);
      } else if (secs > 0 && secs % (5 * 60) === 0) {
        setCue(CUES[Math.floor(Math.random() * CUES.length)]);
        window.setTimeout(() => setCue(null), 12_000);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [phase, target]);

  function begin() {
    startedAt.current = Date.now();
    pausedAcc.current = 0;
    pauseStart.current = null;
    setElapsed(0);
    setLogged(false);
    setPhase("running");
  }

  function pause() {
    pauseStart.current = Date.now();
    setPhase("paused");
  }

  function resume() {
    if (pauseStart.current) {
      pausedAcc.current += Date.now() - pauseStart.current;
      pauseStart.current = null;
    }
    setPhase("running");
  }

  function endEarly() {
    setPhase("done");
  }

  function reset() {
    startedAt.current = null;
    pausedAcc.current = 0;
    pauseStart.current = null;
    setElapsed(0);
    setPhase("idle");
    setLogged(false);
    setCue(null);
  }

  function logSession() {
    saveTouchstone({
      kind: "dose",
      title: `ON the Clock — ${formatSecs(elapsed)}`,
      body: intent ? `Intent: ${intent}` : undefined,
      meta: {
        kind: "focus",
        target: String(target),
        completed: String(elapsed),
      },
    });
    setLogged(true);
  }

  const eyeState = useMemo<EyeState>(() => {
    if (phase === "running") return "focused";
    if (phase === "paused") return "sleepy";
    if (phase === "done") return "smiling";
    return "curious";
  }, [phase]);

  const displayed = Math.min(elapsed, target);
  const remaining = Math.max(0, target - displayed);
  const progress = target > 0 ? displayed / target : 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">ON the Clock</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Not alone at the desk.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          The creature works alongside you. It watches without judgment. When
          your attention drifts, come back. You're both here.
        </p>
      </header>

      <section className="surface flex flex-col items-center gap-6 p-6 sm:p-10">
        <Creature state={eyeState} progress={progress} />

        <div className="text-center">
          <p className="font-mono text-5xl tabular-nums text-sand-200 sm:text-6xl">
            {formatSecs(remaining)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-sand-300/60">
            {phase === "idle" && "ready when you are"}
            {phase === "running" && "focus block · in session"}
            {phase === "paused" && "paused · softly"}
            {phase === "done" && "session complete"}
          </p>
        </div>

        {phase === "idle" && (
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-sand-300/60">
                Session length
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.seconds}
                    type="button"
                    onClick={() => setTarget(p.seconds)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      target === p.seconds
                        ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                        : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-sand-300/60">
                Today's intent (optional)
              </label>
              <input
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="e.g. Draft two paragraphs. Kindly."
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
              />
            </div>
          </div>
        )}

        {intent && phase !== "idle" && (
          <p className="max-w-md text-center font-serif italic text-sand-300/80">
            “{intent}”
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {phase === "idle" && (
            <button type="button" onClick={begin} className="btn-primary">
              Begin →
            </button>
          )}
          {phase === "running" && (
            <>
              <button type="button" onClick={pause} className="btn-quiet">
                Pause
              </button>
              <button type="button" onClick={endEarly} className="btn-quiet">
                End early — kindly
              </button>
            </>
          )}
          {phase === "paused" && (
            <>
              <button type="button" onClick={resume} className="btn-primary">
                Resume
              </button>
              <button type="button" onClick={endEarly} className="btn-quiet">
                End here
              </button>
            </>
          )}
          {phase === "done" && (
            <>
              <button
                type="button"
                onClick={logSession}
                disabled={logged}
                className="btn-primary disabled:opacity-60"
              >
                {logged ? "Logged ✓" : "Log this session"}
              </button>
              <button type="button" onClick={reset} className="btn-quiet">
                Another
              </button>
              <Link href="/log" className="btn-quiet">
                See log
              </Link>
            </>
          )}
        </div>

        {cue && (
          <p className="animate-drift text-center font-serif italic text-moss-300">
            “{cue}”
          </p>
        )}
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">Why co-work with a creature</p>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          Working alone is quiet. Sometimes too quiet. A friendly witness turns
          effort into shared presence — a science of body-doubling that reduces
          the friction of starting. The creature isn't grading you. It's here
          because you're here.
        </p>
      </section>
    </div>
  );
}

type EyeState = "curious" | "focused" | "sleepy" | "smiling";

function Creature({ state, progress }: { state: EyeState; progress: number }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 140);
    }, 3800 + Math.floor(Math.random() * 1600));
    return () => window.clearInterval(id);
  }, []);

  const eyeH =
    state === "sleepy" ? 4 : state === "smiling" ? 6 : blink ? 2 : 14;
  const mouth =
    state === "smiling"
      ? "M 44 66 Q 60 76 76 66"
      : state === "focused"
      ? "M 48 68 Q 60 70 72 68"
      : state === "sleepy"
      ? "M 50 70 Q 60 72 70 70"
      : "M 48 68 Q 60 72 72 68";

  const ring = 158 - Math.min(1, Math.max(0, progress)) * 158;

  return (
    <div className="relative flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-drift rounded-full bg-nebula opacity-70 blur-3xl"
      />
      <svg
        viewBox="0 0 120 120"
        className="h-56 w-56 drop-shadow-[0_0_40px_rgba(154,181,162,0.35)] sm:h-64 sm:w-64"
        role="img"
        aria-label="a friendly co-working creature"
      >
        <defs>
          <radialGradient id="body" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3a4055" />
            <stop offset="60%" stopColor="#1a1e28" />
            <stop offset="100%" stopColor="#0d0f14" />
          </radialGradient>
          <radialGradient id="ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(154,181,162,0.0)" />
            <stop offset="90%" stopColor="rgba(154,181,162,0.6)" />
            <stop offset="100%" stopColor="rgba(154,181,162,0.0)" />
          </radialGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="url(#ring)"
          strokeWidth="2"
          strokeDasharray="326"
          strokeDashoffset={ring * 2.06}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
        <ellipse cx="60" cy="62" rx="42" ry="40" fill="url(#body)" />
        <ellipse
          cx="46"
          cy="52"
          rx="9"
          ry={eyeH}
          fill="#efe7d8"
          className="transition-[ry] duration-150"
        />
        <ellipse
          cx="74"
          cy="52"
          rx="9"
          ry={eyeH}
          fill="#efe7d8"
          className="transition-[ry] duration-150"
        />
        <circle cx="46" cy="53" r={Math.max(2, eyeH / 3)} fill="#0d0f14" />
        <circle cx="74" cy="53" r={Math.max(2, eyeH / 3)} fill="#0d0f14" />
        <circle cx="43" cy="50" r="1.4" fill="#efe7d8" opacity="0.9" />
        <circle cx="71" cy="50" r="1.4" fill="#efe7d8" opacity="0.9" />
        <path
          d={mouth}
          stroke="#efe7d8"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

function formatSecs(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
