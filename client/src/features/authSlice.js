// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

/* ── helpers ── */
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    // Decode JWT payload (base64) and check expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Read from localStorage — only trust token if it's still valid
const rawToken = localStorage.getItem('token');
const validToken = isTokenValid(rawToken) ? rawToken : null;

// If token is stale, wipe storage immediately
if (!validToken) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const userFromStorage = validToken
  ? JSON.parse(localStorage.getItem('user') || 'null')
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: validToken,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading, setError, clearError } =
  authSlice.actions;

export const selectUser  = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;

export default authSlice.reducer;
