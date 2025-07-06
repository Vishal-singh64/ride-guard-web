'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you'd check for a token in localStorage or cookies
        // to see if the user is already logged in.
        const storedUser = localStorage.getItem('ride-guard-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await post<{ success: boolean; user: User, message?: string }>(ApiRoutes.LOGIN, { email, password });
        if (response.success) {
            setUser(response.user);
            localStorage.setItem('ride-guard-user', JSON.stringify(response.user));
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ride-guard-user');
        // In a real app, you'd also call a logout endpoint to invalidate the token.
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
