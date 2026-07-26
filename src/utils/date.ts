export function todayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(aStr: string, bStr: string): number {
  const a = new Date(`${aStr}T00:00:00`);
  const b = new Date(`${bStr}T00:00:00`);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

/**
 * Streak only advances on real activity (answering/completing a lesson),
 * never on merely opening the app. No freeze, no grace period — a full
 * missed day resets it to a fresh 1 on the next activity.
 */
export function nextStreakOnActivity(
  streak: number,
  lastActiveDate: string | null
): { streak: number; lastActiveDate: string } {
  const today = todayStr();

  if (lastActiveDate === today) {
    return { streak, lastActiveDate: today };
  }

  if (lastActiveDate !== null && daysBetween(today, lastActiveDate) === 1) {
    return { streak: streak + 1, lastActiveDate: today };
  }

  return { streak: 1, lastActiveDate: today };
}

/** Streak to display before any activity today — reflects a broken streak honestly. */
export function displayStreak(streak: number, lastActiveDate: string | null): number {
  if (lastActiveDate === null) return 0;
  const today = todayStr();
  if (daysBetween(today, lastActiveDate) > 1) return 0;
  return streak;
}
