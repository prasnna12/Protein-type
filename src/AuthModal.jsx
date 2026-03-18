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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!isLogin && !name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
        // If your Firebase setup doesn't auto-update profile, 
        // you might want to call updateProfile(auth.currentUser, { displayName: name }) here.
      }
      onClose();
    } catch (err) {
      console.error("Auth Error:", err.code);
      let friendlyMsg = err.message.replace('Firebase: ', '');
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        friendlyMsg = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMsg = "This email is already registered. Try logging in.";
      } else if (err.code === 'auth/network-request-failed') {
        friendlyMsg = "Network error. Please check your internet connection.";
      }
      setError(friendlyMsg);
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
      <div className="auth-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="auth-split-layout">
          {/* Left Side: Fitness Info */}
          <div className="auth-info-side">
            <div className="info-overlay"></div>
            <div className="info-content">
              <div className="badge-modern">PREMIUM AI FITNESS</div>
              <h2>AI Fitness & Nutrition Guide</h2>
              <div className="info-lines">
                <div className="info-line">
                  <span className="info-icon">🥩</span>
                  <p>Protein is essential for building and repairing muscles after workouts.</p>
                </div>
                <div className="info-line">
                  <span className="info-icon">💪</span>
                  <p>A balanced diet with proper protein intake helps improve strength and body composition.</p>
                </div>
                <div className="info-line">
                  <span className="info-icon">🥗</span>
                  <p>Regular workouts combined with smart nutrition can transform your health and fitness.</p>
                </div>
              </div>
              
              <div className="feature-pills">
                <span className="pill">💪 Fitness</span>
                <span className="pill">🥩 Protein</span>
                <span className="pill">🥗 Healthy Eating</span>
                <span className="pill">📊 Body Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="auth-form-side">
            <div className="auth-form-header">
              <div className="auth-tabs-modern">
                <button 
                  className={`auth-tab-btn ${isLogin ? 'active' : ''}`} 
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button 
                  className={`auth-tab-btn ${!isLogin ? 'active' : ''}`} 
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              <h1>{isLogin ? 'Login to Continue' : 'Create Account'}</h1>
              <p className="auth-desc">
                {isLogin 
                  ? "Create an account to unlock AI body analysis and personalized nutrition plans."
                  : "Join us to get your personalized AI-driven fitness strategy today."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-modern">
              {error && <div className="auth-error-banner">{error}</div>}
              
              {!isLogin && (
                <div className="modern-input-group">
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

              <div className="modern-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modern-input-group">
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
                <div className="modern-input-group">
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

              <button type="submit" className="btn-primary-modern" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Sign Up')}
              </button>
            </form>

            <div className="auth-divider-modern">
              <span>OR</span>
            </div>

            <button className="btn-google-modern" onClick={handleGoogleSignIn}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: modalFadeIn 0.3s ease;
        }

        .auth-modal-container {
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
          background: #0f172a !important;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          display: flex;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 24px;
          z-index: 100;
          transition: 0.3s;
        }
        .modal-close:hover { background: rgba(255, 77, 77, 0.2); border-color: #ff4d4d; color: #ff4d4d; }

        .auth-split-layout {
          display: flex;
          width: 100%;
        }

        /* Info Side */
        .auth-info-side {
          flex: 1.1;
          padding: 60px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop') center/cover;
        }
        .info-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 182, 212, 0.4) 100%);
          z-index: 1;
        }
        .info-content { position: relative; z-index: 2; }
        
        .badge-modern {
          display: inline-block;
          background: rgba(6, 182, 212, 0.2);
          color: var(--primary-color);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 24px;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .info-content h2 {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 32px;
          background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info-lines { display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; }
        .info-line { display: flex; gap: 16px; align-items: flex-start; }
        .info-icon { font-size: 1.5rem; line-height: 1.4; }
        .info-line p { color: rgba(255,255,255,0.8); font-size: 1rem; line-height: 1.6; }

        .feature-pills { display: flex; flex-wrap: wrap; gap: 12px; }
        .pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
        }

        /* Form Side */
        .auth-form-side {
          flex: 0.9;
          padding: 60px;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-form-header { margin-bottom: 32px; }
        .auth-tabs-modern {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.03);
          padding: 6px;
          border-radius: 14px;
          width: fit-content;
        }
        .auth-tab-btn {
          padding: 10px 24px;
          border-radius: 10px;
          border: none;
          background: none;
          color: var(--text-dim);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .auth-tab-btn.active {
          background: rgba(6, 182, 212, 0.1);
          color: var(--primary-color);
        }

        .auth-form-header h1 { font-size: 2rem; margin-bottom: 12px; font-weight: 800; }
        .auth-desc { color: var(--text-dim); font-size: 0.9rem; line-height: 1.5; }

        .auth-form-modern { display: flex; flex-direction: column; gap: 20px; }
        .auth-error-banner {
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.2);
          color: #ff4d4d;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .modern-input-group label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .modern-input-group input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 14px 18px;
          border-radius: 14px;
          color: #fff;
          transition: 0.3s;
        }
        .modern-input-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
        }

        .btn-primary-modern {
          margin-top: 12px;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: var(--primary-color);
          color: #000;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-primary-modern:hover { transform: translateY(-2px); box-shadow: 0 10px 20px var(--primary-glow); }
        .btn-primary-modern:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-divider-modern {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: var(--text-dim);
          font-size: 0.7rem;
          font-weight: 800;
        }
        .auth-divider-modern::before, .auth-divider-modern::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .btn-google-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: #fff;
          color: #000;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-google-modern:hover { background: #f8fafc; transform: translateY(-1px); }

        @media (max-width: 960px) {
          .auth-modal-container { max-width: 500px; }
          .auth-info-side { display: none; }
          .auth-form-side { flex: 1; padding: 40px; }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
