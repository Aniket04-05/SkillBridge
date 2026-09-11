import React from "react";
import { RouterProvider } from "react-router"; // (or react-router-dom depending on your setup)
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

function App() {
    return (
        // 1. AuthProvider is at the very top so user identity is available everywhere
        <AuthProvider>
            {/* 2. InterviewProvider is nested so it can securely rely on Auth state if needed */}
            <InterviewProvider>
                {/* 3. RouterProvider handles all page navigation */}
                <RouterProvider router={router} />
            </InterviewProvider>
        </AuthProvider>
    );
}

export default App;