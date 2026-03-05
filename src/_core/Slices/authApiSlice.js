import { toast } from "react-toastify";
import { apiSlice } from "./apiSlice";
import { setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
                invalidatesTags: (result, error, id) => [
                    { type: "Profile", id: result?._id || "CURRENT" },
                    { type: "DashboardStats", id: result?._id || "CURRENT" },
                    { type: "User", id: result?._id || "CURRENT" },
                ],
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // Open Sense backend returns: { status: true, message: "Login successful", token: token, user: {...} }
                    let userToStore = data.user;
                    let tokenToStore = data.token;

                    if (userToStore && tokenToStore) {
                        const finalPayload = {
                            user: userToStore,
                            token: tokenToStore,
                        };
                        dispatch(setCredentials(finalPayload));
                    } else {
                        toast.error("Login response missing user or token");
                    }
                } catch (error) {
                    console.error('Login API error in onQueryStarted:', error);
                    toast.error("Login failed");
                }
            },
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: '/auth/signup', // Changed from 'register' to 'signup' as per Open Sense backend
                method: 'POST',
                body: userData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // Signup returns email for OTP verification
                    if (data.status && data.email) {
                        // Don't set credentials yet - user needs to verify OTP
                        toast.success(data.message || "Signup successful. Please verify your email.");
                    } else {
                        toast.error(data.message || "Signup failed");
                    }
                } catch (error) {
                    console.error('Signup API error in onQueryStarted:', error);
                    toast.error("Signup failed");
                }
            },
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify', // Changed from 'verify-otp' to 'verify' as per Open Sense backend
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // OTP verification returns token and user info
                    if (data.status && data.token && data.user) {
                        const finalPayload = {
                            user: data.user,
                            token: data.token,
                        };
                        dispatch(setCredentials(finalPayload));
                        toast.success(data.message || "Account verified successfully");
                    } else {
                        toast.error(data.message || "OTP verification failed");
                    }
                } catch (error) {
                    console.error('OTP verification API error in onQueryStarted:', error);
                    toast.error("OTP verification failed");
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useVerifyOtpMutation,
} = authApiSlice;