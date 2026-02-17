/**
 * Smart Suggestions / Insights Engine.
 * Analyzes completion data and returns heuristic-based insights.
 */
import { CompletionRecord, RoutineItem, Insight } from '../types';
import { getLastNDays } from '../utils/dateHelpers';

/**
 * Generate smart insights from the last 30 days of completion data.
 */
export function generateInsights(
    completions: CompletionRecord[],
    routines: RoutineItem[]
): Insight[] {
    const insights: Insight[] = [];
    const last30 = getLastNDays(30);

    // === 1. Weekend drop-off ===
    const weekdayDates = last30.filter(d => {
        const day = new Date(d + 'T00:00:00').getDay();
        return day !== 0 && day !== 6;
    });
    const weekendDates = last30.filter(d => {
        const day = new Date(d + 'T00:00:00').getDay();
        return day === 0 || day === 6;
    });

    const weekdayRate = getAverageRate(weekdayDates, completions, routines);
    const weekendRate = getAverageRate(weekendDates, completions, routines);

    if (weekdayRate - weekendRate > 0.15) {
        const dropPct = Math.round((weekdayRate - weekendRate) * 100);
        insights.push({
            id: 'weekend-drop',
            icon: 'lightbulb',
            title: 'Productivity Trend',
            description: `Your completion rate drops by ${dropPct}% on weekends. Try setting easier goals for Saturdays.`,
            type: 'warning',
        });
    }

    // === 2. Best day of the week ===
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayRates: number[] = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts: number[] = [0, 0, 0, 0, 0, 0, 0];

    for (const dateStr of last30) {
        const dayIdx = new Date(dateStr + 'T00:00:00').getDay();
        const dayCompletions = completions.filter(c => c.date === dateStr);
        const completed = dayCompletions.filter(c => c.completed).length;
        const total = routines.length;
        if (total > 0) {
            dayRates[dayIdx] += completed / total;
            dayCounts[dayIdx]++;
        }
    }

    let bestDay = 0;
    let bestAvg = 0;
    for (let i = 0; i < 7; i++) {
        const avg = dayCounts[i] > 0 ? dayRates[i] / dayCounts[i] : 0;
        if (avg > bestAvg) {
            bestAvg = avg;
            bestDay = i;
        }
    }

    if (bestAvg > 0.5) {
        insights.push({
            id: 'best-day',
            icon: 'calendar_month',
            title: 'Best Day',
            description: `You are most consistent on ${dayNames[bestDay]}s, averaging ${Math.round(bestAvg * 100)}% completion.`,
            type: 'info',
        });
    }

    // === 3. Per-routine struggle ===
    for (const routine of routines) {
        const routineCompletions = completions.filter(
            c => c.routineId === routine.id && last30.includes(c.date)
        );
        const completedCount = routineCompletions.filter(c => c.completed).length;
        const rate = routineCompletions.length > 0 ? completedCount / routineCompletions.length : 1;

        if (rate < 0.4 && routine.title.toLowerCase().includes('night')) {
            insights.push({
                id: `struggle-${routine.id}`,
                icon: 'schedule',
                title: 'Time Optimization',
                description: `You miss "${routine.title}" ${Math.round((1 - rate) * 100)}% of the time. Consider moving it to an earlier slot.`,
                type: 'warning',
            });
        } else if (rate < 0.4) {
            insights.push({
                id: `struggle-${routine.id}`,
                icon: 'trending_down',
                title: 'Low Completion',
                description: `"${routine.title}" has only ${Math.round(rate * 100)}% weekly completion. Try shorter sessions.`,
                type: 'info',
            });
        }
    }

    // === 4. High performer reward ===
    const overallRate = getAverageRate(last30, completions, routines);
    if (overallRate > 0.8) {
        insights.push({
            id: 'high-performer',
            icon: 'emoji_events',
            title: 'Great Work!',
            description: `You're averaging ${Math.round(overallRate * 100)}% completion over 30 days. Keep the momentum going!`,
            type: 'info',
        });
    }

    return insights.slice(0, 3); // Show max 3 insights
}

/** Helper: average completion rate across a set of dates */
function getAverageRate(
    dates: string[],
    completions: CompletionRecord[],
    routines: RoutineItem[]
): number {
    if (dates.length === 0 || routines.length === 0) return 0;

    let totalRate = 0;
    for (const date of dates) {
        const dayCompletions = completions.filter(c => c.date === date);
        const completed = dayCompletions.filter(c => c.completed).length;
        totalRate += completed / routines.length;
    }

    return totalRate / dates.length;
}
