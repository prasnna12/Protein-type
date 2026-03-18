import { useState, useEffect } from 'react';
import { analyzeBodyImage, calculateFallbackAnalysis, validateHumanImage } from './geminiService';

const SlideScan = ({ next, setData, data, user, onReset }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("");
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // { isHuman: false, detectedObject: 'Dog', emoji: '🐶' }

  const scanPhases = [
    "Scanning Body Structure",
    "Analyzing Physique",
    "Verifying Results",
    "Estimated Analysis (AI Busy)",
    "Finalizing"
  ];

  useEffect(() => {
    if (data.photo && !isScanning) {
      startScan();
    }
  }, [data.photo]);

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanPhase(scanPhases[0]);
    
    // Non-blocking progress simulation for visual feedback
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5; 
      });
    }, 150);

    try {
      // 1. Validation Phase
      setScanPhase("Verifying Image Content...");
      const validation = await validateHumanImage(data.photo);
      
      if (!validation.isHuman) {
        clearInterval(progressInterval);
        setValidationResult(validation);
        setIsScanning(false);
        return;
      }

      // 2. Processing / Uploading Phase
      setScanPhase(scanPhases[0]);
      
      // 3. Analyzing Phase
      setTimeout(() => setScanPhase(scanPhases[1]), 800);

      const result = await analyzeBodyImage(data.photo);
      
      if (result.isHuman === false) {
        clearInterval(progressInterval);
        setValidationResult(result);
        setIsScanning(false);
        return;
      }
      setScanPhase(scanPhases[2]);
      setScanProgress(90);

      // 4. Finalizing Phase
      setTimeout(() => setScanPhase(scanPhases[3]), 400);

      clearInterval(progressInterval);
      setScanProgress(100);
      
      setData(prev => ({ ...prev, analysis: result }));
      
      // Near-instant transition
      setTimeout(() => {
        next();
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      console.warn("AI Analysis issue:", err.message);
      
      const isTimeout = err.message === 'NETWORK_TIMEOUT' || err.message.includes('timeout');
      setScanPhase(isTimeout ? "Neural Core Busy..." : "Processing Issue...");
      
      // EXPLICIT BUT SAFE FALLBACK
      setTimeout(() => {
        setScanPhase(scanPhases[3]); // Estimated Analysis
        const fallbackResult = calculateFallbackAnalysis(data.weight || 75, 25, data.gender || 'Male', data.photo);
        setData(prev => ({ 
          ...prev, 
          analysis: { ...fallbackResult, isEstimated: true } 
        }));
        setScanProgress(100);
        setTimeout(() => next(), 1200); 
      }, 800);
    }
  };

  return (
    <div className="slide-scan glass-card">
      <div className="scan-header">
        <h1 className="text-gradient">Neural Processing</h1>
        <p className="subtitle">Gemini AI is currently analyzing your physique topology.</p>
      </div>

      <div className="processing-display">
        <div className="image-preview-container glass-card">
          <img src={data.photo} alt="Physique Scan" />
          <div className="scan-beam-container">
            <div className="scan-beam"></div>
          </div>
          <div className="corner-decor top-left"></div>
          <div className="corner-decor top-right"></div>
          <div className="corner-decor bottom-left"></div>
          <div className="corner-decor bottom-right"></div>
        </div>
      </div>

      <div className="scan-status">
        <div className="status-top">
          <div className="phase-indicator">
             <span className="pulse-dot"></span>
             <span className="phase-text">{scanPhase || 'Initializing Neural Engine...'}</span>
          </div>
          <span className="percent-text">{scanProgress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${scanProgress}%` }}></div>
        </div>
        <div className="scan-labels">
          <span>AI NEURAL CORE ACTIVE</span>
          <span>STABLE CONNECTION</span>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {validationResult && (
        <div className="validation-rejection-overlay slide-in-bottom">
           <div className="rejection-card glass-card premium-scale">
              <div className="rejection-icon">❌</div>
              <h2 className="rejection-title">Analysis Halted</h2>
              <p className="rejection-msg">Only human images allowed</p>
              
              <div className="detected-box glass-card">
                 <div className="det-content">
                    <span className="det-name">Detected: {validationResult.detectedObject || 'Object'} {validationResult.emoji || '📦'}</span>
                 </div>
              </div>

              <button className="btn-primary" onClick={onReset} style={{ width: '100%', marginTop: '20px' }}>
                Try Another Photo →
              </button>
           </div>
        </div>
      )}

      <style>{`
        .validation-rejection-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 47, 0.9);
          backdrop-filter: blur(15px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        .rejection-card {
           width: 100%;
           max-width: 400px;
           padding: 40px;
           text-align: center;
           border-color: rgba(255, 77, 77, 0.2);
           background: rgba(255, 77, 77, 0.03) !important;
        }
        .rejection-icon { font-size: 3rem; margin-bottom: 20px; }
        .rejection-title { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 12px; }
        .rejection-msg { font-size: 0.95rem; color: var(--text-dim); margin-bottom: 30px; line-height: 1.5; }
        
        .detected-box {
          padding: 20px;
          margin-bottom: 25px;
          background: rgba(255,255,255,0.02) !important;
          border-color: rgba(255,255,255,0.05);
        }
        .det-label { font-size: 0.7rem; font-weight: 950; color: var(--primary-color); letter-spacing: 2px; display: block; margin-bottom: 12px; }
        .det-content { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 12px; }
        .det-emoji { font-size: 2.2rem; }
        .det-name { font-size: 1.4rem; font-weight: 800; color: #fff; }
        .det-hint { font-size: 0.85rem; color: var(--text-dim); font-style: italic; }

        .slide-in-bottom { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .slide-scan {
          max-width: 700px;
          padding: 48px;
          text-align: center;
        }
        .scan-header { margin-bottom: 40px; }
        .processing-display {
          margin-bottom: 40px;
          display: flex;
          justify-content: center;
        }
        .image-preview-container {
          position: relative;
          width: 200px;
          aspect-ratio: 3/4;
          overflow: hidden;
          padding: 8px;
          background: rgba(255,255,255,0.02) !important;
          border-color: rgba(0, 198, 255, 0.2);
        }
        .image-preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          opacity: 0.8;
          filter: contrast(1.1) brightness(1.2) hue-rotate(10deg);
        }

        .scan-beam-container {
          position: absolute;
          inset: 10px;
          z-index: 2;
          overflow: hidden;
        }
        .scan-beam {
          position: absolute;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
          box-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
          top: 0;
          animation: scanLoop 2.5s infinite ease-in-out;
        }
        @keyframes scanLoop {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }

        .corner-decor {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--primary-color);
          z-index: 3;
        }
        .top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
        .top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
        .bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

        .scan-status { text-align: left; }
        .status-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .phase-text { font-size: 0.8rem; font-weight: 800; color: var(--primary-color); letter-spacing: 1px; }
        .percent-text { font-size: 0.9rem; font-weight: 900; color: #fff; }
        
        .progress-track { height: 6px; background: rgba(255,255,255,0.03); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary-color), var(--accent-purple)); box-shadow: 0 0 15px var(--primary-glow); }
        
        .error-text { color: #ff4d4d; margin-top: 20px; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default SlideScan;
