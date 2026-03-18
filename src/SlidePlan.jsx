import { useState, useMemo } from 'react';
import Toast from './Toast';
import { getRecommendedFoods, getMealPlan } from './nutritionService';

const DIET_LABELS = { vegetarian: '🥗 Vegetarian', non_vegetarian: '🍗 Non-Veg' };

const MEAL_META = {
  Breakfast:      { icon: '🌅', color: '#f59e0b', desc: 'Protein-rich start to fuel muscle protein synthesis.' },
  Lunch:          { icon: '☀️', color: '#3b82f6', desc: 'High-volume meal for sustained energy and focus.' },
  'Pre-Workout':  { icon: '⚡', color: '#8b5cf6', desc: 'BCAA and glycogen support for training performance.' },
  'Post-Workout': { icon: '💪', color: '#06b6d4', desc: 'Rapid absorption protein for muscle fiber repair.' },
  Dinner:         { icon: '🌙', color: '#ec4899', desc: 'Slow-digesting protein to prevent overnight catabolism.' },
};

/* ── Food Card for Details ────────── */
const MacroDetail = ({ label, value, color }) => (
  <div className="macro-det">
    <div className="macro-det-top">
      <span className="m-det-lbl">{label}</span>
      <span className="m-det-val" style={{ color }}>{value}g</span>
    </div>
    <div className="m-det-bar"><div className="m-det-fill" style={{ width: `${Math.min(value * 2.5, 100)}%`, background: color }}></div></div>
  </div>
);

const FoodDetailModal = ({ food, dailyTarget, onClose }) => {
  if (!food) return null;
  const servingSize = food.unit ? `1 ${food.unit}` : '1 serving';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="food-modal glass-card premium-scale" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-top-hero">
          <div className="modal-hero-img-wrap" style={{ width: '130px', height: '130px' }}>
            <img src={food.image || `/foods/oats.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="modal-titles">
            <span className="food-badge">MASTER STRATEGY GUIDE</span>
            <div className="prep-summary-pill">{food.prep?.split('.')[0] || 'Ready to eat'}</div>
            <h2>{(food.name || '').toUpperCase()} {food.emoji}</h2>
            <p>{food.category || 'Core Protein Source'}</p>
          </div>
        </div>

        <div className="modal-macros-grid">
          <div className="macro-coaching-box">
             <div className="m-coach-item">
                <span className="m-coach-label">PROTEIN PER {food.unit?.toUpperCase() || 'SERVING'}</span>
                <span className="m-coach-value">{food.unitProtein || food.protein}g</span>
             </div>
             <div className="m-coach-item">
                <span className="m-coach-label">BEST TIMING</span>
                <span className="m-coach-value">{food.bestTime || 'Anytime'}</span>
             </div>
          </div>
          
          <div className="macro-coaching-details">
            <div className="det-section">
              <h4>👨‍🍳 PREPARATION (HOW TO EAT)</h4>
              <p>{food.prep || 'Enjoy as part of your balanced diet.'}</p>
            </div>
            <div className="det-section">
              <h4>🎯 STRATEGY TIP</h4>
              <p>{food.info || 'High quality protein source for your fitness journey.'}</p>
            </div>
          </div>

          <div className="modal-advice glass-card">
             <span className="advice-icon">💡</span>
             <p>This is a top-tier choice for your <strong>{dailyTarget}g</strong> target. Follow the prep instructions for best results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SlidePlan = ({ data }) => {
  const { goal, diet = 'vegetarian', proteinTarget = 120 } = data;
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState(null);
  
  // Track which option index is selected for each meal (default to 0)
  const [mealSelections, setMealSelections] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });

  const goalId = goal?.id || 'maintenance';
  const foods = useMemo(() => getRecommendedFoods(diet, goalId), [diet, goalId]);
  const meals = useMemo(() => getMealPlan(data), [data]);

  return (
    <div className="master-plan-slide">
      <div className="plan-header">
        <div className="plan-badges">
          <span className="badge-item">{goal?.title} Strategy</span>
          <span className="badge-item dim">{DIET_LABELS[diet]}</span>
        </div>
        <h1 className="text-gradient">Daily Master Strategy</h1>
        <p className="plan-intro">Your complete a-z execution guide for the next 24 hours.</p>
        {data.analysis?.isEstimated && (
          <div className="fallback-banner glass-card animate-in">
             <span>⚠️ Neural Fallback Mode Active — AI Neural Engine Busy</span>
          </div>
        )}
      </div>

      <div className="plan-tabs glass-card">
        <button className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>📅 Timeline</button>
        <button className={activeTab === 'database' ? 'active' : ''} onClick={() => setActiveTab('database')}>🥘 Food Database</button>
      </div>

      <div className="tab-content">
        {activeTab === 'timeline' ? (
          <div className="timeline-view">
            <div className="choice-guide-banner stagger-in">
               <span>💡 Freedom of Choice</span>
               <p>Select any 1 option per meal. All alternatives are protein-matched (±5g).</p>
            </div>

            {meals.map((meal, mealIdx) => {
              const meta = MEAL_META[meal.name] || { icon: '🍽️', color: '#fff' };
              const selectedIdx = mealSelections[mealIdx] || 0;
              const currentOption = meal.options[selectedIdx] || meal.options[0];

              return (
                <div key={mealIdx} className="timeline-item">
                  <div className="time-marker">
                    <div className="marker-dot" style={{ background: meta.color }}></div>
                    <div className="marker-line"></div>
                  </div>
                  <div className="meal-content-box glass-card hover-lift">
                    <div className="meal-box-top">
                      <div className="meal-type">
                        <span className="meal-icon" style={{ background: `${meta.color}20`, color: meta.color }}>{meta.icon}</span>
                        <div>
                          <h4>{meal.name}</h4>
                          <span className="meal-clock">{meal.time}</span>
                        </div>
                      </div>
                      <div className="meal-protein-target">
                        <span className="p-target-val">{currentOption.protein}g</span>
                        <span className="p-target-lbl">Prot</span>
                      </div>
                    </div>

                     <div className="options-selector-row">
                        {meal.options.map((opt, optIdx) => (
                          <button 
                            key={optIdx} 
                            className={`opt-selector-btn ${selectedIdx === optIdx ? 'active' : ''}`}
                            onClick={() => setMealSelections(prev => ({ ...prev, [mealIdx]: optIdx }))}
                            title={opt.food}
                          >
                            <img src={opt.foodDetails?.image || `/foods/oats.png`} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                          </button>
                        ))}
                     </div>

                    <div className="meal-food-brief">
                      <div className="nano-img-wrap" onClick={() => setSelectedFood(currentOption.foodDetails)} style={{ width: '50px', height: '50px' }}>
                        <img src={currentOption.foodDetails?.image || `/foods/oats.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="food-info" onClick={() => setSelectedFood(currentOption.foodDetails)}>
                        <div className="food-info-top">
                          <h5>{currentOption.food.toUpperCase()}</h5>
                          <span className="food-qty-label">{currentOption.quantity}</span>
                        </div>
                        <p className="food-prep-text"><strong>Cook:</strong> {currentOption.prep}</p>
                        <p className="food-purpose-text">{currentOption.instruction}</p>
                      </div>
                    </div>
                    <div className="meal-accent" style={{ background: meta.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="database-view-container">
            <div className="category-scroll">
              {['All', 'High Protein', 'Moderate Protein', 'Carb Sources', 'Healthy Fats'].map(cat => (
                <button 
                  key={cat} 
                  className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="database-grid">
              {foods
                .filter(f => selectedCategory === 'All' || f.category === selectedCategory)
                .map((food, i) => (
                <div key={i} className="food-nano-card glass-card hover-lift" onClick={() => setSelectedFood(food)}>
                  <div className="nano-card-img" style={{ height: '100px' }}>
                    <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="nano-badge">{food.emoji}</div>
                  </div>
                  <div className="nano-card-body">
                    <div className="nano-card-top">
                      <h4>{food.name}</h4>
                      <span className="nano-p-val">{food.protein}g</span>
                    </div>
                    <div className="nano-card-meta">
                      <span>{food.unit}</span>
                      <span>•</span>
                      <span className="nano-cat-lbl">{food.category}</span>
                    </div>
                    <div className="nano-timing-bar">
                      <span className="nano-clock-icon">🕒</span>
                      {food.bestTime.split(',')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <button className="btn-primary finalize-btn" onClick={() => setToast({ type: 'success', message: 'Plan Saved to Your AI Dashboard!' })}>
        Finalize & Download Guide →
      </button>

      <style>{`
        .master-plan-slide { max-width: 1000px; width: 100%; padding: 40px; }
        .plan-header { text-align: center; margin-bottom: 40px; }
        .plan-badges { display: flex; justify-content: center; gap: 12px; margin-bottom: 16px; }
        .badge-item { background: var(--primary-color); color: #000; padding: 5px 15px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .badge-item.dim { background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); }
        .plan-intro { color: var(--text-dim); margin-top: 10px; margin-bottom: 20px; }
        
        .fallback-banner { 
          max-width: 500px; margin: 20px auto 0; padding: 12px 20px; 
          border-color: rgba(255, 165, 0, 0.3) !important; background: rgba(255, 165, 0, 0.05) !important;
          color: #ff9d00; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .plan-tabs { display: flex; padding: 6px; gap: 6px; max-width: 400px; margin: 0 auto 40px; }
        .plan-tabs button { flex: 1; padding: 12px; border: none; background: none; color: var(--text-dim); font-weight: 800; cursor: pointer; border-radius: 12px; transition: 0.3s; }
        .plan-tabs button.active { background: var(--primary-color); color: #000; }
        
        /* Timeline */
        .timeline-view { display: flex; flex-direction: column; gap: 30px; position: relative; }
        .choice-guide-banner { background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.1); padding: 15px 20px; border-radius: 16px; margin-bottom: 10px; }
        .choice-guide-banner span { display: block; font-size: 0.9rem; font-weight: 900; color: var(--primary-color); margin-bottom: 4px; }
        .choice-guide-banner p { font-size: 0.8rem; color: var(--text-dim); margin: 0; }

        .timeline-item { display: flex; gap: 25px; position: relative; }
        .time-marker { position: relative; width: 2px; }
        .marker-dot { width: 20px; height: 20px; border-radius: 50%; position: absolute; left: -9px; top: 30px; border: 4px solid #000; z-index: 2; }
        .marker-line { position: absolute; top: 46px; bottom: -40px; left: 0; width: 2px; background: rgba(255,255,255,0.05); }
        .timeline-item:last-child .marker-line { display: none; }
        
        .meal-content-box { flex: 1; padding: 20px; border-radius: 20px; position: relative; overflow: hidden; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
        .meal-box-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer; }

        .options-selector-row { display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .opt-selector-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); width: 40px; height: 40px; border-radius: 10px; font-size: 1.2rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .opt-selector-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .opt-selector-btn.active { background: rgba(0, 255, 136, 0.1); border-color: var(--primary-color); transform: scale(1.1); box-shadow: 0 0 10px rgba(0, 255, 136, 0.2); }
        
        .meal-type { display: flex; gap: 12px; align-items: center; }
        .meal-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .meal-type h4 { font-size: 1rem; font-weight: 800; color: #fff; margin: 0; }
        .meal-clock { font-size: 0.75rem; color: var(--text-dim); }
        
        .meal-protein-target { text-align: right; }
        .p-target-val { display: block; font-size: 1.1rem; font-weight: 900; color: #fff; }
        .p-target-lbl { font-size: 0.6rem; color: var(--text-dim); text-transform: uppercase; font-weight: 800; }
        
        .meal-food-brief { display: flex; gap: 15px; align-items: center; cursor: pointer; }
        .nano-img-wrap { width: 50px; height: 50px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .nano-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .food-info { flex: 1; }
        .food-info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .food-info-top h5 { font-size: 0.85rem; font-weight: 800; color: var(--primary-color); margin: 0; }
        .food-qty-label { font-size: 0.7rem; font-weight: 950; background: rgba(0, 255, 136, 0.1); color: var(--primary-color); padding: 2px 8px; border-radius: 4px; }
        .food-prep-text { font-size: 0.75rem; color: var(--text-dim); margin: 0; }
        .food-prep-text strong { color: rgba(255,255,255,0.6); }
        .food-purpose-text { font-size: 0.7rem; color: var(--text-dim); margin-top: 4px; opacity: 0.7; }
        
        .meal-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; transition: 0.3s; }
        .meal-content-box:hover .meal-accent { width: 8px; }
        
        /* Database & Categories */
        .database-view-container { display: flex; flex-direction: column; gap: 24px; }
        .category-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .cat-pill {
          white-space: nowrap;
          padding: 8px 20px;
          border-radius: 100px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-dim);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .cat-pill:hover { background: rgba(255,255,255,0.08); }
        .option-btn.active {
          background: linear-gradient(135deg, var(--primary-color), var(--accent-purple));
          color: #fff;
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .cat-pill.active { background: var(--primary-color); color: #000; border-color: var(--primary-color); }

        .database-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        
        .food-nano-card { 
          padding: 0; 
          overflow: hidden; 
          cursor: pointer; 
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .nano-card-img { position: relative; height: 100px; overflow: hidden; }
        .nano-card-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .food-nano-card:hover .nano-card-img img { transform: scale(1.1); }
        
        .nano-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .meal-marker {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(0, 198, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--primary-color);
          border: 1px solid rgba(0, 198, 255, 0.1);
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0, 198, 255, 0.05);
        }
        
        .nano-card-body { padding: 15px; display: flex; flex-direction: column; gap: 8px; }
        .nano-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .nano-card-top h4 { font-size: 1rem; color: #fff; font-weight: 800; text-transform: capitalize; margin: 0; }
        .nano-p-val { font-size: 0.8rem; font-weight: 900; color: var(--primary-color); }
        
        .nano-card-meta { display: flex; gap: 8px; font-size: 0.7rem; color: var(--text-dim); font-weight: 600; align-items: center; }
        .nano-cat-lbl { color: var(--primary-color); opacity: 0.8; text-transform: uppercase; font-size: 0.6rem; letter-spacing: 0.5px; }
        
        .nano-timing-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-dim);
          background: rgba(255,255,255,0.03);
          padding: 4px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        /* Timeline Nano Adjustment */
        .nano-img-wrap { width: 50px; height: 50px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05); }
        .nano-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        /* Modal */
        .modal-overlay { 
          position: fixed; inset: 0; 
          background: rgba(2, 6, 23, 0.9); 
          backdrop-filter: blur(10px); 
          z-index: 2000; 
          display: flex; align-items: center; justify-content: center; padding: 20px; 
        }
        .food-modal { 
          background: rgba(10, 25, 47, 0.95); 
          backdrop-filter: blur(30px); 
          max-width: 440px; 
          width: 90%; 
          padding: 0; 
          border-radius: 24px;
          border: 1px solid rgba(0, 198, 255, 0.2); 
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 198, 255, 0.1);
          overflow: hidden;
        }
        .modal-close { 
          position: absolute; top: 20px; right: 20px; 
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
        .modal-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
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

        .food-badge { font-size: 0.6rem; font-weight: 950; letter-spacing: 3px; color: var(--primary-color); display: block; margin-bottom: 10px; opacity: 0.8; }
        .modal-titles h2 { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 5px; }
        .modal-titles p { font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; }
        
        .modal-macros-grid { padding: 30px; }
        .macro-coaching-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .m-coach-item { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .m-coach-label { font-size: 0.65rem; font-weight: 900; color: var(--text-dim); display: block; margin-bottom: 8px; }
        .m-coach-value { font-size: 1.2rem; font-weight: 900; color: var(--primary-color); }
        
        .macro-coaching-details { display: flex; flex-direction: column; gap: 25px; margin-bottom: 30px; }
        .det-section h4 { font-size: 0.75rem; font-weight: 950; color: var(--text-dim); margin-bottom: 10px; letter-spacing: 1px; }
        .det-section p { font-size: 0.95rem; color: #fff; line-height: 1.6; }
        
        .modal-advice { 
          padding: 20px; 
          background: rgba(0, 255, 136, 0.05) !important; 
          border: 1px solid rgba(0, 255, 136, 0.1); 
          display: flex; gap: 15px; align-items: center; 
        }
        .advice-icon { font-size: 1.8rem; }
        .modal-advice p { font-size: 0.85rem; line-height: 1.5; color: var(--text-dim); margin: 0; }
        .modal-advice strong { color: #fff; display: block; margin-bottom: 4px; }

        .premium-scale { 
          animation: premiumScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        @keyframes premiumScale {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .finalize-btn { margin-top: 40px; width: 100%; padding: 18px; font-size: 1.1rem; }
        .hover-lift:hover { transform: translateY(-5px); border-color: var(--primary-color); }
        
        @media (max-width: 768px) {
          .timeline-item { gap: 20px; }
          .meal-content-box { padding: 16px; }
          .meal-box-top { margin-bottom: 12px; }
          .meal-food-brief { padding: 8px; }
          .meal-type h4 { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default SlidePlan;
