import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthHero } from '../components/AuthHero.jsx';
import { useAuth } from '../state/AuthContext.jsx';

const highlights = [
  {
    title: 'Proposal-aligned scope',
    description: 'Authentication, upload, browse, search, comments, and likes in one Azure-ready frontend.'
  },
  {
    title: 'React-first structure',
    description: 'Built for component reuse, client-side routing, and clean API integration.'
  },
  {
    title: 'Azure deployment path',
    description: 'Prepared for Azure Static Web Apps with a dedicated SPA routing config.'
  }
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: 'demo@aiartgallery.app',
    password: 'Password123!'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from?.pathname || '/gallery';

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate(destination, { replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <AuthHero
        badge="Azure Static Web Apps Frontend"
        title="AI Art Gallery"
        subtitle="A cloud-based AI image sharing experience for browsing artwork, storing metadata, and preparing Azure-backed course demos."
        highlights={highlights}
      />

      <section className="auth-card">
        <div className="auth-header">
          <h2>Sign in</h2>
          <p>Use your account to access the gallery, upload new work, and test the Azure-backed flow.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="wayne@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter password"
            required
          />

          <button type="submit" className="primary-btn primary-btn--block" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>

          <div className="demo-account">
            <strong>Demo account</strong>
            <p>Email: demo@aiartgallery.app</p>
            <p>Password: Password123!</p>
          </div>
        </form>

        {error ? <div className="message-box error">{error}</div> : null}

        <div className="auth-footer">
          <span>Need an account?</span>
          <Link className="text-link" to="/register">
            Create one
          </Link>
        </div>
      </section>
    </div>
  );
}
