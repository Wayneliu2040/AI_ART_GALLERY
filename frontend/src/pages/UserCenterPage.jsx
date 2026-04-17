import { useEffect, useState } from 'react';
import { imageApi } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';

function getDisplayName(user) {
  if (user?.name?.trim()) {
    return user.name.trim();
  }

  if (user?.email?.includes('@')) {
    return user.email.split('@')[0];
  }

  return user?.email || 'Guest';
}

export function UserCenterPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      setStatus('loading');
      setError('');

      try {
        const nextSummary = await imageApi.getUserSummary(user);
        setSummary(nextSummary);
        setStatus('ready');
      } catch (nextError) {
        setError(nextError.message);
        setStatus('error');
      }
    }

    loadSummary();
  }, [user]);

  return (
    <div className="page-stack">
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>User Information</h2>
          </div>
        </div>

        {status === 'loading' ? <div className="info-card">Loading user profile...</div> : null}
        {status === 'error' ? <div className="message-box error">{error}</div> : null}

        {status === 'ready' ? (
          <>
            <section className="profile-card">
              <div className="profile-avatar">{getDisplayName(user).slice(0, 1).toUpperCase()}</div>
              <div className="profile-copy">
                <h3>{getDisplayName(user)}</h3>
                <p>{user?.email}</p>
              </div>
            </section>

            <section className="profile-details-grid">
              <article className="stat-card">
                <span className="stat-card__label">Username</span>
                <strong>{getDisplayName(user)}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-card__label">Email</span>
                <strong className="stat-card__value--wrap">{user?.email}</strong>
              </article>
            </section>

            <section className="stats-grid stats-grid--triple">
              <article className="stat-card">
                <span className="stat-card__label">Uploaded Images</span>
                <strong>{summary.uploadCount}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-card__label">Received Likes</span>
                <strong>{summary.receivedLikes}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-card__label">Received Comments</span>
                <strong>{summary.receivedComments}</strong>
              </article>
            </section>
          </>
        ) : null}
      </section>
    </div>
  );
}
