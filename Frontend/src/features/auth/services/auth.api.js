import axios from "axios";

// 1. SCALABILITY: Use Vite's environment variables with a local fallback
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Helper function to extract clean error messages from Axios responses
const handleApiError = (err) => {
    if (err.response && err.response.data && err.response.data.message) {
        // Throws the exact error message your Express controller sent
        throw new Error(err.response.data.message);
    }
    // Fallback for network errors (e.g., server is offline)
    throw new Error("Network error. Please check your connection or try again later.");
};

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
}

export async function logout() {
    try {
        // 2. ROUTE SYNC: Updated to POST to match the RESTful backend changes
        const response = await api.post("/api/auth/logout");
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
}

export async function getMe() {
    try {
        // 3. ROUTE SYNC: Updated from /get-me to /me
        const response = await api.get("/api/auth/me");
        return response.data;
    } catch (err) {
        // We don't use handleApiError here because a 401 on initial load is expected if not logged in.
        // We just throw the raw error to let useAuth.js clear the state silently.
        throw err;
    }
}