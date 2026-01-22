import { baseApi } from "../../app/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    me: builder.query({
      query: () => "/api/auth/me/",
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
