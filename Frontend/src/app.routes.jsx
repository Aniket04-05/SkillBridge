import React from "react";
import { createBrowserRouter, Navigate } from "react-router"; // (or react-router-dom depending on your package version)
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        // Protected Dashboard Route
        path: "/",
        element: (
            <Protected>
                <Home />
            </Protected>
        )
    },
    {
        // Protected Dynamic Interview Report Route
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Interview />
            </Protected>
        )
    },
    {
        // Catch-all route for 404s (redirects unknown URLs back to home)
        path: "*",
        element: <Navigate to="/" replace />
    }
]);