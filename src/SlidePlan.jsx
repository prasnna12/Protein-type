import { useState, useMemo } from 'react';
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

const FoodDetailModal = ({ food, dailyTarget, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="food-modal glass-card animate-in" onClick={e => e.stopPropagation()}>
      <div className="modal-close" onClick={onClose}>×</div>
      <div className="modal-body-content">
        <div className="modal-top-hero">
          <div className="modal-hero-img-wrap">
            <img src={food.image} alt={food.name} />
          </div>
          <div className="modal-titles">
            <span className="food-badge">MASTER FOOD DB</span>
            <h2>{food.name.toUpperCase()}</h2>
            <p>{food.info}</p>
          </div>
        </div>

        <div className="modal-macros-grid">
          <MacroDetail label="Protein" value={food.protein} color="var(--primary-color)" />
          <MacroDetail label="Carbs" value={food.carbs} color="#3b82f6" />
          <MacroDetail label="Fats" value={food.fat} color="#f59e0b" />
        </div>

        <div className="modal-advice glass-card">
          <div className="advice-icon">💡</div>
          <p>For your <strong>{dailyTarget}g</strong> target, this is a top-tier choice. Best consumed during <strong>{food.bestTime}</strong>.</p>
        </div>
      </div>
    </div>
  </div>
);

const SlidePlan = ({ data }) => {
  const { goal, diet = 'vegetarian', proteinTarget = 120 } = data;
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

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
      </div>

      <div className="plan-tabs glass-card">
        <button className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>📅 Timeline</button>
        <button className={activeTab === 'database' ? 'active' : ''} onClick={() => setActiveTab('database')}>🥘 Food Database</button>
      </div>

      <div className="tab-content">
        {activeTab === 'timeline' ? (
          <div className="timeline-view">
            {meals.map((meal, idx) => {
              const meta = MEAL_META[meal.name] || { icon: '🍽️', color: '#fff' };
              return (
                <div key={idx} className="timeline-item">
                  <div className="time-marker">
                    <div className="marker-dot" style={{ background: meta.color }}></div>
                    <div className="marker-line"></div>
                  </div>
                  <div className="meal-content-box glass-card hover-lift" onClick={() => setSelectedFood(meal.foodDetails)}>
                    <div className="meal-box-top">
                      <div className="meal-type">
                        <span className="meal-icon" style={{ background: `${meta.color}20`, color: meta.color }}>{meta.icon}</span>
                        <div>
                          <h4>{meal.name}</h4>
                          <span className="meal-clock">{meal.time}</span>
                        </div>
                      </div>
                      <div className="meal-protein-target">
                        <span className="p-target-val">{meal.protein}g</span>
                        <span className="p-target-lbl">Prot</span>
                      </div>
                    </div>
                    <div className="meal-food-brief">
                      <img src={meal.foodDetails?.image || `/foods/oats.png`} alt="" />
                      <div className="food-info">
                        <h5>{meal.food.toUpperCase()}</h5>
                        <p>{meal.purpose}</p>
                      </div>
                    </div>
                    <div className="meal-accent" style={{ background: meta.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="database-view">
            {foods.map((food, i) => (
              <div key={i} className="food-master-card glass-card hover-lift" onClick={() => setSelectedFood(food)}>
                <div className="food-img-frame">
                  <img src={food.image} alt={food.name} />
                </div>
                <div className="food-card-body">
                  <div className="food-top">
                   <h4>{food.name}</h4>
                   <span className="food-p-badge">{food.protein}g</span>
                  </div>
                  <div className="food-macros-strip">
                    <span>{food.carbs}g Carbs</span>
                    <span>•</span>
                    <span>{food.fat}g Fat</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFood && <FoodDetailModal food={selectedFood} dailyTarget={proteinTarget} onClose={() => setSelectedFood(null)} />}

      <button className="btn-primary finalize-btn" onClick={() => alert('Plan Saved to Your AI Dashboard!')}>
        Finalize & Download Guide →
      </button>

      <style>{`
        .master-plan-slide { max-width: 1000px; width: 100%; padding: 40px; }
        .plan-header { text-align: center; margin-bottom: 40px; }
        .plan-badges { display: flex; justify-content: center; gap: 12px; margin-bottom: 16px; }
        .badge-item { background: var(--primary-color); color: #000; padding: 5px 15px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .badge-item.dim { background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); }
        .plan-intro { color: var(--text-dim); margin-top: 10px; }
        
        .plan-tabs { display: flex; padding: 6px; gap: 6px; max-width: 400px; margin: 0 auto 40px; }
        .plan-tabs button { flex: 1; padding: 12px; border: none; background: none; color: var(--text-dim); font-weight: 800; cursor: pointer; border-radius: 12px; transition: 0.3s; }
        .plan-tabs button.active { background: var(--primary-color); color: #000; }
        
        /* Timeline */
        .timeline-view { position: relative; padding-left: 20px; }
        .timeline-item { display: flex; gap: 40px; margin-bottom: 24px; position: relative; }
        .time-marker { position: relative; width: 2px; }
        .marker-dot { width: 16px; height: 16px; border-radius: 50%; position: absolute; left: -7px; top: 30px; border: 4px solid #000; z-index: 2; }
        .marker-line { position: absolute; top: 46px; bottom: -24px; left: 0; width: 2px; background: rgba(255,255,255,0.05); }
        .timeline-item:last-child .marker-line { display: none; }
        
        .meal-content-box { flex: 1; padding: 24px; position: relative; overflow: hidden; cursor: pointer; transition: 0.3s; }
        .meal-box-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .meal-type { display: flex; gap: 16px; align-items: center; }
        .meal-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .meal-type h4 { font-size: 1.2rem; color: #fff; margin-bottom: 2px; }
        .meal-clock { font-size: 0.75rem; color: var(--text-dim); font-weight: 700; opacity: 0.7; }
        
        .meal-protein-target { text-align: right; }
        .p-target-val { display: block; font-size: 1.5rem; font-weight: 900; color: #fff; line-height: 1; }
        .p-target-lbl { font-size: 0.6rem; text-transform: uppercase; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }
        
        .meal-food-brief { display: flex; gap: 16px; align-items: center; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 16px; }
        .meal-food-brief img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
        .food-info h5 { color: var(--primary-color); font-size: 0.85rem; margin-bottom: 4px; }
        .food-info p { font-size: 0.8rem; color: var(--text-dim); line-height: 1.4; }
        
        .meal-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; opacity: 0.5; transition: 0.3s; }
        .meal-content-box:hover .meal-accent { width: 8px; opacity: 1; }
        
        /* Database */
        .database-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .food-master-card { padding: 0; overflow: hidden; cursor: pointer; }
        .food-img-frame { height: 160px; background: #000; }
        .food-img-frame img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
        .food-master-card:hover .food-img-frame img { transform: scale(1.1); }
        .food-card-body { padding: 16px; }
        .food-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .food-top h4 { font-size: 1rem; color: #fff; text-transform: capitalize; }
        .food-p-badge { font-size: 0.7rem; font-weight: 900; color: var(--primary-color); background: rgba(0,255,136,0.1); padding: 4px 10px; border-radius: 100px; }
        .food-macros-strip { display: flex; gap: 8px; font-size: 0.75rem; color: var(--text-dim); }
        
        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .food-modal { max-width: 500px; width: 100%; padding: 40px; position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; font-size: 2rem; color: var(--text-dim); cursor: pointer; }
        .modal-body-content { position: relative; }
        .modal-top-hero { display: flex; gap: 24px; align-items: center; margin-bottom: 32px; }
        .modal-hero-img-wrap { width: 100px; height: 100px; border-radius: 20px; overflow: hidden; background: #000; flex-shrink: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .modal-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .food-badge { font-size: 0.6rem; font-weight: 900; color: var(--primary-color); letter-spacing: 2px; }
        .modal-titles h2 { font-size: 1.8rem; line-height: 1.2; margin: 4px 0; }
        .modal-titles p { font-size: 0.9rem; color: var(--text-dim); }
        
        .modal-macros-grid { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .macro-det { display: flex; flex-direction: column; gap: 8px; }
        .macro-det-top { display: flex; justify-content: space-between; align-items: flex-end; }
        .m-det-lbl { font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .m-det-val { font-size: 1.1rem; font-weight: 900; line-height: 1; }
        .m-det-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .m-det-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        .modal-advice { padding: 20px; display: flex; gap: 16px; align-items: center; border-color: rgba(0,255,136,0.2); background: rgba(0,255,136,0.02) !important; }
        .advice-icon { font-size: 1.5rem; }
        .modal-advice p { font-size: 0.85rem; line-height: 1.6; color: var(--text-dim); }
        .modal-advice strong { color: #fff; }
        
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
