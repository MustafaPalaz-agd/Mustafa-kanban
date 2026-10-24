const TONES = ["#5f9ee8", "#e5649f", "#d99a1f", "#3aa583", "#8a6fd6"];

/** Etiket adından deterministik bir renk üretir. */
export function labelTone(label: string): string {
  let hash = 0;
  for (const char of label) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 9973;
  }
  return TONES[hash % TONES.length] ?? TONES[0]!;
}
