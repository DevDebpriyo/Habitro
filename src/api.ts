/**
 * API client — centralized HTTP calls to the Express backend.
 * Includes auth endpoints and auto-attaches JWT Bearer token.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️  Use EXPO_PUBLIC_API_URL for production deployment
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.249.209.132:3001';

const TOKEN_KEY = 'auth_token';

// ── Token management ──
let cachedToken: string | null = null;

export async function getToken(): Promise<string | null> {
    if (cachedToken) return cachedToken;
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
}

export async function setToken(token: string): Promise<void> {
    cachedToken = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
    cachedToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
}

// ── Generic fetch helper with auth ──
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(body.error || `API ${res.status}`);
    }
    return res.json() as Promise<T>;
}

// ═══════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════

export interface AuthResponse {
    token: string;
    user: { id: string; name: string; email: string };
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
}

export function loginApi(email: string, password: string): Promise<AuthResponse> {
    return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function registerApi(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
}

export function getMeApi(): Promise<UserProfile> {
    return apiFetch('/api/auth/me');
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
