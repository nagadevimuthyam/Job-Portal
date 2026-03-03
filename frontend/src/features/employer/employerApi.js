import { baseApi } from "../../app/api/baseApi";

export const employerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCandidates: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/api/employer/candidates/?${query}`;
      },
      providesTags: ["EmployerCandidates"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            employerApi.util.invalidateTags(["RecentSearches"])
          );
        } catch {
          // Ignore invalidation when search fails.
        }
      },
    }),
    getRecentSearches: builder.query({
      query: () => "/api/employer/search-presets/recent/",
      providesTags: ["RecentSearches"],
    }),
    getSavedSearches: builder.query({
      query: () => "/api/employer/search-presets/saved/",
      providesTags: ["SavedSearches"],
    }),
    saveSearchPreset: builder.mutation({
      query: (body) => ({
        url: "/api/employer/search-presets/save/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecentSearches", "SavedSearches"],
    }),
    renameSavedSearch: builder.mutation({
      query: ({ presetId, title }) => ({
        url: `/api/employer/search-presets/saved/${presetId}/`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: ["SavedSearches"],
    }),
    deleteSavedSearch: builder.mutation({
      query: (presetId) => ({
        url: `/api/employer/search-presets/saved/${presetId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedSearches"],
    }),
  }),
});

export const {
  useSearchCandidatesQuery,
  useGetRecentSearchesQuery,
  useGetSavedSearchesQuery,
  useSaveSearchPresetMutation,
  useRenameSavedSearchMutation,
  useDeleteSavedSearchMutation,
} = employerApi;
