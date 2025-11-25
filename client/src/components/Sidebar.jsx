import React, { useState } from 'react';
import { Inbox, Settings, Zap, Briefcase, User, FileText, AlertCircle, LayoutGrid, ListTodo, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, collapsed, selectedCategory, onSelectCategory }) => {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const mainNavItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, category: 'All' },
    { id: 'drafts', label: 'Drafts', icon: FileText, category: 'Drafts' },
    { id: 'todo', label: 'To Do', icon: ListTodo, category: 'To-Do' },
  ];

  const categoryItems = [
    { id: 'urgent', label: 'Urgent', icon: AlertCircle, category: 'Urgent' },
    { id: 'work', label: 'Work', icon: Briefcase, category: 'Work' },
    { id: 'personal', label: 'Personal', icon: User, category: 'Personal' },
    { id: 'spam', label: 'Spam', icon: AlertCircle, category: 'Spam' },
    { id: 'uncategorized', label: 'Uncategorized', icon: LayoutGrid, category: 'Uncategorized' },
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (onSelectCategory) onSelectCategory(item.category);
    else setActiveTab('inbox');
  };

  return (
    <div className="sidebar glass" style={{ width: collapsed ? '80px' : '260px', transition: 'width 0.3s', alignItems: collapsed ? 'center' : 'stretch', padding: '1rem 0.5rem' }}>

      {/* Compose Button */}
      <div style={{ marginBottom: '1rem', padding: '0 0.5rem', marginTop: '1rem' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: collapsed ? '1rem' : '0.5rem' }}
          onClick={() => setActiveTab('compose')}
          title="Compose"
        >
          {collapsed ? <span style={{ fontSize: '1.5rem' }}>+</span> : <><span style={{ fontSize: '1.1rem' }}>+</span> Compose</>}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ width: '100%', flex: 1, overflowY: 'auto' }}>
        {/* Main Items */}
        {mainNavItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${selectedCategory === item.category && activeTab === 'inbox' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, item)}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: '0.75rem' }}
            title={item.label}
          >
            <item.icon size={20} />
            {!collapsed && item.label}
          </a>
        ))}

        {/* Categories Section */}
        {!collapsed ? (
          <div style={{ marginTop: '0.5rem' }}>
            <div
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600
              }}
            >
              {categoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Categories
            </div>

            {categoriesOpen && (
              <div style={{ paddingLeft: '0.5rem' }}>
                {categoryItems.map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    className={`nav-item ${selectedCategory === item.category && activeTab === 'inbox' ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, item)}
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.95rem' }}
                    title={item.label}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed View - Show Icons Only */
          <>
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
            {categoryItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className={`nav-item ${selectedCategory === item.category && activeTab === 'inbox' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item)}
                style={{ justifyContent: 'center', padding: '0.75rem' }}
                title={item.label}
              >
                <item.icon size={20} />
              </a>
            ))}
          </>
        )}

        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>

        <a
          href="#"
          className={`nav-item ${activeTab === 'config' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('config'); }}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: '0.75rem' }}
          title="Brain & Config"
        >
          <Settings size={20} />
          {!collapsed && "Brain & Config"}
        </a>
      </nav>

      {!collapsed && (
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', margin: '0 0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Powered by Groq
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
