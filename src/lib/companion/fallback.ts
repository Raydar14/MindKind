import { SAFETY_HANDOFF_MESSAGE } from "./system-prompt";
import { detectUrgency, type ConvoTurn, type FeelingState } from "./state";

type Ctx = {
  state: FeelingState | null;
  turnCount: number;
  lastUser: string;
};

export function fallbackReply(turns: ConvoTurn[]): string {
  const lastUser = [...turns].reverse().find((t) => t.role === "user");
  const text = lastUser?.content ?? "";

  if (detectUrgency(text)) return SAFETY_HANDOFF_MESSAGE;

  const ctx: Ctx = {
    state: lastUser?.state ?? null,
    turnCount: turns.filter((t) => t.role === "user").length,
    lastUser: text,
  };

  // Opening turn — state is set, first user message just arrived.
  if (ctx.turnCount <= 1) return openingByState(ctx);

  // Later turns — reflect briefly, keep it short, one small offering.
  return midByState(ctx);
}

function openingByState({ state, lastUser }: Ctx): string {
  switch (state) {
    case "panic":
      return [
        "You're here. Feet on the floor. One long exhale — longer than the in-breath.",
        "",
        "Don't try to breathe deep yet. Just let air leave. Name three things you can see, out loud if you can.",
        "",
        "I'm here. Tell me when the exhale has landed.",
      ].join("\n");
    case "anxious":
      return [
        "The loop is loud. That doesn't make it true — but it does need something small to stand on.",
        "",
        "Try one: name the fear in one sentence, or press your feet into the floor for ten seconds. Which fits better right now?",
      ].join("\n");
    case "numb":
      return [
        "Numb is a shape, not a failure. The body is protecting you.",
        "",
        "One small sensory contact: cold water on the wrists, a sour taste, a sound you like. Which is closest to you right now?",
      ].join("\n");
    case "overwhelmed":
      return [
        "Too much at once. Let's not sort all of it.",
        "",
        "What's the single thing on your mind that's loudest? One line, however messy.",
      ].join("\n");
    case "angry":
      return [
        "Anger usually means something you care about wasn't honored. It's information.",
        "",
        "Before we look at what: is there space you can put between you and the situation for the next ten minutes? Walk, cold water, close a door — any of those.",
      ].join("\n");
    case "grief":
      return [
        "Grief doesn't need an exercise to stop it. It needs room.",
        "",
        "You don't have to explain. If you want, tell me the shape of it — a memory, a name, a moment. Or just sit here with me.",
      ].join("\n");
    case "ruminating":
      return [
        "The same thought keeps arriving. Not because you haven't thought hard enough — because thinking isn't the way out of this one.",
        "",
        "Two options: shift attention (30 seconds of a strong sensory input), or name the loop out loud (‘I am having the thought that…'). Which sounds more doable?",
      ].join("\n");
    case "shame":
      return [
        "Shame wants you to disappear. It confuses ‘I did a bad thing' with ‘I am bad.' They're not the same sentence.",
        "",
        "One line, if you can: what happened, and what did you make it mean about you?",
      ].join("\n");
    case "exhausted":
      return [
        "Exhausted is real. Not a character flaw, not a discipline problem. The body is asking.",
        "",
        "The next small thing might just be water, or lying down for ten minutes without your phone. Is either possible?",
      ].join("\n");
    case "activated":
      return [
        "An old fear or old fight woke up. Your system is doing what it learned to do to keep you alive.",
        "",
        "Ground first, story second. Look around and name three things that tell you where you are right now — not where you were.",
      ].join("\n");
    case "curious":
      return [
        "Good — a curious moment is a good time to build a skill you can reach for when it's harder.",
        "",
        "What do you want to look at?",
      ].join("\n");
    default:
      return [
        `You said: “${trim(lastUser, 200)}”.`,
        "",
        "Before I offer anything: are you physically safe right now? And is this more anxiety, sadness, anger, numbness, or something else?",
      ].join("\n");
  }
}

function midByState({ state, lastUser }: Ctx): string {
  const reflect = `Noticing what you said — “${trim(lastUser, 140)}”.`;
  const skillLine = (() => {
    switch (state) {
      case "panic":
        return "Stay with the exhale. When you can, tell me one thing you can see, hear, and feel.";
      case "anxious":
        return "The thought is a passenger, not the driver. What's one small action that would still fit if the thought were true — and one that would fit if it weren't?";
      case "numb":
        return "Numb needs contact, not analysis. Cold water on your face or hands. Or a slow bite of something sharp. Then come back.";
      case "overwhelmed":
        return "One thing. Not all of it. Which of what you just named is the smallest true next step — 30 seconds long?";
      case "angry":
        return "Anger tells you a need wasn't met. Try: ‘I feel _____ because I need _____.' What goes in those blanks?";
      case "grief":
        return "You don't need to solve this. If you want, describe one specific detail — a smell, a phrase they used, a room. Or we can be quiet together.";
      case "ruminating":
        return "Try noticing the thought without arguing with it: ‘I'm having the thought that ____.' Say it once, out loud if you can. Then do one thing that has nothing to do with the thought for two minutes.";
      case "shame":
        return "Shame lies about identity. A cleaner sentence: ‘I did something I regret.' Or: ‘I acted in a way I don't want to act again.' Does either land more true?";
      case "exhausted":
        return "Behavioral activation at the smallest scale. Water. Stand up. Open a window. Not to feel great — to make one contact with the world. Then rest.";
      case "activated":
        return "You're safe here, in this room, in this year. Name today's date if you can. Then one thing your senses can confirm.";
      case "curious":
        return "Say more. What's the specific thing you want to understand better?";
      default:
        return "One small next action — 60 seconds or under. Water, a step outside, or a single sentence written down. Which fits?";
    }
  })();

  if (detectUrgency(lastUser)) return SAFETY_HANDOFF_MESSAGE;

  return `${reflect}\n\n${skillLine}`;
}

function trim(s: string, n: number): string {
  s = s.trim().replace(/\s+/g, " ");
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
