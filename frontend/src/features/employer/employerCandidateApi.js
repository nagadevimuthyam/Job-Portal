import { baseApi } from "../../app/api/baseApi";

export const employerCandidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidateProfile: builder.query({
      query: (candidateId) => `/api/employer/candidates/${candidateId}/profile/`,
    }),
  }),
});

export const { useGetCandidateProfileQuery } = employerCandidateApi;
