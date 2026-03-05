export const CLIENT_URL = "http://localhost:3000"

export const BASE_URL = import.meta.env.DEV
    ? "http://localhost:5000/api"  // Open Sense backend local URL
    : import.meta.env.VITE_DEPLOYED_API_URL || "http://localhost:5000/api"; // Fallback to local if not set