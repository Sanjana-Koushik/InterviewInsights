import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExperiences } from '../api/api';
import { useAuth } from '../api/AuthContext';

function HomeFeed() {
    const [experiences, setExperiences] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [outcomeFilter, setOutcomeFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Recent');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        getExperiences()
            .then(data => {
                setExperiences(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = [...experiences];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(exp =>
                exp.company?.toLowerCase().includes(q) ||
                exp.role?.toLowerCase().includes(q) ||
                exp.prep_details?.toLowerCase().includes(q) ||
                exp.experience_level?.toLowerCase().includes(q)
            );
        }
        if (outcomeFilter !== 'All') result = result.filter(exp => exp.outcome === outcomeFilter);
        if (levelFilter !== 'All') result = result.filter(exp => exp.experience_level === levelFilter);
        if (sortBy === 'Recent') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        else if (sortBy === 'Oldest') result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setFiltered(result);
    }, [search, outcomeFilter, levelFilter, sortBy, experiences]);

    const clearFilters = () => {
        setSearch('');
        setOutcomeFilter('All');
        setLevelFilter('All');
        setSortBy('Recent');
    };

    const isFiltering = search || outcomeFilter !== 'All' || levelFilter !== 'All';

    const outcomeStyle = (outcome) => {
        if (outcome === 'Selected') return 'bg-green-100 text-green-700';
        if (outcome === 'Rejected') return 'bg-red-100 text-red-600';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <h1 className="text-lg font-bold text-indigo-700 cursor-pointer" onClick={() => navigate('/feed')}>
                        InterviewInsights
                    </h1>
                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition px-3 py-2 rounded-xl hover:bg-indigo-50"
                        >
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                {user?.user_metadata.full_name?.charAt(0)}
                            </div>
                            <span>{user?.user_metadata.full_name?.split(' ')[0]}</span>
                        </button>
                        <button
                            onClick={() => navigate('/submit')}
                            className="btn-primary text-sm px-4 py-2"
                        >
                            + Share experience
                        </button>
                        <button onClick={signOut} className="btn-ghost text-sm px-3 py-2">
                            Logout
                        </button>
                    </div>
                    {/* Mobile hamburger */}
                    <div className="flex sm:hidden items-center gap-2">
                        <button
                            onClick={() => navigate('/submit')}
                            className="btn-primary text-xs px-3 py-2"
                        >
                            + Share
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition"
                        >
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                    </div>
                </div>
                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-2 bg-white">
                        <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className="text-sm text-gray-600 py-2 text-left">👤 Profile</button>
                        <button onClick={signOut} className="text-sm text-gray-600 py-2 text-left">Logout</button>
                    </div>
                )}
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                {/* Hero banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 text-white">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">Find your interview experience</h2>
                    <p className="text-indigo-100 text-sm mb-4">Search from hundreds of real experiences shared by candidates</p>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by company, role, level..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md"
                        />
                        <span className="absolute right-3 top-3 text-gray-400 text-lg">🔍</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar filters */}
                    <div className="lg:w-56 shrink-0">
                        <div className="card p-4 sticky top-20">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filters</p>

                            <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-2">Outcome</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['All', 'Selected', 'Rejected', 'Waiting'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setOutcomeFilter(opt)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                                outcomeFilter === opt
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-2">Experience level</p>
                                <select
                                    value={levelFilter}
                                    onChange={e => setLevelFilter(e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    <option value="All">All levels</option>
                                    <option>Fresher</option>
                                    <option>0–1 year experience</option>
                                    <option>1–3 years experience</option>
                                    <option>3+ years experience</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-2">Sort by</p>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    <option>Recent</option>
                                    <option>Oldest</option>
                                </select>
                            </div>

                            {isFiltering && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full text-xs text-red-400 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                                >
                                    ✕ Clear all filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {!loading && (
                            <p className="text-xs text-gray-400 mb-4">
                                {filtered.length} experience{filtered.length !== 1 ? 's' : ''} found {isFiltering && '(filtered)'}
                            </p>
                        )}

                        {loading && (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="card p-5 animate-pulse">
                                        <div className="flex gap-2 mb-3">
                                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                                            <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && filtered.length === 0 && (
                            <div className="card p-12 text-center">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="text-gray-600 font-medium mb-1">No experiences found</p>
                                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                                <button onClick={clearFilters} className="btn-ghost text-sm px-5 py-2">Clear filters</button>
                            </div>
                        )}

                        {filtered.map(exp => (
                            <div
                                key={exp.id}
                                onClick={() => navigate(`/experiences/${exp.id}`)}
                                className="card p-5 mb-3 cursor-pointer hover:border-indigo-200 group"
                            >
                                <div className="flex gap-2 flex-wrap mb-3">
                                    <span className="tag bg-indigo-50 text-indigo-700">{exp.company}</span>
                                    <span className="tag bg-emerald-50 text-emerald-700">{exp.role}</span>
                                    <span className="tag bg-amber-50 text-amber-700">{exp.experience_level}</span>
                                    <span className={`tag ${outcomeStyle(exp.outcome)}`}>{exp.outcome}</span>
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exp.prep_details}</p>

                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">{exp.interview_type} · {exp.month_year}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/roadmap?company=${exp.company}&role=${exp.role}`);
                                        }}
                                        className="text-xs text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition opacity-0 group-hover:opacity-100"
                                    >
                                        View roadmap →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeFeed;