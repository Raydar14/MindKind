import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, SAFETY_HANDOFF_MESSAGE } from "@/lib/companion/system-prompt";
import { fallbackReply } from "@/lib/companion/fallback";
import { detectUrgency, type ConvoTurn } from "@/lib/companion/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  turns: ConvoTurn[];
  context?: {
    identity?: string;
    values?: string[];
  };
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  const turns = Array.isArray(body?.turns) ? body.turns : [];
  if (turns.length === 0) return json({ error: "no turns" }, 400);

  const lastUser = [...turns].reverse().find((t) => t.role === "user");

  // Safety short-circuit always runs, key or no key.
  if (lastUser && detectUrgency(lastUser.content)) {
    return json({ reply: SAFETY_HANDOFF_MESSAGE, source: "safety" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return json({ reply: fallbackReply(turns), source: "fallback" });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const messages = turns
      .filter((t) => t.role === "user" || t.role === "assistant")
      .map((t) => ({
        role: t.role,
        content: t.state && t.role === "user"
          ? `[state: ${t.state}] ${t.content}`
          : t.content,
      }));

    const ctxSuffix = buildContextSuffix(body.context);
    const res = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 700,
      system: ctxSuffix ? `${SYSTEM_PROMPT}\n\n${ctxSuffix}` : SYSTEM_PROMPT,
      messages,
    });
    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    return json({ reply: text || fallbackReply(turns), source: "claude" });
  } catch (err) {
    console.error("companion error", err);
    return json({ reply: fallbackReply(turns), source: "fallback-error" });
  }
}

function buildContextSuffix(ctx: Body["context"]): string {
  if (!ctx) return "";
  const parts: string[] = [];
  if (ctx.identity) {
    parts.push(
      `This user has set an identity line they want to move toward: "${ctx.identity}". Reference it briefly ONLY when it fits — not as a slogan.`,
    );
  }
  if (ctx.values && ctx.values.length > 0) {
    parts.push(
      `Their stated values right now are: ${ctx.values.join(", ")}. Let their choices be informed by these when relevant; don't lecture them with the list.`,
    );
  }
  if (parts.length === 0) return "";
  return `## About this person\n${parts.join(" ")}`;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
