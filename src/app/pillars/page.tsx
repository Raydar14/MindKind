const PILLARS = [
  {
    name: "Mind",
    subtitle: "Cognitive clarity & flexible narratives",
    body: "Daily thought checks, distortion-spotting, and the Compassion Mirror. Move from story and blame to needs and choices.",
    tint: "from-dusk-400/40 via-dusk-500/20 to-transparent",
  },
  {
    name: "Breath",
    subtitle: "Regulation & reset",
    body: "Short Interruptions, extended-exhale protocols, breath-linked movement. Speak safety to the body in the language it listens to.",
    tint: "from-moss-400/40 via-moss-500/20 to-transparent",
  },
  {
    name: "Body",
    subtitle: "Grounding & embodiment",
    body: "Progressive muscle relaxation, tension-release journaling, the Body Language library. Meet the body with kindness instead of orders.",
    tint: "from-petal-400/40 via-petal-500/20 to-transparent",
  },
  {
    name: "Nature",
    subtitle: "Sensory healing & presence",
    body: "Grounding walks, ASMR and weather soundscapes, unconventional coping (stacking rocks, watching fish, barefoot minutes).",
    tint: "from-sand-300/40 via-sand-400/20 to-transparent",
  },
  {
    name: "Compassion",
    subtitle: "Self-kindness & inner repair",
    body: "The Compassion Loop — Kind Mirror, Shared Humanity, Outward Radiance. Reparenting space, and the vocabulary bank you can reach for under pressure.",
    tint: "from-petal-300/40 via-dusk-400/20 to-transparent",
  },
  {
    name: "Connection",
    subtitle: "People, purpose & boundaries",
    body: "Micro-connections log, the ‘I need help' button, NVC-based bridge-and-boundary scripts. Protecting needs without attacking anyone.",
    tint: "from-moss-300/40 via-dusk-400/20 to-transparent",
  },
];

export default function PillarsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="chip">The Compass</p>
        <h1 className="mt-4 font-serif text-3xl text-sand-200 sm:text-4xl">
          Six Pillars. One steady inner language.
        </h1>
        <p className="mt-3 max-w-2xl text-sand-300/80">
          Practice over performance. Systems over willpower. Acceptance over
          perfection. Every tool in MindKind lives inside one of these six.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <article
            key={p.name}
            className="surface relative overflow-hidden p-6 sm:p-8"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${p.tint} blur-3xl`}
            />
            <p className="chip">{p.subtitle}</p>
            <h2 className="mt-4 font-serif text-3xl text-sand-200">{p.name}</h2>
            <p className="mt-3 text-sand-300/80">{p.body}</p>
          </article>
        ))}
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">Powers of Mind</p>
        <ul className="mt-4 grid gap-2 font-serif text-lg text-sand-200 sm:grid-cols-3">
          <li>Acceptance over Perfection</li>
          <li>Practice over Performance</li>
          <li>Systems over Willpower</li>
        </ul>
      </section>
    </div>
  );
}
