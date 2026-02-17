/**
 * Dummy data for the habit tracker.
 * 8 routine items + 30 days of randomised completion history.
 */
import { RoutineItem, CompletionRecord } from '../types';
import { formatDateISO } from '../utils/dateHelpers';

/** 8 routine template items (matching the design prototypes) */
export const defaultRoutines: RoutineItem[] = [
    {
        id: '1',
        title: 'Meditation',
        startTime: '07:00',
        endTime: '07:15',
        category: 'Mindfulness',
        required: true,
    },
    {
        id: '2',
        title: 'Deep Work',
        startTime: '09:00',
        endTime: '11:00',
        category: 'Work',
        required: true,
    },
    {
        id: '3',
        title: 'Morning Run',
        startTime: '06:30',
        endTime: '07:00',
        category: 'Fitness',
        required: false,
    },
    {
        id: '4',
        title: 'Journaling',
        startTime: '07:15',
        endTime: '07:30',
        category: 'Wellness',
        required: true,
    },
    {
        id: '5',
        title: 'Review Goals',
        startTime: '08:45',
        endTime: '09:00',
        category: 'Work',
        required: true,
    },
    {
        id: '6',
        title: 'Drink Water',
        startTime: 'All Day',
        endTime: '',
        category: 'Health',
        required: true,
    },
    {
        id: '7',
        title: 'Read 10 Pages',
        startTime: '20:00',
        endTime: '20:30',
        category: 'Growth',
        required: true,
    },
    {
        id: '8',
        title: 'Night Study',
        startTime: '21:00',
        endTime: '22:30',
        category: 'Mind',
        required: true,
    },
];

/**
 * Generate 30 days of randomised completion history.
 * Each routine has a base probability:
 *   - Meditation: 80%, Deep Work: 65%, Morning Run: 40%, Journaling: 75%,
 *   - Review Goals: 70%, Drink Water: 90%, Read 10 Pages: 55%, Night Study: 35%
 * Weekends have lower rates (~60% of weekday rate).
 */
function generateDummyCompletions(): CompletionRecord[] {
    const records: CompletionRecord[] = [];
    const baseProbabilities: Record<string, number> = {
        '1': 0.80,   // Meditation
        '2': 0.65,   // Deep Work
        '3': 0.40,   // Morning Run
        '4': 0.75,   // Journaling
        '5': 0.70,   // Review Goals
        '6': 0.90,   // Drink Water
        '7': 0.55,   // Read 10 Pages
        '8': 0.35,   // Night Study
    };

    // Use a seeded pseudo-random for consistent data
    let seed = 42;
    function seededRandom(): number {
        seed = (seed * 16807 + 0) % 2147483647;
        return seed / 2147483647;
    }

    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDateISO(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        for (const routine of defaultRoutines) {
            const baseProb = baseProbabilities[routine.id] ?? 0.5;
            const prob = isWeekend ? baseProb * 0.6 : baseProb;
            const completed = seededRandom() < prob;

            records.push({
                date: dateStr,
                routineId: routine.id,
                completed,
                timestamp: date.getTime() + (completed ? 1000 * 60 * 60 * 8 : 0),
            });
        }
    }

    return records;
}

export const dummyCompletions: CompletionRecord[] = generateDummyCompletions();
