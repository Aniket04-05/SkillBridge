import { useContext, useEffect } from "react";
// Note: Depending on your exact folder structure, this import might need to be "../services/auth.context"
import { AuthContext } from "../auth.context"; 
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    // 1. CONTEXT SAFETY: Prevent confusing crashes if used outside the Provider
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (err) {
            // 2. CRITICAL FIX: Propagate error to Login.jsx so the UI can display it
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (err) {
            // 2. CRITICAL FIX: Propagate error to Register.jsx
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
            throw err; // Propagate in case a component needs to know logout failed
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                // If getMe fails (e.g., token expired or no token), ensure user state is cleared
                setUser(null); 
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]); // 3. Added dependencies to satisfy React Hook rules

    return { user, loading, handleRegister, handleLogin, handleLogout };
};