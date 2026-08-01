"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteTouchstone,
  loadLog,
  saveTouchstone,
  type Touchstone,
} from "@/lib/storage";

const KINDS: Array<{ key: Touchstone["kind"]; label: string }> = [
  { key: "reframe", label: "Reframe" },
  { key: "moment", label: "Moment" },
  { key: "dose", label: "Dose" },
];

export default function LogPage() {
  const [entries, setEntries] = useState<Touchstone[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    setEntries(loadLog());
  }, []);

  function refresh() {
    setEntries(loadLog());
  }

  function onAddMoment() {
    if (!note.trim()) return;
    saveTouchstone({ kind: "moment", title: note.trim() });
    setNote("");
    refresh();
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Touchstone Log</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Small moments you want to remember.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          Not a streak. Not a scoreboard. A quiet record of the times you stayed
          with yourself — kept only on this device.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <label className="block text-sm text-sand-300/80">
          Log a touchstone moment
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Sighed for the first time today."
            className="flex-1 rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sand-200 outline-none focus:border-moss-500/60"
          />
          <button
            type="button"
            onClick={onAddMoment}
            disabled={!note.trim()}
            className="btn-primary disabled:opacity-40"
          >
            Save
          </button>
        </div>
        <p className="mt-3 text-xs text-sand-300/60">
          Try metaphors: “Felt like cracked glass.” “Heartbeat softened.”
        </p>
      </section>

      {entries.length === 0 ? (
        <section className="surface-quiet p-10 text-center">
          <p className="font-serif text-lg text-sand-300/80">
            Nothing yet. That's fine.
          </p>
          <p className="mt-2 text-sm text-sand-300/60">
            Start with a{" "}
            <Link href="/reframe" className="text-moss-300 underline">
              reframe
            </Link>{" "}
            or a{" "}
            <Link href="/dial" className="text-moss-300 underline">
              Micro-Dose
            </Link>
            .
          </p>
        </section>
      ) : (
        <ul className="space-y-4">
          {entries.map((t) => (
            <li key={t.id} className="surface p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="chip">{kindLabel(t.kind)}</span>
                  <time className="text-xs text-sand-300/60">
                    {new Date(t.createdAt).toLocaleString()}
                  </time>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    deleteTouchstone(t.id);
                    refresh();
                  }}
                  className="text-xs text-sand-300/60 hover:text-petal-400"
                >
                  Release
                </button>
              </div>
              <p className="mt-3 font-serif text-lg leading-relaxed text-sand-200">
                {t.title}
              </p>
              {t.body && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-sand-300/80">
                  {t.body}
                </p>
              )}
              {t.meta && Object.keys(t.meta).length > 0 && (
                <dl className="mt-4 grid gap-2 text-xs text-sand-300/70 sm:grid-cols-2">
                  {Object.entries(t.meta).map(([k, v]) => (
                    <div key={k}>
                      <dt className="uppercase tracking-widest text-sand-300/50">
                        {k}
                      </dt>
                      <dd className="mt-0.5 text-sand-300/90">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function kindLabel(k: Touchstone["kind"]) {
  return KINDS.find((x) => x.key === k)?.label ?? k;
}
