import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice'; // Import apiSlice

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

// Existing slice for synchronous actions
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            // Potentially set a cookie here as well if needed for SSR or other purposes
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
            // Potentially remove cookie here
            // Also, you might want to dispatch apiSlice.util.resetApiState() here
            // to clear out all cached data from RTK Query upon logout.
            // Example: dispatch(apiSlice.util.resetApiState()); (would need dispatch)
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// New section for API endpoints related to auth
