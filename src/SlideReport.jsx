import { useMemo } from 'react';
import { getMealPlan, getRecommendedFoods } from './nutritionService';

const SlideReport = ({ next, data }) => {
  const { proteinTarget, goal, diet, analysis, weight } = data;

  const meals = useMemo(() => {
    return getMealPlan(data);
  }, [data]);

  const recommendedFoods = useMemo(() => {
    return getRecommendedFoods(diet, goal?.id);
  }, [diet, goal?.id]);

  const getBodyIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('muscular')) return '💪';
    if (t.includes('athletic')) return '⚡';
    if (t.includes('fat') || t.includes('overweight') || t.includes('obese')) return '⚖️';
    if (t.includes('average')) return '👤';
    if (t.includes('lean')) return '🦴';
    return '👤';
  };

  return (
    <div className="report-slide">
      <div className="report-grid">
        {/* Left Side: Summary & Body Info */}
        <div className="report-sidebar">
          <div className="profile-card glass-card">
            <div className="profile-header">
              <div className="avatar-icon">{getBodyIcon(analysis?.bodyType)}</div>
              <div>
                <h2 className="text-gradient">AI Physique Scan</h2>
                <p>{analysis?.gender || 'Male'} • Physique Report</p>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="p-stat">
                <span className="p-label">Weight</span>
                <span className="p-value">{weight} KG</span>
              </div>
              <div className="p-stat">
                <span className="p-label">Body Fat</span>
                <span className="p-value">{analysis?.bodyFat || '22%'}</span>
              </div>
              <div className="p-stat">
                <span className="p-label">Body Type</span>
                <span className="p-value">{analysis?.bodyType || 'Average'}</span>
              </div>
              <div className="p-stat">
                <span className="p-label">Fitness Level</span>
                <span className="p-value">Intermediate</span>
              </div>
            </div>

            <div className="body-fat-gauge">
               <div className="gauge-label">
                 <span>Subcutaneous Fat</span>
                 <span>{analysis?.bodyFat || '22%'}</span>
               </div>
               <div className="gauge-track">
                  <div className="gauge-fill" style={{ width: analysis?.bodyFat || '22%' }}></div>
               </div>
            </div>
          </div>

          <div className="insight-card glass-card">
            <h4 className="card-title">✨ AI INSIGHT</h4>
            <p className="insight-text">{analysis?.explanation || "Based on your current physique, focus on high-quality protein to support muscle repair while maintaining a moderate caloric deficit if fat loss is prioritized."}</p>
          </div>
        </div>

        {/* Right Side: Smart Nutrition Assistant */}
        <div className="nutrition-main">
          <div className="protein-target-card glass-card">
            <div className="target-header">
              <h3>DAILY PROTEIN REQUIREMENT</h3>
              <div className="goal-tag">{goal?.title?.toUpperCase() || 'MAINTENANCE'}</div>
            </div>
            
            <div className="target-display">
              <div className="giant-number">{proteinTarget}g</div>
              <div className="target-sub">Protein Per Day</div>
            </div>

            <div className="calculation-rule">
              <span>Rule: {goal?.multiplier || 1.6}g protein per 1kg body weight ({weight}kg)</span>
            </div>
          </div>

          <div className="meals-section">
            <h3 className="section-title">DAILY PROTEIN DISTRIBUTION</h3>
            <div className="meals-list">
              {meals.map((meal, idx) => (
                <div key={idx} className="meal-card-horizontal glass-card hover-lift">
                  <div className="meal-img-wrap">
                    <img src={meal.foodDetails?.image || `/foods/oats.png`} alt={meal.food} />
                  </div>
                  <div className="meal-info">
                    <div className="meal-top">
                      <span className="meal-name">{meal.icon} {meal.name}</span>
                      <span className="meal-time">{meal.time}</span>
                    </div>
                    <h4>{meal.food.toUpperCase()}</h4>
                    <div className="meal-completion">
                      <div className="comp-label">Target Protein: {meal.protein}g</div>
                      <div className="comp-bar"><div className="comp-fill" style={{ width: '100%' }}></div></div>
                    </div>
                  </div>
                  <div className="meal-protein-count">
                    <span className="p-count">{meal.protein}g</span>
                    <span className="p-unit">Prot</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="food-suggestions">
             <h3 className="section-title">SUGGESTED FOODS ({diet === 'non_vegetarian' ? 'NON-VEG' : 'VEG'})</h3>
             <div className="foods-scroll">
                {recommendedFoods.map(f => (
                   <div key={f.name} className="food-thumb glass-card hover-lift">
                      <img src={f.image} alt={f.name} />
                      <div className="food-mini-info">
                        <span className="f-name">{f.name}</span>
                        <span className="f-prot">{f.protein}g protein</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <button className="btn-primary" onClick={next} style={{ width: '100%', marginTop: '20px', padding: '18px' }}>
            Complete Diet Strategy →
          </button>
        </div>
      </div>

      <style>{`
        .report-slide { max-width: 1100px; width: 100%; margin: 0 auto; padding: 20px; }
        .report-grid { display: grid; grid-template-columns: 340px 1fr; gap: 30px; }
        
        .profile-card { padding: 30px; margin-bottom: 20px; }
        .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .avatar-icon { font-size: 3rem; background: rgba(0,255,136,0.1); width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 20px; }
        .profile-header p { color: var(--text-dim); font-size: 0.9rem; }
        
        .profile-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .p-stat { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; }
        .p-label { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .p-value { font-size: 1rem; font-weight: 800; color: #fff; }
        
        .body-fat-gauge { margin-top: 20px; }
        .gauge-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: var(--text-dim); margin-bottom: 8px; }
        .gauge-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .gauge-fill { height: 100%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow); }
        
        .insight-card { padding: 25px; }
        .card-title { font-size: 0.75rem; font-weight: 900; color: var(--primary-color); margin-bottom: 12px; letter-spacing: 1px; }
        .insight-text { font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; font-style: italic; }
        
        .protein-target-card { padding: 30px; text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, rgba(0,255,136,0.1), transparent) !important; }
        .target-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .target-header h3 { font-size: 0.85rem; font-weight: 900; color: var(--text-dim); letter-spacing: 1px; }
        .goal-tag { background: var(--primary-color); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 900; }
        
        .target-display { margin-bottom: 20px; }
        .giant-number { font-size: 4rem; font-weight: 900; line-height: 1; color: #fff; text-shadow: 0 0 30px var(--primary-glow); }
        .target-sub { font-size: 0.9rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; letter-spacing: 2px; }
        .calculation-rule { font-size: 0.75rem; color: var(--text-dim); opacity: 0.7; }
        
        .section-title { font-size: 0.8rem; font-weight: 900; color: var(--text-dim); letter-spacing: 2px; margin-bottom: 20px; text-transform: uppercase; padding-left: 5px; }
        
        .meals-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; }
        .meal-card-horizontal { display: flex; align-items: center; gap: 20px; padding: 15px; }
        .meal-img-wrap { width: 60px; height: 60px; border-radius: 12px; overflow: hidden; background: #000; flex-shrink: 0; }
        .meal-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .meal-info { flex: 1; }
        .meal-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .meal-name { font-size: 0.75rem; font-weight: 800; color: var(--primary-color); }
        .meal-time { font-size: 0.75rem; color: var(--text-dim); }
        .meal-info h4 { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
        
        .meal-completion { display: flex; align-items: center; gap: 15px; }
        .comp-label { font-size: 0.7rem; color: var(--text-dim); white-space: nowrap; }
        .comp-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .comp-fill { height: 100%; background: var(--primary-color); }
        
        .meal-protein-count { text-align: center; padding-left: 15px; border-left: 1px solid rgba(255,255,255,0.1); }
        .p-count { display: block; font-size: 1.2rem; font-weight: 900; color: #fff; }
        .p-unit { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; font-weight: 800; }
        
        .food-suggestions { margin-bottom: 30px; }
        .foods-scroll { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; }
        .food-thumb { flex-shrink: 0; width: 140px; padding: 15px; text-align: center; transition: 0.3s; }
        .food-thumb img { width: 100px; height: 100px; border-radius: 18px; object-fit: cover; margin-bottom: 10px; }
        
        .food-mini-info { display: flex; flex-direction: column; gap: 4px; }
        .f-name { font-size: 0.8rem; font-weight: 800; color: #fff; text-transform: capitalize; display: block; }
        .f-prot { font-size: 0.65rem; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.5px; }

        .hover-lift:hover { transform: translateY(-5px); border-color: var(--primary-color); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.1); }
        
        @media (max-width: 900px) {
          .report-grid { grid-template-columns: 1fr; }
          .report-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .profile-card { margin-bottom: 0; }
        }
        @media (max-width: 600px) {
          .report-sidebar { grid-template-columns: 1fr; }
          .giant-number { font-size: 3rem; }
          .meal-card-horizontal { padding: 12px; gap: 12px; }
          .meal-img-wrap { width: 50px; height: 50px; }
        }
      `}</style>
    </div>
  );
};

export default SlideReport;
