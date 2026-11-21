import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux Slice for managing JWT access and refresh tokens.
 */
const authSlice = createSlice({
  name: "auth", // Accessible as state.auth.access and state.auth.refresh
  initialState: {
    access: localStorage.getItem("access") || null,
    refresh: localStorage.getItem("refresh") || null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      if (action.payload.access) {
        localStorage.setItem("access", action.payload.access);
      }
      if (action.payload.refresh) {
        localStorage.setItem("refresh", action.payload.refresh);
      }
    },
    clearTokens: (state) => {
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

// Actions to use in components
export const { setTokens, clearTokens } = authSlice.actions;

// Reducer to register in store
export default authSlice.reducer;
