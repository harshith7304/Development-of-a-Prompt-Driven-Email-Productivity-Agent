import React, { useState, useEffect } from 'react';
import { Menu, Search, Sparkles, User } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Inbox from './components/Inbox';
import EmailDetail from './components/EmailDetail';
import AgentChat from './components/AgentChat';
import PromptConfig from './components/PromptConfig';
import Compose from './components/Compose';
import { getEmails } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await getEmails();
      setEmails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = (updatedEmail) => {
    setEmails(prev => prev.map(e => e.id === updatedEmail.id ? updatedEmail : e));
  };

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  // Filter Emails
  const filteredEmails = emails.filter(e => {
    if (selectedCategory === 'All') return !e.isDraft;
    if (selectedCategory === 'Drafts') return e.isDraft;
    if (selectedCategory === 'Uncategorized') return !e.category && !e.isDraft;
    return e.category === selectedCategory && !e.isDraft;
  });

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      {/* Header */}
      <header className="glass" style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'space-between', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ padding: '0.5rem' }}>
            <Menu size={20} />
          </button>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AIMail</span>
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: '600px', margin: '0 2rem', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search mail"
            style={{ marginBottom: 0, paddingLeft: '3rem', background: 'rgba(30, 41, 59, 0.5)', border: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className={`btn ${agentOpen ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAgentOpen(!agentOpen)}
            title="Ask AI Agent"
          >
            <Sparkles size={18} />
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
            <User size={18} />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveTab('inbox');
            setSelectedEmailId(null);
          }}
        />

        <main className="main-content" style={{ position: 'relative' }}>
          {activeTab === 'inbox' && (
            <>
              <Inbox
                emails={filteredEmails}
                selectedEmailId={selectedEmailId}
                onSelectEmail={setSelectedEmailId}
                onRefresh={fetchEmails}
                category={selectedCategory}
              />
              <EmailDetail
                email={selectedEmail}
                onUpdateEmail={handleUpdateEmail}
              />
            </>
          )}

          {activeTab === 'config' && (
            <div style={{ width: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
              <PromptConfig />
            </div>
          )}

          {activeTab === 'compose' && (
            <div style={{ width: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Compose onDraftCreated={(newEmail) => {
                setEmails(prev => [newEmail, ...prev]);
                setSelectedEmailId(newEmail.id);
                setActiveTab('inbox');
              }} />
            </div>
          )}

          {/* Agent Chat Drawer */}
          {agentOpen && (
            <AgentChat
              selectedEmailId={selectedEmailId}
              onClose={() => setAgentOpen(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
