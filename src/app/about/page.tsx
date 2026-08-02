const SOURCES = [
  {
    heading: "Identity-based habits",
    lines: [
      "James Clear · Atomic Habits — jamesclear.com/atomic-habits",
      "BJ Fogg · Tiny Habits — tinyhabits.com",
      "APA · on habit formation — apa.org/monitor/2019/01/habits",
    ],
  },
  {
    heading: "Self-compassion",
    lines: [
      "Dr. Kristin Neff · self-compassion.org",
      "Three components: self-kindness · common humanity · mindfulness.",
    ],
  },
  {
    heading: "Nonviolent Communication",
    lines: [
      "Marshall Rosenberg · Center for Nonviolent Communication — cnvc.org",
      "The four-part process — nonviolentcommunication.com/pdf_files/4part_nvc_process.pdf",
      "Positive Psychology overview — positivepsychology.com/non-violent-communication",
    ],
  },
  {
    heading: "Interoception & the nervous system",
    lines: [
      "Frontiers in Psychiatry · interoception & mental health — frontiersin.org/articles/10.3389/fpsyt.2018.00161/full",
      "NCBI · vagus nerve and breath — ncbi.nlm.nih.gov/pmc/articles/PMC6137615",
      "Polyvagal theory · Stephen Porges.",
    ],
  },
  {
    heading: "Trauma-informed practice",
    lines: [
      "Bessel van der Kolk · The Body Keeps the Score — besselvanderkolk.com",
      "Regulation before narrative. Window of tolerance first.",
    ],
  },
];

const PROMISE = [
  "Practice over performance.",
  "Systems over willpower.",
  "Acceptance over perfection.",
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="chip">The promise</p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-sand-200 sm:text-4xl">
          A kinder inner language, spoken fluently under pressure.
        </h1>
        <p className="mt-4 max-w-2xl text-sand-300/80">
          MindKind is a personal, intuitive guide for people learning to nurture
          self-compassion, emotional regulation, and resilience. It integrates
          ancient practices with modern neuroscience and honors each person's
          emotional rhythm.
        </p>
      </header>

      <section className="surface p-6 sm:p-8">
        <p className="chip">Core philosophy</p>
        <div className="mt-5 grid gap-3 font-serif text-xl leading-relaxed text-sand-200 sm:grid-cols-3">
          {PROMISE.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-6 text-sand-300/80">
          We stop waiting for the world to calm down. We build inner peace now —
          through six accessible inner powers and a radical shift from striving
          to softening.
        </p>
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">The core mantra</p>
        <div className="mt-4 space-y-2 font-serif text-xl leading-relaxed text-sand-200 sm:text-2xl">
          <p>No matter what happens, I am here for me.</p>
          <p>I trust myself to face the moment.</p>
          <p>My worth is not in question.</p>
        </div>
      </section>

      <section className="space-y-6">
        <p className="chip">Foundations we lean on</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOURCES.map((s) => (
            <article key={s.heading} className="surface p-6">
              <h2 className="font-serif text-xl text-sand-200">{s.heading}</h2>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-sand-300/80">
                {s.lines.map((l) => (
                  <li key={l}>• {l}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="surface p-6 sm:p-8">
        <p className="chip">How the Companion is different</p>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          MindKind's AI companion is a psychologically informed voice, not a
          general chatbot. It's built around a single loop —{" "}
          <span className="text-sand-200">Notice → Name → Release → Choose</span> — and it adapts what it offers to the state you're in.
        </p>
        <ul className="mt-4 space-y-2 text-sand-300/80">
          <li>• Panic gets a longer <em>exhale</em>, not a big inhale.</li>
          <li>• Numb gets sensory activation, not more thinking.</li>
          <li>• Grief gets room, not an exercise to make it stop.</li>
          <li>• Anger gets space and impulse control before analysis.</li>
          <li>• Rumination gets defusion or attention shift, not more debate.</li>
        </ul>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          It asks fewer, better questions; separates feelings from thoughts from
          urges from actions; validates without enabling; and drops all its
          usual tools the moment safety is at stake — where it becomes short,
          direct, and points to a human.
        </p>
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">On what this is, and isn't</p>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          MindKind is a practice space, not a substitute for care. If you are in
          crisis, please reach out to a trusted person, a therapist, or a crisis
          line — start at{" "}
          <a href="/crisis" className="text-moss-300 underline">
            /crisis
          </a>
          .
        </p>
      </section>
    </div>
  );
}
