import React, { useState, useEffect } from 'react';
import { Sparkles, Reply, CheckSquare, Tag, Send, Save, Lightbulb, RotateCcw } from 'lucide-react';
import { processEmail, generateDraft, saveDraft } from '../services/api';

const EmailDetail = ({ email, onUpdateEmail }) => {
    const [processing, setProcessing] = useState(false);
    const [drafting, setDrafting] = useState(false);
    const [saving, setSaving] = useState(false);

    // Draft State
    const [draftBody, setDraftBody] = useState('');
    const [draftSubject, setDraftSubject] = useState('');
    const [followUps, setFollowUps] = useState([]);
    const [draftInstructions, setDraftInstructions] = useState('');
    const [showDraft, setShowDraft] = useState(false);

    useEffect(() => {
        if (email) {
            if (email.draft) {
                setDraftBody(email.draft.body || '');
                setDraftSubject(email.draft.subject || '');
                setFollowUps(email.draft.followUps || []);
                setShowDraft(true);
            } else {
                setDraftBody('');
                setDraftSubject(`Re: ${email.subject}`);
                setFollowUps([]);
                setShowDraft(false);
            }
            setDraftInstructions('');
        }
    }, [email]);

    if (!email) {
        return (
            <div className="email-detail glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem' }}>
                <p style={{ fontSize: '1.2rem' }}>Select an email to view</p>
                <p style={{ color: '#ef4444', maxWidth: '400px', textAlign: 'center' }}>
                    Click the <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Reset button in the header to clear all classifications and start fresh.
                </p>
            </div>
        );
    }

    const handleProcess = async () => {
        setProcessing(true);
        try {
            const res = await processEmail(email.id);
            onUpdateEmail(res.data.email);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleDraft = async () => {
        setDrafting(true);
        try {
            const res = await generateDraft(email.id, draftInstructions);
            const { subject, body, followUps } = res.data.draft;
            setDraftSubject(subject || `Re: ${email.subject}`);
            setDraftBody(body || '');
            setFollowUps(followUps || []);
            setShowDraft(true);
        } catch (err) {
            console.error(err);
        } finally {
            setDrafting(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const draftData = { subject: draftSubject, body: draftBody, followUps };
            const res = await saveDraft(email.id, draftData);
            onUpdateEmail(res.data.email);
            // Optional: Show success toast
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setShowDraft(false);
        setDraftBody('');
        setFollowUps([]);
    };

    return (
        <div className="email-detail glass animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{email.subject}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {email.sender[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{email.sender}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(email.timestamp).toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!email.processed && (
                            <button className="btn btn-primary" onClick={handleProcess} disabled={processing}>
                                <Sparkles size={16} />
                                {processing ? 'Processing...' : 'Analyze Email'}
                            </button>
                        )}
                        {email.processed && <span className="badge badge-green">Analyzed</span>}
                    </div>
                </div>

                {email.processed && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {email.category && (
                            <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Tag size={16} color="var(--accent-primary)" />
                                <span>Category: <strong>{email.category}</strong></span>
                            </div>
                        )}
                        {email.actions?.tasks?.length > 0 && (
                            <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <CheckSquare size={16} color="var(--success)" />
                                    <strong>Action Items</strong>
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                                    {email.actions.tasks.map((task, i) => (
                                        <li key={i}>
                                            {task.task} {task.deadline && <span style={{ color: 'var(--text-secondary)' }}>({task.deadline})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                    {email.body}
                </div>
            </div>

            {/* Draft Section */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Reply size={20} />
                    Draft Reply
                </h3>

                {!showDraft ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <textarea
                            className="input-field"
                            placeholder="Instructions for the agent (e.g., 'Polite decline', 'Ask for more info')"
                            value={draftInstructions}
                            onChange={(e) => setDraftInstructions(e.target.value)}
                            style={{ minHeight: '80px', resize: 'vertical' }}
                        />
                        <button className="btn btn-primary" onClick={handleDraft} disabled={drafting} style={{ height: 'fit-content' }}>
                            {drafting ? 'Drafting...' : 'Generate Draft'}
                        </button>
                    </div>
                ) : (
                    <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Subject</label>
                            <input
                                type="text"
                                className="input-field"
                                value={draftSubject}
                                onChange={(e) => setDraftSubject(e.target.value)}
                                style={{ fontWeight: 600 }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Body</label>
                            <textarea
                                className="input-field"
                                value={draftBody}
                                onChange={(e) => setDraftBody(e.target.value)}
                                style={{ minHeight: '200px', background: 'rgba(0,0,0,0.2)', border: 'none' }}
                            />
                        </div>

                        {followUps.length > 0 && (
                            <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
                                    <Lightbulb size={16} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Suggested Follow-ups</span>
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {followUps.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                            <button className="btn btn-secondary" onClick={handleDiscard}>Discard</button>
                            <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
                                <Save size={16} />
                                {saving ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button className="btn btn-primary">
                                <Send size={16} />
                                Send (Mock)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailDetail;
