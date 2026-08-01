"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IDENTITY_TEMPLATES,
  saveProfile,
  VALUES,
  valueLabel,
  type ValueKey,
} from "@/lib/profile";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [values, setValues] = useState<ValueKey[]>([]);
  const [template, setTemplate] = useState(IDENTITY_TEMPLATES[0]);
  const [chosenValue, setChosenValue] = useState<ValueKey | null>(null);

  function toggle(k: ValueKey) {
    setValues((prev) => {
      if (prev.includes(k)) return prev.filter((x) => x !== k);
      if (prev.length >= 3) return prev;
      return [...prev, k];
    });
  }

  function finish() {
    if (values.length === 0 || !chosenValue) return;
    const identity = template.replace("{value}", valueLabel(chosenValue).toLowerCase());
    saveProfile({
      values,
      identity,
      createdAt: Date.now(),
    });
    router.push("/");
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">First touchstone</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          {step === 0 && "What do you want to move toward?"}
          {step === 1 && "Say who you're becoming."}
          {step === 2 && "You're ready."}
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          {step === 0 &&
            "Pick up to three values. Not what you should care about — what actually matters to you right now."}
          {step === 1 &&
            "Choose one identity line. The mirror will use it when the sharp voice comes."}
          {step === 2 &&
            "Your compass is set. You can change it later, gently, in any moment."}
        </p>
      </header>

      {step === 0 && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => {
              const active = values.includes(v.key);
              const full = values.length >= 3 && !active;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => toggle(v.key)}
                  disabled={full}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? "border-moss-400/60 bg-moss-500/10"
                      : full
                      ? "border-white/5 bg-ink-800/40 opacity-40"
                      : "border-white/5 bg-ink-800/60 hover:border-white/15 hover:bg-ink-800/90"
                  }`}
                >
                  <p
                    className={`font-serif text-xl ${
                      active ? "text-moss-300" : "text-sand-200"
                    }`}
                  >
                    {v.label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-sand-300/70">
                    {v.body}
                  </p>
                </button>
              );
            })}
          </section>
          <div className="flex items-center justify-between">
            <p className="text-sm text-sand-300/70">
              {values.length}/3 chosen
            </p>
            <button
              type="button"
              onClick={() => {
                if (values.length > 0) {
                  setChosenValue(values[0]);
                  setStep(1);
                }
              }}
              disabled={values.length === 0}
              className="btn-primary disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <section className="surface p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-sand-300/60">
              Anchor value
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {values.map((k) => {
                const active = k === chosenValue;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setChosenValue(k)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-moss-400/60 bg-moss-500/15 text-moss-300"
                        : "border-white/10 bg-white/5 text-sand-300"
                    }`}
                  >
                    {valueLabel(k)}
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-xs uppercase tracking-widest text-sand-300/60">
              Identity line
            </p>
            <div className="mt-3 space-y-2">
              {IDENTITY_TEMPLATES.map((t) => {
                const active = t === template;
                const preview = t.replace(
                  "{value}",
                  chosenValue ? valueLabel(chosenValue).toLowerCase() : "…",
                );
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`w-full rounded-xl border p-4 text-left font-serif text-lg transition ${
                      active
                        ? "border-moss-400/60 bg-moss-500/10 text-sand-200"
                        : "border-white/10 bg-white/5 text-sand-300 hover:bg-white/10"
                    }`}
                  >
                    “{preview}”
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-quiet"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 2 && chosenValue && (
        <>
          <section className="surface p-8 sm:p-12">
            <p className="chip">Your compass</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-sand-300/60">
                  Values
                </p>
                <ul className="mt-2 space-y-1 font-serif text-xl text-sand-200">
                  {values.map((k) => (
                    <li key={k}>{valueLabel(k)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-sand-300/60">
                  Identity line
                </p>
                <p className="mt-2 font-serif text-2xl leading-relaxed text-sand-200">
                  “{template.replace("{value}", valueLabel(chosenValue).toLowerCase())}”
                </p>
              </div>
            </div>
          </section>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-quiet"
            >
              ← Back
            </button>
            <button type="button" onClick={finish} className="btn-primary">
              Save & begin →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
