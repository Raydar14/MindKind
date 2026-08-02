"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProfile, valueLabel, type Profile } from "@/lib/profile";
import { saveTouchstone } from "@/lib/storage";

type Rating = 0 | 1 | 2 | 3 | 4;

const RATING_WORDS: Record<Rating, string> = {
  0: "not at all",
  1: "barely",
  2: "sometimes",
  3: "often",
  4: "consistently",
};

const CORE_QUESTIONS = [
  "I acted like the person I'm becoming, at least once when it was hard.",
  "I spoke more from needs than from blame.",
  "I stayed with myself when something got difficult.",
];

export default function ReviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([2, 2, 2]);
  const [held, setHeld] = useState("");
  const [stumble, setStumble] = useState("");
  const [next, setNext] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const identityQuestion = profile?.identity
    ? `“${profile.identity}” — I lived that this week…`
    : CORE_QUESTIONS[0];

  const questions = [identityQuestion, CORE_QUESTIONS[1], CORE_QUESTIONS[2]];

  const alignmentScore = Math.round(
    (ratings.reduce<number>((s, r) => s + r, 0) / (ratings.length * 4)) * 100,
  );

  function save() {
    saveTouchstone({
      kind: "moment",
      title: `Weekly review · ${alignmentScore}% alignment`,
      body: [
        held ? `Held: ${held}` : null,
        stumble ? `Stumbled: ${stumble}` : null,
        next ? `Next: ${next}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      meta: {
        kind: "review",
        alignment: String(alignmentScore),
        values: profile ? profile.values.map(valueLabel).join(", ") : "",
      },
    });
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Weekly Review</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Who did you practice being this week?
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Not a scoreboard. A weekly self-check on the identity you chose. No
          streak breaks, no shame — just noticing.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <p className="chip">Identity alignment</p>
        <ul className="mt-6 space-y-8">
          {questions.map((q, i) => (
            <li key={i}>
              <p className="text-lg leading-relaxed text-sand-200">{q}</p>
              <div className="mt-4 grid grid-cols-5 gap-1">
                {[0, 1, 2, 3, 4].map((r) => {
                  const rating = r as Rating;
                  const active = ratings[i] === rating;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        const next = [...ratings];
                        next[i] = rating;
                        setRatings(next);
                        setSaved(false);
                      }}
                      className={`rounded-lg border p-2 text-center text-xs transition ${
                        active
                          ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                          : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-serif text-lg">{r}</div>
                      <div className="mt-0.5 opacity-70">{RATING_WORDS[rating]}</div>
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface p-6 sm:p-8">
        <p className="chip">Three lines to close the week</p>
        <div className="mt-5 space-y-5">
          <PromptField
            label="What I held, even when it was hard"
            value={held}
            onChange={(v) => {
              setHeld(v);
              setSaved(false);
            }}
          />
          <PromptField
            label="Where I stumbled, kindly named"
            value={stumble}
            onChange={(v) => {
              setStumble(v);
              setSaved(false);
            }}
          />
          <PromptField
            label="The smallest true next step"
            value={next}
            onChange={(v) => {
              setNext(v);
              setSaved(false);
            }}
          />
        </div>
      </section>

      <section className="surface-quiet flex flex-col items-center gap-3 p-6 text-center sm:p-10">
        <p className="text-xs uppercase tracking-widest text-sand-300/60">
          Alignment score
        </p>
        <p className="font-serif text-5xl text-sand-200">
          {alignmentScore}%
        </p>
        <p className="max-w-md text-sm text-sand-300/70">
          A weekly signal, not a grade. Notice the shape. Don't rescue the number.
        </p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saved}
            className="btn-primary disabled:opacity-60"
          >
            {saved ? "Saved ✓" : "Save this review"}
          </button>
          <Link href="/log" className="btn-quiet">
            See log
          </Link>
        </div>
      </section>
    </div>
  );
}

function PromptField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-sand-300/60">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="One line, however short"
        className="mt-2 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
      />
    </div>
  );
}
