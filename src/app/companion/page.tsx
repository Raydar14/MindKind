"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { loadProfile, valueLabel, type Profile } from "@/lib/profile";
import { saveTouchstone } from "@/lib/storage";
import {
  clearConvo,
  detectUrgency,
  loadConvo,
  saveConvo,
  STATE_LABELS,
  type ConvoTurn,
  type FeelingState,
} from "@/lib/companion/state";

type Stage = "safety" | "state" | "chat";

export default function CompanionPage() {
  return (
    <Suspense fallback={null}>
      <CompanionInner />
    </Suspense>
  );
}

function CompanionInner() {
  const params = useSearchParams();
  const seed = params?.get("seed") ?? null;
  const seedState = (params?.get("state") ?? null) as FeelingState | null;
  const [stage, setStage] = useState<Stage>("safety");
  const [state, setState] = useState<FeelingState | null>(null);
  const [turns, setTurns] = useState<ConvoTurn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    const existing = loadConvo();
    if (existing.length > 0) {
      setTurns(existing);
      setStage("chat");
      const lastUserState = [...existing]
        .reverse()
        .find((t) => t.role === "user" && t.state);
      if (lastUserState?.state) setState(lastUserState.state);
    } else if (seed) {
      // Seed a first user message from a cross-link.
      if (seedState) setState(seedState);
      setInput(seed);
      setStage("state");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveConvo(turns);
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns]);

  async function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setPending(true);
    setInput("");
    const userTurn: ConvoTurn = {
      role: "user",
      content: t,
      at: Date.now(),
      state: state ?? undefined,
    };
    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);

    if (detectUrgency(t)) {
      // Local safety response instantly.
      const safety: ConvoTurn = {
        role: "assistant",
        content:
          "A human needs to be in this with you.\n\nIf you're in the U.S., **988** is the Suicide and Crisis Lifeline — call or text. If you're in immediate danger, **911**.\n\nIs there one person you can text right now, or one professional you already have?",
        at: Date.now(),
      };
      setTurns([...nextTurns, safety]);
      setSource("safety");
      setPending(false);
      return;
    }

    // Seed an empty assistant turn we'll append to as chunks arrive.
    const placeholder: ConvoTurn = {
      role: "assistant",
      content: "",
      at: Date.now(),
    };
    setTurns([...nextTurns, placeholder]);

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          turns: nextTurns,
          context: profile
            ? {
                identity: profile.identity,
                values: profile.values.map(valueLabel),
              }
            : undefined,
        }),
      });
      setSource(res.headers.get("x-companion-source"));

      if (!res.body) {
        const text = await res.text();
        setTurns([
          ...nextTurns,
          { ...placeholder, content: text || "Still here with you." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      // Stream loop.
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setTurns([
          ...nextTurns,
          { ...placeholder, content: accumulated },
        ]);
      }
      accumulated += decoder.decode();
      if (accumulated) {
        setTurns([
          ...nextTurns,
          { ...placeholder, content: accumulated },
        ]);
      }
    } catch {
      setTurns([
        ...nextTurns,
        {
          ...placeholder,
          content:
            "I lost the connection for a second. Try again, or step away for a moment — that's a valid choice too.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function resetConvo() {
    clearConvo();
    setTurns([]);
    setState(null);
    setStage("safety");
    setSource(null);
  }

  function saveTakeaway() {
    const lastAssistant = [...turns].reverse().find((t) => t.role === "assistant");
    const lastUser = [...turns].reverse().find((t) => t.role === "user");
    if (!lastAssistant && !lastUser) return;
    saveTouchstone({
      kind: "moment",
      title: `Companion — ${lastUser ? trim(lastUser.content, 100) : "session"}`,
      body: lastAssistant ? lastAssistant.content : undefined,
      meta: {
        kind: "companion",
        state: state ?? "unclear",
      },
    });
  }

  if (stage === "safety") {
    return (
      <SafetyGate
        onSafe={() => setStage("state")}
        onUrgent={() => {
          setTurns([
            {
              role: "assistant",
              content:
                "Stay with me for a second. If you're in immediate danger, please call or text **988** (U.S. Suicide and Crisis Lifeline), or **911**. If you're outside the U.S., your local emergency number.\n\nWhen you're ready, tell me what's happening — I'll stay short and steady.",
              at: Date.now(),
            },
          ]);
          setStage("chat");
        }}
      />
    );
  }

  if (stage === "state") {
    return (
      <StatePicker
        onPick={(k) => {
          setState(k);
          setStage("chat");
        }}
        onSkip={() => setStage("chat")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="chip">MindKind Companion</p>
          <h1 className="mt-2 font-serif text-2xl text-sand-200 sm:text-3xl">
            Here, quietly, with you.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state && (
            <span className="chip">
              state · {STATE_LABELS.find((s) => s.key === state)?.label ?? state}
            </span>
          )}
          <button
            type="button"
            onClick={saveTakeaway}
            disabled={turns.length === 0}
            className="text-xs text-sand-300/70 hover:text-sand-200 disabled:opacity-40"
          >
            Save takeaway
          </button>
          <button
            type="button"
            onClick={resetConvo}
            className="text-xs text-sand-300/70 hover:text-sand-200"
          >
            New session
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="surface max-h-[60vh] min-h-[24rem] overflow-y-auto p-5 sm:p-8"
      >
        {turns.length === 0 && <OpeningInvitation state={state} />}
        <ul className="space-y-4">
          {turns
            .filter((t) => t.content.length > 0)
            .map((t, i) => (
              <li
                key={i}
                className={
                  t.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed ${
                    t.role === "user"
                      ? "bg-moss-500/15 text-sand-200"
                      : "bg-ink-900/70 text-sand-200"
                  }`}
                >
                  {renderMarkdownLite(t.content)}
                </div>
              </li>
            ))}
          {pending && turns.at(-1)?.role === "assistant" && !turns.at(-1)?.content && (
            <li className="flex justify-start">
              <div className="rounded-2xl bg-ink-900/70 px-4 py-3 text-sand-300/70">
                <span className="inline-flex gap-1">
                  <Dot />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="surface-quiet flex items-end gap-3 p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={2}
          placeholder="One line is enough. Rough is fine."
          className="flex-1 resize-none bg-transparent p-2 text-sand-200 outline-none placeholder:text-sand-300/40"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          className="btn-primary disabled:opacity-40"
        >
          Send
        </button>
      </form>

      <p className="text-center text-xs text-sand-300/60">
        {source === "fallback" || source === "fallback-error"
          ? "Offline mode — running the state-adaptive fallback. Add ANTHROPIC_API_KEY to unlock the full companion."
          : source === "claude"
          ? "Claude-powered. Your words leave your device only to be answered."
          : source === "safety"
          ? "Safety mode. This is not a substitute for a human. Please reach out."
          : "This is a practice space. Not a substitute for care."}
      </p>

      <ActionRow />
    </div>
  );
}

function SafetyGate({
  onSafe,
  onUrgent,
}: {
  onSafe: () => void;
  onUrgent: () => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <p className="chip">Before we begin</p>
        <h1 className="mt-3 font-serif text-3xl text-sand-200 sm:text-4xl">
          Are you physically safe right now?
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          One question first, because it changes what I offer. If not — a human
          needs to be in this with you, and that's what I'll point to.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onSafe}
          className="surface p-6 text-left transition hover:border-white/15 hover:bg-ink-800/90"
        >
          <p className="font-serif text-xl text-sand-200">Yes, I'm safe</p>
          <p className="mt-2 text-sm text-sand-300/70">
            Distressed maybe, but not in immediate danger.
          </p>
        </button>
        <button
          type="button"
          onClick={onUrgent}
          className="surface p-6 text-left transition hover:border-white/15 hover:bg-ink-800/90"
        >
          <p className="font-serif text-xl text-sand-200">Not sure / not safe</p>
          <p className="mt-2 text-sm text-sand-300/70">
            I'll switch to crisis mode and stay short and clear.
          </p>
        </button>
      </div>
      <div className="surface-quiet p-6">
        <p className="text-sm text-sand-300/80">
          If you're in immediate danger, call or text{" "}
          <span className="font-medium text-sand-200">988</span> (U.S. Suicide
          and Crisis Lifeline) or <span className="font-medium text-sand-200">911</span>. Outside the U.S., your local emergency number.
        </p>
        <Link
          href="/crisis"
          className="mt-3 inline-block text-sm text-moss-300 hover:underline"
        >
          Full crisis resources →
        </Link>
      </div>
    </div>
  );
}

function StatePicker({
  onPick,
  onSkip,
}: {
  onPick: (k: FeelingState) => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <p className="chip">One clarifying question</p>
        <h1 className="mt-3 font-serif text-3xl text-sand-200 sm:text-4xl">
          What's closest to how you feel right now?
        </h1>
        <p className="mt-3 max-w-xl text-sand-300/80">
          No wrong answer. It changes what would actually help — not a category
          you have to defend.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {STATE_LABELS.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => onPick(s.key)}
              className="w-full rounded-2xl border border-white/5 bg-ink-800/60 p-5 text-left transition hover:border-white/15 hover:bg-ink-800/90"
            >
              <p className="font-serif text-xl text-sand-200">{s.label}</p>
              <p className="mt-1 text-sm text-sand-300/70">{s.hint}</p>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button type="button" onClick={onSkip} className="btn-quiet">
          Skip and just talk →
        </button>
      </div>
    </div>
  );
}

function OpeningInvitation({ state }: { state: FeelingState | null }) {
  const opening = state
    ? "You said what's closest. Say a little more, in whatever words come. One line is enough."
    : "Wherever you are, say a little. One line is enough. Rough is fine.";
  return (
    <div className="rounded-2xl bg-ink-900/70 px-4 py-3 text-sand-300/80">
      {opening}
    </div>
  );
}

function ActionRow() {
  return (
    <div className="flex flex-wrap gap-2 pt-2 text-xs">
      <Link href="/dial" className="chip hover:text-sand-200">
        → Take the Dial
      </Link>
      <Link href="/reframe" className="chip hover:text-sand-200">
        → Reframe a thought
      </Link>
      <Link href="/skills" className="chip hover:text-sand-200">
        → Swipe Deck
      </Link>
      <Link href="/reparenting" className="chip hover:text-sand-200">
        → Reparenting
      </Link>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sand-300/70"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function trim(s: string, n: number): string {
  s = s.trim().replace(/\s+/g, " ");
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/** Minimal markdown — bold only, and paragraph breaks. Keeps LLM output readable without HTML injection. */
function renderMarkdownLite(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={i} className="font-semibold text-sand-100">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
