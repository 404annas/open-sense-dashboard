// File: src/_core/Slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/ApiBaseUrl';

// Fallback to local URL if not set
const baseQuery = fetchBaseQuery({
    // baseUrl: "https://open-sense-snko.vercel.app/api", // Using deployed backend
    baseUrl: BASE_URL,

    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userInfo?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        // Auto logout logic
        toast.error('Session expired. Please log in again.');
        api.dispatch(logout());
        // Optionally redirect to login page
        window.location.href = '/';
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Project', 'User', 'DashboardStats', 'Profile', 'Category'],
    endpoints: (builder) => ({
        // Authentication endpoints
        registerUser: builder.mutation({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (verificationData) => ({
                url: '/auth/verify',
                method: 'POST',
                body: verificationData,
            }),
        }),
        loginUser: builder.mutation({
            query: (loginData) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (emailData) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: emailData,
            }),
        }),
        verifyPasswordResetOTP: builder.mutation({
            query: (otpData) => ({
                url: '/auth/reset-password-verify',
                method: 'POST',
                body: otpData,
            }),
        }),
        resetPassword: builder.mutation({
            query: (passwordData) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: passwordData,
            }),
        }),
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body: passwordData,
            }),
            invalidatesTags: ['User'],
        }),

        // Projects endpoints
        getProjects: builder.query({
            query: (params) => ({
                url: '/projects',
                params, // RTK Query automatically converts to ?page=&limit=
            }),
            providesTags: ['Project'],
        }),
        createProject: builder.mutation({
            query: (projectData) => {
                // Check if projectData is FormData (for file uploads) or regular object
                const isFormData = projectData instanceof FormData;

                return {
                    url: '/projects',
                    method: 'POST',
                    body: projectData,
                    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                };
            },
            invalidatesTags: ['Project'],
        }),
        updateProject: builder.mutation({
            query: (arg) => {
                // Handle both regular objects and FormData (for file uploads)
                let id, updateData;

                if (arg.updateData instanceof FormData) {
                    // When we have { id, updateData: FormData }
                    id = arg.id;
                    updateData = arg.updateData;
                } else if (arg.updateData) {
                    // When we have { id, updateData: object }
                    id = arg.id;
                    updateData = arg.updateData;
                } else {
                    // When it's a regular object with id and other data
                    id = arg.id;
                    // Remove the id to get the update data
                    const { id: extractedId, ...rest } = arg;
                    updateData = rest;
                }

                // Check if updateData is FormData (for file uploads) or regular object
                const isFormData = updateData instanceof FormData;

                return {
                    url: `/projects/${id}`,
                    method: 'PUT',
                    body: updateData,
                    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                };
            },
            invalidatesTags: ['Project'],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Project'],
        }),

        // Category endpoints
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: '/categories',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),



        // Dashboard Stats endpoints
        getDashboardStats: builder.query({
            query: () => '/dashboard/stats',
            providesTags: ['DashboardStats'],
        }),

        // Get single project by ID
        getProjectById: builder.query({
            query: (id) => `/projects/${id}`,
            providesTags: ['Project'],
        }),
    }),
});

export const {
    // Authentication
    useRegisterUserMutation,
    useVerifyOTPMutation,
    useLoginUserMutation,
    useForgotPasswordMutation,
    useVerifyPasswordResetOTPMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,

    // Projects
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,

    // Dashboard Stats
    useGetDashboardStatsQuery,

    // Categories
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

    // Contact Form
    useGetContactRequestsQuery,
    useCreateContactRequestMutation,
    useDeleteContactRequestMutation,

    // Cost Calculator
    useGetCostCalculatorRequestsQuery,
    useCreateCostCalculatorRequestMutation,
    useDeleteCostCalculatorRequestMutation,
} = apiSlice;

