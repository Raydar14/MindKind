export type Sense = "touch" | "taste" | "sight" | "sound" | "smell" | "movement";
export type Target = "calm" | "activate" | "focus" | "comfort" | "connect";

export type Skill = {
  id: string;
  title: string;
  body: string;
  sense: Sense;
  target: Target;
};

export const SKILLS: Skill[] = [
  { id: "sour-candy", title: "Let a sour candy ground your tongue", body: "The sharpness pulls attention out of the head, back to the mouth.", sense: "taste", target: "activate" },
  { id: "warm-towels", title: "Fold warm towels slowly", body: "Straight from the dryer. Notice the heat leaving one, entering the other.", sense: "touch", target: "comfort" },
  { id: "smell-pet", title: "Smell your pet", body: "Their neck, their paws. It's a very old grounding.", sense: "smell", target: "connect" },
  { id: "watch-fish", title: "Watch fish for two minutes", body: "In a tank, in a video. The eyes learn to slow with them.", sense: "sight", target: "calm" },
  { id: "stack-rocks", title: "Stack small rocks or coins", body: "The hand asks for care. The tower asks for patience. Both help.", sense: "movement", target: "focus" },
  { id: "hum-low", title: "Hum a low note for one minute", body: "The vagus nerve is threaded through the throat. Hum reaches it.", sense: "sound", target: "calm" },
  { id: "cold-water", title: "Splash cold water on your face", body: "Trigger the mammalian dive reflex. Heart slows within seconds.", sense: "touch", target: "calm" },
  { id: "sway", title: "Sway side to side, slowly", body: "The rocking chair the body remembers from very early.", sense: "movement", target: "comfort" },
  { id: "watch-clouds", title: "Watch clouds for three minutes", body: "The sky is very patient. Let it teach you.", sense: "sight", target: "calm" },
  { id: "peel-orange", title: "Peel a citrus fruit", body: "The oil under the skin. The sharp smell that arrives before the taste.", sense: "smell", target: "activate" },
  { id: "barefoot", title: "Five barefoot minutes on grass or wood", body: "Skin on ground. Older than shoes. The nervous system knows.", sense: "touch", target: "calm" },
  { id: "self-hug", title: "Hug yourself and sway", body: "Arms across. Rock gently. Nothing to say to yourself yet.", sense: "touch", target: "comfort" },
  { id: "bubble-wrap", title: "Pop bubble wrap, slowly", body: "One bubble at a time. Let the pop finish before the next.", sense: "sound", target: "activate" },
  { id: "bloopers", title: "Watch bloopers for two minutes", body: "Laughter shifts state faster than reasoning does.", sense: "sight", target: "activate" },
  { id: "one-song-dance", title: "Dance to one song, alone", body: "Awful is fine. Small movements count. The body wants to move.", sense: "movement", target: "activate" },
  { id: "warm-shower", title: "Warm shower focus on temperature", body: "Attention on the water, not on the day.", sense: "touch", target: "comfort" },
  { id: "candle-breath", title: "Breathe out a candle, without blowing it", body: "Long, soft exhale. Imagine bending the flame, not extinguishing.", sense: "sight", target: "calm" },
  { id: "tea-slow", title: "Make tea slowly, on purpose", body: "Heat, wait, pour, steep. Watch the color arrive.", sense: "sight", target: "calm" },
  { id: "kind-text", title: "Send one kind, short text", body: "‘Thinking of you.' No ask. No context. Just contact.", sense: "sound", target: "connect" },
  { id: "cross-arms", title: "Cross arms and tap alternately", body: "Slow bilateral taps on shoulders. 30 seconds. Soothes.", sense: "movement", target: "calm" },
  { id: "puzzle-piece", title: "Do one puzzle piece", body: "Not the whole puzzle. Just one. Attention finds a rhythm.", sense: "sight", target: "focus" },
  { id: "letter-yourself", title: "Write one line to your future self", body: "‘When you read this, remember you made it through today.'", sense: "sight", target: "connect" },
  { id: "orange-peel", title: "Bite an orange peel", body: "Sharp, bitter, alive. Interrupts a spiral in about six seconds.", sense: "taste", target: "activate" },
  { id: "smell-book", title: "Smell an old book", body: "Vanillin and dust. Time, in a paper form.", sense: "smell", target: "calm" },
  { id: "hand-lotion", title: "Slow hand lotion", body: "One hand at a time. Notice the scent land, then leave.", sense: "smell", target: "comfort" },
  { id: "walk-slow", title: "Walk one block, half speed", body: "See what your body notices at half the speed.", sense: "movement", target: "calm" },
  { id: "eye-contact-self", title: "Look at yourself in the mirror kindly", body: "Say silently: ‘I'm glad to see you.'", sense: "sight", target: "comfort" },
  { id: "photo-slow", title: "Look at one old photo for a full minute", body: "Notice what the photo actually shows, not what you remember.", sense: "sight", target: "connect" },
  { id: "cold-spoon", title: "Cold spoon under the jaw", body: "Along the sides of the throat. Signals safety to the body.", sense: "touch", target: "calm" },
  { id: "salt-bath", title: "Warm salted water for the feet", body: "Fifteen minutes. Nothing to do. Just water and skin.", sense: "touch", target: "comfort" },
];

export const SENSES: Array<{ key: Sense; label: string }> = [
  { key: "touch", label: "Touch" },
  { key: "taste", label: "Taste" },
  { key: "sight", label: "Sight" },
  { key: "sound", label: "Sound" },
  { key: "smell", label: "Smell" },
  { key: "movement", label: "Movement" },
];

export const TARGETS: Array<{ key: Target; label: string }> = [
  { key: "calm", label: "Calm" },
  { key: "activate", label: "Activate" },
  { key: "focus", label: "Focus" },
  { key: "comfort", label: "Comfort" },
  { key: "connect", label: "Connect" },
];
