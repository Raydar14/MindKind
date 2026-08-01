"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRitual, totalDuration, type Ritual } from "@/lib/rituals";
import { saveTouchstone } from "@/lib/storage";

type Phase = "idle" | "running" | "done";

export default function RunRitualPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [blockIdx, setBlockIdx] = useState(0);
  const [blockElapsed, setBlockElapsed] = useState(0);
  const [logged, setLogged] = useState(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const r = getRitual(String(params.id));
    if (!r) router.replace("/rituals");
    else setRitual(r);
  }, [params, router]);

  const currentBlock = ritual?.blocks[blockIdx];

  useEffect(() => {
    if (phase !== "running" || !currentBlock) return;
    startedAt.current = Date.now();
    const id = window.setInterval(() => {
      const started = startedAt.current ?? Date.now();
      const secs = Math.floor((Date.now() - started) / 1000);
      setBlockElapsed(secs);
      if (secs >= currentBlock.duration) {
        window.clearInterval(id);
        advance();
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, blockIdx, currentBlock]);

  function advance() {
    if (!ritual) return;
    if (blockIdx >= ritual.blocks.length - 1) {
      setPhase("done");
    } else {
      setBlockIdx((i) => i + 1);
      setBlockElapsed(0);
    }
  }

  function begin() {
    setBlockIdx(0);
    setBlockElapsed(0);
    setPhase("running");
    setLogged(false);
  }

  function skip() {
    advance();
  }

  function logRitual() {
    if (!ritual) return;
    saveTouchstone({
      kind: "dose",
      title: `Ritual: ${ritual.name}`,
      body: ritual.intent,
      meta: {
        kind: "ritual",
        blocks: ritual.blocks.map((b) => b.label).join(" · "),
        duration: String(totalDuration(ritual)),
      },
    });
    setLogged(true);
  }

  if (!ritual) return null;

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">
          {ritual.blocks.length} blocks ·{" "}
          {Math.round(totalDuration(ritual) / 60) || 1} min
        </p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          {ritual.name}
        </h1>
        <p className="mt-3 font-serif italic text-sand-300/80">
          “{ritual.intent}”
        </p>
      </header>

      <section className="surface flex flex-col items-center gap-6 p-8 sm:p-12">
        {phase === "idle" && (
          <>
            <p className="max-w-md text-center text-sand-300/80">
              When you're ready, press begin. The blocks will move you through
              gently — you can skip any time.
            </p>
            <button type="button" onClick={begin} className="btn-primary">
              Begin →
            </button>
          </>
        )}

        {phase === "running" && currentBlock && (
          <>
            <p className="text-xs uppercase tracking-widest text-sand-300/60">
              Block {blockIdx + 1} of {ritual.blocks.length} · {currentBlock.label}
            </p>
            <div
              aria-hidden
              className="animate-breathe h-28 w-28 rounded-full bg-gradient-to-br from-moss-400/50 via-dusk-400/40 to-petal-400/40 blur-xl"
            />
            <p className="max-w-md text-center font-serif text-2xl leading-relaxed text-sand-200">
              {currentBlock.cue}
            </p>
            <p className="text-sm tabular-nums text-sand-300/60">
              {formatSecs(Math.min(blockElapsed, currentBlock.duration))} /{" "}
              {formatSecs(currentBlock.duration)}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={skip} className="btn-quiet">
                Next block →
              </button>
              <button
                type="button"
                onClick={() => setPhase("done")}
                className="btn-quiet"
              >
                End early — kindly
              </button>
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <p className="font-serif text-2xl italic text-sand-200">
              You moved through it. Look at you go.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={logRitual}
                disabled={logged}
                className="btn-primary disabled:opacity-60"
              >
                {logged ? "Logged ✓" : "Log this ritual"}
              </button>
              <button type="button" onClick={begin} className="btn-quiet">
                Again
              </button>
              <Link href="/rituals" className="btn-quiet">
                All rituals
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-sand-300/60">
          The full sequence
        </p>
        <ol className="mt-4 space-y-3">
          {ritual.blocks.map((b, i) => {
            const active = i === blockIdx && phase === "running";
            return (
              <li
                key={b.id + i}
                className={`rounded-xl border p-4 transition ${
                  active
                    ? "border-moss-400/60 bg-moss-500/10"
                    : "border-white/5 bg-ink-900/50"
                }`}
              >
                <p className="text-xs uppercase tracking-widest text-sand-300/60">
                  {b.kind} · {formatSecs(b.duration)}
                </p>
                <p className="mt-1 font-serif text-lg text-sand-200">{b.label}</p>
                <p className="mt-1 text-sm text-sand-300/80">{b.cue}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function formatSecs(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
