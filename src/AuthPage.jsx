import React, { useState } from 'react';
import Toast from './Toast';
import { useAuth } from './AuthContext';

const AuthPage = () => {
  const [toast, setToast] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic client‑side validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setToast({ type: 'success', message: 'Logged in successfully' });
      } else {
        await signup(email, password);
        setToast({ type: 'success', message: 'Account created successfully' });
      }
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-hero-section">
        <div className="hero-content stagger-in">
          <div className="hero-badge">AI POWERED FITNESS</div>
          <h1 className="hero-title">Elevate Your <span className="text-gradient">Physique</span></h1>
          <p className="hero-text">
            Join the next generation of AI-driven nutrition. Analyze your body composition and fuel your journey with precision.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">AI</span>
              <span className="stat-label">Vision</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Personalized</span>
            </div>
          </div>
        </div>
        <div className="hero-bg-overlay"></div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container glass-card stagger-in">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Enter your credentials to continue' : 'Start your transformation today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Get Started')}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button className="btn-google" onClick={handleGoogleSignIn}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="auth-toggle">
            {isLogin ? "New to Protein.in AI?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #000;
          overflow: hidden;
        }

        /* Hero Section */
        .auth-hero-section {
          flex: 1.2;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: #020617;
          background-image: 
            radial-gradient(at 0% 0%, rgba(0, 255, 136, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%);
        }
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80') center/cover no-repeat;
          opacity: 0.15;
          mix-blend-mode: overlay;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 500px;
        }
        .hero-badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: var(--primary-color);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 24px;
          color: #fff;
        }
        .hero-text {
          font-size: 1.1rem;
          color: var(--text-dim);
          line-height: 1.6;
          margin-bottom: 40px;
        }
        .hero-stats {
          display: flex;
          gap: 40px;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
        }
        .stat-num {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Form Section */
        .auth-form-section {
          flex: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #000;
          position: relative;
        }
        .auth-form-section::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--primary-color);
          filter: blur(150px);
          opacity: 0.05;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .auth-form-container {
          width: 100%;
          max-width: 440px;
          padding: 50px;
          border-radius: 32px;
          z-index: 2;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .auth-header h2 {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .auth-header p {
          color: var(--text-dim);
          font-size: 0.95rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dim);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .input-wrapper input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--surface-border);
          border-radius: 16px;
          padding: 14px 18px;
          color: #fff;
          font-family: inherit;
          transition: var(--transition-smooth);
        }
        .input-wrapper input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.05);
        }
        .auth-submit {
          margin-top: 10px;
          padding: 16px;
          border-radius: 16px;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 32px 0;
          color: rgba(255,255,255,0.2);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--surface-border);
        }
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #fff;
          color: #000;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .btn-google:hover {
          background: #f1f1f1;
          transform: translateY(-2px);
        }
        .auth-toggle {
          margin-top: 40px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-dim);
        }
        .auth-toggle button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 800;
          margin-left: 8px;
          cursor: pointer;
          font-family: inherit;
        }
        .auth-toggle button:hover {
          text-decoration: underline;
        }
        @media (max-width: 1024px) {
          .auth-hero-section { display: none; }
          .auth-form-section { flex: 1; }
        }
        @media (max-width: 480px) {
          .auth-form-container { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
