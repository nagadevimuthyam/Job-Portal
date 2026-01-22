import { baseApi } from "../../app/api/baseApi";

export const employerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCandidates: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/api/employer/candidates/?${query}`;
      },
      providesTags: ["EmployerCandidates"],
    }),
  }),
});

export const { useSearchCandidatesQuery } = employerApi;
