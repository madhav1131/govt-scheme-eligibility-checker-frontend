import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, LogIn, UserPlus, Shield, Sparkles } from 'lucide-react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
        }
      } else {
        const res = await register(formData.name, formData.email, formData.password);
        if (res.success) {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setFormData({ name: 'System Admin', email: 'admin@janseva.local', password: 'admin123' });
    setIsLogin(true);
  };

  const fillDemoUser = () => {
    setFormData({ name: 'Rahul Sharma', email: 'rahul@example.com', password: 'user123' });
    setIsLogin(true);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      {/* Quick Demo Credentials Box */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--primary-light)', border: '1px solid rgba(30, 58, 138, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          <Sparkles size={16} /> Quick Demo Login (One Click):
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={fillDemoAdmin} className="btn btn-secondary btn-sm" style={{ background: 'var(--bg-card)', flex: 1 }}>
            <Shield size={14} color="var(--primary)" /> Fill Admin Login
          </button>
          <button type="button" onClick={fillDemoUser} className="btn btn-secondary btn-sm" style={{ background: 'var(--bg-card)', flex: 1 }}>
            Fill User Login
          </button>
        </div>
      </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <Landmark size={36} color="#f97316" style={{ margin: '0 auto 0.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {isLogin ? 'Sign In to Citizen Portal' : 'Register Citizen Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Access saved eligibility profiles & scheme bookmarks' : 'Create an account to track your scheme applications'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? (
              <><LogIn size={18} /> Sign In</>
            ) : (
              <><UserPlus size={18} /> Create Account</>
            )}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem' }}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button type="button" onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
