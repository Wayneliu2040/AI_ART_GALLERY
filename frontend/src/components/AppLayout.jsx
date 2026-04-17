import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

const navItems = [
  { to: '/gallery', label: 'Explore' },
  { to: '/user-center', label: 'User Center' },
  { to: '/upload', label: 'Upload Image' }
];

function getDisplayName(user) {
  if (user?.name?.trim()) {
    return user.name.trim();
  }

  if (user?.email?.includes('@')) {
    return user.email.split('@')[0];
  }

  return user?.email || 'Guest';
}

export function AppLayout({ children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-inline">
          <div className="logo-orb" />
          <div>
            <h1>AI Art Gallery</h1>
            <p>A curated space for sharing and exploring AI-generated art</p>
          </div>
        </div>

        <div className="topbar-meta">
          <div className="user-pill">
            <span className="user-pill__label">Signed in as</span>
            <strong>{getDisplayName(user)}</strong>
          </div>
          <button type="button" className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="workspace-grid">
        <aside className="sidebar">
          <div className="sidebar-panel">
            <span className="section-tag">Navigation</span>
            <nav className="nav-list">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
