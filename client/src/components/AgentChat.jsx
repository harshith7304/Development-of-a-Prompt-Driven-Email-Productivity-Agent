import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { chatAgent } from '../services/api';

const AgentChat = ({ selectedEmailId, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Email Productivity Agent. Ask me anything about your inbox or specific emails.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [contextMode, setContextMode] = useState('auto'); // 'auto', 'email', 'inbox'
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Determine context
        let emailIdToUse = selectedEmailId;
        if (contextMode === 'inbox') emailIdToUse = null;
        // If 'auto' and selectedEmailId exists, use it. If not, use null (inbox).

        try {
            const res = await chatAgent(input, emailIdToUse);
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass" style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '400px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.3)'
        }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={20} color="var(--accent-primary)" />
                    <h3 style={{ margin: 0 }}>AI Agent</h3>
                </div>
                <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.25rem' }}>X</button>
            </div>

            <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <button
                    className={`btn ${contextMode === 'auto' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setContextMode('auto')}
                >
                    Auto
                </button>
                <button
                    className={`btn ${contextMode === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setContextMode('email')}
                    disabled={!selectedEmailId}
                >
                    Current Email
                </button>
                <button
                    className={`btn ${contextMode === 'inbox' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setContextMode('inbox')}
                >
                    Whole Inbox
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        {msg.role === 'assistant' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Bot size={18} color="white" />
                            </div>
                        )}
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: msg.role === 'user' ? 'black' : 'var(--text-primary)',
                            borderTopLeftRadius: msg.role === 'assistant' ? '0' : '1rem',
                            borderTopRightRadius: msg.role === 'user' ? '0' : '1rem'
                        }}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={18} color="white" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', marginLeft: '3rem' }}>
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        style={{ marginBottom: 0 }}
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentChat;
