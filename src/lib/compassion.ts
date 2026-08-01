export const COMPASSION_WORDS = [
  "safe", "steady", "becoming", "whole", "worthy", "capable", "enough",
  "present", "gentle", "loving", "trusting", "open", "learning", "grounded",
  "soft", "resilient", "warm", "anchored", "cared for", "accepted", "brave",
  "patient", "supported", "cherished", "valued", "here", "strong", "rooted",
  "kind",
] as const;

export const COMMON_PHRASES = [
  "This is my growth edge — I'm right where I need to be.",
  "Anxiety is a sign I care, not proof I'm failing.",
  "Every expert was once uncomfortable.",
  "Effort in discomfort is building my range.",
  "My worth is not on trial here.",
  "I'm proud of myself for showing up.",
  "Confusion is part of mastery.",
  "This challenge is making me stronger.",
  "I'm practicing staying with myself when it's hard.",
  "What I offer is enough in this moment.",
  "I can feel anxious and still be capable.",
  "I am learning, and that is brave.",
  "I can trust myself to find the next step.",
  "I am safe to take my time.",
  "I belong here.",
  "It's okay to not know yet — learning is sacred.",
  "I am allowed to tend to myself first.",
] as const;

export const SELF_PRAISE = [
  "proud", "impressed", "strong", "growing", "capable", "becoming",
  "steady", "resilient", "patient", "loving", "wise", "kind",
] as const;

export const CORE_MANTRA = [
  "No matter what happens, I am here for me.",
  "I trust myself to face the moment.",
  "My worth is not in question.",
] as const;

export const COMPASSION_CATCHERS = {
  physical: [
    "Jaw clenching",
    "Tight shoulders",
    "Shallow breathing",
    "Restlessness",
    "Stomach tension",
    "Hands fidgeting",
    "Headache starting",
  ],
  thought: [
    "I should know this already.",
    "This isn't meant for me.",
    "Other people could handle this better.",
    "If I mess this up, it's over.",
    "I'm not enough for this.",
  ],
  behavior: [
    "Avoiding eye contact",
    "Overexplaining",
    "Withdrawing or ghosting",
    "Cancelling plans suddenly",
    "Delaying starting tasks out of fear",
    "Jumping into mindless scrolling / TV",
    "Saying \"I'm fine\" when I'm not",
  ],
} as const;

export const CATCHER_CUES = [
  "Pause. Soften. This is my cue to speak kindly.",
  "This is exactly when compassion matters most.",
  "I stay with me, especially now.",
] as const;

export type ReframeInput = {
  thought: string;
  feeling?: string;
  need?: string;
};

export type Reframe = {
  observation: string;
  feeling: string;
  need: string;
  kindResponse: string;
  identityLine: string;
  anchorPhrase: string;
};

const HARSH_PATTERNS: Array<{
  test: RegExp;
  feeling: string;
  need: string;
  kind: string;
  identity: string;
}> = [
  {
    test: /\b(stupid|dumb|idiot|worthless|failure|loser)\b/i,
    feeling: "ashamed and small",
    need: "self-respect and to know my worth isn't on trial",
    kind: "You are not the label your fear reached for. You did your best with what you had, and you're growing through this.",
    identity: "I am a person who speaks to myself the way I'd speak to someone I love.",
  },
  {
    test: /\b(should|shouldn'?t|must|have to|supposed to)\b/i,
    feeling: "pressured and tight in my chest",
    need: "room to move at my own pace, and to trust my own timing",
    kind: "There is no ‘should' urgent enough to leave yourself behind for. Softening the demand doesn't lower your standards — it lets you actually reach them.",
    identity: "I am learning to choose from care instead of pressure.",
  },
  {
    test: /\b(always|never|everyone|no one|nothing|everything)\b/i,
    feeling: "overwhelmed by how big this feels",
    need: "accuracy, and a smaller, truer picture",
    kind: "This is one moment, not the whole story. One hard thing does not equal every hard thing.",
    identity: "I am someone who can tell one moment from all moments.",
  },
  {
    test: /\b(can'?t|impossible|too hard|stuck|hopeless)\b/i,
    feeling: "heavy, tired, and shut down",
    need: "gentleness, one small next step, and rest before effort",
    kind: "You don't have to solve the whole thing right now. The next kind step is the only one that's yours.",
    identity: "I am someone who can rest and still be moving forward.",
  },
  {
    test: /\b(hate|angry|furious|resent|sick of)\b/i,
    feeling: "angry, protective, and unmet",
    need: "to be heard, and for something important to me to matter",
    kind: "Your anger is telling you that something you care about wasn't honored. That's information, not a flaw.",
    identity: "I am someone who listens to my anger for what it is protecting.",
  },
  {
    test: /\b(alone|lonely|nobody|no one cares|unloved|abandon)\b/i,
    feeling: "lonely and unseen",
    need: "warmth, contact, and to know I am not the only one",
    kind: "This feeling is universal, even when it feels most private. You are one of many hearts sitting with this right now — and I'm here.",
    identity: "I am someone who reaches for warmth instead of hiding from it.",
  },
  {
    test: /\b(afraid|scared|anxious|panic|worried|nervous)\b/i,
    feeling: "anxious, alert, and looking for safety",
    need: "safety, and to know I don't have to face this alone or perfectly",
    kind: "Anxiety is a sign you care, not proof you're failing. You can feel this and still be capable.",
    identity: "I am someone who can be with fear without being led by it.",
  },
];

const DEFAULT: Omit<Reframe, "observation"> = {
  feeling: "tender and stretched",
  need: "kindness, patience, and to be with myself as I am",
  kindResponse:
    "This is a moment of suffering. Suffering is part of being human. May you be kind to yourself in this moment.",
  identityLine: "I am someone who returns to myself when it gets hard.",
  anchorPhrase: "I stay with me, especially now.",
};

export function reframe(input: ReframeInput): Reframe {
  const text = input.thought.trim();
  const match = HARSH_PATTERNS.find((p) => p.test.test(text));
  const feeling = input.feeling?.trim() || match?.feeling || DEFAULT.feeling;
  const need = input.need?.trim() || match?.need || DEFAULT.need;
  const kindResponse = match?.kind ?? DEFAULT.kindResponse;
  const identityLine = match?.identity ?? DEFAULT.identityLine;
  const anchor = pickAnchor(text);

  return {
    observation: text || "a hard thought passing through",
    feeling,
    need,
    kindResponse,
    identityLine,
    anchorPhrase: anchor,
  };
}

function pickAnchor(text: string): string {
  // Deterministic-ish pick based on text length so results are stable per input.
  const idx = Math.abs(hash(text)) % COMMON_PHRASES.length;
  return COMMON_PHRASES[idx];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
