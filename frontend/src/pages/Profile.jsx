import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { getProfile, createOrUpdateProfile, deleteExperience } from '../api/api';

function Profile() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        college: '',
        graduation_year: '',
        branch: '',
        job_seeker_type: 'Student / Fresh Grad',
    });

    useEffect(() => {
        if (!user) return;
        getProfile(user.id)
            .then(data => {
                if (data.profile) {
                    setProfile(data.profile);
                    setForm({
                        college: data.profile.college || '',
                        graduation_year: data.profile.graduation_year || '',
                        branch: data.profile.branch || '',
                        job_seeker_type: data.profile.job_seeker_type || 'Student / Fresh Grad',
                    });
                }
                setExperiences(data.experiences);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await createOrUpdateProfile({
                id: user.id,
                name: user.user_metadata.full_name,
                email: user.email,
                college: form.college,
                graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
                branch: form.branch,
                job_seeker_type: form.job_seeker_type,
            });
            setProfile({ ...profile, ...form });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update profile.');
        }
        setSaving(false);
    };

    const handleDelete = async (expId) => {
        if (!window.confirm('Delete this experience?')) return;
        try {
            await deleteExperience(expId);
            setExperiences(prev => prev.filter(e => e.id !== expId));
        } catch (err) {
            alert('Failed to delete.');
        }
    };

    const selectedCount = experiences.filter(e => e.outcome === 'Selected').length;
    const inputClass = "input";

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/feed')} className="text-gray-400 hover:text-indigo-600 transition text-sm">← Back</button>
                        <span className="text-gray-200">|</span>
                        <h1 className="text-base font-bold text-indigo-700">InterviewInsights</h1>
                    </div>
                    <button onClick={signOut} className="btn-ghost text-sm px-3 py-1.5">Logout</button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

                {/* Profile hero */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-5 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                            {user?.user_metadata.full_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold truncate">{user?.user_metadata.full_name}</h2>
                            <p className="text-indigo-200 text-sm truncate">{user?.email}</p>
                            <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">{profile?.job_seeker_type || 'Job seeker'}</span>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition"
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile details */}
                <div className="card p-5 mb-5">
                    {!isEditing && (
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'College', value: profile?.college },
                                { label: 'Branch', value: profile?.branch },
                                { label: 'Graduation year', value: profile?.graduation_year },
                                { label: 'Job seeker type', value: profile?.job_seeker_type },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm text-gray-700 font-medium">{item.value || '—'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {isEditing && (
                        <div>
                            <p className="text-sm font-bold text-gray-800 mb-4">Edit profile</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">College</label>
                                    <input className={inputClass} placeholder="e.g. NIT Trichy" value={form.college} onChange={e => setForm(prev => ({ ...prev, college: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">Branch</label>
                                    <input className={inputClass} placeholder="e.g. B.E. CSE" value={form.branch} onChange={e => setForm(prev => ({ ...prev, branch: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">Graduation year</label>
                                    <input className={inputClass} type="number" placeholder="e.g. 2025" value={form.graduation_year} onChange={e => setForm(prev => ({ ...prev, graduation_year: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">Job seeker type</label>
                                    <select className={inputClass} value={form.job_seeker_type} onChange={e => setForm(prev => ({ ...prev, job_seeker_type: e.target.value }))}>
                                        <option>Student / Fresh Grad</option>
                                        <option>Working Professional</option>
                                        <option>Career Changer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save changes'}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="btn-ghost text-sm px-4 py-2.5">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { label: 'Total posts', value: experiences.length, color: 'text-gray-800' },
                        { label: 'Selected', value: selectedCount, color: 'text-green-600' },
                        { label: 'Success rate', value: experiences.length > 0 ? `${Math.round((selectedCount / experiences.length) * 100)}%` : '0%', color: 'text-indigo-600' },
                    ].map((stat, i) => (
                        <div key={i} className="card p-4 text-center">
                            <p className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* My experiences */}
                <div className="card p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-800">
                            My experiences
                            {experiences.length > 0 && <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{experiences.length}</span>}
                        </h3>
                        <button
                            onClick={() => navigate('/submit')}
                            className="btn-primary text-xs px-3 py-1.5"
                        >
                            + Add new
                        </button>
                    </div>

                    {experiences.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-3xl mb-3">📝</p>
                            <p className="text-gray-500 text-sm font-medium mb-1">No experiences yet</p>
                            <p className="text-gray-400 text-xs mb-4">Share your first interview experience!</p>
                            <button onClick={() => navigate('/submit')} className="btn-primary text-sm px-5 py-2.5">
                                + Share experience
                            </button>
                        </div>
                    )}

                    {experiences.map(exp => (
                        <div key={exp.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                            <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => navigate(`/experiences/${exp.id}`)}
                            >
                                <div className="flex gap-1.5 flex-wrap mb-1">
                                    <span className="tag bg-indigo-50 text-indigo-700 text-xs">{exp.company}</span>
                                    <span className="tag bg-emerald-50 text-emerald-700 text-xs">{exp.role}</span>
                                    <span className={`tag text-xs ${exp.outcome === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{exp.outcome}</span>
                                </div>
                                <p className="text-xs text-gray-400">{exp.experience_level} · {exp.month_year}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => navigate(`/experiences/${exp.id}`)}
                                    className="text-xs text-indigo-500 border border-indigo-200 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="text-xs text-red-400 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Profile;