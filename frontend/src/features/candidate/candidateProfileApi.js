import { baseApi } from "../../app/api/baseApi";

export const candidateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/api/candidate/profile/",
      providesTags: ["CandidateProfile"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/profile/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    createSkill: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/profile/skills/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    deleteSkill: builder.mutation({
      query: (skillId) => ({
        url: `/api/candidate/profile/skills/${skillId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    createEmployment: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/profile/employments/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    updateEmployment: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/api/candidate/profile/employments/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    deleteEmployment: builder.mutation({
      query: (employmentId) => ({
        url: `/api/candidate/profile/employments/${employmentId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    createEducation: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/profile/educations/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    updateEducation: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/api/candidate/profile/educations/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    deleteEducation: builder.mutation({
      query: (educationId) => ({
        url: `/api/candidate/profile/educations/${educationId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    createProject: builder.mutation({
      query: (payload) => ({
        url: "/api/candidate/profile/projects/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/api/candidate/profile/projects/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/api/candidate/profile/projects/${projectId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
    uploadResume: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return {
          url: "/api/candidate/profile/resume/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CandidateProfile"],
    }),
    deleteResume: builder.mutation({
      query: () => ({
        url: "/api/candidate/profile/resume/",
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useCreateEmploymentMutation,
  useUpdateEmploymentMutation,
  useDeleteEmploymentMutation,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadResumeMutation,
  useDeleteResumeMutation,
} = candidateProfileApi;
