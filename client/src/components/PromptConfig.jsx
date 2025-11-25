import React, { useState, useEffect } from 'react';
import { Save, Key, RotateCcw } from 'lucide-react';
import { getPrompts, updatePrompts, updateApiKey, resetInbox } from '../services/api';

const PromptConfig = () => {
    const [prompts, setPrompts] = useState({
        categorization: '',
        action_item: '',
        auto_reply: ''
    });
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const pRes = await getPrompts();
            setPrompts(pRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSavePrompts = async () => {
        setLoading(true);
        try {
            await updatePrompts(prompts);
            setMsg('Prompts saved successfully!');
        } catch (err) {
            setMsg('Error saving prompts.');
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const handleSaveApiKey = async () => {
        setLoading(true);
        try {
            await updateApiKey(apiKey);
            setMsg('API Key updated successfully!');
            setApiKey('');
        } catch (err) {
            setMsg('Error updating API Key.');
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const handleResetInbox = async () => {
        if (!confirm('Are you sure you want to reset all classifications? This cannot be undone.')) return;
        setLoading(true);
        try {
            await resetInbox();
            setMsg('Inbox reset successfully!');
        } catch (err) {
            setMsg('Error resetting inbox.');
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    return (
        <div className="glass animate-fade-in" style={{ margin: '2rem', padding: '2rem', borderRadius: '1rem', maxWidth: '800px', width: '100%' }}>
            <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                Brain & Configuration
            </h2>

            {msg && (
                <div style={{ padding: '1rem', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    {msg}
                </div>
            )}


            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={20} />
                    API Configuration
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Update the Groq API Key used by the agent.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Enter new Groq API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                    <button className="btn btn-secondary" onClick={handleSaveApiKey} disabled={loading}>
                        Update Key
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                    <RotateCcw size={20} />
                    Reset Data
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Clear all AI classifications and actions. This reverts the inbox to its initial unclassified state. Useful for demos.
                </p>
                <button className="btn btn-secondary" onClick={handleResetInbox} disabled={loading} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                    Reset Inbox
                </button>
            </div>

            <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={20} />
                    Prompt Templates
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Customize how the agent thinks. These prompts guide the LLM's behavior.
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Categorization Prompt</label>
                    <textarea
                        className="input-field"
                        rows={4}
                        value={prompts.categorization}
                        onChange={(e) => setPrompts({ ...prompts, categorization: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Action Item Extraction Prompt</label>
                    <textarea
                        className="input-field"
                        rows={4}
                        value={prompts.action_item}
                        onChange={(e) => setPrompts({ ...prompts, action_item: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Auto-Reply Draft Prompt</label>
                    <textarea
                        className="input-field"
                        rows={4}
                        value={prompts.auto_reply}
                        onChange={(e) => setPrompts({ ...prompts, auto_reply: e.target.value })}
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSavePrompts} disabled={loading}>
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default PromptConfig;
