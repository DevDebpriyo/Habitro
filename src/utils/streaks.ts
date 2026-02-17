/**
 * Streak calculation utilities.
 * Pure functions operating on completion records.
 */
import { CompletionRecord, RoutineItem } from '../types';
import { formatDateISO } from './dateHelpers';

/**
 * Calculate the completion rate for a given date.
 * Returns a number between 0 and 1.
 */
function getDayCompletionRate(
    date: string,
    completions: CompletionRecord[],
    routines: RoutineItem[]
): number {
    const dayRecords = completions.filter(c => c.date === date);
    if (dayRecords.length === 0) return 0;

    const completed = dayRecords.filter(c => c.completed).length;
    const total = routines.length;
    return total > 0 ? completed / total : 0;
}

/**
 * A day counts as "successful" if ≥ 70% of routines are completed.
 */
const SUCCESS_THRESHOLD = 0.7;

/**
 * Calculate the current streak — consecutive days ending today
 * where the completion rate ≥ SUCCESS_THRESHOLD.
 */
export function calculateCurrentStreak(
    completions: CompletionRecord[],
    routines: RoutineItem[]
): number {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = formatDateISO(d);

        const rate = getDayCompletionRate(dateStr, completions, routines);

        if (rate >= SUCCESS_THRESHOLD) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Calculate the best (longest) streak in the completion history.
 */
export function calculateBestStreak(
    completions: CompletionRecord[],
    routines: RoutineItem[]
): number {
    // Get all unique dates sorted ascending
    const dates = [...new Set(completions.map(c => c.date))].sort();
    if (dates.length === 0) return 0;

    let bestStreak = 0;
    let currentStreak = 0;

    for (const date of dates) {
        const rate = getDayCompletionRate(date, completions, routines);
        if (rate >= SUCCESS_THRESHOLD) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    return bestStreak;
}
