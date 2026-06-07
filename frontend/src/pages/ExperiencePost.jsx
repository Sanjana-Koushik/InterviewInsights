import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperience, getComments, createComment, deleteExperience, updateExperience } from '../api/api';
import { useAuth } from '../api/AuthContext';

function ExperiencePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [experience, setExperience] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        Promise.all([getExperience(id), getComments(id)])
            .then(([expData, commentsData]) => {
                setExperience(expData);
                setEditForm(expData);
                setComments(commentsData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            await createComment({ experience_id: id, body: newComment });
            const updated = await getComments(id);
            setComments(updated);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this experience? This cannot be undone.')) return;
        try {
            await deleteExperience(id);
            navigate('/feed');
        } catch (err) {
            console.error(err);
            alert('Failed to delete.');
        }
    };

    const handleEditSave = async () => {
        try {
            await updateExperience(id, editForm);
            setExperience(editForm);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update.');
        }
    };

    const handleEditRoundChange = (index, field, value) => {
        setEditForm(prev => {
            const updatedRounds = [...prev.rounds];
            updatedRounds[index] = { ...updatedRounds[index], [field]: value };
            return { ...prev, rounds: updatedRounds };
        });
    };

    const isAuthor = user && experience && user.id === experience.user_id;

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading experience...</p>
            </div>
        </div>
    );

    if (!experience) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-4xl mb-3">😕</p>
                <p className="text-gray-600 font-medium">Experience not found</p>
                <button onClick={() => navigate('/feed')} className="btn-primary mt-4 px-5 py-2 text-sm">← Back to feed</button>
            </div>
        </div>
    );

    const outcomeStyle = experience.outcome === 'Selected'
        ? 'bg-green-100 text-green-700'
        : experience.outcome === 'Rejected'
        ? 'bg-red-100 text-red-600'
        : 'bg-yellow-100 text-yellow-700';

    const inputClass = "input";

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/feed')} className="text-gray-400 hover:text-indigo-600 transition text-sm flex items-center gap-1">
                            ← <span className="hidden sm:inline">Back to feed</span>
                        </button>
                        <span className="text-gray-200">|</span>
                        <h1 className="text-base font-bold text-indigo-700">InterviewInsights</h1>
                    </div>

                    {isAuthor && !isEditing && (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="text-xs sm:text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                                ✏️ Edit
                            </button>
                            <button onClick={handleDelete} className="text-xs sm:text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                                🗑️ Delete
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <div className="flex gap-2">
                            <button onClick={handleEditSave} className="btn-primary text-xs sm:text-sm px-4 py-1.5">Save</button>
                            <button onClick={() => setIsEditing(false)} className="btn-ghost text-xs sm:text-sm px-3 py-1.5">Cancel</button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-5">
                    <span className="tag bg-indigo-50 text-indigo-700">{experience.company}</span>
                    <span className="tag bg-emerald-50 text-emerald-700">{experience.role}</span>
                    <span className="tag bg-amber-50 text-amber-700">{experience.experience_level}</span>
                    <span className={`tag ${outcomeStyle}`}>{experience.outcome}</span>
                    {experience.is_anonymous && <span className="tag bg-gray-100 text-gray-500">Anonymous</span>}
                </div>

                {/* View mode */}
                {!isEditing && (
                    <>
                        {/* Prep details */}
                        <div className="card p-5 mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Prep time & resources</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{experience.prep_details || '—'}</p>
                        </div>

                        {/* Rounds */}
                        <h2 className="text-base font-bold text-gray-800 mb-3">Interview Rounds</h2>
                        {experience.rounds?.length === 0 && (
                            <p className="text-sm text-gray-400 mb-4">No rounds added.</p>
                        )}
                        {experience.rounds?.map((round, index) => (
                            <div key={index} className="card p-5 mb-3 border-l-4 border-indigo-400">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Round {round.round_number}</span>
                                        <p className="text-sm font-semibold text-gray-800 mt-1">{round.round_type}</p>
                                    </div>
                                    {round.duration && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{round.duration}</span>}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{round.description}</p>
                            </div>
                        ))}

                        {/* Tips */}
                        {experience.tips && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 mb-5">
                                <p className="text-xs font-semibold text-indigo-600 mb-2">💡 Tips from the author</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{experience.tips}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <button
                            onClick={() => navigate(`/roadmap?company=${experience.company}&role=${experience.role}`)}
                            className="btn-secondary w-full py-3 text-sm mb-6"
                        >
                            🗺️ View roadmap for {experience.company} {experience.role}
                        </button>
                    </>
                )}

                {/* Edit mode */}
                {isEditing && (
                    <div className="card p-5 mb-4">
                        <p className="text-sm font-bold text-gray-800 mb-4">Edit experience</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Company</label>
                                <input className={inputClass} value={editForm.company} onChange={e => setEditForm(prev => ({ ...prev, company: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Role</label>
                                <input className={inputClass} value={editForm.role} onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-xs font-medium text-gray-600 block mb-2">Outcome</label>
                            <div className="flex gap-2">
                                {['Selected', 'Rejected', 'Waiting'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setEditForm(prev => ({ ...prev, outcome: opt }))}
                                        className={`flex-1 py-2 text-xs font-medium rounded-xl border transition ${
                                            editForm.outcome === opt
                                                ? opt === 'Selected' ? 'bg-green-100 text-green-800 border-green-300'
                                                : opt === 'Rejected' ? 'bg-red-100 text-red-800 border-red-300'
                                                : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-xs font-medium text-gray-600 block mb-1">Prep details</label>
                            <textarea className={`${inputClass} resize-none`} rows={2} value={editForm.prep_details} onChange={e => setEditForm(prev => ({ ...prev, prep_details: e.target.value }))} />
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-medium text-gray-600 block mb-1">Tips</label>
                            <textarea className={`${inputClass} resize-none`} rows={3} value={editForm.tips} onChange={e => setEditForm(prev => ({ ...prev, tips: e.target.value }))} />
                        </div>

                        <p className="text-sm font-semibold text-gray-700 mb-3">Edit rounds</p>
                        {editForm.rounds?.map((round, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
                                <p className="text-xs font-semibold text-indigo-600 mb-2">Round {round.round_number}</p>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Type</label>
                                        <select className={inputClass} value={round.round_type} onChange={e => handleEditRoundChange(index, 'round_type', e.target.value)}>
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
                                        <input className={inputClass} value={round.duration} onChange={e => handleEditRoundChange(index, 'duration', e.target.value)} />
                                    </div>
                                </div>
                                <textarea className={`${inputClass} resize-none`} rows={2} value={round.description} onChange={e => handleEditRoundChange(index, 'description', e.target.value)} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Comments */}
                <div className="card p-5">
                    <h3 className="text-base font-bold text-gray-800 mb-5">
                        Questions & Answers
                        {comments.length > 0 && <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{comments.length}</span>}
                    </h3>

                    {comments.length === 0 && (
                        <div className="text-center py-6 mb-4">
                            <p className="text-2xl mb-2">💬</p>
                            <p className="text-sm text-gray-400">No questions yet. Be the first to ask!</p>
                        </div>
                    )}

                    {comments.map(comment => (
                        <div key={comment.id} className="border-l-2 border-indigo-200 pl-4 mb-4 py-1">
                            <p className="text-sm text-gray-700 leading-relaxed mb-1">{comment.body}</p>
                            <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                    ))}

                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Ask something about this experience..."
                            className="input resize-none mb-3"
                            rows={3}
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!newComment.trim()}
                            className="btn-primary text-sm px-5 py-2.5 disabled:opacity-40"
                        >
                            Post question
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ExperiencePost;