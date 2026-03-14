import { useState } from 'react'
import './index.css'
import Slide1 from './Slide1'
import Slide2 from './Slide2'
import SlideDiet from './SlideDiet'
import Slide3 from './Slide3'
import Slide4 from './Slide4'
import Footer from './Footer'
import { useAuth } from './AuthContext'
import AuthPage from './AuthPage'

const TOTAL_SLIDES = 5;

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

function App() {
  const { user, logout } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [userData, setUserData] = useState({
    photo: null,
    analysis: null,
    goal: null,
    diet: null,
    proteinTarget: 0,
    meals: []
  });

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, TOTAL_SLIDES));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 1));

  const renderSlide = () => {
    switch(currentSlide) {
      case 1: return <Slide1 next={nextSlide} setData={setUserData} />;
      case 2: return <Slide2 next={nextSlide} prev={prevSlide} setData={setUserData} data={userData} />;
      case 3: return <SlideDiet next={nextSlide} prev={prevSlide} setData={setUserData} />;
      case 4: return <Slide3 next={nextSlide} prev={prevSlide} data={userData} />;
      case 5: return <Slide4 prev={prevSlide} data={userData} />;
      default: return <Slide1 next={nextSlide} setData={setUserData} />;
    }
  };

  if (!user) {
    return (
      <div className="page-root">
        <AuthPage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-root">
      <div className="app-container">
        <div className="brand-signature">@prasnnacreativity</div>
        <nav className="nav-header glass-card">
          <div className="nav-left">
            {currentSlide > 1 ? (
              <button className="btn-back-global" onClick={prevSlide} title="Go Back">
                <BackIcon />
                <span>Back</span>
              </button>
            ) : (
              <div className="logo-wrap">
                <div className="logo text-gradient">Protein.in AI</div>
                <div className="tagline">Smart AI Fitness & Protein Nutrition Planner</div>
              </div>
            )}
            
            <div className="user-info">
              <span className="welcome-text">Hi, {user.displayName || user.email.split('@')[0]} 👋</span>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </div>
          </div>

          {currentSlide > 1 && <div className="logo-center text-gradient">Protein.in AI</div>}

          <div className="step-indicator">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map(s => (
              <div
                key={s}
                className={`step ${s === currentSlide ? 'active' : ''} ${s < currentSlide ? 'completed' : ''}`}
                title={['Upload Photo', 'Choose Goal', 'Diet Type', 'Meal Plan', 'Foods'][s - 1]}
              >
                {s}
              </div>
            ))}
          </div>
        </nav>

        <main className="slide-content stagger-in" key={currentSlide}>
          {renderSlide()}
        </main>
      </div>

      <Footer />

      <style>{`
        .page-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .brand-signature {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
          margin-left: 30px;
          opacity: 0.6;
          user-select: none;
        }
        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 30px;
          margin-bottom: 40px;
          position: sticky;
          top: 20px;
          z-index: 100;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 25px;
        }
        .logo { font-size: 1.4rem; font-weight: 800; line-height: 1; }
        .logo-wrap { display: flex; flex-direction: column; gap: 4px; }
        .tagline { font-size: 0.65rem; font-weight: 600; color: var(--text-dim); letter-spacing: 0.5px; }
        .logo-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1.3rem;
          font-weight: 800;
          pointer-events: none;
        }
        
        .btn-back-global {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--surface-border);
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }
        .btn-back-global:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-4px);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .btn-back-global svg { width: 18px; height: 18px; }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          padding-left: 20px;
          border-left: 1px solid var(--surface-border);
        }
        .welcome-text { color: var(--text-dim); }
        .btn-logout {
          background: none;
          border: none;
          color: var(--secondary-color);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }
        .btn-logout:hover { text-decoration: underline; }
        
        .step-indicator { display: flex; gap: 10px; }
        .step {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-dim);
          transition: var(--transition-smooth);
        }
        .step.active {
          border-color: var(--primary-color);
          color: var(--primary-color);
          box-shadow: 0 0 15px var(--primary-glow);
        }
        .step.completed {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: #000;
        }
        .slide-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .logo-center { display: none; }
        }
        @media (max-width: 768px) {
          .nav-header { padding: 15px 20px; }
          .welcome-text { display: none; }
          .user-info { padding-left: 0; border: none; }
        }
      `}</style>
    </div>
  )
}

export default App
