import { baseApi } from "../../app/api/baseApi";

export const masterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/api/master/dashboard/",
      providesTags: ["Dashboard"],
    }),
    createOrganization: builder.mutation({
      query: (payload) => ({
        url: "/api/master/organizations/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Dashboard", "Organizations"],
    }),
    getOrganizations: builder.query({
      query: (search = "") =>
        `/api/master/organizations/?search=${encodeURIComponent(search)}`,
      providesTags: ["Organizations"],
    }),
    createEmployer: builder.mutation({
      query: (payload) => ({
        url: "/api/master/employers/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Dashboard", "Employers"],
    }),
    getEmployers: builder.query({
      query: (search = "") =>
        `/api/master/employers/?search=${encodeURIComponent(search)}`,
      providesTags: ["Employers"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useCreateOrganizationMutation,
  useGetOrganizationsQuery,
  useCreateEmployerMutation,
  useGetEmployersQuery,
} = masterApi;
