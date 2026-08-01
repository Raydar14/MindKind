export type Distortion = {
  key: string;
  name: string;
  description: string;
  match: RegExp;
};

export const DISTORTIONS: Distortion[] = [
  {
    key: "all-or-nothing",
    name: "All-or-nothing",
    description:
      "Absolutes like ‘always,' ‘never,' ‘everyone,' ‘nothing.' One moment gets treated like the whole story.",
    match: /\b(always|never|everyone|no one|nothing|everything|completely|totally)\b/i,
  },
  {
    key: "catastrophizing",
    name: "Catastrophizing",
    description:
      "Jumping to the worst outcome. ‘Ruined,' ‘over,' ‘disaster,' ‘end of me.'",
    match: /\b(ruined|disaster|catastrophe|over( for me)?|end of me|the end|nightmare|screwed)\b/i,
  },
  {
    key: "should",
    name: "‘Should' statements",
    description:
      "Pressure language — ‘should,' ‘must,' ‘have to,' ‘supposed to.' Often masks fear as duty.",
    match: /\b(should(n't)?|must(n't)?|have to|supposed to|ought to)\b/i,
  },
  {
    key: "labeling",
    name: "Labeling",
    description:
      "Calling yourself (or someone) a name. ‘Stupid,' ‘failure,' ‘loser,' ‘broken.'",
    match: /\b(stupid|dumb|idiot|worthless|failure|loser|pathetic|broken|useless|awful)\b/i,
  },
  {
    key: "mind-reading",
    name: "Mind-reading",
    description:
      "Guessing what others think without evidence. ‘They think,' ‘they don't like,' ‘they judge.'",
    match: /\b(they (think|hate|don'?t like|judge|see me as)|everyone thinks|no one likes)\b/i,
  },
  {
    key: "personalizing",
    name: "Personalizing",
    description:
      "Making it about you when it isn't (or only) about you. ‘My fault,' ‘because of me.'",
    match: /\b(my fault|all my fault|because of me|i (ruined|broke|caused)|it's on me)\b/i,
  },
  {
    key: "emotional-reasoning",
    name: "Emotional reasoning",
    description:
      "Treating a feeling as proof. ‘I feel it, so it must be true.'",
    match: /\bi (feel|felt) (like|so) (i|it)|feels? true|must be true because i feel/i,
  },
  {
    key: "fortune-telling",
    name: "Fortune-telling",
    description:
      "Predicting the future with certainty. ‘Will fail,' ‘won't work,' ‘never going to.'",
    match: /\b(will (fail|never|not)|won'?t work|never going to|going to (fail|be alone|be rejected))\b/i,
  },
  {
    key: "helplessness",
    name: "Helplessness",
    description:
      "Language of stuckness. ‘Can't,' ‘stuck,' ‘hopeless,' ‘too hard.'",
    match: /\b(can'?t|impossible|too hard|stuck|hopeless|no way|no point)\b/i,
  },
  {
    key: "discounting-positive",
    name: "Discounting the positive",
    description:
      "Dismissing what went well. ‘Doesn't count,' ‘just luck,' ‘anyone could.'",
    match: /\b(doesn'?t count|just luck|anyone could|not that impressive|only because)\b/i,
  },
];

export function detectDistortions(text: string): Distortion[] {
  const found: Distortion[] = [];
  for (const d of DISTORTIONS) {
    if (d.match.test(text)) found.push(d);
  }
  return found;
}
