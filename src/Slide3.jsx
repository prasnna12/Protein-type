import { useMemo } from 'react';
import { getMealPlan } from './nutritionService';

const Slide3 = ({ next, data }) => {
  const { proteinTarget, goal, diet, analysis } = data;

  const meals = useMemo(() => {
    return getMealPlan(data);
  }, [data]);

  const getBodyIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('muscular') || t.includes('athletic')) return '💪';
    if (t.includes('fat') || t.includes('overweight') || t.includes('obese')) return '📉';
    if (t.includes('skinny') || t.includes('underweight')) return '🦴';
    return '👤';
  };

  return (
    <div className="slide-3-container glass-card stagger-in">
      <div className="summary-section">
        <div className="summary-left">
          <h1 className="hero-main-title">AI <span className="text-gradient">Physique Report</span></h1>
          <p className="plan-meta">Analyzing {analysis?.bodyType} frame with a focus on {goal?.title}.</p>
          
          <div className="ai-stats-grid">
            <div className="stat-bar-group">
              <div className="stat-label"><span>Muscle Density</span> <span>{analysis?.muscleGrade * 10 || 40}%</span></div>
              <div className="stat-track"><div className="stat-fill" style={{ width: `${analysis?.muscleGrade * 10 || 40}%`, background: 'var(--cyan)' }}></div></div>
            </div>
            <div className="stat-bar-group">
              <div className="stat-label"><span>Body Fat Est.</span> <span>{analysis?.bodyFatRange || '20%'}</span></div>
              <div className="stat-track"><div className="stat-fill" style={{ width: '45%', background: 'var(--purple)' }}></div></div>
            </div>
            <div className="stat-bar-group">
              <div className="stat-label"><span>Fitness Symmetry</span> <span>{analysis?.symmetryScore || 70}%</span></div>
              <div className="stat-track"><div className="stat-fill" style={{ width: `${analysis?.symmetryScore || 70}%`, background: 'var(--blue)' }}></div></div>
            </div>
          </div>
        </div>
        
        <div className="physique-visual glass-card">
           <div className="body-icon-large">{getBodyIcon(analysis?.bodyType)}</div>
           <div className="body-label-tag">{analysis?.bodyType?.toUpperCase() || 'AVERAGE'} BODY</div>
        </div>
      </div>

      <div className="section-title-minimal">Nutrition Strategy: {proteinTarget}g Protein Daily</div>

      <div className="meals-grid-vertical">
        {meals.map((meal, index) => (
          <div key={index} className="meal-card-fluid glass-card">
            <div className="meal-header-fluid">
              <div className="meal-img-box">
                <img src={`/foods/${meal.food.replace(/\s+/g, '-')}.png`} alt={meal.food} />
              </div>
              <div className="meal-text-box">
                <div className="meal-time-tag"><span>{meal.icon}</span> {meal.time} • {meal.name}</div>
                <h3>{meal.foodDetails.name.toUpperCase()}</h3>
                <p className="meal-explain-text">{meal.explanation}</p>
              </div>
              <div className="meal-macro-pill-group">
                <div className="macro-pill"><strong>{meal.protein}g</strong> Protein</div>
                <div className="macro-pill secondary">{meal.calories} kcal</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="s3-footer">
        <button className="btn-primary" onClick={next} style={{ width: '100%', padding: '18px' }}>
          Explore Recommended Foods & Meals →
        </button>
      </div>

      <style>{`
        .slide-3-container {
          max-width: 1000px;
          width: 100%;
          padding: 40px;
        }
        .summary-section {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 40px;
          margin-bottom: 60px;
          align-items: center;
        }
        .summary-left { flex: 1; }
        .summary-left h1 { font-size: 2rem; margin-bottom: 8px; }
        .plan-meta { color: var(--text-dim); font-size: 1rem; margin-bottom: 15px; }
        .goal-badges { display: flex; gap: 8px; }
        .g-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: var(--primary-color); color: #000; padding: 4px 12px; border-radius: 20px; }
        .d-badge { background: rgba(59,130,246,0.15); color: var(--accent-color); padding: 4px 12px; border: 1px solid rgba(59,130,246,0.3); }

        .ai-stats-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 30px;
        }
        .stat-bar-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .stat-track {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
        }
        .stat-fill {
          height: 100%;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(255,255,255,0.2);
          transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .physique-visual {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background: rgba(255,255,255,0.02) !important;
          border: 1px solid var(--surface-border);
        }
        .body-icon-large { font-size: 5rem; filter: drop-shadow(0 0 20px var(--primary-glow)); }
        .body-label-tag { font-size: 0.8rem; font-weight: 900; color: var(--primary-color); letter-spacing: 2px; }

        .section-title-minimal {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 30px;
          opacity: 0.6;
          text-align: center;
        }

        .protein-hero { flex-shrink: 0; }
        .circle-wrap { position: relative; width: 150px; height: 150px; }
        .circle-wrap svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .circle-wrap circle { fill: none; stroke-width: 8; stroke-linecap: round; }
        .bg-ring { stroke: rgba(255,255,255,0.05); }
        .progress-ring { stroke: var(--primary-color); stroke-dasharray: 283; filter: drop-shadow(0 0 8px var(--primary-glow)); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .center-val { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .center-val h2 { font-size: 2.2rem; line-height: 1; margin-bottom: 2px; }
        .center-val p { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }

        .meals-grid { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
        
        .meal-item-premium {
          padding: 0;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition-smooth);
        }
        
        .meal-item-premium:hover {
          transform: translateY(-5px) translateX(5px);
          border-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.1);
        }

        .meal-card-top {
          display: flex;
          align-items: center;
          padding: 24px 30px;
          gap: 24px;
        }

        .meal-img-thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          background: #000;
        }
        
        .meal-img-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        
        .meal-item-premium:hover .meal-img-thumbnail img { transform: scale(1.1); }

        .meal-main-info { flex: 1; }
        .meal-meta-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .meal-icon-mini { font-size: 1.1rem; }
        .meal-time-text { font-size: 0.8rem; color: var(--primary-color); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .meal-main-info h3 { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .meal-food-name-tag { font-size: 0.9rem; color: var(--text-dim); text-transform: capitalize; font-weight: 600; }

        .meal-macros-summary-row {
          display: flex;
          gap: 24px;
          text-align: right;
        }
        
        .summary-macro { display: flex; flex-direction: column; gap: 4px; }
        .summary-macro .label { font-size: 0.65rem; font-weight: 900; color: var(--text-dim); letter-spacing: 1px; }
        .summary-macro .value { font-size: 1.2rem; font-weight: 800; color: #fff; }
        .protein-val { color: var(--primary-color) !important; font-size: 1.4rem !important; }

        .meal-accent-line { height: 3px; width: 60px; transition: width 0.4s ease; }
        .meal-item-premium:hover .meal-accent-line { width: 100%; }

        .meals-grid-vertical {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .meal-card-fluid {
          padding: 24px;
          border-radius: 24px;
        }
        .meal-header-fluid {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .meal-img-box {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          flex-shrink: 0;
        }
        .meal-img-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .meal-text-box { flex: 1; }
        .meal-time-tag { font-size: 0.75rem; font-weight: 800; color: var(--primary-color); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .meal-text-box h3 { font-size: 1.1rem; font-weight: 900; color: #fff; margin-bottom: 8px; letter-spacing: 0.5px; }
        .meal-explain-text { font-size: 0.85rem; color: var(--text-dim); line-height: 1.4; }

        .meal-macro-pill-group { display: flex; flex-direction: column; gap: 8px; text-align: right; }
        .macro-pill { 
          background: rgba(255,255,255,0.05);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .macro-pill strong { color: var(--primary-color); }
        .macro-pill.secondary { background: none; border: 1px solid var(--surface-border); font-size: 0.75rem; opacity: 0.7; }

        @media (max-width: 900px) {
          .summary-section { grid-template-columns: 1fr; text-align: center; }
          .physique-visual { height: 200px; }
          .ai-stats-grid { text-align: left; }
        }
        @media (max-width: 850px) {
          .meal-card-top { flex-direction: column; text-align: center; padding: 30px 20px; gap: 20px; }
          .meal-macros-summary-row { text-align: center; justify-content: center; width: 100%; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
          .meal-main-info { width: 100%; }
          .meal-meta-row { justify-content: center; }
        }
        @media (max-width: 680px) {
          .circle-wrap { width: 120px; height: 120px; }
          .meal-item-premium { padding: 0; }
          .meal-card-top { padding: 18px 20px; }
          .meal-img-thumbnail { width: 60px; height: 60px; border-radius: 15px; }
          .meal-main-info h3 { font-size: 1.2rem; }
          .meal-food-name-tag { font-size: 0.8rem; }
          .meal-macros-summary-row { gap: 15px; }
          .summary-macro .value { font-size: 1rem; }
          .protein-val { font-size: 1.2rem !important; }
        }
        @media (max-width: 600px) {
          .meal-header-fluid { flex-direction: column; text-align: center; }
          .meal-macro-pill-group { flex-direction: row; justify-content: center; width: 100%; }
          .slide-3-container { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Slide3;
