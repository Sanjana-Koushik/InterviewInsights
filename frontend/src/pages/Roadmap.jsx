import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getRoadmap } from '../api/api';

function Roadmap() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const company = searchParams.get('company');
    const role = searchParams.get('role');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!company || !role) return;
        getRoadmap(company, role)
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [company, role]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading roadmap...</p>
            </div>
        </div>
    );

    if (!data || data.experiences.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-4xl mb-3">🗺️</p>
                <p className="text-gray-600 font-medium mb-1">No roadmap yet</p>
                <p className="text-gray-400 text-sm mb-4">No experiences found for {company} {role}</p>
                <button onClick={() => navigate('/feed')} className="btn-primary px-5 py-2 text-sm">← Back to feed</button>
            </div>
        </div>
    );

    const { stats, experiences } = data;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
                    <button onClick={() => navigate('/feed')} className="text-gray-400 hover:text-indigo-600 transition text-sm">← Back</button>
                    <span className="text-gray-200">|</span>
                    <h1 className="text-base font-bold text-indigo-700">InterviewInsights</h1>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <p className="text-indigo-200 text-xs font-medium mb-2 uppercase tracking-wide">Interview Roadmap</p>
                    <h2 className="text-2xl font-bold mb-1">{company}</h2>
                    <p className="text-indigo-100 text-sm">{role} · Based on {stats.total} experience{stats.total > 1 ? 's' : ''}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-800' },
                        { label: 'Selected', value: stats.selected, color: 'text-green-600' },
                        { label: 'Success rate', value: `${stats.selection_rate}%`, color: 'text-indigo-600' },
                    ].map((stat, i) => (
                        <div key={i} className="card p-4 text-center">
                            <p className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Round frequency */}
                <div className="card p-5 mb-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">How common is each round?</h3>
                    {Object.entries(stats.round_percentages)
                        .sort((a, b) => b[1] - a[1])
                        .map(([roundType, percentage]) => (
                            <div key={roundType} className="flex items-center gap-3 mb-4 last:mb-0">
                                <span className="text-xs text-gray-600 w-36 shrink-0">{roundType}</span>
                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{percentage}%</span>
                            </div>
                        ))}
                </div>

                {/* All experiences */}
                <div className="card p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">
                        All experiences
                        <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{stats.total}</span>
                    </h3>
                    {experiences.map(exp => (
                        <div
                            key={exp.id}
                            onClick={() => navigate(`/experiences/${exp.id}`)}
                            className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-xl px-3 -mx-3 transition group"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-700">{exp.experience_level} · {exp.interview_type}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{exp.month_year}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`tag ${
                                    exp.outcome === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                }`}>{exp.outcome}</span>
                                <span className="text-gray-300 group-hover:text-indigo-400 transition">›</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Roadmap;