import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data?.access) {
      api.dispatch(
        setCredentials({
          accessToken: refreshResult.data.access,
          refreshToken,
          user: api.getState().auth.user,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Dashboard", "Organizations", "Employers", "EmployerCandidates", "CandidateProfile"],
  endpoints: () => ({}),
});
