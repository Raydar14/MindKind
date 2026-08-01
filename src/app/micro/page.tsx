import Link from "next/link";
import { MICRO_DOSES } from "@/lib/microdoses";

export default function MicroIndexPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="chip">Micro-Dose Menu</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          60–180 seconds. Tied to a moment you already have.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          The system carries the habit, not your willpower. Link each dose to an
          anchor moment in your day.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {MICRO_DOSES.map((d) => (
          <li key={d.id}>
            <Link
              href={`/micro/${d.id}`}
              className="group surface flex h-full flex-col p-6 transition hover:border-white/15 hover:bg-ink-800/90"
            >
              <p className="chip w-fit">
                {Math.round(d.duration / 60) || 1} min
              </p>
              <h2 className="mt-4 font-serif text-2xl text-sand-200">
                {d.name}
              </h2>
              <p className="mt-3 text-sm text-sand-300/80">{d.anchor}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-moss-300/80">
                {d.skill}
              </p>
              <p className="mt-6 text-sm text-moss-300 opacity-80 transition group-hover:opacity-100">
                Begin →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
