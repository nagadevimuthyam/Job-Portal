export const selectAuthState = (state) => state.auth;
export const selectAuthUser = (state) => selectAuthState(state).user;
export const selectAccessToken = (state) => selectAuthState(state).accessToken;
