import { useState, useRef, useEffect } from 'react';
import { analyzeBodyImage } from './geminiService';
import { useAuth } from './AuthContext';

// Import physique images for recommendations
import imgBulk from './assets/goal-bulk.png';
import imgLeanBulk from './assets/goal-lean-bulk.png';
import imgCut from './assets/goal-cut.png';
import imgFatLoss from './assets/goal-fat-loss.png';
import imgMaintenance from './assets/goal-maintenance.png';

const goalImages = {
  'Bulk': imgBulk,
  'Lean Bulk': imgLeanBulk,
  'Cut': imgCut,
  'Fat Loss': imgFatLoss,
  'Maintenance': imgMaintenance
};

const ResultCard = ({ title, value, icon, delay, children, grade, symmetry }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`result-card glass-card ${isVisible ? 'reveal' : ''}`}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="metric-icon">{icon}</span>
          <span className="metric-title">{title}</span>
        </div>
        <span className="metric-value">{value}</span>
      </div>
      <div className="card-body">
        {children}
        {grade && (
          <div className="grade-container">
            <div className="grade-label">DEFINITION GRADE: {grade}/10</div>
            <div className="grade-pill-bar">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`grade-pill ${i < grade ? 'active' : ''}`}></div>
              ))}
            </div>
          </div>
        )}
        {symmetry && (
          <div className="symmetry-container">
             <div className="grade-label">SYMMETRY RATING: {symmetry}%</div>
             <div className="symmetry-bar">
               <div className="symmetry-fill" style={{ width: `${symmetry}%` }}></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Slide1 = ({ next, setData, onLoginRequired }) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("");
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const fileInputRef = useRef(null);

  const resetScan = () => {
    setIsResetting(true);
    setTimeout(() => {
      setImage(null);
      setAnalysis(null);
      setError(null);
      setScanProgress(0);
      setIsResetting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 400);
  };

  const scanPhases = [
    "AI analyzing physique...",
    "SCANNING BODY TOPOLOGY...",
    "MAPPING MUSCLE DENSITY...",
    "CALCULATING SYMMETRY RATIOS...",
    "DETECTING PHYSIOLOGICAL SIGNALS...",
    "GENERATING BIO-REPORT..."
  ];

  // SVG Icons
  const Icons = {
    BodyType: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    BodyFat: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-8 6-8 11s4 9 8 9 8-4 8-9-8-11-8-11z"/><path d="M12 22v-3"/><path d="M9 18l3-3 3 3"/>
      </svg>
    ),
    Muscle: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8"/><path d="M3 22h18"/><path d="M18 18V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10"/><path d="M12 6V2"/>
      </svg>
    ),
    Goal: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    Signals: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    Dumbbell: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m2.121 7.757 1.415-1.414a2 2 0 1 0-2.829-2.829l-1.414 1.414a2 2 0 1 0 2.828 2.829z"/><path d="m8.121 13.757 1.415-1.414a2 2 0 1 0-2.829-2.829l-1.414 1.414a2 2 0 1 0 2.828 2.829z"/>
      </svg>
    ),
    Zap: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    Target: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    Brain: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A5 5 0 0 1 12 7v5H7a5 5 0 0 1 2.5-10z"/><path d="M14.5 2A5 5 0 0 0 12 7v5h5a5 5 0 0 0-2.5-10z"/><path d="M9.5 22a5 5 0 0 0 2.5-5v-5H7a5 5 0 0 0 2.5 10z"/><path d="M14.5 22a5 5 0 0 1-2.5-5v-5h5a5 5 0 0 1-2.5 5z"/>
      </svg>
    ),
    Scale: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.11.22-.53.31-1.14.31-1.14 0-1.5-.4-1.86-.44-.36.03-.72.44-1.86.44-.61 0-1.03-.09-1.14-.31Z"/><path d="m2 16 3-8 3 8c-.11.22-.53.31-1.14.31-1.14 0-1.5-.4-1.86-.44-.36.03-.72.44-1.86.44-.61 0-1.03-.09-1.14-.31Z"/><path d="M7 21h10"/><path d="M12 21V3"/><path d="M3 7h18"/>
      </svg>
    ),
    Activity: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  };

  const fitnessLines = [
    { icon: <Icons.Dumbbell />, text: "Protein helps repair and build muscle tissue after workouts.", delay: 100 },
    { icon: <Icons.Activity />, text: "Proper protein intake supports muscle growth and recovery.", delay: 200 },
    { icon: <Icons.Zap />, text: "Your body needs protein to maintain strength and energy.", delay: 300 },
    { icon: <Icons.Target />, text: "Different body goals like Bulk, Cut, or Maintain require different nutrition.", delay: 400 },
    { icon: <Icons.Brain />, text: "AI analysis helps estimate your body condition and suggest the right diet.", delay: 500 },
    { icon: <Icons.Scale />, text: "Balanced meals with protein, carbs, and nutrients improve health.", delay: 600 }
  ];

  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const startScan = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    if (!image) return;
    setIsScanning(true);
    setScanProgress(0);
    setAnalysis(null);
    setError(null);
    setScanPhase(scanPhases[0]);
    
    // Multi-stage progress
    let currentPhase = 0;
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const nextVal = prev + 5;
        
        const phaseIdx = Math.floor((nextVal / 100) * scanPhases.length);
        if (phaseIdx !== currentPhase && phaseIdx < scanPhases.length) {
          currentPhase = phaseIdx;
          setScanPhase(scanPhases[phaseIdx]);
        }

        if (nextVal >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return nextVal;
      });
    }, 150);

    try {
      const result = await analyzeBodyImage(image);
      setTimeout(() => {
        setAnalysis(result);
        setIsScanning(false);
        setData(prev => ({ ...prev, photo: image, analysis: result }));
      }, 3500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsScanning(false);
      setError(err.message || "Failed to analyze image. Please try again.");
    }
  };

  return (
    <div className={`slide-1-container stagger-in ${isResetting ? 'resetting' : ''}`}>
      {!analysis && !isScanning && (
        <div className="homepage-intro-section stagger-in">
          <h1 className="hero-main-title">AI Fitness & <span className="text-gradient">Protein Analysis</span></h1>
          <p className="hero-subtitle">Upload your photo and get AI-based body analysis and personalized nutrition suggestions to reach your peak physique.</p>
        </div>
      )}

      <div className="hero-layout-wrapper">
        <div className="preview-hero">
          <div 
            className={`scan-panel ${image ? 'has-image' : ''} ${isScanning ? 'scanning' : ''} ${isDragging ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!image ? (
              <div 
                className={`upload-box glass-card ${!user ? 'locked' : ''} ${isDragging ? 'active-drag' : ''}`} 
                onClick={() => user ? fileInputRef.current.click() : onLoginRequired()}
              >
                <div className="upload-icon-animated">
                  {user ? (
                    <div className="icon-bounce">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="lock-icon-wrap">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h3>{user ? 'Drag & Drop or Click' : 'Analyze Your Physique'}</h3>
                <p className="upload-hint">
                  {user ? 'Upload a front-view physique photo for analysis' : 'Please login to unlock AI neural scan and diet planning.'}
                </p>
                {user && (
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                )}
                {!user && <button className="btn-login-small glow-primary">Login to Access</button>}
                
                {isDragging && <div className="drag-overlay"><span>Drop Image Here</span></div>}
              </div>
            ) : (
              <div className="image-display-wrapper">
                <img src={image} alt="Physique" className="physique-preview-img" />
                <div className="hero-glow-border"></div>
                {isScanning && (
                  <div className="scan-overlay">
                    <div className="scan-line"></div>
                  </div>
                )}
                {!isScanning && (
                  <button className="btn-reupload" onClick={resetScan}>
                    Change Photo
                  </button>
                )}
              </div>
            )}
          </div>

          {isScanning && (
            <div className="loading-container glass-card stagger-in">
              <div className="loading-header">
                  <h3>{scanPhase}</h3>
                  <span className="percent-text">{Math.round(scanProgress)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p className="loading-hint">Performing deep neural scan of physiological markers</p>
            </div>
          )}

          {error && (
            <div className="error-message glass-card stagger-in">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="btn-reupload" onClick={() => setError(null)} style={{position: 'relative', bottom: 0, marginTop: '15px'}}>Dismiss</button>
            </div>
          )}
        </div>

        {!analysis && !isScanning && (
          <div className="fitness-info-sidebar stagger-in">
            <h2 className="info-title">Why Protein <span className="text-gradient">Matters</span></h2>
            <div className="info-cards-list">
              {fitnessLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className="info-mini-card glass-card"
                  style={{ animationDelay: `${line.delay}ms` }}
                >
                  <div className="info-icon-wrap">{line.icon}</div>
                  <p>{line.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="results-container">
        {!analysis && !isScanning && (
          <div className="intro-card glass-card text-center stagger-in">
            <h1 className="text-gradient">Ready to Transform?</h1>
            <p>Our advanced AI evaluates muscle density, frame size, and fat distribution to unlock your genetic potential.</p>
            <button 
              className="btn-primary start-btn" 
              onClick={startScan} 
              disabled={!image}
            >
              Start AI Analysis
            </button>
          </div>
        )}

        {analysis && (
          <div className="analysis-report">
            <div className="report-header stagger-in">
              <h2 className="text-gradient">Physique Bio-Report</h2>
              <button className="btn-reset-text" onClick={resetScan}>NEW SCAN +</button>
            </div>

            <div className="result-cards-grid">
              <ResultCard 
                title="Body Type" 
                value={analysis.bodyType} 
                icon={<Icons.BodyType />} 
                delay={200}
                symmetry={analysis.symmetryScore}
              >
                <p>Categorized by frame topology and metabolic profile.</p>
              </ResultCard>

              <ResultCard 
                title="Body Fat %" 
                value={analysis.bodyFatRange} 
                icon={<Icons.BodyFat />} 
                delay={400}
              >
                <p>Detected adipose tissue across core and limbs.</p>
              </ResultCard>

              <ResultCard 
                title="Muscle Analysis" 
                value={analysis.muscleLevel} 
                icon={<Icons.Muscle />} 
                delay={600}
                grade={analysis.muscleGrade}
              >
                <p>Density and separation grade relative to target potential.</p>
              </ResultCard>

              <ResultCard 
                title="Visual Signals" 
                value="DETECTED" 
                icon={<Icons.Signals />} 
                delay={800}
              >
                <div className="signals-grid">
                  <div className="signal-item">
                    <span>STOMACH</span>
                    <strong className={analysis.visualSignals?.stomach?.toLowerCase().includes('enlarged') ? 'warning' : 'success'}>
                      {analysis.visualSignals?.stomach}
                    </strong>
                  </div>
                  <div className="signal-item">
                    <span>SHOULDERS</span>
                    <strong>{analysis.visualSignals?.shoulders}</strong>
                  </div>
                  <div className="signal-item">
                    <span>WAIST</span>
                    <strong>{analysis.visualSignals?.waist}</strong>
                  </div>
                  <div className="signal-item">
                    <span>BODY FAT</span>
                    <strong>{analysis.visualSignals?.bodyFat}</strong>
                  </div>
                  <div className="signal-item">
                    <span>DEFINITION</span>
                    <strong>{analysis.visualSignals?.definition}</strong>
                  </div>
                  <div className="signal-item">
                    <span>POSTURE</span>
                    <strong>{analysis.visualSignals?.posture}</strong>
                  </div>
                </div>
              </ResultCard>

              <ResultCard 
                title="AI Target Goal" 
                value={analysis.suggestedGoal} 
                icon={<Icons.Goal />} 
                delay={1000}
              >
                <div className="goal-card-content">
                  <img src={goalImages[analysis.suggestedGoal] || imgMaintenance} alt={analysis.suggestedGoal} className="card-mini-img" />
                  <p>Optimal pathway selected for maximum aesthetic progression.</p>
                </div>
              </ResultCard>
            </div>

            <div className="summary-card glass-card reveal-delayed">
              <div className="summary-icon">✨</div>
              <div className="summary-content">
                <h4>AI EXPLANATION</h4>
                <p style={{fontStyle: 'italic', marginBottom: '10px'}}>{analysis.explanation}</p>
                <h4>BIO-INSIGHT</h4>
                <p>{analysis.summary}</p>
              </div>
            </div>

            <button className="btn-primary btn-cta reveal-delayed" onClick={next}>
              Access Strategy →
            </button>
          </div>
        )}
      </div>

      <style>{`
        .slide-1-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding-bottom: 60px;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .slide-1-container.resetting {
          opacity: 0;
          transform: translateY(10px);
        }

        .homepage-intro-section {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInDown 0.8s ease backwards;
        }

        .hero-main-title {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 15px;
          line-height: 1.1;
        }
        .hero-subtitle {
          color: var(--text-dim);
          font-size: 1.1rem;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 500;
        }

        .hero-section {
          padding-top: 40px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-subtitle {
          font-size: var(--fs-body);
          color: var(--text-dim);
          max-width: 500px;
          margin-bottom: 40px;
        }

        .upload-container {
          max-width: 500px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-box {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          border: 2px dashed var(--surface-border);
          transition: var(--transition-smooth);
        }
        .upload-box.dragging { border-color: var(--primary-color); background: rgba(6, 182, 212, 0.1); }
        .upload-box:hover { border-color: var(--primary-color); transform: translateY(-5px); }

        .upload-icon-wrap { font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px; }
        .upload-box h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 8px; }
        .upload-box p { font-size: 0.85rem; color: var(--text-dim); }

        .upload-lock-card {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .lock-icon { font-size: 3rem; margin-bottom: 10px; }

        .analysis-warning-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .warning-icon { font-size: 1.2rem; }
        .warning-text { font-size: 0.85rem; line-height: 1.4; }

        .fitness-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-tip-card {
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
          transition: var(--transition-smooth);
        }
        .info-tip-card:hover { transform: translateX(10px); border-color: var(--primary-color); }
        .tip-icon { font-size: 1.5rem; }
        .tip-content h4 { font-size: 0.9rem; font-weight: 800; margin-bottom: 4px; color: #fff; }
        .tip-content p { font-size: 0.75rem; color: var(--text-dim); line-height: 1.4; }

        .ai-loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .hero-section { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-subtitle { margin: 0 auto 40px auto; }
          .fitness-info-grid { max-width: 700px; margin: 0 auto; }
        }
        @media (max-width: 600px) {
          .fitness-info-grid { grid-template-columns: 1fr; }
          .hero-main-title { font-size: 2.2rem; }
        }
        .upload-icon-animated {
          color: var(--primary-color);
          margin-bottom: 25px;
          transition: 0.3s;
        }
        .icon-bounce { animation: bounce 2s infinite ease-in-out; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .upload-hint { color: var(--text-dim); font-size: 0.95rem; margin-top: 12px; max-width: 240px; line-height: 1.5; font-weight: 500; }

        .upload-box {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          border: 2px dashed rgba(0, 255, 136, 0.25);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: rgba(15, 23, 42, 0.4) !important;
        }

        .upload-box:hover {
          border-color: var(--primary-color);
          background: rgba(0, 255, 136, 0.04) !important;
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.08);
        }

        .upload-box.active-drag {
          border-color: var(--primary-color);
          background: rgba(0, 255, 136, 0.1) !important;
          transform: scale(1.05);
        }

        .drag-overlay {
          position: absolute;
          inset: 10px;
          border: 2px solid var(--primary-color);
          border-radius: 20px;
          background: rgba(0, 255, 136, 0.1);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .drag-overlay span { font-weight: 900; color: var(--primary-color); text-transform: uppercase; letter-spacing: 2px; }

        .upload-box.locked { 
          border-color: rgba(255,255,255,0.08); 
          filter: grayscale(0.8);
          opacity: 0.7;
        }
        .upload-box.locked:hover { border-color: var(--primary-color); filter: grayscale(0); opacity: 1; }
        .lock-icon-wrap { color: var(--text-dim); opacity: 0.5; margin-bottom: 20px; }
        .btn-login-small {
          margin-top: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .upload-icon { color: var(--text-dim); margin-bottom: 24px; }
        .upload-box p { color: var(--text-dim); font-size: 0.9rem; margin-top: 10px; max-width: 200px; line-height: 1.4; }

        .image-display-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        .physique-preview-img { width: 100%; height: 100%; object-fit: cover; }

        .hero-glow-border {
          position: absolute;
          inset: 0;
          border: 2px solid var(--primary-color);
          border-radius: 30px;
          opacity: 0.2;
          box-shadow: inset 0 0 20px var(--primary-glow), 0 0 20px var(--primary-glow);
          pointer-events: none;
        }

        .btn-reupload {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-reupload:hover { border-color: var(--primary-color); background: #000; }

        .loading-container { width: 100%; max-width: 500px; padding: 30px; }
        .loading-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .percent-text { font-family: monospace; color: var(--primary-color); font-weight: 800; font-size: 1.2rem; }
        .progress-bar-bg { height: 10px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; margin-bottom: 15px; }
        .progress-bar-fill { height: 100%; background: var(--primary-color); box-shadow: 0 0 15px var(--primary-glow); transition: width 0.3s linear; }
        .loading-hint { color: var(--text-dim); font-size: 0.85rem; text-align: center; }

        .error-message { width: 100%; max-width: 500px; padding: 20px; border-color: rgba(255, 77, 77, 0.3); background: rgba(255, 77, 77, 0.05); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .error-message .error-icon { font-size: 2rem; }
        .error-message p { color: #ff4d4d; font-size: 0.95rem; }

        .scan-overlay { position: absolute; inset: 0; background: rgba(0, 255, 136, 0.1); pointer-events: none; }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: var(--primary-color);
          box-shadow: 0 0 20px var(--primary-color);
          top: 0;
          animation: scanDown 2s infinite ease-in-out;
        }
        @keyframes scanDown { 0%, 100% { top: 0; } 50% { top: 100%; } }

        /* Result Cards Grid */
        .result-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .result-card {
          padding: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .result-card.reveal { opacity: 1; transform: translateY(0); }

        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .card-header-left { display: flex; align-items: center; gap: 12px; }
        .metric-icon { color: var(--primary-color); opacity: 0.8; }
        .metric-title { font-weight: 700; color: var(--text-dim); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-weight: 800; color: #fff; font-size: 1.2rem; }

        .card-body p { color: rgba(255,255,255,0.5); font-size: 0.85rem; line-height: 1.5; margin-bottom: 15px; }

        .grade-container { margin-top: 10px; }
        .grade-label { font-size: 0.7rem; font-weight: 800; color: var(--primary-color); margin-bottom: 8px; letter-spacing: 1px; }
        .grade-pill-bar { display: flex; gap: 4px; }
        .grade-pill { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 100px; }
        .grade-pill.active { background: var(--primary-color); box-shadow: 0 0 8px var(--primary-glow); }

        .symmetry-container { margin-top: 15px; }
        .symmetry-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; }
        .symmetry-fill { height: 100%; background: linear-gradient(to right, var(--primary-color), #00ffcc); }

        .signals-grid { display: flex; flex-direction: column; gap: 8px; }
        .signal-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
        .signal-item span { color: var(--text-dim); }
        .signal-item strong.warning { color: #ff4d4d; }
        .signal-item strong.success { color: var(--primary-color); }

        .goal-card-content { display: flex; align-items: center; gap: 15px; margin-top: 5px; }
        .card-mini-img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(0, 255, 136, 0.3); }

        .summary-card {
          margin-top: 30px;
          padding: 30px;
          display: flex;
          gap: 20px;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), transparent);
          border-color: rgba(0, 255, 136, 0.2);
          opacity: 0;
          animation: revealDelay 0.8s forwards 1.2s;
        }

        @keyframes revealDelay { to { opacity: 1; } }

        .summary-icon { font-size: 2rem; }
        .summary-content h4 { margin-bottom: 8px; font-weight: 800; color: var(--primary-color); font-size: 0.8rem; text-transform: uppercase; }
        .summary-content p { color: var(--text-dim); line-height: 1.6; font-size: 0.95rem; }

        .btn-cta { margin-top: 30px; width: 100%; border-radius: 100px; padding: 20px; font-size: 1.1rem; opacity: 0; animation: revealDelay 0.8s forwards 1.5s; }

        .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .btn-reset-text { background: none; border: 1px solid var(--primary-color); color: var(--primary-color); padding: 5px 15px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn-reset-text:hover { background: var(--primary-color); color: #000; box-shadow: 0 0 10px var(--primary-glow); }

        @media (max-width: 1000px) {
          .hero-layout-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .fitness-info-sidebar {
            max-width: 100%;
            text-align: center;
          }
          .info-mini-card {
            text-align: left;
          }
        }

        @media (max-width: 768px) {
          .result-cards-grid { grid-template-columns: 1fr; }
          .scan-panel { width: 280px; height: 420px; }
          .info-title { font-size: 1.5rem; }
          .hero-layout-wrapper { gap: 30px; }
        }
      `}</style>
    </div>
  );
};

export default Slide1;
