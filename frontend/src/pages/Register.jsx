import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { createOrUpdateProfile } from '../api/api';

function Register() {
    const { user, signOut, markUserAsRegistered } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        college: '',
        branch: '',
        graduation_year: '',
        job_seeker_type: 'Student / Fresh Grad',
    });

    const handleSubmit = async () => {
        if (!form.college || !form.branch || !form.graduation_year) {
            alert('Please fill in all fields!');
            return;
        }
        setSaving(true);
        try {
            await createOrUpdateProfile({
                id: user.id,
                name: user.user_metadata.full_name,
                email: user.email,
                college: form.college,
                branch: form.branch,
                graduation_year: parseInt(form.graduation_year),
                job_seeker_type: form.job_seeker_type,
            });
            markUserAsRegistered();
            navigate('/feed');
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-700 mb-1">InterviewInsights</h1>
                    <p className="text-gray-800 font-semibold text-lg mt-4">Welcome, {user?.user_metadata.full_name?.split(' ')[0]}! 👋</p>
                    <p className="text-gray-400 text-sm mt-1">Just a few details to personalise your experience</p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <div className="card p-6 sm:p-8">

                    {/* Google account info */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                            {user?.user_metadata.full_name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{user?.user_metadata.full_name}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Verified ✓</span>
                    </div>

                    {step === 1 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-4">Step 1 — Academic details</p>

                            <div className="mb-4">
                                <label className="text-xs font-medium text-gray-600 block mb-1.5">College / University *</label>
                                <input
                                    className="input"
                                    placeholder="e.g. NIT Trichy, VIT Vellore, PESIT Bangalore"
                                    value={form.college}
                                    onChange={e => setForm(prev => ({ ...prev, college: e.target.value }))}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-medium text-gray-600 block mb-1.5">Branch / Degree *</label>
                                <input
                                    className="input"
                                    placeholder="e.g. B.E. CSE, B.Tech ECE, MCA"
                                    value={form.branch}
                                    onChange={e => setForm(prev => ({ ...prev, branch: e.target.value }))}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-medium text-gray-600 block mb-1.5">Graduation year *</label>
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="e.g. 2025"
                                    value={form.graduation_year}
                                    onChange={e => setForm(prev => ({ ...prev, graduation_year: e.target.value }))}
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if (!form.college || !form.branch || !form.graduation_year) {
                                        alert('Please fill in all fields!');
                                        return;
                                    }
                                    setStep(2);
                                }}
                                className="btn-primary w-full py-3 text-sm"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-4">Step 2 — I am a...</p>

                            <div className="grid grid-cols-1 gap-3 mb-6">
                                {[
                                    { value: 'Student / Fresh Grad', icon: '🎓', desc: 'Currently studying or just graduated' },
                                    { value: 'Working Professional', icon: '💼', desc: 'Employed and looking to switch companies' },
                                    { value: 'Career Changer', icon: '🔄', desc: 'Switching to a completely different domain' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setForm(prev => ({ ...prev, job_seeker_type: opt.value }))}
                                        className={`text-left px-4 py-4 rounded-2xl border-2 transition-all duration-150 ${
                                            form.job_seeker_type === opt.value
                                                ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                                                : 'bg-gray-50 border-gray-200 hover:border-indigo-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{opt.icon}</span>
                                            <div>
                                                <p className={`text-sm font-semibold ${form.job_seeker_type === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.value}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                                            </div>
                                            {form.job_seeker_type === opt.value && (
                                                <span className="ml-auto text-indigo-600 text-lg">✓</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="btn-ghost px-5 py-3 text-sm"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="btn-primary flex-1 py-3 text-sm disabled:opacity-50"
                                >
                                    {saving ? 'Setting up...' : 'Complete registration 🎉'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={signOut}
                    className="w-full text-center text-xs text-gray-400 mt-5 hover:text-gray-600 transition py-2"
                >
                    Sign out and use a different account
                </button>
            </div>
        </div>
    );
}

export default Register;