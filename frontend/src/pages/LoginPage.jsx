import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthHero } from '../components/AuthHero.jsx';
import { useAuth } from '../state/AuthContext.jsx';

const highlights = [
  {
    title: 'Art frontier in the AI era',
    description: 'Discover imaginative visual worlds shaped by prompts, models, and human taste.'
  },
  {
    title: 'Inspiration from every creator',
    description: 'Browse fresh ideas, styles, and prompts from people exploring generative art.'
  },
  {
    title: 'A gallery built for exchange',
    description: 'Share your own work, appreciate others, and turn AI images into conversation.'
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
        badge="AI Art Community"
        title="AI Art Gallery"
        subtitle="A space for browsing, sharing, and discussing AI-generated artwork."
        highlights={highlights}
      />

      <section className="auth-card">
        <div className="auth-header">
          <h2>Sign in</h2>
          <p>Use your account to access the gallery, upload new work, and join the conversation.</p>
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
