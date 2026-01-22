import { baseApi } from "../../app/api/baseApi";

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerCandidate: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/register/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useRegisterCandidateMutation } = candidateApi;
