import { useState, useEffect } from 'react';
import imgBulk from './assets/goal_muscle_bulk.png';
import imgLeanBulk from './assets/goal_lean_bulk.png';
import imgCut from './assets/goal_fat_loss.png';
import imgTone from './assets/goal_lean_bulk.png';

const SlideGoal = ({ next, setData, data }) => {
  const [selectedGoal, setSelectedGoal] = useState(data.goal || null);
  const [localWeight, setLocalWeight] = useState(data.weight || '');
  const [localGender, setLocalGender] = useState(data.gender || '');
  const [localDiet, setLocalDiet] = useState(data.diet || 'vegetarian');
  const [localHealth, setLocalHealth] = useState(data.healthCondition || 'None');
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const allGoals = [
    { id: 'bulk',        title: 'Muscle Bulk', multiplier: 2.0, img: imgBulk,     desc: 'Maximum muscle growth strategy.', gender: 'Male' },
    { id: 'lean_bulk',   title: 'Lean Bulk',   multiplier: 2.4, img: imgLeanBulk, desc: 'Aesthetic growth with minimal fat.', gender: 'both' },
    { id: 'cut',         title: 'Fat Loss',    multiplier: 2.2, img: imgCut,      desc: 'Shred body fat while keeping muscle.', gender: 'Male' },
    { id: 'fat_loss',    title: 'Fat Loss',    multiplier: 2.2, img: imgCut,      desc: 'Focus on healthy fat reduction.', gender: 'Female' },
    { id: 'tone_body',   title: 'Tone Body',   multiplier: 2.0, img: imgTone,     desc: 'Define and tone your physique.', gender: 'Female' },
    { id: 'maintenance', title: 'Maintenance',  multiplier: 1.8, img: imgLeanBulk, desc: 'Balanced approach for habit building.', gender: 'both' }
  ];

  /* Updated formulas per user request:
     Fat Loss -> 1.8 - 2.2
     Lean Bulk -> 2.0 - 2.4
     Bulk -> 1.8 - 2.0
     Maintenance -> 1.6 - 1.8
  */
  const getMultiplier = (goalId) => {
    switch(goalId) {
      case 'cut':
      case 'fat_loss': return 2.2;
      case 'lean_bulk': return 2.4;
      case 'bulk': return 2.0;
      case 'maintenance': return 1.8;
      default: return 2.0;
    }
  };

  const goals = allGoals.filter(g => g.gender === 'both' || g.gender === localGender || !localGender);

  useEffect(() => {
    const aiGoal = data.analysis?.recommendedGoal || data.analysis?.suggestedGoal;
    if (!selectedGoal && aiGoal) {
      const suggested = allGoals.find(g => 
        g.title.toLowerCase() === aiGoal.toLowerCase() ||
        g.id === aiGoal.toLowerCase().replace(' ', '_')
      );
      if (suggested) setSelectedGoal(suggested);
    }
  }, [data.analysis, selectedGoal]);

  const handleContinue = () => {
    const weightVal = parseFloat(localWeight);
    if (!localWeight || isNaN(weightVal) || weightVal < 10 || weightVal > 250) {
      setErrorMsg('Please enter a valid weight (10kg - 250kg).');
      setShowError(true);
      return;
    }
    if (!localGender) {
      setErrorMsg('Please select your gender.');
      setShowError(true);
      return;
    }
    if (selectedGoal) {
      const mult = getMultiplier(selectedGoal.id);
      const proteinTarget = Math.round(weightVal * mult);
      setData(prev => ({
        ...prev,
        weight: localWeight,
        gender: localGender,
        diet: localDiet,
        healthCondition: localHealth,
        goal: selectedGoal,
        proteinTarget: proteinTarget
      }));
      next();
    }
  };

  const isSuggested = (goalId) => {
    const aiGoal = data.analysis?.recommendedGoal || data.analysis?.suggestedGoal;
    if (!aiGoal) return false;
    const sugg = aiGoal.toLowerCase().replace(' ', '_');
    return sugg === goalId || aiGoal.toLowerCase() === allGoals.find(g => g.id === goalId)?.title.toLowerCase();
  };

  return (
    <div className="slide-goal-container">
      <div className="goal-header">
        <h1 className="text-gradient">Personalize & Strategy</h1>
        <p className="subtitle">Set your profile to unlock precision AI nutrition.</p>
      </div>

      <div className="profile-inputs-section glass-card">
        <div className="input-group">
          <label>Gender Selection</label>
          <div className="gender-toggle">
            <button className={localGender === 'Male' ? 'active' : ''} onClick={() => setLocalGender('Male')}>Male</button>
            <button className={localGender === 'Female' ? 'active' : ''} onClick={() => setLocalGender('Female')}>Female</button>
          </div>
        </div>
        <div className="input-group">
          <label>Diet Preference</label>
          <div className="gender-toggle">
            <button className={localDiet === 'vegetarian' ? 'active' : ''} onClick={() => setLocalDiet('vegetarian')}>Veg</button>
            <button className={localDiet === 'non_vegetarian' ? 'active' : ''} onClick={() => setLocalDiet('non_vegetarian')}>Non-Veg</button>
          </div>
        </div>
      </div>

      <div className="profile-inputs-section glass-card" style={{ marginTop: '0' }}>
        <div className="input-group">
          <label>Health Conditions</label>
          <select 
            className="health-select"
            value={localHealth}
            onChange={(e) => setLocalHealth(e.target.value)}
          >
            <option value="None">None (Perfectly Healthy)</option>
            <option value="Diabetes">Diabetes</option>
            <option value="High Blood Pressure">High Blood Pressure</option>
            <option value="Thyroid">Thyroid</option>
            <option value="Cholesterol">Cholesterol</option>
          </select>
        </div>
        <div className="input-group">
          <label>Current Weight (kg)</label>
          <input 
            type="number" 
            placeholder="e.g. 75" 
            value={localWeight} 
            onChange={(e) => setLocalWeight(e.target.value)} 
          />
        </div>
      </div>

      {showError && (
        <div className="warning-msg animate-in">
          ⚠️ {errorMsg || 'Please complete your profile details to continue.'}
        </div>
      )}

      <div className="goals-grid" style={{ marginTop: '30px' }}>
        {goals.map(goal => {
          const recommended = isSuggested(goal.id);
          const mult = getMultiplier(goal.id);
          return (
            <div 
              key={goal.id} 
              className={`goal-card glass-card ${selectedGoal?.id === goal.id ? 'active' : ''} ${recommended ? 'recommended' : ''}`}
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="goal-img-wrap">
                <img src={goal.img} alt={goal.title} />
                <div className="img-overlay"></div>
                {recommended && <div className="rec-badge">AI SUGGESTED</div>}
              </div>
              <div className="goal-card-body">
                <h3>{goal.title}</h3>
                <p>{goal.desc}</p>
                <div className="goal-stats">
                  <span className="mult-label">Approx {mult}g / kg</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="action-row">
        <div className="summary-box">
          {selectedGoal && localWeight && localGender ? (
            <div className="protein-result-card animate-in">
                <span className="p-res-lbl-main">Daily Protein Requirement: {Math.round(localWeight * getMultiplier(selectedGoal.id))}g</span>
            </div>
          ) : (
            <p className="p-hint">Set profile and path to view target...</p>
          )}
        </div>
        <button className="btn-primary confirm-btn" onClick={handleContinue} disabled={!selectedGoal}>
          Confirm & See Report →
        </button>
      </div>

      <style>{`
        .slide-goal-container { max-width: 1000px; width: 100%; padding: 40px; }
        .goal-header { text-align: center; margin-bottom: 40px; }
        .subtitle { color: var(--text-dim); margin-top: 8px; }
        
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .goal-card {
          cursor: pointer;
          overflow: hidden;
          transition: 0.4s;
          display: flex;
          flex-direction: column;
          background: rgba(15, 23, 42, 0.4) !important;
        }
        
        .goal-img-wrap {
          height: 120px;
          position: relative;
          background: #000;
        }
        .goal-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .goal-card:hover .goal-img-wrap img { transform: scale(1.1); }
        .img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
        
        .rec-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--primary-color);
          color: #000;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 100px;
          letter-spacing: 1px;
        }

        .goal-card-body { padding: 15px; flex: 1; display: flex; flex-direction: column; }
        .goal-card-body h3 { font-size: 1rem; margin-bottom: 6px; color: #fff; }
        .goal-card-body p { font-size: 0.75rem; color: var(--text-dim); line-height: 1.4; margin-bottom: 15px; flex: 1; }
        
        .mult-label { font-size: 0.75rem; font-weight: 800; color: var(--primary-color); background: rgba(0,255,136,0.1); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(0,255,136,0.2); }

        .goal-card:hover { transform: translateY(-10px); border-color: var(--primary-color); }
        .goal-card.active { border-color: var(--primary-color); box-shadow: 0 0 30px var(--primary-glow), 0 0 10px var(--purple-glow); }
        
        .profile-inputs-section { display: flex; gap: 24px; padding: 24px; margin-bottom: 30px; }
        .input-group { flex: 1; display: flex; flex-direction: column; gap: 8px; text-align: left; }
        .input-group label { font-size: 0.75rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .input-group input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; color: #fff; font-size: 1rem; transition: 0.3s; }
        .input-group input:focus { border-color: var(--primary-color); outline: none; background: rgba(255,255,255,0.06); }
        .gender-toggle { display: flex; gap: 10px; }
        .gender-toggle button { flex: 1; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #fff; cursor: pointer; transition: 0.3s; font-weight: 700; }
        .gender-toggle button:hover { background: rgba(255,255,255,0.06); }
        .gender-toggle button.active { background: linear-gradient(135deg, var(--primary-color), var(--accent-purple)); border-color: var(--primary-color); color: #fff; font-weight: 800; box-shadow: 0 0 15px var(--primary-glow); }
        
        .health-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          outline: none;
        }
        .health-select option { background: #0f172a; color: #fff; }
        
        .warning-msg { background: rgba(248, 113, 113, 0.1); color: #f87171; padding: 12px; border-radius: 12px; border: 1px solid rgba(248, 113, 113, 0.2); font-size: 0.85rem; font-weight: 700; margin-bottom: 20px; }
        
        .protein-result-card { background: linear-gradient(135deg, rgba(0, 198, 255, 0.1), rgba(127, 90, 240, 0.1)); padding: 12px 24px; border-radius: 16px; border: 1px solid rgba(0, 198, 255, 0.2); text-align: left; box-shadow: 0 0 20px rgba(0, 198, 255, 0.1); }
        .p-res-label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; }
        .p-res-val { font-size: 1.5rem; font-weight: 900; color: #fff; }

        @media (max-width: 900px) {
          .goals-grid { grid-template-columns: 1fr 1fr; }
          .profile-inputs-section { flex-direction: column; }
        }
        @media (max-width: 600px) {
          .goals-grid { grid-template-columns: 1fr; }
          .action-row { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default SlideGoal;
