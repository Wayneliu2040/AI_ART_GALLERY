import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthHero } from '../components/AuthHero.jsx';
import { useAuth } from '../state/AuthContext.jsx';

const highlights = [
  {
    title: 'Ready for real APIs',
    description: 'The form structure matches the future .NET authentication endpoints.'
  },
  {
    title: 'Student-project friendly',
    description: 'Simple enough to ship quickly while still feeling like a full product workflow.'
  },
  {
    title: 'Azure-focused delivery',
    description: 'Designed to connect cleanly with Azure SQL and Azure VM-hosted APIs.'
  }
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate('/gallery', { replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <AuthHero
        badge="Azure Project Onboarding"
        title="Create your gallery account"
        subtitle="Register a user profile that will later be stored in Azure SQL Database and authenticated through the .NET backend."
        highlights={highlights}
      />

      <section className="auth-card">
        <div className="auth-header">
          <h2>Register</h2>
          <p>Create an account to upload artwork, leave comments, and build your Azure demo dataset.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Display name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Wayne"
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="wayne@example.com"
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Create password"
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            placeholder="Repeat password"
            required
          />

          <button type="submit" className="primary-btn primary-btn--block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {error ? <div className="message-box error">{error}</div> : null}

        <div className="auth-footer">
          <span>Already registered?</span>
          <Link className="text-link" to="/login">
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
