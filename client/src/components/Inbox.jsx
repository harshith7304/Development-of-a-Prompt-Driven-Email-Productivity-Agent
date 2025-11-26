import React, { useState } from 'react';
import { processEmail } from '../services/api';
import { Inbox as InboxIcon, RefreshCw, CheckCircle, Brain } from 'lucide-react';

const Inbox = ({ emails, selectedEmailId, onSelectEmail, onRefresh, category }) => {
    const [processingAll, setProcessingAll] = useState(false);

    const handleClassifyAll = async () => {
        setProcessingAll(true);
        const uncategorized = emails.filter(e => !e.category || e.category === 'Uncategorized');

        for (const email of uncategorized) {
            try {
                await processEmail(email.id);
            } catch (err) {
                console.error(`Failed to process ${email.id}`, err);
            }
        }
        await onRefresh();
        setProcessingAll(false);
    };

    const getBadgeColor = (cat) => {
        const map = {
            'Urgent': 'red',
            'Work': 'blue',
            'Personal': 'green',
            'To-Do': 'yellow',
            'Spam': 'gray',
            'Drafts': 'gray',
            'Uncategorized': 'gray'
        };
        return map[cat] || 'gray';
    };

    return (
        <div className="inbox-list glass" style={{ width: '350px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <InboxIcon size={20} />
                    {category === 'All' ? 'Inbox' : category}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({emails.length})</span>
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={handleClassifyAll}
                        title="Classify All Uncategorized"
                        disabled={processingAll}
                        style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Brain size={16} className={processingAll ? 'spin' : ''} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Categorize AI</span>
                    </button>
                    <button className="btn btn-secondary" onClick={onRefresh} title="Refresh" style={{ padding: '0.4rem' }}>
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {emails.map((email) => (
                    <div
                        key={email.id}
                        className={`email-item ${selectedEmailId === email.id ? 'active' : ''} ${!email.read ? 'unread' : ''}`}
                        onClick={() => onSelectEmail(email.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{email.sender.split('@')[0]}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {new Date(email.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="subject" style={{ fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {email.subject}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {email.body}
                        </div>
                        {email.category && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <span className={`badge badge-${getBadgeColor(email.category)}`}>
                                    {email.category}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inbox;
