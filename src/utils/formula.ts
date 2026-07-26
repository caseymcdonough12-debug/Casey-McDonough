/** Normalizes a formula so "=sum(c2:c6)" and "= SUM( C2 : C6 )" compare equal. */
export function normalizeFormula(input: string): string {
  let normalized = input.trim().toUpperCase().replace(/\s+/g, '');
  if (!normalized.startsWith('=')) {
    normalized = `=${normalized}`;
  }
  return normalized;
}

export function isFormulaCorrect(input: string, accepted: string[]): boolean {
  const normalizedInput = normalizeFormula(input);
  return accepted.some((a) => normalizeFormula(a) === normalizedInput);
}
