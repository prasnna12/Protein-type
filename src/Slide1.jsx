import { useState, useRef, useEffect } from 'react';
import { analyzeBodyImage } from './geminiService';

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

const Slide1 = ({ next, setData }) => {
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
    "INITIALIZING VISION CORE...",
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
    )
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be picked again
    e.target.value = '';
  };

  const startScan = async () => {
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
      <div className="preview-hero">
        <div className={`scan-panel ${image ? 'has-image' : ''} ${isScanning ? 'scanning' : ''}`}>
          {!image ? (
            <div className="upload-box glass-card" onClick={() => fileInputRef.current.click()}>
              <div className="upload-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <h3>Analyze Your Physique</h3>
              <p>Upload a front-view photo for AI analysis</p>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageUpload}
                accept="image/*"
              />
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
                <h4>Bio-Insight</h4>
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

        .preview-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .scan-panel {
          width: 320px;
          height: 480px;
          transition: all 0.5s ease;
          position: relative;
        }

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
          border: 2px dashed rgba(0, 255, 136, 0.2);
          transition: var(--transition-smooth);
        }

        .upload-box:hover {
          border-color: var(--primary-color);
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-5px);
        }

        .upload-icon { color: var(--text-dim); margin-bottom: 24px; }
        .upload-box p { color: var(--text-dim); font-size: 0.9rem; margin-top: 10px; }

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

        @media (max-width: 768px) {
          .result-cards-grid { grid-template-columns: 1fr; }
          .scan-panel { width: 280px; height: 420px; }
        }
      `}</style>
    </div>
  );
};

export default Slide1;
