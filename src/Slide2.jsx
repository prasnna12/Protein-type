import { useState, useEffect } from 'react';
import imgBulk from './assets/goal-bulk.png';
import imgLeanBulk from './assets/goal-lean-bulk.png';
import imgCut from './assets/goal-cut.png';
import imgFatLoss from './assets/goal-fat-loss.png';
import imgMaintenance from './assets/goal-maintenance.png';

const Slide2 = ({ next, setData, data }) => {
  const [selectedGoal, setSelectedGoal] = useState(data.goal || null);
  const [weight, setWeight] = useState(data.weight || 80);

  const goals = [
    { id: 'bulk',        title: 'Bulk',        multiplier: 2.0, img: imgBulk,        desc: 'Maximize muscle growth with a calculated calorie surplus.' },
    { id: 'lean_bulk',   title: 'Lean Bulk',   multiplier: 1.8, img: imgLeanBulk,   desc: 'Build quality muscle while strictly minimizing body fat gain.' },
    { id: 'cut',         title: 'Cut',         multiplier: 2.2, img: imgCut,         desc: 'Shred body fat while preserving your hard-earned muscle mass.' },
    { id: 'fat_loss',    title: 'Fat Loss',    multiplier: 2.3, img: imgFatLoss,    desc: 'Aggressive fat loss focusing on metabolic health and protein safety.' },
    { id: 'maintenance', title: 'Maintenance', multiplier: 1.5, img: imgMaintenance, desc: 'Maintain your current physique while optimizing performance.' }
  ];

  // Auto-highlighting based on AI analysis
  useEffect(() => {
    if (!selectedGoal && data.analysis?.suggestedGoal) {
      const suggested = goals.find(g => 
        g.title.toLowerCase() === data.analysis.suggestedGoal.toLowerCase() ||
        g.id === data.analysis.suggestedGoal.toLowerCase().replace(' ', '_')
      );
      if (suggested) {
        setSelectedGoal(suggested);
      }
    }
  }, [data.analysis, selectedGoal]);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      const proteinTarget = weight * selectedGoal.multiplier;
      setData(prev => ({
        ...prev,
        goal: selectedGoal,
        weight: Number(weight),
        proteinTarget: Math.round(proteinTarget)
      }));
      next();
    }
  };

  const isSuggested = (goalId) => {
    if (!data.analysis?.suggestedGoal) return false;
    const sugg = data.analysis.suggestedGoal.toLowerCase().replace(' ', '_');
    return sugg === goalId || data.analysis.suggestedGoal.toLowerCase() === goals.find(g => g.id === goalId)?.title.toLowerCase();
  };

  return (
    <div className="slide-2-container glass-card stagger-in">
      <div className="s2-header">
        <h1 className="text-gradient">Choose Your Fitness Goal</h1>
        <p className="subtitle">Select the outcome you want to achieve based on your current physique and targets.</p>
      </div>

      <div className="weight-input-section glass-card">
        <div className="weight-header">
          <label>1. Enter Current Weight (KG)</label>
          <span className="weight-val">{weight} kg</span>
        </div>
        <div className="slider-wrap">
          <input 
            type="range" 
            min="30" 
            max="180" 
            step="1"
            className="weight-slider"
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
          />
          <div className="slider-labels">
            <span>30kg</span>
            <span>105kg</span>
            <span>180kg</span>
          </div>
        </div>
      </div>

      <div className="goals-label">2. Select Your Path</div>
      <div className="goals-grid stagger-in">
        {goals.map(goal => {
          const recommended = isSuggested(goal.id);
          return (
            <div 
              key={goal.id} 
              className={`goal-card glass-card ${selectedGoal?.id === goal.id ? 'active' : ''} ${recommended ? 'recommended' : ''}`}
              onClick={() => handleGoalSelect(goal)}
            >
              <div className="goal-img-container">
                <img src={goal.img} alt={goal.title} className="goal-physique-img" />
                <div className="goal-img-overlay"></div>
                {recommended && <div className="recommended-badge">AI RECOMMENDED</div>}
                {selectedGoal?.id === goal.id && <div className="goal-check">✓</div>}
              </div>
              <div className="goal-info">
                <h3>{goal.title}</h3>
                <p>{goal.desc}</p>
                <div className="goal-meta">
                  <span className="protein-badge">{goal.multiplier}g Protein / kg</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-footer">
        <div className="summary-hint">
          {selectedGoal ? (
            <span>Target: <strong style={{color: 'var(--primary-color)'}}>{Math.round(weight * selectedGoal.multiplier)}g</strong> protein daily</span>
          ) : (
            <span>Please select a goal to proceed</span>
          )}
        </div>
        <button 
          className="btn-primary" 
          onClick={handleContinue} 
          disabled={!selectedGoal}
          style={{ padding: '14px 40px' }}
        >
          Generate My Plan →
        </button>
      </div>

      <style>{`
        .slide-2-container {
          max-width: 1100px;
          width: 100%;
          padding: 48px 40px;
        }
        .s2-header { text-align: center; margin-bottom: 40px; }
        .subtitle { color: var(--text-dim); font-size: 1rem; margin-top: 8px; }

        .weight-input-section {
          background: rgba(255,255,255,0.02);
          padding: 24px 30px;
          margin-bottom: 40px;
          border-radius: 20px;
          border-color: rgba(255,255,255,0.05);
        }
        .weight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .weight-header label { font-weight: 700; font-size: 0.9rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
        .weight-val { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
        
        .weight-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 5px;
          outline: none;
          margin-bottom: 12px;
        }
        .weight-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: var(--primary-color);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px var(--primary-glow);
          transition: 0.2s;
        }
        .weight-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .slider-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: rgba(255,255,255,0.2); font-weight: 600; }

        .goals-label { font-weight: 700; font-size: 0.9rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 20px; padding-left: 5px; }
        
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .goal-card {
          padding: 0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          border-radius: 24px;
          border-color: rgba(255,255,255,0.05);
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
        }

        .goal-img-container {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
        }

        .goal-physique-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .goal-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8));
        }

        .goal-card:hover { 
          transform: translateY(-10px); 
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1), 0 0 20px rgba(0, 255, 136, 0.1);
        }
        .goal-card:hover .goal-physique-img { transform: scale(1.15); }

        .goal-card.active {
          border-color: var(--primary-color);
          background: rgba(0, 255, 136, 0.08);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2), 0 0 30px rgba(0, 255, 136, 0.1);
        }

        .goal-card.recommended {
          border-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 0 25px rgba(0, 255, 136, 0.08);
        }

        .recommended-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--primary-color);
          color: #000;
          font-size: 0.7rem;
          font-weight: 900;
          padding: 5px 12px;
          border-radius: 100px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
          z-index: 2;
          animation: badgePulse 2s infinite;
        }

        @keyframes badgePulse {
          0% { box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4); }
          50% { box-shadow: 0 4px 25px rgba(0, 255, 136, 0.6); }
          100% { box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4); }
        }

        .goal-check { 
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px; 
          height: 24px; 
          background: var(--primary-color); 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #000; 
          font-size: 0.85rem; 
          font-weight: 900; 
          z-index: 2;
          box-shadow: 0 4px 10px rgba(0, 255, 136, 0.3);
        }

        .goal-info { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .goal-card h3 { font-size: 1.4rem; margin-bottom: 12px; color: #fff; }
        .goal-card p { font-size: 0.92rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 24px; flex: 1; }
        
        .protein-badge { 
          font-size: 0.8rem; 
          font-weight: 800; 
          color: var(--primary-color); 
          background: rgba(0, 255, 136, 0.1); 
          padding: 6px 14px; 
          border-radius: 20px; 
          border: 1px solid rgba(0, 255, 136, 0.2); 
          display: inline-block;
        }

        .action-footer { display: flex; justify-content: space-between; align-items: center; }
        .summary-hint { font-size: 0.95rem; color: var(--text-dim); font-weight: 600; }

        @media (max-width: 1024px) {
          .goals-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 650px) {
          .goals-grid { grid-template-columns: 1fr; }
          .action-footer { flex-direction: column; gap: 24px; text-align: center; }
          .slide-2-container { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
};

export default Slide2;
