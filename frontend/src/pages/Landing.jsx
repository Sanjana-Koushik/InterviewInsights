import React, { useEffect } from 'react';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const { user, signInWithGoogle, signUpWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/feed');
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">

            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
                <h1 className="text-xl font-bold text-indigo-700">InterviewInsights</h1>
                <button
                    onClick={signInWithGoogle}
                    className="btn-ghost text-sm px-4 py-2"
                >
                    Sign in
                </button>
            </nav>

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-indigo-600">Real experiences from real candidates</span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
                    Ace your next
                    <span className="text-indigo-600"> interview </span>
                    with real insights
                </h2>

                <p className="text-gray-500 text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
                    Browse thousands of interview experiences shared by candidates just like you. Know what to expect, prepare smarter, and land your dream job.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-md">
                    <button
                        onClick={signUpWithGoogle}
                        className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                    >
                        🚀 Create free account
                    </button>
                    <button
                        onClick={signInWithGoogle}
                        className="btn-secondary flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                    >
                        Sign in →
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-4">No credit card required · Free forever</p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mt-14 mb-16">
                    {[
                        { value: '500+', label: 'Experiences shared' },
                        { value: '100+', label: 'Companies covered' },
                        { value: '50+', label: 'Roles available' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-bold text-indigo-700">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                    {[
                        { icon: '🎯', title: 'Company specific', desc: 'Filter by company, role and experience level to find exactly what you need' },
                        { icon: '🗺️', title: 'Interview roadmaps', desc: 'See aggregated round patterns from multiple candidates for any role' },
                        { icon: '💬', title: 'Ask questions', desc: 'Ask the author anything directly about their interview experience' },
                    ].map((feature, i) => (
                        <div key={i} className="card p-5 text-left">
                            <span className="text-3xl mb-3 block">{feature.icon}</span>
                            <p className="text-sm font-semibold text-gray-800 mb-1">{feature.title}</p>
                            <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 text-xs text-gray-400">
                © 2026 InterviewInsights · Built for job seekers everywhere
            </footer>
        </div>
    );
}

export default Landing;