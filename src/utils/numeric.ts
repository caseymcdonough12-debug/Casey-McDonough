/** Parses a numeric answer, stripping $, %, commas, "x", and surrounding whitespace. */
export function parseNumericInput(input: string): number | null {
  const cleaned = input.trim().replace(/[$,%x]/gi, '').replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function isNumericCorrect(
  input: string,
  correctValue: number,
  tolerance = 0.01
): boolean {
  const parsed = parseNumericInput(input);
  if (parsed === null) return false;
  return Math.abs(parsed - correctValue) <= tolerance;
}
