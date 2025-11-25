import React, { useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { createDraft, generateDraft } from '../services/api';

const Compose = ({ onDraftCreated }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [followUps, setFollowUps] = useState([]);
    const [saving, setSaving] = useState(false);

    // AI Generation State
    const [instructions, setInstructions] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showAi, setShowAi] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const draftData = { subject, body, followUps };
            const res = await createDraft(draftData);
            onDraftCreated(res.data.email);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleGenerate = async () => {
        if (!instructions.trim()) return;
        setGenerating(true);
        try {
            const res = await generateDraft(null, instructions);
            const { draft } = res.data;
            setSubject(draft.subject);
            setBody(draft.body);
            setFollowUps(draft.followUps || []);
            setShowAi(false); // Close AI panel after generation
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="glass animate-fade-in" style={{ margin: '2rem', padding: '2rem', borderRadius: '1rem', maxWidth: '800px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Compose New Email</h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowAi(!showAi)}
                    style={{ gap: '0.5rem', background: showAi ? 'var(--accent-primary)' : 'transparent', color: showAi ? 'black' : 'inherit' }}
                >
                    <Sparkles size={18} />
                    {showAi ? 'Close AI' : 'Draft with AI'}
                </button>
            </div>

            {showAi && (
                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        Tell AI what to write:
                    </label>
                    <textarea
                        className="input-field"
                        rows={3}
                        placeholder="e.g., Write an email to the team about the project delay due to server issues, propose a meeting on Friday."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                            {generating ? 'Generating...' : 'Generate Draft'}
                            <Sparkles size={16} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <textarea
                    className="input-field"
                    style={{ minHeight: '300px', resize: 'vertical', lineHeight: '1.6' }}
                    placeholder="Write your email here..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>

            {followUps.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Suggested Follow-ups (Internal Notes)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {followUps.map((fu, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem' }}>{fu}</span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <Save size={18} style={{ marginRight: '0.5rem' }} />
                    {saving ? 'Saving...' : 'Save as Draft'}
                </button>
            </div>
        </div>
    );
};

export default Compose;
