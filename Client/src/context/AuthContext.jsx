/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'currentUser';
const PENDING_EMAIL_KEY = 'pendingEmail';

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem(TOKEN_KEY) || null
    );
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(USER_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const saveToken = useCallback((token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            setAccessToken(token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            setAccessToken(null);
        }
    }, []);

    const saveUser = useCallback((userData) => {
        if (userData) {
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem(USER_KEY);
            setUser(null);
        }
    }, []);

    const setPendingEmail = useCallback((email) => {
        if (email) {
            sessionStorage.setItem(PENDING_EMAIL_KEY, email);
        } else {
            sessionStorage.removeItem(PENDING_EMAIL_KEY);
        }
    }, []);

    const getPendingEmail = useCallback(() => {
        return sessionStorage.getItem(PENDING_EMAIL_KEY) || '';
    }, []);

    const login = useCallback(
        async (credentials) => {
            const data = await authApi.login(credentials);
            saveToken(data.accessToken);
            saveUser(data.user);
            return data;
        },
        [saveToken, saveUser]
    );

    const register = useCallback(
        async (payload) => {
            const data = await authApi.register(payload);
            setPendingEmail(payload.email);
            return data;
        },
        [setPendingEmail]
    );

    const verifyEmail = useCallback(async (payload) => {
        const data = await authApi.verifyEmail(payload);
        setPendingEmail(null);
        return data;
    }, [setPendingEmail]);

    const resendOtp = useCallback(async (email) => {
        return await authApi.resendOtp({ email });
    }, []);

    const fetchMe = useCallback(
        async (token = accessToken) => {
            if (!token) return null;
            try {
                const data = await authApi.getMe(token);
                saveUser(data.user);
                return data.user;
            } catch {
                return null;
            }
        },
        [accessToken, saveUser]
    );

    const refreshAccessToken = useCallback(async () => {
        const data = await authApi.refreshToken();
        saveToken(data.accessToken);
        return data.accessToken;
    }, [saveToken]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            /* clear local state even if server logout fails */
        }
        saveToken(null);
        saveUser(null);
    }, [saveToken, saveUser]);

    const logoutAll = useCallback(async () => {
        try {
            await authApi.logoutAll();
        } catch {
            /* clear local state even if server logout fails */
        }
        saveToken(null);
        saveUser(null);
    }, [saveToken, saveUser]);

    const value = useMemo(
        () => ({
            accessToken,
            user,
            loading,
            setLoading,
            login,
            register,
            verifyEmail,
            resendOtp,
            fetchMe,
            refreshAccessToken,
            logout,
            logoutAll,
            setPendingEmail,
            getPendingEmail,
            isAuthenticated: Boolean(accessToken),
        }),
        [
            accessToken,
            user,
            loading,
            login,
            register,
            verifyEmail,
            resendOtp,
            fetchMe,
            refreshAccessToken,
            logout,
            logoutAll,
            setPendingEmail,
            getPendingEmail,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
