"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SENSES, SKILLS, TARGETS, type Sense, type Target } from "@/lib/skills";
import { saveTouchstone } from "@/lib/storage";

export default function SkillsPage() {
  const [senseFilter, setSenseFilter] = useState<Sense | null>(null);
  const [targetFilter, setTargetFilter] = useState<Target | null>(null);
  const [idx, setIdx] = useState(0);

  const filtered = useMemo(() => {
    const list = SKILLS.filter(
      (s) =>
        (!senseFilter || s.sense === senseFilter) &&
        (!targetFilter || s.target === targetFilter),
    );
    return shuffleStable(list);
  }, [senseFilter, targetFilter]);

  const card = filtered[idx % Math.max(1, filtered.length)];

  function next() {
    setIdx((i) => i + 1);
  }
  function save() {
    if (!card) return;
    saveTouchstone({
      kind: "moment",
      title: card.title,
      body: card.body,
      meta: {
        kind: "coping",
        sense: card.sense,
        target: card.target,
      },
    });
    next();
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Coping Swipe Deck</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Pick one small thing.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Sensory, playful, unconventional. Not to feel better in a big way —
          to feel here in a small one.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <FilterRow
          label="By sense"
          items={SENSES}
          value={senseFilter}
          onChange={(k) => {
            setSenseFilter(k);
            setIdx(0);
          }}
        />
        <FilterRow
          label="By what I need"
          items={TARGETS}
          value={targetFilter}
          onChange={(k) => {
            setTargetFilter(k);
            setIdx(0);
          }}
        />
      </section>

      <section className="surface relative min-h-[16rem] p-8 sm:p-12">
        {card ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sand-300/60">
              <span>{card.sense}</span>
              <span>·</span>
              <span>{card.target}</span>
            </div>
            <h2 className="font-serif text-3xl leading-tight text-sand-200 sm:text-4xl">
              {card.title}
            </h2>
            <p className="text-lg leading-relaxed text-sand-300/90">
              {card.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={save} className="btn-primary">
                I'll try it — log
              </button>
              <button type="button" onClick={next} className="btn-quiet">
                Skip →
              </button>
              <Link href="/dial" className="btn-quiet">
                Not this — take the Dial
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sand-300/70">
            No matches. Try clearing a filter.
          </p>
        )}
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">Why unconventional</p>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          The clever brain has already tried its usual solutions. The senses
          haven't. Play, warmth, sourness, cold, and rhythm are older than
          reasoning — they can move you when logic can't.
        </p>
      </section>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: Array<{ key: T; label: string }>;
  value: T | null;
  onChange: (k: T | null) => void;
}) {
  return (
    <div className="surface-quiet p-4">
      <p className="text-xs uppercase tracking-widest text-sand-300/60">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            value === null
              ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
              : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
          }`}
        >
          Any
        </button>
        {items.map((it) => {
          const active = value === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(active ? null : it.key)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                  : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Deterministic stable shuffle — same order per filter set, per session.
function shuffleStable<T extends { id: string }>(arr: T[]): T[] {
  const withKey = arr.map((x) => ({ x, k: hash(x.id) }));
  withKey.sort((a, b) => a.k - b.k);
  return withKey.map((w) => w.x);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0;
  return h;
}
