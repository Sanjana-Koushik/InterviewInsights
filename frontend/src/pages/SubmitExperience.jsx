import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExperience } from '../api/api';
import { useAuth } from '../api/AuthContext';

function SubmitExperience() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [form, setForm] = useState({
        company: '',
        role: '',
        interview_type: 'Off-campus',
        experience_level: 'Fresher',
        month_year: '',
        prep_details: '',
        outcome: 'Selected',
        tips: '',
        is_anonymous: false,
    });

    const [rounds, setRounds] = useState([
        { round_number: 1, round_type: 'Online assessment', duration: '', description: '' }
    ]);

    const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleRoundChange = (index, field, value) => {
        setRounds(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addRound = () => setRounds(prev => [...prev, {
        round_number: prev.length + 1,
        round_type: 'DSA / coding',
        duration: '',
        description: ''
    }]);

    const removeRound = (index) => setRounds(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        if (!form.company || !form.role) {
            alert('Please fill in at least company and role!');
            return;
        }
        setLoading(true);
        try {
            await createExperience({ ...form, user_id: user?.id, rounds });
            alert('Experience shared successfully!');
            navigate('/feed');
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white";

    const outcomeOptions = [
        { label: '✓ Selected', value: 'Selected', active: 'bg-green-100 text-green-800 border-green-300' },
        { label: '✗ Rejected', value: 'Rejected', active: 'bg-red-100 text-red-800 border-red-300' },
        { label: '⏳ Waiting', value: 'Waiting', active: 'bg-gray-100 text-gray-700 border-gray-300' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => navigate('/feed')} className="text-gray-400 hover:text-gray-600 transition text-sm">← Back</button>
                    <h1 className="text-lg font-bold text-indigo-700">InterviewInsights</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Share your experience</h2>

                {/* Basic details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-4">Basic details</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Company *</label>
                            <input className={inputClass} placeholder="e.g. Google" value={form.company} onChange={e => handleFormChange('company', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Role *</label>
                            <input className={inputClass} placeholder="e.g. SDE-1" value={form.role} onChange={e => handleFormChange('role', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Interview type</label>
                            <select className={inputClass} value={form.interview_type} onChange={e => handleFormChange('interview_type', e.target.value)}>
                                <option>On-campus</option>
                                <option>Off-campus</option>
                                <option>Referral</option>
                                <option>Direct apply</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Experience level</label>
                            <select className={inputClass} value={form.experience_level} onChange={e => handleFormChange('experience_level', e.target.value)}>
                                <option>Fresher</option>
                                <option>0–1 year experience</option>
                                <option>1–3 years experience</option>
                                <option>3+ years experience</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="text-xs font-medium text-gray-600 block mb-1">Month & Year</label>
                        <input type="month" className={`${inputClass} w-1/2`} value={form.month_year} onChange={e => handleFormChange('month_year', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Prep time & resources</label>
                        <textarea className={`${inputClass} resize-none`} rows={2} placeholder="e.g. 2 months · LeetCode, Striver's sheet..." value={form.prep_details} onChange={e => handleFormChange('prep_details', e.target.value)} />
                    </div>
                </div>

                {/* Rounds */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Interview rounds</p>
                    <p className="text-xs text-gray-400 mb-4">Add each round one by one</p>

                    {rounds.map((round, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 mb-3">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700">Round {round.round_number}</span>
                                {rounds.length > 1 && (
                                    <button onClick={() => removeRound(index)} className="text-xs text-red-400 hover:text-red-600 transition">Remove</button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Round type</label>
                                    <select className={inputClass} value={round.round_type} onChange={e => handleRoundChange(index, 'round_type', e.target.value)}>
                                        <option>Online assessment</option>
                                        <option>DSA / coding</option>
                                        <option>System design</option>
                                        <option>Low-level design</option>
                                        <option>HR / behavioural</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Duration</label>
                                    <input className={inputClass} placeholder="e.g. 60 mins" value={round.duration} onChange={e => handleRoundChange(index, 'duration', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">What happened?</label>
                                <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Describe the questions, format, difficulty..." value={round.description} onChange={e => handleRoundChange(index, 'description', e.target.value)} />
                            </div>
                        </div>
                    ))}

                    <button onClick={addRound} className="w-full py-2 text-sm rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-indigo-300 hover:text-indigo-500 transition">
                        + Add another round
                    </button>
                </div>

                {/* Outcome & Tips */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-4">Outcome & tips</p>

                    <div className="mb-4">
                        <label className="text-xs font-medium text-gray-600 block mb-2">Outcome</label>
                        <div className="flex gap-2">
                            {outcomeOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleFormChange('outcome', opt.value)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${
                                        form.outcome === opt.value ? opt.active : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs font-medium text-gray-600 block mb-1">Tips for future candidates</label>
                        <textarea className={`${inputClass} resize-none`} rows={3} placeholder="What would you tell someone preparing for this interview?" value={form.tips} onChange={e => handleFormChange('tips', e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-700">Post anonymously</p>
                            <p className="text-xs text-gray-400">Your name won't be shown</p>
                        </div>
                        <input type="checkbox" checked={form.is_anonymous} onChange={e => handleFormChange('is_anonymous', e.target.checked)} className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit experience ↗'}
                </button>
            </div>
        </div>
    );
}

export default SubmitExperience;