/**
 * Zustand store — syncs with Express/MongoDB backend.
 * Optimistic updates + API write-through. Clears on logout.
 */
import { create } from 'zustand';
import { RoutineItem, CompletionRecord } from '../types';
import { getToday } from '../utils/dateHelpers';
import * as api from '../api';

interface RoutineStore {
    routines: RoutineItem[];
    completions: CompletionRecord[];
    isDarkMode: boolean;
    isLoading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    toggleTask: (routineId: string) => Promise<void>;
    addRoutine: (routine: Omit<RoutineItem, 'id'> & { id?: string }) => Promise<void>;
    updateRoutine: (id: string, updates: Partial<RoutineItem>) => Promise<void>;
    deleteRoutine: (id: string) => Promise<void>;
    reorderRoutines: (routines: RoutineItem[]) => void;
    toggleRequired: (id: string) => Promise<void>;
    toggleDarkMode: () => void;
    resetRoutines: () => Promise<void>;
    clearHistory: () => Promise<void>;
    clearAll: () => void; // for logout
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
    routines: [],
    completions: [],
    isDarkMode: true,
    isLoading: false,
    error: null,

    fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const [apiRoutines, apiCompletions] = await Promise.all([
                api.fetchRoutines(),
                api.fetchCompletions(),
            ]);
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

    toggleTask: async (routineId: string) => {
        const today = getToday();
        set(state => {
            const existing = state.completions.find(c => c.date === today && c.routineId === routineId);
            if (existing) {
                return {
                    completions: state.completions.map(c =>
                        c.date === today && c.routineId === routineId ? { ...c, completed: !c.completed, timestamp: Date.now() } : c
                    )
                };
            }
            return { completions: [...state.completions, { date: today, routineId, completed: true, timestamp: Date.now() }] };
        });
        try { await api.toggleCompletion(today, routineId); } catch (err: any) { console.error('toggleTask error:', err.message); }
    },

    addRoutine: async (routine) => {
        const id = routine.id || `r_${Date.now()}`;
        const newItem: RoutineItem = { ...routine, id } as RoutineItem;
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
        } catch (err: any) { console.error('addRoutine error:', err.message); }
    },

    updateRoutine: async (id: string, updates: Partial<RoutineItem>) => {
        set(state => ({ routines: state.routines.map(r => (r.id === id ? { ...r, ...updates } : r)) }));
        try { await api.updateRoutine(id, updates); } catch (err: any) { console.error('updateRoutine error:', err.message); }
    },

    deleteRoutine: async (id: string) => {
        set(state => ({ routines: state.routines.filter(r => r.id !== id) }));
        try { await api.deleteRoutine(id); } catch (err: any) { console.error('deleteRoutine error:', err.message); }
    },

    reorderRoutines: (routines: RoutineItem[]) => set({ routines }),

    toggleRequired: async (id: string) => {
        const routine = get().routines.find(r => r.id === id);
        if (!routine) return;
        const newVal = !routine.required;
        set(state => ({ routines: state.routines.map(r => r.id === id ? { ...r, required: newVal } : r) }));
        try { await api.updateRoutine(id, { required: newVal } as any); } catch (err: any) { console.error('toggleRequired error:', err.message); }
    },

    toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

    resetRoutines: async () => {
        try { await api.resetRoutines(); await get().fetchAll(); } catch (err: any) { console.error('resetRoutines error:', err.message); }
    },

    clearHistory: async () => {
        set({ completions: [] });
        try { await api.clearHistory(); } catch (err: any) { console.error('clearHistory error:', err.message); }
    },

    // Called on logout — wipe everything
    clearAll: () => set({ routines: [], completions: [], isLoading: false, error: null }),
}));
