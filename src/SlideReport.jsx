import { useMemo, useState } from 'react';
import { getMealPlan, getRecommendedFoods } from './nutritionService';

// Reusable Detail Modal (Professional Nutrition Passport)
const FoodDetailPopup = ({ food, onClose }) => {
  if (!food) return null;
  const servingSize = food.quantity || '1 serving';
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="food-modal glass-card premium-scale" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-top-hero">
          <div className="modal-hero-img-wrap" style={{ width: '130px', height: '130px' }}>
            <img src={food.foodDetails?.image || `/foods/oats.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="modal-titles">
            <span className="food-badge">PREPARATION GUIDE</span>
            <div className="prep-summary-pill">{food.prep || 'Ready to eat'}</div>
            <h2>{(food.food || food.name || '').toUpperCase()} {food.foodDetails?.emoji}</h2>
            <p>{food.foodDetails?.category || 'High Protein Source'}</p>
          </div>
        </div>

        <div className="modal-macros-grid">
          <div className="macro-coaching-box">
             <div className="m-coach-item">
                <span className="m-coach-label">RECO. QTY</span>
                <span className="m-coach-value">{servingSize}</span>
             </div>
             <div className="m-coach-item">
                <span className="m-coach-label">PROTEIN</span>
                <span className="m-coach-value">{food.protein}g</span>
             </div>
          </div>
          
          <div className="macro-coaching-details">
            <div className="det-section">
              <h4>👨‍🍳 PREPARATION (HOW TO EAT)</h4>
              <p>{food.prep || 'Enjoy as part of your balanced diet.'}</p>
            </div>
            <div className="det-section">
              <h4>🕒 BEST TIME TO EAT</h4>
              <p>{food.foodDetails?.bestTime || 'Anytime during the day.'}</p>
            </div>
          </div>

          <div className="modal-advice glass-card">
             <span className="advice-icon">💡</span>
             <p><strong>Coach Tip:</strong> {food.instruction || food.foodDetails?.info}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SlideReport = ({ next, data }) => {
  const { proteinTarget, diet, goal, analysis, weight } = data;
  const [expandedMeal, setExpandedMeal] = useState(0); 
  const [selectedFood, setSelectedFood] = useState(null);

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
              {meals.map((meal, mealIdx) => (
                <div key={mealIdx} className={`meal-section-group ${expandedMeal === mealIdx ? 'expanded' : ''}`}>
                  <div className="meal-section-header glass-card" onClick={() => setExpandedMeal(expandedMeal === mealIdx ? -1 : mealIdx)}>
                    <div className="meal-type-main">
                      <span className="meal-main-icon">{meal.icon}</span>
                      <div>
                        <h3>{meal.name}</h3>
                        <span className="meal-main-time">{meal.time}</span>
                      </div>
                    </div>
                    <div className="meal-target-pill">
                      TARGET: {meal.targetProtein}g 
                      <span className={`chevron ${expandedMeal === mealIdx ? 'up' : 'down'}`}>▼</span>
                    </div>
                  </div>

                  {expandedMeal === mealIdx && (
                    <div className="meal-expansion-content slide-in-top">
                      <div className="options-choice-label">
                         <span>💡 Choose any 1 option</span>
                         <em>(All provide ~{meal.targetProtein}g protein)</em>
                      </div>

                      <div className="options-grid">
                        {meal.options.map((option, optIdx) => (
                          <div 
                            key={optIdx} 
                            className="option-nano-card glass-card hover-lift clickable"
                            onClick={() => setSelectedFood(option)}
                          >
                            <div className="opt-img-wrap" style={{ width: '55px', height: '55px' }}>
                              <img src={option.foodDetails?.image || `/foods/oats.png`} alt={option.food} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div className="opt-protein-badge">{option.protein}g</div>
                            </div>
                            <div className="opt-content">
                              <div className="opt-title">
                                <h4>{option.food.toUpperCase()}</h4>
                                {option.foodDetails?.emoji}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="next-page-guide animated-hint" onClick={next}>
             <span className="guide-text">For more detailed diet plan → <strong>Go to Next Page</strong></span>
             <div className="guide-arrow">→</div>
          </div>

          <div className="food-suggestions">
             <h3 className="section-title">SUGGESTED FOODS ({diet === 'non_vegetarian' ? 'NON-VEG' : 'VEG'})</h3>
             <div className="foods-scroll">
                {recommendedFoods.map(f => (
                   <div key={f.name} className="food-thumb glass-card hover-lift clickable" onClick={() => setSelectedFood({ ...f, foodDetails: f })} style={{ width: '120px' }}>
                      <img src={f.image} alt={f.name} style={{ width: '70px', height: '70px', borderRadius: '15px', objectFit: 'cover' }} />
                      <div className="food-mini-info">
                        <span className="f-name">{f.name}</span>
                        <span className="f-prot">{f.protein}g protein</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <button className="btn-primary" onClick={next} style={{ width: '100%', marginTop: '30px', padding: '18px' }}>
            Complete Diet Strategy →
          </button>
        </div>
      </div>

      {/* Detail Popup */}
      {selectedFood && (
        <FoodDetailPopup 
          food={selectedFood} 
          onClose={() => setSelectedFood(null)} 
        />
      )}

      <style>{`
        .report-slide { max-width: 1200px; width: 100%; margin: 0 auto; padding: 20px; }
        .report-grid { display: grid; grid-template-columns: 340px 1fr; gap: 30px; }
        
        .profile-card { padding: 30px; margin-bottom: 20px; }
        .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .avatar-icon { font-size: 2.2rem; background: rgba(0,255,136,0.1); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 15px; }
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
        
        .protein-target-card { padding: 30px; text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, rgba(0,255,136,0.1), transparent) !important; border: 1px solid rgba(0,255,136,0.1); }
        .target-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .target-header h3 { font-size: 0.85rem; font-weight: 900; color: var(--text-dim); letter-spacing: 1px; }
        .goal-tag { background: var(--primary-color); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 900; }
        
        .target-display { margin-bottom: 20px; }
        .giant-number { font-size: 4.5rem; font-weight: 900; line-height: 1; color: #fff; text-shadow: 0 0 30px var(--primary-glow); }
        .target-sub { font-size: 1rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; letter-spacing: 2px; }
        .calculation-rule { font-size: 0.75rem; color: var(--text-dim); opacity: 0.7; }
        
        .section-title { font-size: 0.85rem; font-weight: 900; color: var(--text-dim); letter-spacing: 2px; margin-bottom: 25px; text-transform: uppercase; padding-left: 5px; }
        
        .meal-section-group { margin-bottom: 15px; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .meal-section-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 20px 25px; 
          cursor: pointer; 
        }
        .meal-section-header:hover { background: rgba(255,255,255,0.05); border-color: var(--primary-color); }
        
        .meal-type-main { display: flex; gap: 20px; align-items: center; }
        .meal-main-icon { font-size: 1.8rem; background: rgba(255,255,255,0.03); width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 14px; }
        .meal-type-main h3 { font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0; }
        .meal-main-time { font-size: 0.85rem; color: var(--text-dim); }
        
        .meal-target-pill { 
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.75rem; 
          font-weight: 950; 
          color: var(--primary-color); 
          background: rgba(0, 198, 255, 0.08); 
          padding: 8px 18px; 
          border-radius: 100px; 
          letter-spacing: 1px;
          transition: 0.3s;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .chevron { font-size: 0.6rem; transition: 0.3s; opacity: 0.6; }
        .chevron.up { transform: rotate(180deg); opacity: 1; }

        .meal-expansion-content { padding-top: 20px; padding-bottom: 30px; }
        .options-choice-label { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; padding: 12px 18px; background: rgba(0, 198, 255, 0.03); border-radius: 12px; border: 1px solid rgba(0, 198, 255, 0.08); }
        .options-choice-label span { font-size: 0.85rem; font-weight: 800; color: #fff; }
        .options-choice-label em { font-size: 0.75rem; color: var(--text-dim); font-style: normal; opacity: 0.8; }

        .options-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 12px; 
        }
        @media (max-width: 1024px) { .options-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .options-grid { grid-template-columns: repeat(2, 1fr); } }

        .option-nano-card { 
          padding: 12px; 
          border-radius: 14px; 
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255,255,255,0.05); 
          transition: 0.3s; 
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          min-height: 140px;
        }
        .option-nano-card.clickable { cursor: pointer; }
        .option-nano-card:hover { transform: translateY(-5px); border-color: var(--primary-color); box-shadow: 0 10px 30px rgba(0, 198, 255, 0.08); background: rgba(0, 198, 255, 0.02); }
        
        .opt-img-wrap { position: relative; width: 55px; height: 55px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05); }
        .opt-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .option-nano-card:hover .opt-img-wrap img { transform: scale(1.1); }
        .opt-protein-badge { position: absolute; bottom: 0; right: 0; background: var(--primary-color); color: #000; font-size: 0.65rem; font-weight: 900; padding: 3px 6px; border-radius: 6px 0 0 0; }
        
        .opt-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .opt-title { display: flex; justify-content: space-between; align-items: center; }
        .opt-title h4 { font-size: 0.9rem; font-weight: 800; color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
        .opt-qty { font-size: 0.8rem; font-weight: 900; color: var(--primary-color); }
        .opt-prep { font-size: 0.7rem; color: var(--text-dim); margin-top: 2px; }

        .food-suggestions { margin-top: 50px; }
        .foods-scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .food-thumb { flex-shrink: 0; width: 120px; padding: 15px; text-align: center; transition: 0.3s; border: 1px solid rgba(255,255,255,0.05); }
        .food-thumb.clickable { cursor: pointer; }
        .food-thumb img { width: 70px; height: 70px; border-radius: 15px; object-fit: cover; margin-bottom: 12px; transition: 0.3s; }
        .food-thumb:hover img { transform: translateY(-8px); filter: drop-shadow(0 10px 15px var(--primary-glow)); }
        .f-name { font-size: 0.85rem; font-weight: 800; color: #fff; text-transform: capitalize; display: block; margin-bottom: 4px; }
        .f-prot { font-size: 0.7rem; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 1px; }

        /* NEXT PAGE GUIDE */
        .animated-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 25px;
          background: linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.03), transparent);
          border-radius: 16px;
          margin: 40px 0;
          cursor: pointer;
          transition: 0.3s;
          border: 1px dashed rgba(0, 198, 255, 0.2);
        }
        .animated-hint:hover { background: rgba(0, 198, 255, 0.05); transform: translateY(-2px); }
        .guide-text { font-size: 0.95rem; color: var(--text-dim); }
        .guide-text strong { color: var(--primary-color); font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .guide-arrow { 
          font-size: 1.5rem; 
          color: var(--primary-color); 
          animation: arrowMove 1.5s infinite; 
        }
        @keyframes arrowMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .food-modal {
          background: rgba(10, 25, 47, 0.95);
          backdrop-filter: blur(30px);
          padding: 30px;
          border-radius: 24px;
          max-width: 440px;
          width: 90%;
          border: 1px solid rgba(0, 198, 255, 0.2);
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 198, 255, 0.1);
        }
        .modal-close {
          position: absolute;
          top: 20px; right: 20px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          font-size: 1.5rem;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s;
        }
        .modal-close:hover { background: #ff4d4d; transform: rotate(90deg); }

        .meal-timing-pill {
          background: rgba(0, 198, 255, 0.1);
          color: var(--primary-color);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          border: 1px solid rgba(0, 198, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .modal-top-hero {
          padding: 40px;
          background: linear-gradient(180deg, rgba(0, 198, 255, 0.1), transparent);
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .modal-hero-img-wrap {
          width: 130px; height: 130px;
          margin: 0 auto 20px;
          border-radius: 24px;
          overflow: hidden;
          border: 2px solid var(--primary-color);
          box-shadow: 0 0 20px var(--primary-glow);
        }
        .prep-summary-pill {
          background: rgba(0, 198, 255, 0.1);
          color: var(--primary-color);
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          display: inline-block;
          margin-bottom: 10px;
          border: 1px solid rgba(0, 198, 255, 0.2);
        }
        .modal-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .food-badge { font-size: 0.6rem; font-weight: 950; letter-spacing: 3px; color: var(--primary-color); display: block; margin-bottom: 10px; opacity: 0.8; }
        .modal-titles h2 { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 5px; }
        .modal-titles p { font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; }

        .modal-macros-grid { padding: 30px; }
        .macro-coaching-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        .m-coach-item {
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .m-coach-label { font-size: 0.65rem; font-weight: 900; color: var(--text-dim); display: block; margin-bottom: 8px; }
        .m-coach-value { font-size: 1.2rem; font-weight: 900; color: var(--primary-color); }

        .macro-coaching-details { display: flex; flex-direction: column; gap: 25px; margin-bottom: 30px; }
        .det-section h4 { font-size: 0.75rem; font-weight: 950; color: var(--text-dim); margin-bottom: 10px; letter-spacing: 1px; }
        .det-section p { font-size: 0.95rem; color: #fff; line-height: 1.6; }

        .modal-advice {
          padding: 20px;
          background: rgba(0, 255, 136, 0.05) !important;
          border: 1px solid rgba(0, 255, 136, 0.1);
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .advice-icon { font-size: 1.8rem; }
        .modal-advice p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; margin: 0; }
        .modal-advice strong { color: #fff; display: block; margin-bottom: 4px; }

        /* ANIMATIONS */
        .premium-scale { 
          animation: premiumScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        @keyframes premiumScale {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .slide-in-top { animation: slideTop 0.3s ease-out; }
        @keyframes slideTop {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 900px) {
          .report-grid { grid-template-columns: 1fr; }
          .report-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .profile-card { margin-bottom: 0; }
          .giant-number { font-size: 3.5rem; }
        }
        @media (max-width: 600px) {
          .report-sidebar { grid-template-columns: 1fr; }
          .meal-main-icon { width: 45px; height: 45px; font-size: 1.5rem; }
          .meal-type-main h3 { font-size: 1.1rem; }
          .options-grid { grid-template-columns: 1fr; }
          .food-modal { max-height: 90vh; overflow-y: auto; border-radius: 0; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default SlideReport;
