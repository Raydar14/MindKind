export type MicroDose = {
  id: string;
  name: string;
  duration: number; // seconds
  anchor: string;
  skill: string;
  steps: string[];
  closing: string;
};

export const MICRO_DOSES: MicroDose[] = [
  {
    id: "pause-button",
    name: "The Pause Button",
    duration: 90,
    anchor: "Before sending a text or waiting for the kettle.",
    skill: "Interoception · self-empathy · mind before mouth",
    steps: [
      "Feet on the ground. Notice the weight of your body.",
      "One slow breath. Longer out than in.",
      "Ask: what am I feeling right now?",
      "Ask: what am I needing right now?",
      "One more breath before you speak or act.",
    ],
    closing: "You chose stillness before speed. That was skill. That was love.",
  },
  {
    id: "vagus-tone",
    name: "Vagus Tone Check",
    duration: 120,
    anchor: "Before unlocking your phone, or before you start the car.",
    skill: "Nervous system regulation · parasympathetic activation",
    steps: [
      "Unclench your jaw. Let the tongue rest on the roof of the mouth.",
      "Soften your throat and shoulders.",
      "Inhale for 4 through the nose.",
      "Exhale for 8 with a soft sigh through the mouth.",
      "Continue at this pace. Each exhale, a signal of safety.",
    ],
    closing: "You spoke to your body in the language it listens to.",
  },
  {
    id: "kind-mirror",
    name: "Kind Mirror Check-In",
    duration: 60,
    anchor: "After you look in the mirror, or when you log into work.",
    skill: "Self-compassion · mood baseline",
    steps: [
      "Look at yourself as if you were meeting a dear friend.",
      "Notice one thing that is hard right now, without fixing it.",
      "Say silently: this is a moment of suffering. Suffering is part of being human.",
      "Say silently: may I be kind to myself in this moment.",
    ],
    closing: "You stayed with yourself. Look at you go.",
  },
  {
    id: "identity-affirmation",
    name: "Identity Affirmation Bite",
    duration: 45,
    anchor: "Before a meal, or before opening the first tab of the day.",
    skill: "Identity-shift · cognitive restructuring",
    steps: [
      "Pick one identity: calm · patient · honest · kind · steady.",
      "Say: today, I choose to act as someone who is …",
      "One slow breath. Let the sentence land in the body.",
    ],
    closing: "You voted for who you are becoming.",
  },
  {
    id: "boundary-breath",
    name: "Boundary Breath",
    duration: 90,
    anchor: "When resentment rises before you say ‘yes.'",
    skill: "Bridge & boundary · NVC self-empathy",
    steps: [
      "Feet on the ground. Long exhale.",
      "Silently: I'm feeling ______ because I'm needing ______.",
      "Rehearse a short, kind ‘no' or ‘not yet' in your head.",
      "One more breath. Then speak, or wait.",
    ],
    closing: "You protected a need without attacking anyone. That is love, spoken well.",
  },
  {
    id: "body-compassion",
    name: "Body Compassion (Short)",
    duration: 180,
    anchor: "After a hard hour, or when the body feels far away.",
    skill: "Somatic self-care · presence",
    steps: [
      "Hug yourself. Sway gently, side to side.",
      "Apply lotion or warmth to your hands. Notice the texture.",
      "Silently: this body lets me live and love.",
      "Silently: I am grateful for what I can feel right now.",
    ],
    closing: "You met your body with kindness. Nothing was earned. It was given.",
  },
];

export const STATE_TO_DOSE: Record<string, string> = {
  hyperaroused: "vagus-tone",
  anxious: "vagus-tone",
  foggy: "pause-button",
  numb: "body-compassion",
  hopeful: "identity-affirmation",
  exhausted: "kind-mirror",
  irritated: "boundary-breath",
  scattered: "pause-button",
};

export const DIAL_STATES: Array<{
  key: keyof typeof STATE_TO_DOSE | string;
  label: string;
  hint: string;
}> = [
  { key: "hyperaroused", label: "Wired", hint: "activated, heart racing, jaw tight" },
  { key: "anxious", label: "Anxious", hint: "looping thoughts, chest fluttering" },
  { key: "foggy", label: "Foggy", hint: "unfocused, spaced-out, slow" },
  { key: "numb", label: "Numb", hint: "flat, disconnected from the body" },
  { key: "exhausted", label: "Exhausted", hint: "depleted, heavy, empty" },
  { key: "irritated", label: "Irritated", hint: "resentful, snappy, pressure rising" },
  { key: "scattered", label: "Scattered", hint: "many tabs open in the mind" },
  { key: "hopeful", label: "Hopeful", hint: "resourced, open, curious" },
];

export function getMicroDose(id: string): MicroDose | undefined {
  return MICRO_DOSES.find((d) => d.id === id);
}
