"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATCHER_CUES,
  COMMON_PHRASES,
  COMPASSION_CATCHERS,
  COMPASSION_WORDS,
} from "@/lib/compassion";
import {
  LENSES,
  reframe,
  type LensKey,
  type Reframing,
} from "@/lib/reframe";
import { saveTouchstone } from "@/lib/storage";

const NEED_SUGGESTIONS = [
  "safety", "rest", "kindness", "respect", "choice", "belonging",
  "clarity", "space", "care", "understanding", "connection", "autonomy",
];

const FEELING_SUGGESTIONS = [
  "anxious", "ashamed", "angry", "tender", "tight", "heavy",
  "small", "afraid", "raw", "quiet", "tired", "flat",
];

export default function ReframePage() {
  const [thought, setThought] = useState("");
  const [feeling, setFeeling] = useState("");
  const [need, setNeed] = useState("");
  const [result, setResult] = useState<Reframing | null>(null);
  const [activeLens, setActiveLens] = useState<LensKey>("compassion");
  const [saved, setSaved] = useState(false);

  const canSubmit = thought.trim().length > 0;

  function onReframe() {
    setSaved(false);
    setResult(reframe({ thought, feeling, need }));
  }

  function onSave() {
    if (!result) return;
    const lens = result.lenses.find((l) => l.lens === activeLens);
    saveTouchstone({
      kind: "reframe",
      title: result.observation.slice(0, 140),
      body: lens
        ? `${lens.headline}\n\n${lens.lines.join("\n")}\n\n— ${result.anchorPhrase}`
        : result.anchorPhrase,
      meta: {
        lens: activeLens,
        feeling: result.feeling,
        need: result.need,
        identity: result.identityLine,
        distortions:
          result.distortions.map((d) => d.name).join(", ") || "none tagged",
      },
    });
    setSaved(true);
  }

  const currentLens = result?.lenses.find((l) => l.lens === activeLens);

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Compassion Mirror</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Say the hard thing.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Write it as it lives in your head. The mirror will offer it back in
          six kinder voices — pick the one that meets you today.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <label className="block text-sm text-sand-300/80">The thought</label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          rows={4}
          placeholder="e.g. I always mess things up. I should have known better."
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-ink-900/80 p-4 font-serif text-lg leading-relaxed text-sand-200 outline-none focus:border-moss-500/60"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <FieldWithSuggestions
            label="What am I feeling?"
            value={feeling}
            onChange={setFeeling}
            suggestions={FEELING_SUGGESTIONS}
            placeholder="optional — we'll guess if empty"
          />
          <FieldWithSuggestions
            label="What am I needing?"
            value={need}
            onChange={setNeed}
            suggestions={NEED_SUGGESTIONS}
            placeholder="optional — we'll guess if empty"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onReframe}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reframe →
          </button>
          <button
            type="button"
            onClick={() => {
              setThought("");
              setFeeling("");
              setNeed("");
              setResult(null);
              setSaved(false);
            }}
            className="btn-quiet"
          >
            Clear
          </button>
        </div>
      </section>

      {result && (
        <>
          {result.distortions.length > 0 && (
            <section className="surface-quiet p-6 sm:p-8">
              <p className="chip">Patterns I noticed — gently</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.distortions.map((d) => (
                  <li key={d.key} className="rounded-xl border border-white/5 bg-ink-900/50 p-4">
                    <p className="font-serif text-lg text-sand-200">{d.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-sand-300/70">
                      {d.description}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-sand-300/60">
                Naming a pattern is not accusing yourself. It is meeting the
                mind with curiosity.
              </p>
            </section>
          )}

          <section className="surface p-6 sm:p-8">
            <p className="chip">Choose a voice</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {LENSES.map((l) => {
                const active = l.key === activeLens;
                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setActiveLens(l.key)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                        : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-medium">{l.name}</span>
                    <span className="ml-2 text-xs opacity-70">{l.tradition}</span>
                  </button>
                );
              })}
            </div>

            {currentLens && (
              <div className="mt-8 space-y-6">
                <p className="text-xs uppercase tracking-widest text-sand-300/60">
                  {LENSES.find((l) => l.key === currentLens.lens)?.tagline}
                </p>
                <h2 className="font-serif text-2xl leading-tight text-sand-200 sm:text-3xl">
                  {currentLens.headline}
                </h2>
                <ol className="space-y-3">
                  {currentLens.lines.map((line, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-white/5 bg-ink-900/50 p-4"
                    >
                      <span className="font-serif text-moss-300">{i + 1}.</span>
                      <span className="text-sand-200">{line}</span>
                    </li>
                  ))}
                </ol>
                <p className="font-serif text-lg italic text-moss-300">
                  “{currentLens.practice}”
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-6 border-t border-white/5 pt-6 sm:grid-cols-3">
              <MetaLine label="Identity line" value={result.identityLine} />
              <MetaLine label="Feeling" value={`I feel ${result.feeling}.`} />
              <MetaLine label="Need" value={`I need ${result.need}.`} />
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-sand-300/60">
                Phrase to carry
              </p>
              <p className="mt-2 font-serif text-xl leading-relaxed text-sand-200">
                “{result.anchorPhrase}”
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onSave} className="btn-primary">
                {saved ? "Saved ✓" : "Save to Touchstone Log"}
              </button>
              <Link href="/dial" className="btn-quiet">
                Take a Micro-Dose →
              </Link>
              <Link href="/focus" className="btn-quiet">
                Focus with the creature →
              </Link>
            </div>
          </section>
        </>
      )}

      <CompassionCatchers />

      <PhraseBank />
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-sand-300/60">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-sand-200">{value}</p>
    </div>
  );
}

function FieldWithSuggestions({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suggestions: readonly string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-sand-300/80">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sand-300/80 hover:bg-white/10 hover:text-sand-200"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function CompassionCatchers() {
  const cue = useMemo(
    () => CATCHER_CUES[Math.floor(Math.random() * CATCHER_CUES.length)],
    [],
  );
  return (
    <section className="surface-quiet p-6 sm:p-8">
      <p className="chip">Compassion Catchers</p>
      <p className="mt-4 text-sand-300/80">
        Notice one of these? It's a cue — not a failure.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <CatcherList label="In the body" items={COMPASSION_CATCHERS.physical} />
        <CatcherList label="In the thoughts" items={COMPASSION_CATCHERS.thought} />
        <CatcherList label="In the behavior" items={COMPASSION_CATCHERS.behavior} />
      </div>
      <p className="mt-6 font-serif text-lg italic text-moss-300">“{cue}”</p>
    </section>
  );
}

function CatcherList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-sand-300/60">{label}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-sand-300/80">
        {items.map((i) => (
          <li key={i} className="leading-snug">• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function PhraseBank() {
  return (
    <section className="surface-quiet p-6 sm:p-8">
      <p className="chip">Vocabulary bank</p>
      <p className="mt-4 text-sand-300/80">
        Words to reach for when the sharp voice comes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {COMPASSION_WORDS.map((w) => (
          <span
            key={w}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-sand-300"
          >
            {w}
          </span>
        ))}
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-sand-300/60">
        Common phrases
      </p>
      <ul className="mt-3 space-y-2 text-sand-300/90">
        {COMMON_PHRASES.slice(0, 8).map((p) => (
          <li key={p} className="font-serif italic">“{p}”</li>
        ))}
      </ul>
    </section>
  );
}
