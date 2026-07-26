const WINDOW_SIZE = 5;
const STRUGGLE_THRESHOLD = 0.4;
const MASTERY_THRESHOLD = 1;

/**
 * Recalibrates a track's effective proficiency from actual in-lesson
 * performance, so someone who claimed "4+ years" but is genuinely
 * struggling on this track gets slowed back to standard pacing, and vice
 * versa. Runs on a rolling window rather than every single answer so one
 * lucky guess or one slip doesn't swing the multiplier.
 */
export function recalibrateProficiency(
  recentAnswers: boolean[],
  wasCorrect: boolean,
  currentProficiency: number
): { proficiency: number; recentAnswers: boolean[] } {
  const updated = [...recentAnswers, wasCorrect].slice(-WINDOW_SIZE);

  if (updated.length < WINDOW_SIZE) {
    return { proficiency: currentProficiency, recentAnswers: updated };
  }

  const accuracy = updated.filter(Boolean).length / updated.length;

  if (accuracy <= STRUGGLE_THRESHOLD && currentProficiency > 1) {
    return { proficiency: currentProficiency - 1, recentAnswers: [] };
  }

  if (accuracy >= MASTERY_THRESHOLD && currentProficiency < 5) {
    return { proficiency: currentProficiency + 1, recentAnswers: [] };
  }

  return { proficiency: currentProficiency, recentAnswers: updated };
}
