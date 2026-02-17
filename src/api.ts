/**
 * API client — centralized HTTP calls to the Express backend.
 *
 * Your PC's local IP is used so a physical Android device
 * on the same Wi-Fi network can reach the server.
 * If your IP changes, update the value below.
 */
import { Platform } from 'react-native';

// ⚠️  Your PC's local IP — both phone and PC must be on the same Wi-Fi
const LOCAL_IP = '10.249.209.109';

export const BASE_URL = `http://${LOCAL_IP}:3001`;

// ── Generic fetch helper ──
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`API ${res.status}: ${body}`);
    }
    return res.json() as Promise<T>;
}

// ═══════════════════════════════════════════
//  ROUTINES
// ═══════════════════════════════════════════

export interface ApiRoutine {
    _id: string;
    routineId: string;
    title: string;
    startTime: string;
    endTime: string;
    category: string;
    required: boolean;
    order: number;
}

export function fetchRoutines(): Promise<ApiRoutine[]> {
    return apiFetch('/api/routines');
}

export function createRoutine(data: {
    routineId: string;
    title: string;
    startTime: string;
    endTime: string;
    category: string;
    required: boolean;
}): Promise<ApiRoutine> {
    return apiFetch('/api/routines', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateRoutine(
    routineId: string,
    updates: Partial<ApiRoutine>
): Promise<ApiRoutine> {
    return apiFetch(`/api/routines/${routineId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export function deleteRoutine(routineId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/routines/${routineId}`, { method: 'DELETE' });
}

// ═══════════════════════════════════════════
//  COMPLETIONS
// ═══════════════════════════════════════════

export interface ApiCompletion {
    _id: string;
    date: string;
    routineId: string;
    completed: boolean;
    timestamp: number;
}

export function fetchCompletions(date?: string): Promise<ApiCompletion[]> {
    const query = date ? `?date=${date}` : '';
    return apiFetch(`/api/completions${query}`);
}

export function toggleCompletion(date: string, routineId: string): Promise<ApiCompletion> {
    return apiFetch('/api/completions/toggle', {
        method: 'POST',
        body: JSON.stringify({ date, routineId }),
    });
}

export function clearHistory(): Promise<{ success: boolean }> {
    return apiFetch('/api/completions', { method: 'DELETE' });
}

export function resetRoutines(): Promise<{ success: boolean; count: number }> {
    return apiFetch('/api/reset', { method: 'POST' });
}
