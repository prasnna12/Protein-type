import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialTab === 'login');
  
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialTab === 'login');
    }
  }, [isOpen, initialTab]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <div className="auth-body">
          <h2>{isLogin ? 'Welcome Back' : 'Join Protein.in AI'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Enter your details to track your progress' : 'Create an account to unlock AI analysis'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error-msg">{error}</div>}
            
            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-grid-auth">
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Create Account')}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button className="btn-google-auth" onClick={handleGoogleSignIn}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .auth-modal {
          width: 100%;
          max-width: 480px;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          background: rgba(15, 23, 42, 0.8) !important;
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          z-index: 10;
          transition: 0.3s;
        }
        .modal-close:hover { background: rgba(255, 77, 77, 0.2); border-color: #ff4d4d; color: #ff4d4d; }

        .auth-tabs {
          display: flex;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .auth-tab {
          flex: 1;
          padding: 20px;
          background: none;
          border: none;
          color: var(--text-dim);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.3s;
          position: relative;
        }
        .auth-tab.active { color: var(--primary-color); }
        .auth-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-color);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .auth-body { padding: 40px; }
        .auth-body h2 { font-size: 1.8rem; margin-bottom: 8px; color: #fff; }
        .auth-subtitle { color: var(--text-dim); font-size: 0.9rem; margin-bottom: 30px; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .auth-error-msg {
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.2);
          color: #ff4d4d;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-dim);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .input-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--surface-border);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-family: inherit;
          transition: 0.3s;
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.05);
        }

        .input-grid-auth { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media (max-width: 480px) { .input-grid-auth { grid-template-columns: 1fr; } }

        .auth-submit-btn { width: 100%; padding: 16px; border-radius: 14px; margin-top: 10px; font-weight: 800; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 30px 0;
          color: rgba(255,255,255,0.15);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

        .btn-google-auth {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #fff;
          color: #000;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-google-auth:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default AuthModal;
