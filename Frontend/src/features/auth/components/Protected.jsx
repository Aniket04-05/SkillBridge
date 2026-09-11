import React from 'react';
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    // 1. Minimal loading spinner matching our new design system
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-zinc-100">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900"></div>
            </main>
        );
    }

    // 2. Redirect unauthenticated users safely
    if (!user) {
        // 'replace' ensures this protected route doesn't clog up the user's browser back-history
        return <Navigate to="/login" replace />; 
    }
    
    // 3. Render the protected content
    return children;
};

export default Protected;