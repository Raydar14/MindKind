"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CORE_MANTRA } from "@/lib/compassion";
import { loadProfile, valueLabel, type Profile } from "@/lib/profile";
import { suggestion, weeklyStats, type WeeklyStats } from "@/lib/stats";
import type { Touchstone } from "@/lib/storage";

export default function HomePage() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [next, setNext] = useState<ReturnType<typeof suggestion> | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setStats(weeklyStats());
    setNext(suggestion());
    setProfile(loadProfile());
  }, []);

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
          MindKind translates the sharp voice into the steady one — the voice
          that stays with you when it's hard. Grounded in ACT, NVC,
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

      {profile ? (
        <section className="surface-quiet p-6 sm:p-8">
          <p className="chip">Your compass</p>
          <p className="mt-3 font-serif text-xl leading-relaxed text-sand-200">
            “{profile.identity}”
          </p>
          <p className="mt-2 text-sm text-sand-300/70">
            Values: {profile.values.map(valueLabel).join(" · ")}
          </p>
          <Link
            href="/onboarding"
            className="mt-3 inline-block text-xs text-moss-300 hover:underline"
          >
            Adjust →
          </Link>
        </section>
      ) : (
        <section className="surface p-6 sm:p-8">
          <p className="chip">Get your bearings</p>
          <p className="mt-3 font-serif text-2xl text-sand-200">
            Choose three values and one identity line — 60 seconds.
          </p>
          <p className="mt-2 text-sand-300/80">
            The mirror uses your line when the sharp voice comes.
          </p>
          <Link href="/onboarding" className="btn-primary mt-4">
            Set your compass →
          </Link>
        </section>
      )}

      {next && (
        <section className="surface flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="chip">Next kind step</p>
            <h2 className="mt-3 font-serif text-2xl text-sand-200">
              {next.label}
            </h2>
            <p className="mt-1 text-sand-300/80">{next.reason}</p>
          </div>
          <Link href={next.href} className="btn-primary self-start sm:self-auto">
            Begin →
          </Link>
        </section>
      )}

      {stats && stats.totalEntries > 0 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            eyebrow="C-Rating (7d)"
            value={`${Math.round(stats.cRating * 100)}%`}
            body={`${stats.activeDays} of 7 days practiced. No streak to break.`}
          />
          <StatCard
            eyebrow="This week"
            value={String(stats.totalEntries)}
            body={`${stats.byKind.reframe} reframes · ${stats.byKind.dose} doses · ${stats.byKind.moment} moments`}
          />
          <StatCard
            eyebrow="Returning"
            value={String(stats.streakForward)}
            body="Days you've returned to yourself, in a row. Not a streak — a witness."
          />
        </section>
      )}

      {stats?.latest && <LatestTouchstone latest={stats.latest} />}

      <section className="grid gap-4 sm:grid-cols-2">
        <Tile
          href="/companion"
          eyebrow="Companion"
          title="Talk it through"
          body="A psychologically informed voice — not a therapist. Notice, name, release, choose. Short, adaptive, and it knows when to hand you to a human."
        />
        <Tile
          href="/reframe"
          eyebrow="Compassion Mirror"
          title="Reframe a thought"
          body="Six lenses — CBT, ACT, NVC, self-compassion, Stoic, non-attachment — pick the voice that meets you today."
        />
        <Tile
          href="/dial"
          eyebrow="Nervous System Dial"
          title="Pick your state"
          body="Wired, foggy, numb, exhausted — the dial picks the right Micro-Dose for the next 60–180 seconds."
        />
        <Tile
          href="/focus"
          eyebrow="ON the Clock"
          title="Focus with a witness"
          body="A friendly co-working creature. Not alone at the desk. Log your focused blocks without shame."
        />
        <Tile
          href="/rituals"
          eyebrow="Ritual Builder"
          title="Design a sequence"
          body="Compose breath, body, sense, affirmation, journal, and silence into openings and repairs of your own."
        />
        <Tile
          href="/skills"
          eyebrow="Swipe Deck"
          title="One small sensory thing"
          body="Sour candy · warm towels · watching fish · humming low. Older than reasoning, and often faster."
        />
        <Tile
          href="/reparenting"
          eyebrow="Reparenting Space"
          title="Meet a tender part"
          body="Scared, angry, weary, unseen, left-behind. Not fixing — contact. A slow guided sequence."
        />
        <Tile
          href="/log"
          eyebrow="Touchstone Log"
          title="Your quiet record"
          body="Small moments you want to remember. Reframes, resets, and the times you stayed with yourself."
        />
        <Tile
          href="/breath"
          eyebrow="Breathing Dojo"
          title="Mindful of breath"
          body="Anapanasati. Four patterns, texture-first logging. Not a fix — a way to feel."
        />
        <Tile
          href="/review"
          eyebrow="Weekly Review"
          title="Identity alignment"
          body="Three quick questions. Three closing lines. A signal, not a grade — kept private on your device."
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

function StatCard({
  eyebrow,
  value,
  body,
}: {
  eyebrow: string;
  value: string;
  body: string;
}) {
  return (
    <div className="surface-quiet p-6">
      <p className="text-xs uppercase tracking-widest text-sand-300/60">
        {eyebrow}
      </p>
      <p className="mt-3 font-serif text-4xl text-sand-200">{value}</p>
      <p className="mt-2 text-sm text-sand-300/70">{body}</p>
    </div>
  );
}

function LatestTouchstone({ latest }: { latest: Touchstone }) {
  return (
    <section className="surface-quiet p-6 sm:p-8">
      <p className="chip">Latest touchstone</p>
      <p className="mt-3 text-xs uppercase tracking-widest text-sand-300/60">
        {kindLabel(latest.kind)} · {new Date(latest.createdAt).toLocaleString()}
      </p>
      <p className="mt-2 font-serif text-xl leading-relaxed text-sand-200">
        {latest.title}
      </p>
      {latest.body && (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-sand-300/80">
          {latest.body.split("\n\n")[0]}
        </p>
      )}
      <Link href="/log" className="mt-4 inline-block text-sm text-moss-300">
        See the full log →
      </Link>
    </section>
  );
}

function kindLabel(k: Touchstone["kind"]) {
  return k === "reframe" ? "Reframe" : k === "dose" ? "Dose" : "Moment";
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
