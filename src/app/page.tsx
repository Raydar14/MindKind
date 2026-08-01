import Link from "next/link";
import { CORE_MANTRA } from "@/lib/compassion";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-800/50 p-8 sm:p-12">
        <div
          aria-hidden
          className="absolute -inset-32 -z-10 animate-drift bg-nebula opacity-90 blur-3xl"
        />
        <p className="chip">A kinder inner language</p>
        <h1 className="mt-5 font-serif text-4xl leading-tight text-sand-200 sm:text-5xl">
          Turn hard thoughts and words
          <br />
          into steady, kind self-talk.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-300/80">
          MindKind helps you translate the sharp voice into the steady one — the
          voice that stays with you when it's hard. Built on ACT, NVC,
          self-compassion, and interoception.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/reframe" className="btn-primary">
            Reframe a thought →
          </Link>
          <Link href="/dial" className="btn-quiet">
            I need a reset
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Tile
          href="/reframe"
          eyebrow="Compassion Mirror"
          title="Reframe a thought"
          body="Say the hard thing. Get it back in your own kinder voice — observation, feeling, need, and a phrase to carry."
        />
        <Tile
          href="/dial"
          eyebrow="Nervous System Dial"
          title="Pick your state"
          body="Wired, foggy, numb, exhausted — the dial picks the right Micro-Dose for the next 60–180 seconds."
        />
        <Tile
          href="/log"
          eyebrow="Touchstone Log"
          title="Your quiet record"
          body="Small moments you want to remember. Reframes, resets, and the times you stayed with yourself."
        />
        <Tile
          href="/pillars"
          eyebrow="Six Pillars"
          title="The compass"
          body="Mind · Breath · Body · Nature · Compassion · Connection. The map behind every practice."
        />
      </section>

      <section className="surface p-8">
        <p className="chip">Core mantra</p>
        <div className="mt-4 space-y-2 font-serif text-xl leading-relaxed text-sand-200 sm:text-2xl">
          {CORE_MANTRA.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

function Tile({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group surface p-6 transition hover:border-white/15 hover:bg-ink-800/90"
    >
      <p className="chip">{eyebrow}</p>
      <h3 className="mt-4 font-serif text-2xl text-sand-200">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-sand-300/80">{body}</p>
      <p className="mt-6 text-sm text-moss-300 opacity-80 transition group-hover:opacity-100">
        Open →
      </p>
    </Link>
  );
}
