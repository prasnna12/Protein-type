import { useMemo } from 'react';

const Slide3 = ({ next, data }) => {
  const { proteinTarget, goal, diet } = data;

  const meals = useMemo(() => {
    const distribution = [0.25, 0.2, 0.15, 0.25, 0.15];
    const mealNames = [
      { name: 'Breakfast', time: '08:00 AM', icon: '🍳', color: '#f59e0b' },
      { name: 'Lunch', time: '01:00 PM', icon: '🥗', color: '#22c55e' },
      { name: 'Pre-Workout', time: '04:30 PM', icon: '🍌', color: '#3b82f6' },
      { name: 'Post-Workout', time: '07:00 PM', icon: '🥤', color: '#8b5cf6' },
      { name: 'Dinner', time: '09:00 PM', icon: '🍗', color: '#ec4899' }
    ];

    return mealNames.map((m, i) => ({
      ...m,
      protein: Math.round(proteinTarget * distribution[i])
    }));
  }, [proteinTarget]);

  return (
    <div className="slide-3-container glass-card stagger-in">
      <div className="summary-section">
        <div className="summary-left">
          <h1 className="text-gradient">Daily Nutrition Plan</h1>
          <p className="plan-meta">
            Targeting <strong>{proteinTarget}g</strong> protein daily for <strong>{goal?.title || 'Maintenance'}</strong>
          </p>
          <div className="goal-badges">
            <span className="g-badge">{goal?.title} Mode</span>
            <span className="g-badge d-badge">{diet === 'vegetarian' ? '🥗 Veg' : '🍗 Non-Veg'}</span>
          </div>
        </div>
        
        <div className="protein-hero">
          <div className="circle-wrap">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="bg-ring" />
              <circle cx="50" cy="50" r="45" className="progress-ring" style={{ strokeDashoffset: 283 - (283 * 0.75) }} />
            </svg>
            <div className="center-val">
              <h2>{proteinTarget}</h2>
              <p>PROTEIN (G)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="meals-grid stagger-in">
        {meals.map((meal, index) => (
          <div key={index} className="meal-item glass-card">
            <div className="m-left">
              <div className="m-icon-box" style={{ background: `${meal.color}15`, borderColor: `${meal.color}30` }}>
                <span className="m-icon">{meal.icon}</span>
              </div>
              <div className="m-info">
                <h4>{meal.name}</h4>
                <time>{meal.time}</time>
              </div>
            </div>
            <div className="m-right">
              <div className="m-protein" style={{ color: meal.color }}>{meal.protein}g</div>
              <label>Protein</label>
            </div>
            <div className="m-accent-bar" style={{ background: meal.color }}></div>
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
          max-width: 900px;
          width: 100%;
          padding: 48px 40px;
        }
        .summary-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          gap: 40px;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .summary-left { flex: 1; }
        .summary-left h1 { font-size: 2rem; margin-bottom: 8px; }
        .plan-meta { color: var(--text-dim); font-size: 1rem; margin-bottom: 15px; }
        .goal-badges { display: flex; gap: 8px; }
        .g-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: var(--primary-color); color: #000; padding: 4px 12px; border-radius: 20px; }
        .d-badge { background: rgba(59,130,246,0.15); color: var(--accent-color); padding: 4px 12px; border: 1px solid rgba(59,130,246,0.3); }

        .protein-hero { flex-shrink: 0; }
        .circle-wrap { position: relative; width: 150px; height: 150px; }
        .circle-wrap svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .circle-wrap circle { fill: none; stroke-width: 8; stroke-linecap: round; }
        .bg-ring { stroke: rgba(255,255,255,0.05); }
        .progress-ring { stroke: var(--primary-color); stroke-dasharray: 283; filter: drop-shadow(0 0 8px var(--primary-glow)); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .center-val { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .center-val h2 { font-size: 2.2rem; line-height: 1; margin-bottom: 2px; }
        .center-val p { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }

        .meals-grid { display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px; }
        .meal-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
        }
        .meal-item:hover { transform: scale(1.02) translateX(8px); background: rgba(255,255,255,0.03); }
        .m-left { display: flex; align-items: center; gap: 20px; }
        .m-icon-box { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid; }
        .m-icon { font-size: 1.8rem; }
        .m-info h4 { font-size: 1.25rem; margin-bottom: 2px; }
        .m-info time { font-size: 0.85rem; color: var(--text-dim); font-weight: 600; }
        .m-right { text-align: right; }
        .m-protein { font-size: 1.8rem; font-weight: 900; line-height: 1; margin-bottom: 2px; }
        .m-right label { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
        .m-accent-bar { position: absolute; top: 0; left: 0; bottom: 0; width: 4px; border-radius: 0 4px 4px 0; opacity: 0.8; }

        @media (max-width: 680px) {
          .summary-section { flex-direction: column; text-align: center; gap: 30px; }
          .circle-wrap { width: 120px; height: 120px; }
          .meal-item { padding: 18px 20px; }
          .m-left { gap: 15px; }
          .m-icon-box { width: 48px; height: 48px; }
          .m-icon { font-size: 1.5rem; }
          .m-info h4 { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default Slide3;
