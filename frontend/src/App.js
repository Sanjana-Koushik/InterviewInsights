import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './api/AuthContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import HomeFeed from './pages/HomeFeed';
import ExperiencePost from './pages/ExperiencePost';
import SubmitExperience from './pages/SubmitExperience';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
    const { user, loading, isNewUser } = useAuth();
    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
    if (!user) return <Navigate to="/" />;
    if (isNewUser) return <Navigate to="/register" />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/feed" element={<ProtectedRoute><HomeFeed /></ProtectedRoute>} />
                <Route path="/experiences/:id" element={<ProtectedRoute><ExperiencePost /></ProtectedRoute>} />
                <Route path="/submit" element={<ProtectedRoute><SubmitExperience /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;