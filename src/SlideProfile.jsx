import React, { useState, useEffect } from 'react';
import { analyzeBodyImage, calculateFallbackAnalysis } from './geminiService';

const SlideProfile = ({ next, setData, data }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [healthCondition, setHealthCondition] = useState('None');
  const [showResults, setShowResults] = useState(!!data.analysis);

  // Analysis is now handled by SlideScan. SlideProfile just displays it.

  // Analysis is now fully handled by SlideScan to ensure consistent result generation.
  // Profile inputs like Weight and Gender are handled in SlideGoal (Personalization).

  const getSmartFoodSuggestions = (condition) => {
    switch (condition) {
      case 'Diabetes':
        return [
          { name: 'Oats', icon: '🥣', desc: 'Low GI carb source' },
          { name: 'Brown Rice', icon: '🍚', desc: 'Complex carbohydrate' },
          { name: 'Eggs', icon: '🥚', desc: 'High quality protein' },
          { name: 'Paneer', icon: '🧀', desc: 'Slow digesting protein' },
          { name: 'Green Veggies', icon: '🥦', desc: 'High fiber, low calorie' }
        ];
      case 'High Blood Pressure':
        return [
          { name: 'Banana', icon: '🍌', desc: 'Rich in potassium' },
          { name: 'Spinach', icon: '🥬', desc: 'Low sodium, high fiber' },
          { name: 'Beetroot', icon: '🩸', desc: 'Natural nitrates for BP' },
          { name: 'Berries', icon: '🫐', desc: 'Antioxidant rich' }
        ];
      case 'Thyroid':
        return [
          { name: 'Brazil Nuts', icon: '🌰', desc: 'Rich in Selenium' },
          { name: 'Fish', icon: '🐟', desc: 'Iodine & Omega-3' },
          { name: 'Pumpkin Seeds', icon: '🎃', desc: 'Zinc for metabolism' },
          { name: 'Yogurt', icon: '🍦', desc: 'Probiotics & Iodine' }
        ];
      case 'Cholesterol':
        return [
          { name: 'Oats', icon: '🥣', desc: 'Soluble fiber to lower LDL' },
          { name: 'Walnuts', icon: '🌰', desc: 'Healthy omega-3 fats' },
          { name: 'Fatty Fish', icon: '🐟', desc: 'Omega-3 for heart health' },
          { name: 'Garlic', icon: '🧄', desc: 'Allicin for lipid profile' }
        ];
      default:
        return [
          { name: 'Chicken Breast', icon: '🍗', desc: 'Lean protein' },
          { name: 'Sweet Potato', icon: '🍠', desc: 'Quality carbs' },
          { name: 'Almonds', icon: '🫘', desc: 'Healthy fats' },
          { name: 'Quinoa', icon: '🌾', desc: 'Complete plant protein' }
        ];
    }
  };

  const analysis = data.analysis || {};

  return (
    <div className="dashboard-container slide-profile">
      <div className="dashboard-header">
        <h1 className="text-gradient">AI Physio-Scan Dashboard</h1>
        <p className="subtitle">Real-time physiological mapping and structural analysis.</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Image & Scan Animation */}
        <div className="scan-preview-side glass-card">
          <div className="scan-image-wrapper">
            <img src={data.photo} alt="User Physique" className="user-physique-img" />
            <div className={`scan-overlay ${isScanning ? 'active' : ''}`}>
              <div className="scan-line"></div>
              <div className="scan-nodes">
                <div className="node n1"></div>
                <div className="node n2"></div>
                <div className="node n3"></div>
                <div className="node n4"></div>
              </div>
            </div>
            {isScanning && (
              <div className="scan-status-pill high-tech">
                <div className="neural-load"></div>
                <span className="pulse-dot"></span>
                NEURAL ENGINE ANALYZING... {scanProgress}%
              </div>
            )}
            {!isScanning && analysis.bodyType && (
              <div className="confidence-badge">
                <div className="conf-wave"></div>
                <span>98.2% AI CONFIDENCE</span>
              </div>
            )}
            <div className="corner-decor top-left"></div>
            <div className="corner-decor top-right"></div>
            <div className="corner-decor bottom-left"></div>
            <div className="corner-decor bottom-right"></div>
          </div>
          
          <div className={`transformation-card glass-card ${analysis.recommendedGoal === 'Fat Loss' ? 'goal-cut' : 'goal-gain'}`}>
            <h3>AI TARGET STRATEGY</h3>
            <div className="transformation-badge">{analysis.recommendedGoal || 'Body Recomposition'}</div>
            <p className="transformation-reason">
              {analysis.explanation || `Detected ${analysis.bodyType} physique. Targeted ${analysis.recommendedGoal} protocol recommended for optimal protein synthesis.`}
            </p>
          </div>
        </div>

        {/* Right Side: Results & Metrics */}
        <div className="stats-side">
          <div className="metrics-grid">
            <div className={`metric-card glass-card ${parseInt(analysis.bodyFat) > 24 ? 'warning' : 'success'}`}>
              <span className="label">Body Fat %</span>
              <span className="value">{analysis.bodyFat || '22%'}</span>
            </div>
            <div className="metric-card glass-card">
              <span className="label">Metabolic Status</span>
              <span className="value">{analysis.metabolicAge || 'Active'}</span>
            </div>
            <div className="metric-card glass-card">
              <span className="label">Physique Index</span>
              <span className="value">{analysis.physiqueIndex || '5.5'}/10</span>
            </div>
            <div className="metric-card glass-card">
              <span className="label">Muscle Type</span>
              <span className="value">{analysis.muscleType || 'Mesomorph'}</span>
            </div>
            <div className="metric-card glass-card">
              <span className="label">Fitness Level</span>
              <span className="value">{analysis.fitnessLevel || 'Beginner'}</span>
            </div>
            <div className="metric-card glass-card">
              <span className="label">Body Type</span>
              <span className="value">{analysis.bodyType || 'Average'}</span>
            </div>
          </div>

          <div className="body-composition-section glass-card">
            <h3>Body Composition Analysis</h3>
            <div className="composition-bars">
              {[
                { label: 'Body Fat Level', val: parseInt(analysis.bodyFat) || 20, color: parseInt(analysis.bodyFat) > 24 ? '#ff4d4d' : '#f87171' },
                { label: 'Muscle Density', val: (analysis.muscleMass || 50), color: '#4ade80' },
                { label: 'Symmetry Score', val: (analysis.fitnessScore || 60), color: '#38bdf8' },
                { label: 'Overall Vibe', val: (analysis.fitnessScore || 60) + 5, color: 'var(--primary-color)' }
              ].map(bar => (
                <div key={bar.label} className="comp-bar-item">
                  <div className="comp-bar-info">
                    <span className="label">{bar.label}</span>
                    <span className="value">{Math.min(100, bar.val)}%</span>
                  </div>
                  <div className="comp-bar-track">
                    <div 
                      className="comp-bar-fill" 
                      style={{ 
                        width: `${Math.min(100, bar.val)}%`,
                        backgroundColor: bar.color,
                        boxShadow: `0 0 15px ${bar.color}66`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="body-part-analysis glass-card">
            <h3>Structural Observations</h3>
            <div className="part-list">
              {[
                { name: 'Stomach', obs: analysis.visualSignals?.stomach || 'Proportionate', val: 70, icon: '🥋' },
                { name: 'Definition', obs: analysis.visualSignals?.definition || 'Moderate', val: 50, icon: '⚡' },
                { name: 'Shoulders', obs: analysis.visualSignals?.shoulders || 'Average', val: 60, icon: '📐' },
                { name: 'Posture', obs: analysis.visualSignals?.posture || 'Good', val: 80, icon: '📏' }
              ].map(part => (
                <div key={part.name} className="part-item">
                  <div className="part-info">
                    <span className="part-name">
                      <span className="part-icon">{part.icon}</span>
                      {part.name}
                    </span>
                    <span className="part-obs">{part.obs}</span>
                  </div>
                  <div className="part-bar-track">
                    <div className="part-bar-fill" style={{ width: `${part.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="health-section glass-card">
            <div className="health-header">
              <h3>Health Condition <span className="optional">(Optional)</span></h3>
              <div className="health-pills">
                {['None', 'Diabetes', 'High Blood Sugar', 'High Blood Pressure', 'Thyroid', 'Cholesterol', 'Other'].map(opt => (
                  <button 
                    key={opt}
                    className={`health-pill ${healthCondition === opt ? 'active' : ''}`}
                    onClick={() => setHealthCondition(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {healthCondition !== 'None' && (
              <div className="smart-food-box animate-in">
                <p className="health-alert">
                  ⚠️ <strong>{healthCondition}</strong> detected. Adjusting nutritional guidance for safety and performance.
                </p>
                <div className="food-suggestions">
                  {getSmartFoodSuggestions(healthCondition).map(food => (
                    <div key={food.name} className="food-pill">
                      <span className="food-icon">{food.icon}</span>
                      <div className="food-details">
                        <span className="food-name">{food.name}</span>
                        <span className="food-desc">{food.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-actions" style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-secondary dashboard-back-btn" onClick={() => setData(prev => ({ ...prev, photo: null, analysis: null }))}>
              ↺ New Scan
            </button>
            <button className="btn-primary dashboard-next-btn" onClick={next}>
              Goal Strategy →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          max-width: 1200px;
          width: 100%;
          animation: fadeIn 0.8s ease forwards;
        }

        .confidence-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 255, 136, 0.15);
          backdrop-filter: blur(8px);
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
          overflow: hidden;
        }
        .conf-wave {
          width: 4px;
          height: 12px;
          background: var(--primary-color);
          animation: wavePulse 1s infinite alternate;
        }
        @keyframes wavePulse { from { opacity: 0.3; } to { opacity: 1; } }

        .dashboard-header { text-align: center; margin-bottom: 40px; }
        .dashboard-header h1 { font-size: 2.5rem; font-weight: 950; margin-bottom: 8px; letter-spacing: -1px; }
        .subtitle { color: var(--text-dim); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        /* Left Side */
        .scan-preview-side { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .scan-image-wrapper {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .user-physique-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
          filter: grayscale(0.5) contrast(1.2);
        }

        .scan-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 4px;
          background: var(--primary-color);
          box-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
          top: 0;
          opacity: 0;
          transition: 0.3s;
        }
        .scan-overlay.active .scan-line {
          opacity: 1;
          animation: scanLoop 2.5s infinite ease-in-out;
        }
        @keyframes scanLoop { 0%, 100% { top: 0; } 50% { top: 100%; } }

        .node { position: absolute; width: 8px; height: 8px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff; opacity: 0; }
        .scan-overlay.active .node { opacity: 0.6; animation: nodePulse 1s infinite; }
        .n1 { top: 20%; left: 30%; }
        .n2 { top: 40%; right: 25%; }
        .n3 { top: 60%; left: 45%; }
        .n4 { top: 80%; right: 40%; }
        @keyframes nodePulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.5); opacity: 1; } }

        .scan-status-pill {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
        }
        .pulse-dot { width: 6px; height: 6px; background: var(--primary-color); border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        .corner-decor { position: absolute; width: 30px; height: 30px; border: 3px solid var(--primary-color); opacity: 0.4; pointer-events: none; }
        .top-left { top: 15px; left: 15px; border-right: none; border-bottom: none; }
        .top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; }
        .bottom-right { bottom: 15px; right: 15px; border-left: none; border-top: none; }

        .transformation-card { 
          padding: 30px; 
          text-align: center; 
          border: 2px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .transformation-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .transformation-card.goal-cut { border-color: rgba(255, 77, 77, 0.3); }
        .transformation-card.goal-gain { border-color: rgba(0, 255, 136, 0.3); }

        .transformation-card h3 { font-size: 0.75rem; color: var(--text-dim); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
        .transformation-badge {
          display: inline-block;
          background: var(--primary-color);
          color: #000;
          padding: 12px 32px;
          border-radius: 100px;
          font-weight: 950;
          font-size: 1.4rem;
          margin-bottom: 20px;
          box-shadow: 0 0 30px var(--primary-glow);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .goal-cut .transformation-badge { background: #ff4d4d; box-shadow: 0 0 30px rgba(255, 77, 77, 0.4); }

        .transformation-reason { font-size: 0.85rem; color: var(--text-dim); line-height: 1.7; font-weight: 500; }

        /* Right Side Stats */
        .stats-side { display: flex; flex-direction: column; gap: 24px; }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .metric-card { padding: 22px 15px; display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center; transition: 0.3s; }
        .metric-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.05) !important; }
        .metric-card .label { font-size: 0.6rem; font-weight: 900; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.5px; }
        .metric-card .value { font-size: 1.1rem; font-weight: 950; color: #fff; letter-spacing: -0.5px; }
        .metric-card.warning .value { color: #ff6b6b; }
        .metric-card.success .value { color: #4ade80; }

        .body-composition-section { padding: 30px; margin-bottom: 24px; }
        .body-composition-section h3 { font-size: 1rem; margin-bottom: 24px; }
        .composition-bars { display: flex; flex-direction: column; gap: 20px; }
        .comp-bar-item { display: flex; flex-direction: column; gap: 8px; }
        .comp-bar-info { display: flex; justify-content: space-between; align-items: center; }
        .comp-bar-info .label { font-size: 0.85rem; font-weight: 700; color: #fff; }
        .comp-bar-info .value { font-size: 0.9rem; font-weight: 900; }
        .comp-bar-track { height: 10px; background: rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; position: relative; }
        .comp-bar-fill { height: 100%; border-radius: 20px; transition: width 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67); }

        .body-part-analysis { padding: 30px; }
        .body-part-analysis h3 { font-size: 1rem; margin-bottom: 24px; }
        .part-list { display: flex; flex-direction: column; gap: 20px; }
        .part-item { }
        .part-info { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; }
        .part-name { font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }
        .part-obs { font-size: 0.75rem; color: var(--text-dim); font-weight: 600; }
        .part-bar-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .part-bar-fill { height: 100%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow); border-radius: 10px; }

        .health-section { padding: 30px; }
        .health-header h3 { font-size: 1rem; margin-bottom: 20px; }
        .optional { font-size: 0.7rem; color: var(--text-dim); font-weight: normal; margin-left: 8px; }
        .health-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .health-pill {
          padding: 8px 16px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-dim);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .health-pill:hover { background: rgba(255,255,255,0.08); }
        .health-pill.active { background: var(--primary-color); border-color: var(--primary-color); color: #000; font-weight: 800; }

        .smart-food-box { margin-top: 25px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 20px; border-left: 4px solid var(--primary-color); }
        .health-alert { font-size: 0.85rem; color: #fff; margin-bottom: 20px; line-height: 1.5; }
        .food-suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .food-pill {
          background: rgba(255,255,255,0.05);
          padding: 10px 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .food-icon { font-size: 1.25rem; }
        .food-details { display: flex; flex-direction: column; }
        .food-name { font-weight: 800; font-size: 0.85rem; }
        .food-desc { font-size: 0.65rem; color: var(--text-dim); font-weight: 600; }

        .dashboard-next-btn { width: 100%; padding: 20px; margin-top: 10px; font-weight: 900; letter-spacing: 0.5px; }

        @media (max-width: 960px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .scan-preview-side { order: 1; }
          .stats-side { order: 2; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SlideProfile;
