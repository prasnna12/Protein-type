import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import AuthModal from './AuthModal'
import Footer from './Footer'
import React, { Suspense, lazy } from 'react'

// Lazy load slides for performance
const SlideHome = lazy(() => import('./SlideHome'));
const SlideProfile = lazy(() => import('./SlideProfile'));
const SlideScan = lazy(() => import('./SlideScan'));
const SlideGoal = lazy(() => import('./SlideGoal'));
const SlideReport = lazy(() => import('./SlideReport'));
const SlidePlan = lazy(() => import('./SlidePlan'));

const LoadingSpinner = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Initializing Neural Engine...</p>
    <style>{`
      .loading-fallback { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; gap: 20px; color: var(--text-dim); }
      .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

// ── GLOBAL ERROR BOUNDARY ──────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) {
    console.error("APP CRITICAL ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback glass-card">
          <h2>Something went wrong. Please try again.</h2>
          <p>The page you tried to access is not available or encountered a neural glitch.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Refresh Platform</button>
          <style>{`
            .error-fallback {
              margin: 100px auto;
              max-width: 500px;
              padding: 40px;
              text-align: center;
              border: 1px solid rgba(248, 113, 113, 0.3);
              background: rgba(15, 23, 42, 0.8);
            }
            .error-fallback h2 { color: #f87171; margin-bottom: 20px; font-weight: 900; }
          `}</style>
        </div>
      );
    }
    return this.props.children;
  }
}

const TOTAL_SLIDES = 6;

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const NavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="m9.05 10 1-.92a6.5 6.5 0 1 1 3.9 0l1 .92"/><path d="M12 12v.01"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.31-2.31a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LogoIcon = () => (
  <div className="logo-icon-wrap">
    <NavIcon />
  </div>
);

const BrandingTag = () => (
  <span className="branding-tag">@prasnnacreativity</span>
);

function App() {
  const { user, logout } = useAuth();
  useEffect(() => {
    const handleOnline = () => alert("Connection Restored.");
    const handleOffline = () => alert("Network issue detected. Please check your internet connection.");
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    weight: '',
    gender: '',
    diet: 'vegetarian',
    healthCondition: 'None',
    photo: null,
    analysis: null,
    goal: null,
    proteinTarget: 0,
    meals: []
  });

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, TOTAL_SLIDES));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 1));
  
  // BROKEN LINK PROTECTION: Validates slide range
  const goToSlide = (slide) => {
    if (slide < 1 || slide > TOTAL_SLIDES) {
      console.warn(`Invalid slide ${slide} requested. Redirecting to Home.`);
      setCurrentSlide(1);
    } else {
      setCurrentSlide(slide);
    }
    setIsMobileMenuOpen(false);
  };

  const openAuth = (tab) => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Network Status Monitoring
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderSlide = () => {
    // Data Integrity Redirects
    if (currentSlide > 1 && !userData.photo) {
      setTimeout(() => setCurrentSlide(1), 0);
      return <SlideHome next={nextSlide} setData={setUserData} onLoginRequired={() => openAuth('login')} user={user} />;
    }
    if (currentSlide > 2 && !userData.analysis) {
      setTimeout(() => setCurrentSlide(2), 0);
      return <SlideScan next={nextSlide} data={userData} setData={setUserData} />;
    }

    switch(currentSlide) {
      case 1: return <SlideHome next={nextSlide} setData={setUserData} onLoginRequired={() => openAuth('login')} user={user} />;
      case 2: return <SlideScan next={nextSlide} data={userData} setData={setUserData} />;
      case 3: return <SlideProfile next={nextSlide} setData={setUserData} data={userData} />;
      case 4: return <SlideGoal next={nextSlide} data={userData} setData={setUserData} />;
      case 5: return <SlideReport next={nextSlide} data={userData} setData={setUserData} />;
      case 6: return <SlidePlan data={userData} />;
      default: return <SlideHome next={nextSlide} setData={setUserData} onLoginRequired={() => openAuth('login')} user={user} />;
    }
  };

  const slideLabels = ['Home / Upload', 'AI Body Analysis', 'Analysis Result', 'User Inputs', 'Protein Calculation', 'Master Strategy'];

  return (
    <div className="page-root">
      <header className="main-header glass-card">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-section" onClick={() => goToSlide(1)}>
              <div className="logo-wrapper">
                <LogoIcon />
                <BrandingTag />
              </div>
              <div className="divider"></div>
              <div className="logo-text">
                <span className="logo-title text-gradient">Protein.in AI</span>
                <span className="logo-tag">SMART NUTRITION AI</span>
              </div>
            </div>
          </div>

          <nav className={`header-center ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <ul className="nav-menu">
              <li><button onClick={() => goToSlide(1)} className={currentSlide === 1 ? 'active' : ''}>Home</button></li>
              <li><button onClick={() => goToSlide(3)} className={currentSlide === 3 ? 'active' : ''}>AI Analysis</button></li>
              <li><button onClick={() => goToSlide(5)} className={currentSlide === 5 ? 'active' : ''}>Report</button></li>
            </ul>
          </nav>

          <div className="header-right">
            {user ? (
              <div className="user-profile-widget">
                <div className="user-avatar-small">
                  {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{user.email[0].toUpperCase()}</span>}
                </div>
                <span className="user-name-small desktop-only">{user.displayName || user.email.split('@')[0]}</span>
                <button className="btn-header-logout" onClick={logout}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <button className="btn-signin-nav desktop-only" onClick={() => openAuth('login')}>Sign In</button>
                <button className="btn-signup-nav glow-primary" onClick={() => openAuth('signup')}>Sign Up</button>
              </div>
            )}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {currentSlide > 1 && (
        <button className="global-back-btn glass-card slide-in-left" onClick={prevSlide}>
          <BackIcon />
          <span>Back</span>
        </button>
      )}

      <div className="app-main-content">
        <div className="app-container">
          {!isOnline && (
            <div className="network-warning-bar slide-in-top">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
              <span>Internet Disconnected. AI Neural Engine Paused.</span>
              <style>{`
                .network-warning-bar {
                  background: #ef4444; border-radius: 12px; padding: 10px 20px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-weight: 800; font-size: 0.85rem; color: #fff; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.2);
                }
              `}</style>
            </div>
          )}

          <div className="slide-progress-bar">
             <div className="progress-track">
               <div className="progress-fill" style={{ width: `${(currentSlide / TOTAL_SLIDES) * 100}%` }}></div>
             </div>
             <div className="progress-steps-label">
                STEP {currentSlide} OF {TOTAL_SLIDES}: {slideLabels[currentSlide - 1].toUpperCase()}
             </div>
          </div>

          <main className="slide-content-wrapper stagger-in" key={currentSlide}>
            <Suspense fallback={<LoadingSpinner />}>
              {renderSlide()}
            </Suspense>
          </main>
        </div>
      </div>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authTab}
      />

      <style>{`
        .page-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #020617;
        }

        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 1000;
          backdrop-filter: blur(20px);
          background: rgba(10, 25, 47, 0.8) !important;
          border-bottom: 1px solid rgba(0, 198, 255, 0.1);
          border-radius: 0;
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: 0.3s;
        }
        .header-left .logo-section:hover { transform: translateY(-1px); }

        .logo-wrapper { display: flex; align-items: center; gap: 10px; position: relative; cursor: pointer; }
        .branding-tag {
          font-size: 0.7rem;
          font-weight: 950;
          color: #fff;
          background: linear-gradient(90deg, var(--primary-color), var(--accent-purple), var(--primary-color));
          background-size: 200% auto;
          padding: 6px 16px;
          border-radius: 100px;
          box-shadow: 0 0 25px rgba(0, 198, 255, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
          animation: brandingShimmer 3s linear infinite, brandingPulse 1.5s ease-in-out infinite alternate;
          border: 1px solid rgba(0, 198, 255, 0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @keyframes brandingShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes brandingPulse {
          from { filter: drop-shadow(0 0 2px var(--primary-color)); transform: scale(1) rotate(-1deg); }
          to { filter: drop-shadow(0 0 12px var(--primary-color)); transform: scale(1.05) rotate(1deg); }
        }

        .header-left .divider { width: 1px; height: 30px; background: rgba(255,255,255,0.1); margin: 0 5px; }

        .logo-icon-wrap {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-purple));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .logo-title { font-size: 1.1rem; font-weight: 900; letter-spacing: -0.5px; }
        .logo-tag { font-size: 0.6rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; opacity: 0.8; }

        .nav-menu { display: flex; list-style: none; gap: 35px; }
        .nav-menu button {
          background: none;
          border: none;
          color: var(--text-dim);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.3s;
          padding: 8px 0;
          position: relative;
        }
        .nav-menu button:hover { color: #fff; }
        .nav-menu button.active { color: var(--primary-color); }
        .nav-menu button.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-color);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .header-right { display: flex; align-items: center; gap: 20px; }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-dim);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          transition: 0.3s;
          margin-right: 15px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 100px;
        }
        .contact-link:hover { color: #fff; background: rgba(255,255,255,0.08); }

        .auth-buttons-group { display: flex; align-items: center; gap: 15px; }

        .btn-signin-nav {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-signin-nav:hover { background: rgba(255,255,255,0.05); border-color: var(--primary-color); color: var(--primary-color); }

        .btn-signup-nav {
          background: var(--primary-color);
          color: #000;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 15px var(--primary-glow);
        }
        .btn-signup-nav:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--primary-glow); }

        .user-profile-widget { display: flex; align-items: center; gap: 12px; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 100px; }
        .user-info-brief { display: flex; align-items: center; gap: 10px; }
        .user-avatar-small { width: 30px; height: 30px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000; overflow: hidden; font-size: 0.8rem; }
        .user-name-small { font-weight: 700; font-size: 0.85rem; color: #fff; }
        .btn-header-logout { background: none; border: none; color: var(--text-dim); cursor: pointer; display: flex; align-items: center; transition: 0.3s; }
        .btn-header-logout:hover { color: #ff4d4d; }

        .app-main-content { padding-top: 100px; flex: 1; }
        .app-container { max-width: 1200px; margin: 0 auto; padding: 20px; width: 100%; }

        .brand-signature { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; opacity: 0.6; }

        .slide-progress-bar { margin-bottom: 40px; }
        .progress-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; margin-bottom: 10px; }
        .progress-fill { height: 100%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow); transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .progress-steps-label { font-size: 0.7rem; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }

        .mobile-menu-toggle { display: none; background: none; border: none; color: #fff; cursor: pointer; }

        @media (max-width: 1100px) {
          .nav-menu { gap: 20px; }
          .header-inner { padding: 0 20px; }
        }

        @media (max-width: 900px) {
          .desktop-only { display: none; }
          .header-center {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: #0f172a;
            padding: 30px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            display: none;
          }
          .header-center.mobile-active { display: block; }
          .nav-menu { flex-direction: column; gap: 20px; }
          .mobile-menu-toggle { display: block; }
          .auth-buttons-group { gap: 10px; }
          .btn-signin-nav, .btn-signup-nav { padding: 8px 16px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

const AppWithBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithBoundary;
