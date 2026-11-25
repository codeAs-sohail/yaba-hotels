import { authApi } from '../auth/authApi';

/**
 * Dashboard API endpoints injected into the central RTK Query authApi slice.
 * Covers Menu, Gallery, Branch, Feedback, and Category management.
 */
export const dashboardApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // MENU ENDPOINTS
    // ==========================================
    getMenus: builder.query({
      query: (branchId) => {
        if (
          branchId &&
          branchId !== 'all' &&
          branchId !== 'undefined' &&
          branchId !== 'null'
        ) {
          return `menu/?branch_id=${branchId}`;
        }
        return 'menu/';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Menu', id })),
              { type: 'Menu', id: 'LIST' },
              'Menu',
            ]
          : [{ type: 'Menu', id: 'LIST' }, 'Menu'],
    }),

    getMenuById: builder.query({
      query: (id) => `menu/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),

    createMenu: builder.mutation({
      query: (formData) => ({
        url: 'menu/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        'Menu',
        { type: 'Menu', id: 'LIST' },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    updateMenu: builder.mutation({
      query: ({ id, formData }) => ({
        url: `menu/${id}/`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Menu',
        { type: 'Menu', id },
        { type: 'Menu', id: 'LIST' },
      ],
    }),

    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `menu/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Menu',
        { type: 'Menu', id: 'LIST' },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    // ==========================================
    // GALLERY ENDPOINTS
    // ==========================================
    getGallery: builder.query({
      query: () => 'gallery/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Gallery', id })),
              { type: 'Gallery', id: 'LIST' },
              'Gallery',
            ]
          : [{ type: 'Gallery', id: 'LIST' }, 'Gallery'],
    }),

    createGallery: builder.mutation({
      query: (formData) => ({
        url: 'gallery/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gallery', { type: 'Gallery', id: 'LIST' }],
    }),

    updateGallery: builder.mutation({
      query: ({ id, formData }) => ({
        url: `gallery/${id}/`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Gallery',
        { type: 'Gallery', id },
        { type: 'Gallery', id: 'LIST' },
      ],
    }),

    deleteGallery: builder.mutation({
      query: (id) => ({
        url: `gallery/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery', { type: 'Gallery', id: 'LIST' }],
    }),

    toggleGalleryVisibility: builder.mutation({
      query: ({ id, is_visible }) => ({
        url: `gallery/${id}/`,
        method: 'PATCH',
        body: { is_visible },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Gallery',
        { type: 'Gallery', id },
        { type: 'Gallery', id: 'LIST' },
      ],
    }),

    // ==========================================
    // BRANCH ENDPOINTS
    // ==========================================
    getBranches: builder.query({
      query: () => 'branches/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Branch', id })),
              { type: 'Branch', id: 'LIST' },
              'Branch',
            ]
          : [{ type: 'Branch', id: 'LIST' }, 'Branch'],
    }),

    getBranchById: builder.query({
      query: (id) => `branches/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Branch', id }],
    }),

    createBranch: builder.mutation({
      query: (body) => ({
        url: 'branches/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Branch', { type: 'Branch', id: 'LIST' }],
    }),

    updateBranch: builder.mutation({
      query: ({ id, body }) => ({
        url: `branches/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Branch',
        { type: 'Branch', id },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    deleteBranch: builder.mutation({
      query: ({ id, force = false }) => ({
        url: `branches/${id}/${force ? '?force=true' : ''}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Branch',
        { type: 'Branch', id: 'LIST' },
        'Menu',
        { type: 'Menu', id: 'LIST' },
      ],
    }),

    // ==========================================
    // FEEDBACK ENDPOINTS
    // ==========================================
    getFeedbacks: builder.query({
      query: (branchId) => {
        if (branchId && branchId !== 'all') {
          return `feedback/?branch_id=${branchId}`;
        }
        return 'feedback/';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Feedback', id })),
              { type: 'Feedback', id: 'LIST' },
              'Feedback',
            ]
          : [{ type: 'Feedback', id: 'LIST' }, 'Feedback'],
    }),

    getPublicFeedbacks: builder.query({
      query: (branchId) => {
        if (branchId && branchId !== 'all') {
          return `feedback/?is_featured=true&branch_id=${branchId}`;
        }
        return 'feedback/?is_featured=true';
      },
      providesTags: ['Feedback', { type: 'Feedback', id: 'PUBLIC_LIST' }],
    }),

    createFeedback: builder.mutation({
      query: (body) => ({
        url: 'feedback/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Feedback', { type: 'Feedback', id: 'LIST' }, { type: 'Feedback', id: 'PUBLIC_LIST' }],
    }),

    toggleFeedbackVisibility: builder.mutation({
      query: ({ id, is_featured }) => ({
        url: `feedback/${id}/`,
        method: 'PATCH',
        body: { is_featured },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Feedback',
        { type: 'Feedback', id },
        { type: 'Feedback', id: 'LIST' },
        { type: 'Feedback', id: 'PUBLIC_LIST' },
      ],
    }),

    // ==========================================
    // CATEGORY ENDPOINTS (Helper for Menu Form)
    // ==========================================
    getCategories: builder.query({
      query: () => 'categories/',
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useToggleGalleryVisibilityMutation,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetFeedbacksQuery,
  useGetPublicFeedbacksQuery,
  useCreateFeedbackMutation,
  useToggleFeedbackVisibilityMutation,
  useGetCategoriesQuery,
} = dashboardApi;
