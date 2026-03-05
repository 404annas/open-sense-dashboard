import { useNavigate } from "react-router";

// utils/makeRequest.js
export const makeRequest = async ({
    apiFunc,             // RTK query or mutation function
    data,                // payload to send
    dispatch = null,     // optional redux dispatch
    action = null,       // optional action like setCredentials
    toast = null,
    toastText = null,        // toast lib for notifications
    navigate = null,     // optional navigation
    redirectTo = "",     // path after success
    onSuccess = null,    // optional success callback
    onError = null,      // optional error callback
}) => {
    try {
        const res = await apiFunc(data).unwrap();

        if (dispatch && action) {
            dispatch(action(res));
        }

        if (toast) {
            toast.success(toastText || res?.message || toast || "Success");
        }

        if (navigate && redirectTo) {
            navigate(redirectTo);
        }

        if (onSuccess) onSuccess(res);

        return res; // return response to use externally if needed
    } catch (err) {
        const errorMessage = err?.data?.message || err?.error || "Something went wrong";

        if (toast) {
            toast.error(errorMessage);
        }

        if (onError) onError(err);

        console.error("API Error:", errorMessage);
        throw err; // optionally rethrow
    }
};
