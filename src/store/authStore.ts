/**
 * Auth store — manages authentication state with AsyncStorage persistence.
 */
import { create } from 'zustand';
import * as api from '../api';

interface AuthUser {
    id: string;
    name: string;
    email: string;
}

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // start true so splash shows while checking token
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.loginApi(email, password);
            await api.setToken(res.token);
            set({
                user: res.user,
                token: res.token,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch (err: any) {
            set({ isLoading: false, error: err.message || 'Login failed' });
            return false;
        }
    },

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.registerApi(name, email, password);
            await api.setToken(res.token);
            set({
                user: res.user,
                token: res.token,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch (err: any) {
            set({ isLoading: false, error: err.message || 'Registration failed' });
            return false;
        }
    },

    logout: async () => {
        await api.clearToken();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = await api.getToken();
            if (!token) {
                set({ isLoading: false, isAuthenticated: false });
                return false;
            }
            const user = await api.getMeApi();
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch {
            await api.clearToken();
            set({ isLoading: false, isAuthenticated: false, user: null, token: null });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));
