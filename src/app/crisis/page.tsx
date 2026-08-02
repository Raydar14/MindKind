import Link from "next/link";

export default function CrisisPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="chip">If you need a human right now</p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-sand-200 sm:text-4xl">
          You don't have to face this alone.
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          MindKind is a practice space. It is not a substitute for a person who
          can be with you right now. These lines are staffed by humans.
        </p>
      </header>

      <section className="surface p-6 sm:p-10">
        <p className="chip">United States</p>
        <ul className="mt-5 space-y-6">
          <ResourceLine
            title="988 — Suicide and Crisis Lifeline"
            body="Call or text 988. Free, confidential, 24/7. If you'd rather text, you'll get a person that way too."
            actions={[
              { href: "tel:988", label: "Call 988" },
              { href: "sms:988", label: "Text 988" },
            ]}
          />
          <ResourceLine
            title="911 — Immediate danger"
            body="If someone's life is at risk right now — yours or someone else's — call 911."
            actions={[{ href: "tel:911", label: "Call 911" }]}
          />
          <ResourceLine
            title="Crisis Text Line"
            body="Text HOME to 741741 to connect with a trained volunteer counselor."
            actions={[{ href: "sms:741741&body=HOME", label: "Text HOME to 741741" }]}
          />
          <ResourceLine
            title="Trans Lifeline"
            body="Peer support run by and for trans people. 1-877-565-8860."
            actions={[{ href: "tel:1-877-565-8860", label: "Call Trans Lifeline" }]}
          />
          <ResourceLine
            title="Veterans Crisis Line"
            body="Dial 988 and press 1, or text 838255."
            actions={[
              { href: "tel:988", label: "Call 988 → press 1" },
              { href: "sms:838255", label: "Text 838255" },
            ]}
          />
        </ul>
      </section>

      <section className="surface p-6 sm:p-10">
        <p className="chip">Outside the U.S.</p>
        <p className="mt-4 leading-relaxed text-sand-300/80">
          Please reach your local emergency services. A directory of
          international crisis lines is maintained at{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-moss-300 underline"
          >
            findahelpline.com
          </a>
          .
        </p>
      </section>

      <section className="surface-quiet p-6 sm:p-8">
        <p className="chip">While you wait</p>
        <ul className="mt-4 space-y-2 leading-relaxed text-sand-300/90">
          <li>• If a weapon or means is nearby, can you put distance between yourself and it — hand it to someone, put it in the car, lock it away?</li>
          <li>• Is there one person you can text right now? “I'm not okay. Can you sit on the phone with me?”</li>
          <li>• Long exhale. Longer than the in-breath. Feet on the floor. You are still here.</li>
        </ul>
      </section>

      <div className="text-center">
        <Link href="/" className="text-sm text-sand-300/70 hover:text-sand-200">
          ← back to MindKind
        </Link>
      </div>
    </div>
  );
}

function ResourceLine({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions: Array<{ href: string; label: string }>;
}) {
  return (
    <li>
      <p className="font-serif text-xl text-sand-200">{title}</p>
      <p className="mt-1 text-sand-300/80">{body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sand-200 hover:bg-white/10"
          >
            {a.label}
          </a>
        ))}
      </div>
    </li>
  );
}
