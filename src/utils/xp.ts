export const BASE_XP_PER_QUESTION = 10;

/**
 * Boost ceiling scales with proficiency: someone reporting more experience
 * gets a higher multiplier on easy/foundational tiers. Proficiency 1 (no
 * experience) always yields a flat 1x — there's no "review" content for them.
 */
export function computeXpMultiplier(
  difficultyTier: number,
  proficiency: number
): number {
  if (proficiency <= 1) return 1;
  if (difficultyTier >= proficiency) return 1;

  const boostMax = 1 + (proficiency - 1) * 0.25;
  const t = (proficiency - difficultyTier) / (proficiency - 1);
  return 1 + (boostMax - 1) * t;
}

export function xpForAnswer(difficultyTier: number, proficiency: number) {
  const multiplier = computeXpMultiplier(difficultyTier, proficiency);
  return Math.round(BASE_XP_PER_QUESTION * multiplier);
}

export function estimatedProficiencyFromExperience(
  experience: 'none' | '1-3' | '4+'
): number {
  switch (experience) {
    case 'none':
      return 1;
    case '1-3':
      return 3;
    case '4+':
      return 5;
  }
}
