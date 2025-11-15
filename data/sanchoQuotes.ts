export interface SanchoQuote {
  quote: string;
  context?: string;
}

export const sanchoQuotes: SanchoQuote[] = [
  {
    quote: "I was born to live dying; and let him die who would live living.",
    context: "Part II, Chapter 59"
  },
  {
    quote: "A closed mouth catches no flies.",
    context: "Part II, Chapter 43"
  },
  {
    quote: "Tell me what company thou keepest, and I'll tell thee what thou art.",
    context: "Part II, Chapter 10"
  },
  {
    quote: "Well-gotten gain proves itself.",
    context: "Part I, Chapter 23"
  },
  {
    quote: "He who sings frightens away his ills.",
    context: "Part I, Chapter 22"
  },
  {
    quote: "A bird in the hand is worth two in the bush.",
    context: "Part I, Chapter 31"
  },
  {
    quote: "Better a sparrow in the hand than a vulture on the wing.",
    context: "Part II, Chapter 12"
  },
  {
    quote: "Honesty's the best policy.",
    context: "Part II, Chapter 33"
  },
  {
    quote: "I have always heard say that to do a kindness to clowns is to throw water into the sea.",
    context: "Part I, Chapter 23"
  },
  {
    quote: "One should not talk of halters in the house of the hanged.",
    context: "Part I, Chapter 25"
  },
  {
    quote: "Let every man mind his own business, and not meddle with what does not concern him.",
    context: "Part II, Chapter 8"
  },
  {
    quote: "The proof of the pudding is in the eating.",
    context: "Part I, Chapter 39"
  },
  {
    quote: "Fortune leaves always some door open to come at a remedy.",
    context: "Part I, Chapter 15"
  },
  {
    quote: "Where one door shuts, another opens.",
    context: "Part I, Chapter 21"
  },
  {
    quote: "I say patience, and shuffle the cards.",
    context: "Part II, Chapter 23"
  },
  {
    quote: "Every man is the son of his own works.",
    context: "Part I, Chapter 4"
  },
  {
    quote: "He who says what he likes, shall hear what he does not like.",
    context: "Part II, Chapter 19"
  },
  {
    quote: "The belly carries the legs, and not the legs the belly.",
    context: "Part II, Chapter 34"
  },
  {
    quote: "Let us forget and forgive injuries.",
    context: "Part II, Chapter 3"
  },
  {
    quote: "Diligence is the mother of good fortune.",
    context: "Part II, Chapter 43"
  },
  {
    quote: "One swallow does not make a summer.",
    context: "Part I, Chapter 13"
  },
  {
    quote: "Fine feathers make fine birds.",
    context: "Part I, Chapter 47"
  },
  {
    quote: "God, who gives the wound, gives the salve.",
    context: "Part II, Chapter 19"
  },
  {
    quote: "Let sleeping dogs lie.",
    context: "Part II, Chapter 49"
  },
  {
    quote: "Tell me thy company, and I will tell thee what thou art.",
    context: "Part II, Chapter 68"
  }
];

/**
 * Returns a random Sancho Panza quote from Don Quixote
 */
export function getRandomSanchoQuote(): SanchoQuote {
  const randomIndex = Math.floor(Math.random() * sanchoQuotes.length);
  return sanchoQuotes[randomIndex];
}
