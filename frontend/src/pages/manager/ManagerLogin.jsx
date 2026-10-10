import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ManagerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/manager/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Use admin@hotel.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@hotel.com');
    setPassword('admin123');
    setLoading(true);
    try {
      await login('admin@hotel.com', 'admin123');
      navigate('/manager/dashboard');
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.25rem',
        textAlign: 'left'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>
            Manager Portal
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Hotel Kitchen, Orders & Menu Management
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Manager Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@hotel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark btn-full"
            style={{ padding: '0.75rem', fontSize: '0.9375rem', marginBottom: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Manager'}
          </button>

          {/* Quick Demo button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-outline btn-full"
            style={{ padding: '0.65rem', fontSize: '0.8125rem', color: '#b45309', borderColor: '#fde68a', backgroundColor: '#fef3c7' }}
          >
            <Sparkles size={14} />
            <span>Quick 1-Click Demo Login</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}>
            ← Back to Customer Dining Page
          </Link>
        </div>
      </div>
    </div>
  );
}
