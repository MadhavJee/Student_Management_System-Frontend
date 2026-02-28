import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fetch profile on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await authService.getProfile();
                    setUser(res.data);
                } catch {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = useCallback(async (credentials) => {
        const res = await authService.login(credentials);
        const { user: userData, token: newToken } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return res;
    }, []);

    const register = useCallback(async (userData) => {
        const res = await authService.register(userData);
        const { user: newUser, token: newToken } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        return res;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
