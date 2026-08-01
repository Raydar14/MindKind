"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATCHER_CUES,
  COMMON_PHRASES,
  COMPASSION_CATCHERS,
  COMPASSION_WORDS,
  reframe,
  type Reframe,
} from "@/lib/compassion";
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
  const [result, setResult] = useState<Reframe | null>(null);
  const [saved, setSaved] = useState(false);

  const canSubmit = thought.trim().length > 0;

  function onReframe() {
    setSaved(false);
    setResult(reframe({ thought, feeling, need }));
  }

  function onSave() {
    if (!result) return;
    saveTouchstone({
      kind: "reframe",
      title: result.observation.slice(0, 120),
      body: `${result.kindResponse}\n\n— ${result.anchorPhrase}`,
      meta: {
        feeling: result.feeling,
        need: result.need,
        identity: result.identityLine,
      },
    });
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Compassion Mirror</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Say the hard thing.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Write it exactly as it lives in your head. Nothing to fix, nothing to
          soften. The mirror will speak it back in a steadier voice.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <label className="block text-sm text-sand-300/80">
          The thought
        </label>
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
            placeholder="optional"
          />
          <FieldWithSuggestions
            label="What am I needing?"
            value={need}
            onChange={setNeed}
            suggestions={NEED_SUGGESTIONS}
            placeholder="optional"
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
        <section className="surface p-6 sm:p-8">
          <p className="chip">Your kinder voice</p>
          <div className="mt-5 space-y-6">
            <ReframeLine label="Observation" value={result.observation} />
            <ReframeLine
              label="Feeling"
              value={`I feel ${result.feeling}.`}
            />
            <ReframeLine
              label="Need"
              value={`I need ${result.need}.`}
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-sand-300/60">
                Kind response
              </p>
              <p className="mt-2 font-serif text-xl italic leading-relaxed text-sand-200">
                “{result.kindResponse}”
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-sand-300/60">
                Identity line
              </p>
              <p className="mt-2 text-lg text-moss-300">
                {result.identityLine}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-sand-300/60">
                Phrase to carry
              </p>
              <p className="mt-2 text-lg text-sand-200">
                {result.anchorPhrase}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onSave} className="btn-primary">
              {saved ? "Saved ✓" : "Save to Touchstone Log"}
            </button>
            <Link href="/dial" className="btn-quiet">
              Take a Micro-Dose →
            </Link>
          </div>
        </section>
      )}

      <CompassionCatchers />

      <PhraseBank />
    </div>
  );
}

function ReframeLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-sand-300/60">
        {label}
      </p>
      <p className="mt-2 text-lg leading-relaxed text-sand-200">{value}</p>
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
