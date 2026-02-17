/**
 * Zustand store — now syncs all data with the Express/MongoDB backend.
 * Local state is populated from the API on init, and every mutation
 * is written through to the server so MongoDB stays in sync.
 */
import { create } from 'zustand';
import { RoutineItem, CompletionRecord, StreakData, DayStats, Insight } from '../types';
import { calculateCurrentStreak, calculateBestStreak } from '../utils/streaks';
import { generateInsights } from '../analytics/insights';
import { getToday, getLastNDays } from '../utils/dateHelpers';
import * as api from '../api';

interface RoutineStore {
    // State
    routines: RoutineItem[];
    completions: CompletionRecord[];
    isDarkMode: boolean;
    isLoading: boolean;
    error: string | null;

    // ── Bootstrap: fetch from API ──
    fetchAll: () => Promise<void>;

    // ── Actions: task management (API-synced) ──
    toggleTask: (routineId: string) => Promise<void>;
    addRoutine: (routine: Omit<RoutineItem, 'id'> & { id?: string }) => Promise<void>;
    updateRoutine: (id: string, updates: Partial<RoutineItem>) => Promise<void>;
    deleteRoutine: (id: string) => Promise<void>;
    reorderRoutines: (routines: RoutineItem[]) => void;
    toggleRequired: (id: string) => Promise<void>;

    // ── Actions: settings (API-synced) ──
    toggleDarkMode: () => void;
    resetRoutines: () => Promise<void>;
    clearHistory: () => Promise<void>;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
    routines: [],
    completions: [],
    isDarkMode: true,
    isLoading: false,
    error: null,

    // ── Load everything from the database ──
    fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const [apiRoutines, apiCompletions] = await Promise.all([
                api.fetchRoutines(),
                api.fetchCompletions(),
            ]);

            // Map API shapes → local shapes
            const routines: RoutineItem[] = apiRoutines.map(r => ({
                id: r.routineId,
                title: r.title,
                startTime: r.startTime,
                endTime: r.endTime,
                category: r.category as RoutineItem['category'],
                required: r.required,
            }));

            const completions: CompletionRecord[] = apiCompletions.map(c => ({
                date: c.date,
                routineId: c.routineId,
                completed: c.completed,
                timestamp: c.timestamp,
            }));

            set({ routines, completions, isLoading: false });
        } catch (err: any) {
            console.error('fetchAll error:', err.message);
            set({ isLoading: false, error: err.message });
        }
    },

    // ── Toggle a task's completion for today ──
    toggleTask: async (routineId: string) => {
        const today = getToday();

        // Optimistic update
        set(state => {
            const existing = state.completions.find(
                c => c.date === today && c.routineId === routineId
            );
            if (existing) {
                return {
                    completions: state.completions.map(c =>
                        c.date === today && c.routineId === routineId
                            ? { ...c, completed: !c.completed, timestamp: Date.now() }
                            : c
                    ),
                };
            } else {
                return {
                    completions: [
                        ...state.completions,
                        { date: today, routineId, completed: true, timestamp: Date.now() },
                    ],
                };
            }
        });

        // Sync to API
        try {
            await api.toggleCompletion(today, routineId);
        } catch (err: any) {
            console.error('toggleTask API error:', err.message);
        }
    },

    // ── Add a new routine ──
    addRoutine: async (routine) => {
        const id = routine.id || `r_${Date.now()}`;
        const newItem: RoutineItem = { ...routine, id } as RoutineItem;

        // Optimistic
        set(state => ({ routines: [...state.routines, newItem] }));

        try {
            await api.createRoutine({
                routineId: id,
                title: newItem.title,
                startTime: newItem.startTime,
                endTime: newItem.endTime,
                category: newItem.category,
                required: newItem.required,
            });
        } catch (err: any) {
            console.error('addRoutine API error:', err.message);
        }
    },

    // ── Update an existing routine ──
    updateRoutine: async (id: string, updates: Partial<RoutineItem>) => {
        // Optimistic
        set(state => ({
            routines: state.routines.map(r => (r.id === id ? { ...r, ...updates } : r)),
        }));

        try {
            await api.updateRoutine(id, updates);
        } catch (err: any) {
            console.error('updateRoutine API error:', err.message);
        }
    },

    // ── Delete a routine ──
    deleteRoutine: async (id: string) => {
        // Optimistic
        set(state => ({
            routines: state.routines.filter(r => r.id !== id),
        }));

        try {
            await api.deleteRoutine(id);
        } catch (err: any) {
            console.error('deleteRoutine API error:', err.message);
        }
    },

    reorderRoutines: (routines: RoutineItem[]) => {
        set({ routines });
    },

    // ── Toggle a routine's "required" state ──
    toggleRequired: async (id: string) => {
        const routine = get().routines.find(r => r.id === id);
        if (!routine) return;

        const newVal = !routine.required;
        set(state => ({
            routines: state.routines.map(r =>
                r.id === id ? { ...r, required: newVal } : r
            ),
        }));

        try {
            await api.updateRoutine(id, { required: newVal } as any);
        } catch (err: any) {
            console.error('toggleRequired API error:', err.message);
        }
    },

    toggleDarkMode: () => {
        set(state => ({ isDarkMode: !state.isDarkMode }));
    },

    // ── Reset routines to defaults (via API) ──
    resetRoutines: async () => {
        try {
            await api.resetRoutines();
            // Re-fetch from DB
            await get().fetchAll();
        } catch (err: any) {
            console.error('resetRoutines error:', err.message);
        }
    },

    // ── Clear all completion history (via API) ──
    clearHistory: async () => {
        set({ completions: [] });
        try {
            await api.clearHistory();
        } catch (err: any) {
            console.error('clearHistory error:', err.message);
        }
    },
}));
