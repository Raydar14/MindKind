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

  // Safety short-circuit always runs, key or no key. Streamed as one chunk.
  if (lastUser && detectUrgency(lastUser.content)) {
    return streamOneShot(SAFETY_HANDOFF_MESSAGE, "safety");
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return streamOneShot(fallbackReply(turns), "fallback");
  }

  // Real streaming from Claude.
  try {
    const client = new Anthropic({ apiKey: key });
    const messages = turns
      .filter((t) => t.role === "user" || t.role === "assistant")
      .map((t) => ({
        role: t.role,
        content:
          t.state && t.role === "user"
            ? `[state: ${t.state}] ${t.content}`
            : t.content,
      }));
    const system = body.context
      ? `${SYSTEM_PROMPT}\n\n${buildContextSuffix(body.context)}`
      : SYSTEM_PROMPT;

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          const stream = client.messages.stream({
            model: "claude-opus-4-7",
            max_tokens: 700,
            system,
            messages,
          });
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(enc.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("companion stream error", err);
          controller.enqueue(enc.encode(fallbackReply(turns)));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-companion-source": "claude",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("companion error", err);
    return streamOneShot(fallbackReply(turns), "fallback-error");
  }
}

function streamOneShot(text: string, source: string): Response {
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-companion-source": source,
      "cache-control": "no-store",
    },
  });
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
