"use client";

import Link from "next/link";
import { useState } from "react";
import { saveTouchstone } from "@/lib/storage";

type PartKey = "scared" | "angry" | "weary" | "unseen" | "abandoned";

const PARTS: Array<{
  key: PartKey;
  label: string;
  arrives: string;
  offering: string;
}> = [
  {
    key: "scared",
    label: "The scared little one",
    arrives: "arrives when the room feels too big and no one is looking",
    offering: "cocoa · a soft blanket · a quiet voice saying ‘you're safe now'",
  },
  {
    key: "angry",
    label: "The angry teen",
    arrives: "arrives when something you cared about wasn't honored",
    offering:
      "your full attention · permission to be angry · one true sentence about what you needed",
  },
  {
    key: "weary",
    label: "The weary caretaker",
    arrives: "arrives when you've held everyone but yourself",
    offering:
      "warm water · a chair that holds you · someone to say ‘you're allowed to rest'",
  },
  {
    key: "unseen",
    label: "The unseen one",
    arrives: "arrives when you performed and were still not chosen",
    offering:
      "eye contact · a witness to what actually happened · one hand on your chest",
  },
  {
    key: "abandoned",
    label: "The left-behind one",
    arrives: "arrives when someone stopped answering, or never really did",
    offering:
      "a slow ‘I'm here now' · a soft hand on their back · a promise not to leave first",
  },
];

const STEPS = [
  "Notice",
  "Meet",
  "Ask",
  "Offer",
  "Stay",
];

export default function ReparentingPage() {
  const [partKey, setPartKey] = useState<PartKey | null>(null);
  const [step, setStep] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const part = PARTS.find((p) => p.key === partKey) ?? null;

  function reset() {
    setPartKey(null);
    setStep(0);
    setNote("");
    setSaved(false);
  }

  function save() {
    if (!part) return;
    saveTouchstone({
      kind: "moment",
      title: `Sat with ${part.label}`,
      body: note || `I met the part that ${part.arrives}. I offered ${part.offering}.`,
      meta: { kind: "reparenting", part: part.key },
    });
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Reparenting Space</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Meet the part. Offer it care.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Younger parts don't need fixing. They need contact. This is a slow
          space — nothing to rush, nothing to resolve.
        </p>
      </header>

      {!part && (
        <section className="grid gap-3 sm:grid-cols-2">
          {PARTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setPartKey(p.key);
                setStep(0);
              }}
              className="surface p-6 text-left transition hover:border-white/15 hover:bg-ink-800/90"
            >
              <p className="font-serif text-2xl text-sand-200">{p.label}</p>
              <p className="mt-2 text-sand-300/80">{p.arrives}.</p>
            </button>
          ))}
        </section>
      )}

      {part && (
        <>
          <section className="surface p-6 sm:p-10">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-sand-300/60">
              <span>Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
              <button
                type="button"
                onClick={reset}
                className="text-sand-300/60 hover:text-sand-200"
              >
                Choose a different part
              </button>
            </div>
            <h2 className="mt-4 font-serif text-2xl text-sand-200">
              {part.label}
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-sand-200">
              {step === 0 && (
                <p>
                  Feel the shape of the part in the body. Where does it live?
                  Chest? Throat? Belly? Just notice. Don't move it yet.
                </p>
              )}
              {step === 1 && (
                <p>
                  Turn toward it, gently. Say silently: “Hello. I see you. I am
                  not going anywhere.” Let it know an adult has arrived.
                </p>
              )}
              {step === 2 && (
                <p>
                  Ask it: what were you needing back then, that no one gave? And
                  what do you need <em>now</em>, from me?
                </p>
              )}
              {step === 3 && (
                <p>
                  Offer what it's asking for, in imagination. It might be{" "}
                  <span className="text-moss-300">{part.offering}</span>. Move
                  slowly. Notice if the part receives it.
                </p>
              )}
              {step === 4 && (
                <p>
                  Stay. Don't fix. Don't move on. Just be with the part a little
                  longer than feels productive. Presence is the medicine.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-quiet disabled:opacity-40"
              >
                ← Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-primary"
                >
                  Next →
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link href="/log" className="btn-quiet">
                    See log
                  </Link>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saved}
                    className="btn-primary disabled:opacity-60"
                  >
                    {saved ? "Saved ✓" : "Save this moment"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {step === STEPS.length - 1 && (
            <section className="surface-quiet p-6 sm:p-8">
              <label className="text-xs uppercase tracking-widest text-sand-300/60">
                One line, if it helps (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What the part said. What I offered. What I noticed."
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-ink-900/80 p-4 leading-relaxed text-sand-200 outline-none focus:border-moss-500/60"
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
