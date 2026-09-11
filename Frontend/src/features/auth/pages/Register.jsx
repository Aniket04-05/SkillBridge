import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const { loading, handleRegister } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        try {
            await handleRegister({ username, email, password });
            navigate("/"); 
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-zinc-100">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-100 px-4 sm:px-6 lg:px-8">
            {/* Swapped heavy shadow for a clean, subtle border and softer background */}
            <div className="max-w-md w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-8 space-y-8">
                
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-zinc-900">Create an Account</h1>
                    <p className="mt-2 text-sm text-zinc-500">Join us to generate your AI interview reports.</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="Enter username"
                            required
                            minLength="3"
                            maxLength="30"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors outline-none text-zinc-900 placeholder-zinc-400"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Enter email address"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors outline-none text-zinc-900 placeholder-zinc-400"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter password"
                            required
                            minLength="6"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors outline-none text-zinc-900 placeholder-zinc-400"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        // Minimalist dark button instead of bright blue
                        className="w-full py-2.5 px-4 mt-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-zinc-900 hover:underline transition-all">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Register;