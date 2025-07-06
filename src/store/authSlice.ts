'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  name: string;
  email: string;
  fraudsReported: number;
  coins: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitialState: (state) => {
        try {
            const token = localStorage.getItem('ride-guard-token');
            const user = localStorage.getItem('ride-guard-user');
            if (token && user) {
                state.token = token;
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
        state.loading = false;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('ride-guard-user', JSON.stringify(action.payload.user));
      localStorage.setItem('ride-guard-token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ride-guard-user');
      localStorage.removeItem('ride-guard-token');
    },
  },
});

export const { setInitialState, loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
