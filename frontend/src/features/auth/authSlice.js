import { createSlice } from "@reduxjs/toolkit";

const stored = JSON.parse(localStorage.getItem("auth")) || {};

const initialState = {
  accessToken: stored.accessToken || null,
  refreshToken: stored.refreshToken || null,
  user: stored.user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      localStorage.setItem(
        "auth",
        JSON.stringify({ accessToken, refreshToken, user })
      );
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
