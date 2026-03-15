import { useState, useMemo } from 'react';
import { getRecommendedFoods, getMealPlan, getMealFoods } from './nutritionService';

const DIET_LABELS = { vegetarian: '🥗 Vegetarian', non_vegetarian: '🍗 Non-Veg' };

const MEAL_META = {
  Breakfast:      { icon: '🌅', color: '#f59e0b', desc: 'Fuel your day with high-protein energy.' },
  Snack:          { icon: '🍎', color: '#22c55e', desc: 'Maintain energy levels between meals.' },
  Lunch:          { icon: '☀️', color: '#3b82f6', desc: 'Balanced nutrition for peak performance.' },
  'Pre-Workout':  { icon: '⚡', color: '#8b5cf6', desc: 'Energy to power your training.' },
  'Post-Workout': { icon: '💪', color: '#06b6d4', desc: 'Protein recovery for muscle growth.' },
  Dinner:         { icon: '🌙', color: '#ec4899', desc: 'Recovery before sleep.' },
};

/* ── Compact Food Card (inside meal detail) ────────── */
const MealFoodCard = ({ food, onClick }) => (
  <div className="mf-card glass-card" onClick={() => onClick(food)}>
    <div className="mf-img-wrap">
      <img src={food.image} alt={food.name} />
      <div className="mf-overlay">VIEW GUIDE</div>
    </div>
    <div className="mf-body">
      <p className="mf-name">{food.name}</p>
      <div className="mf-macros">
        <span className="mf-mac">P: {food.protein}g</span>
        <span className="mf-mac">C: {food.carbs}g</span>
      </div>
    </div>
  </div>
);

/* ── Big Food Card (recommendations tab) ───────────── */
const FoodCard = ({ food, onClick }) => (
  <div className="food-card glass-card" onClick={() => onClick(food)}>
    <div className="food-img-wrap">
      <img src={food.image} alt={food.name} />
      <div className="food-overlay">📖 VIEW NUTRITION GUIDE</div>
    </div>
    <div className="food-card-body">
      <h3 className="food-name">{food.name}</h3>
      <div className="food-macros-row">
        <div className="mac-pill protein">
          <span className="m-val">{food.protein}g</span>
          <span className="m-lbl">PRO</span>
        </div>
        <div className="mac-pill carbs">
          <span className="m-val">{food.carbs}g</span>
          <span className="m-lbl">CARB</span>
        </div>
        <div className="mac-pill cals">
          <span className="m-val">{food.calories}</span>
          <span className="m-lbl">KCAL</span>
        </div>
      </div>
    </div>
  </div>
);

/* ── Modal ─────────────────────────────────────────── */
const MacroBar = ({ label, value, max, color }) => (
  <div className="macro-item">
    <div className="macro-header"><span>{label}</span><span style={{ color }}>{value}g</span></div>
    <div className="macro-bar">
      <div className="macro-fill" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
    </div>
  </div>
);

const FoodModal = ({ food, onClose, dailyTarget }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="food-modal glass-card" onClick={e => e.stopPropagation()}>
      <div className="modal-header-nav">
        <span className="modal-title-pill">PROTEIN FOOD GUIDE</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="modal-content">
        <div className="modal-hero">
          <div className="modal-img-wrap">
            <img src={food.image} alt={food.name}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="modal-emoji-fb">{food.emoji || '🍽️'}</div>
          </div>
          <div className="modal-primary-meta">
            <h2 className="modal-food-name">{food.name}</h2>
            <div className="protein-summary-badge">
               {food.quantity} of {food.name} = <strong>{food.protein}g protein</strong>
            </div>
          </div>
        </div>

        <div className="modal-guide-grid">
           <div className="guide-box">
              <div className="guide-label">📏 HOW MUCH TO EAT</div>
              <p>{food.quantity || '1 portion'}</p>
           </div>
           <div className="guide-box">
              <div className="guide-label">🕒 BEST TIME TO EAT</div>
              <p>{food.bestTime || 'Any meal'}</p>
           </div>
        </div>

        <div className="modal-beginner-note">
           <div className="note-icon">💡</div>
           <p>
             "To reach your daily protein goal of {dailyTarget}g, you can eat {food.quantity} {food.name} in {food.bestTime?.split(',')[0] || 'your next meal'} which gives about <strong>{food.protein}g protein</strong>."
           </p>
        </div>

        <div className="modal-macros-section">
           <div className="section-title">NUTRITION BREAKDOWN</div>
           <div className="modal-macros">
              <MacroBar label="Protein"       value={food.protein} max={50}  color="var(--primary-color)" />
              <MacroBar label="Carbohydrates" value={food.carbs}   max={80}  color="var(--accent-color)"  />
              <MacroBar label="Fat"           value={food.fat}     max={40}  color="var(--secondary-color)" />
              <div className="calorie-footer">
                 <span>Total Energy: <strong>{Math.round(food.calories)} kcal</strong></span>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────── */
const Slide4 = ({ data }) => {
  const { goal, diet = 'vegetarian', proteinTarget = 120 } = data;
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeTab, setActiveTab]       = useState('foods');
  const [expandedMeal, setExpandedMeal] = useState(null);

  const goalId = goal?.id || 'maintenance';
  const foods  = useMemo(() => getRecommendedFoods(diet, goalId), [diet, goalId]);
  const meals  = useMemo(() => getMealPlan(data), [data]);

  const toggleMeal = (mealName) =>
    setExpandedMeal(prev => prev === mealName ? null : mealName);

  return (
    <div className="s4-container glass-card stagger-in">

      <div className="s4-header">
        <div className="s4-badges">
          <span className="badge-goal">{goal?.title || 'Standard'} Path</span>
          <span className="badge-diet">{DIET_LABELS[diet]}</span>
        </div>
        <h1 className="text-gradient">Professional Nutrition Plan</h1>
        
        <div className="protein-progress-banner glass-card">
           <div className="progress-top">
              <span className="progress-icon">🎯</span>
              <p>You need <strong>{proteinTarget}g</strong> protein daily to reach your goal.</p>
           </div>
           <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '65%' }}></div>
           </div>
           <p className="progress-hint">This plan is optimized to hit your target across 5 meals.</p>
        </div>
      </div>

      <div className="s4-tabs">
        <button className={`s4-tab ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>🥘 Food Database</button>
        <button className={`s4-tab ${activeTab === 'meals' ? 'active' : ''}`} onClick={() => setActiveTab('meals')}>📅 Daily Meal Flow</button>
      </div>

      {activeTab === 'foods' && (
        <div className="food-grid stagger-in">
          {foods.map((food, i) => <FoodCard key={i} food={food} onClick={setSelectedFood} />)}
        </div>
      )}

      {activeTab === 'meals' && (
        <div className="meal-list stagger-in">
          {meals.map((meal, i) => {
            const meta    = MEAL_META[meal.name] || { icon: '🍽️', color: '#00ff88', desc: '' };
            const isOpen  = expandedMeal === meal.name;
            const mealFoods = isOpen ? getMealFoods(meal.name, diet) : [];

            return (
              <div key={i} className={`meal-section ${isOpen ? 'open' : ''}`}>
                <div
                  className="meal-card glass-card"
                  onClick={() => toggleMeal(meal.name)}
                  style={isOpen ? { borderColor: meta.color, background: `${meta.color}08`, boxShadow: `0 0 40px ${meta.color}15` } : {}}
                >
                  <div className="meal-card-left">
                    <div className="m-icon-ring" style={{ color: meta.color, borderColor: `${meta.color}30` }}>{meta.icon}</div>
                    <div className="meal-card-info">
                      <p className="meal-card-name" style={isOpen ? { color: meta.color } : {}}>{meal.name}</p>
                      <div className="meal-card-time-wrap">
                        <span className="time-icon">🕒</span>
                        <p className="meal-card-time">{meal.time}</p>
                      </div>
                      <p className="meal-card-purpose">
                        <span className="purpose-tag" style={{ background: `${meta.color}20`, color: meta.color }}>PURPOSE</span>
                        {meal.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="meal-card-right">
                    <div className="meal-macros-summary">
                      <div className="macro-mini">P: <span>{meal.protein}g</span></div>
                      <div className="macro-mini">C: <span>{meal.carbs}g</span></div>
                      <div className="macro-mini">F: <span>{meal.fat}g</span></div>
                    </div>
                    <span className="meal-protein-val" style={{ color: meta.color }}>{meal.calories} kcal</span>
                    <span className="meal-chevron" style={isOpen ? { transform: 'rotate(180deg)', color: meta.color } : {}}>▾</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="meal-food-grid-wrap">
                    <div className="grid-header">
                      <p className="meal-food-grid-title" style={{ color: meta.color }}>
                        {meta.icon} Recommended Components
                      </p>
                    </div>
                    <div className="meal-food-grid">
                      {mealFoods.map((food, fi) => (
                        <MealFoodCard key={fi} food={food} onClick={setSelectedFood} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedFood && <FoodModal food={selectedFood} dailyTarget={proteinTarget} onClose={() => setSelectedFood(null)} />}

      <div className="s4-footer">
        <button className="btn-primary" onClick={() => alert('📊 Plan Exported to Profile!')} style={{ width: '100%' }}>
          Approve & Save Daily Workflow
        </button>
      </div>

      <style>{`
        .s4-container { max-width:1000px; width:100%; padding:48px 40px; }
        .s4-header { margin-bottom:32px; text-align: center; }
        .s4-badges { display:flex; gap:10px; justify-content: center; margin-bottom:16px; }
        .badge-goal { background: #fff; color: #000; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:800; text-transform:uppercase; }
        .badge-diet { background:rgba(0,255,136,0.1); color:var(--primary-color); border:1px solid var(--primary-color); padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:800; }
        .s4-header h1 { font-size:2.2rem; margin-bottom:8px; }
        
        .protein-progress-banner { margin: 24px auto; padding: 20px; max-width: 600px; text-align: left; background: rgba(0, 255, 136, 0.03); border-color: rgba(0, 255, 136, 0.2); border-radius: 20px; }
        .progress-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .progress-icon { font-size: 1.5rem; }
        .progress-top p { font-size: 1rem; color: #fff; }
        .progress-bar-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
        .progress-bar-fill { height: 100%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow); }
        .progress-hint { font-size: 0.75rem; color: var(--text-dim); }

        .s4-tabs { display:flex; gap:12px; margin-bottom:32px; justify-content: center; }
        .s4-tab { padding:12px 28px; border-radius:14px; border:1px solid var(--surface-border); background:rgba(255,255,255,0.02); color:var(--text-dim); font-size:0.95rem; font-weight:700; cursor:pointer; transition:var(--transition-smooth); }
        .s4-tab.active { background:var(--primary-color); border-color:var(--primary-color); color:#000; box-shadow: 0 4px 15px var(--primary-glow); }
        .s4-tab:hover:not(.active) { background:rgba(255,255,255,0.05); transform: translateY(-2px); }

        .food-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:24px; margin-bottom:40px; }
        .food-card { cursor:pointer; overflow:hidden; border-radius:28px; display: flex; flex-direction: column; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(15, 23, 42, 0.2) !important; border: 1px solid rgba(255,255,255,0.05); }
        .food-card:hover { transform:translateY(-10px); border-color:var(--primary-color); box-shadow: 0 15px 40px rgba(0, 255, 136, 0.1); }
        .food-img-wrap { position:relative; height:180px; background:#000; overflow: hidden; }
        .food-img-wrap img { width:100%; height:100%; object-fit:cover; transition:0.6s ease; }
        .food-card:hover .food-img-wrap img { transform:scale(1.1); }
        .food-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:900; color:var(--primary-color); opacity:0; transition:0.3s; backdrop-filter: blur(4px); }
        .food-card:hover .food-overlay { opacity:1; }
        
        .food-card-body { padding:24px; flex: 1; display: flex; flex-direction: column; }
        .food-name { font-size:1.25rem; font-weight:800; text-transform:capitalize; margin-bottom:16px; color: #fff; }
        
        .food-macros-row { display:flex; gap:10px; margin-bottom:16px; }
        .mac-pill { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding: 8px 4px; 
          border-radius: 12px; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.05); 
        }
        
        .mac-pill .m-val { font-size: 1rem; font-weight: 800; line-height: 1.2; }
        .mac-pill .m-lbl { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.5px; margin-top: 2px; }
        
        .mac-pill.protein { border-color: rgba(0, 255, 136, 0.3); background: rgba(0, 255, 136, 0.05); }
        .mac-pill.protein .m-val { color: var(--primary-color); }
        
        .mac-pill.carbs { border-color: rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.05); }
        .mac-pill.carbs .m-val { color: #3b82f6; }
        
        .mac-pill.cals { border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.05); }
        .mac-pill.cals .m-val { color: #f59e0b; }

        .qty-badge { font-size:0.8rem; color:var(--text-dim); font-weight:700; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: auto; }

        .meal-list { display:flex; flex-direction:column; gap:14px; margin-bottom:40px; }
        .meal-section { display:flex; flex-direction:column; }
        .meal-card { display:flex; align-items:center; justify-content:space-between; padding:22px 30px; border-radius:20px; cursor:pointer; transition:var(--transition-smooth); gap:20px; }
        .meal-card:hover { transform:translateX(8px); background: rgba(255,255,255,0.03); }
        .meal-section.open .meal-card { border-radius:20px 20px 0 0; }
        .meal-card-left { display:flex; align-items:center; gap:24px; flex:1; }
        .m-icon-ring { width: 56px; height: 56px; border-radius: 50%; border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; background: rgba(255,255,255,0.02); transition: transform 0.4s; }
        .meal-section.open .m-icon-ring { transform: scale(1.1) rotate(10deg); }
        .meal-card-name { font-size:1.25rem; font-weight:800; margin-bottom:6px; }
        .meal-card-time-wrap { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .time-icon { font-size: 0.9rem; opacity: 0.8; }
        .meal-card-time { font-size:0.85rem; color:var(--primary-color); font-weight:700; letter-spacing: 0.5px; }
        .meal-card-purpose { font-size:0.85rem; color:var(--text-dim); line-height: 1.4; display: flex; align-items: flex-start; gap: 10px; }
        .purpose-tag { font-size: 0.65rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
        .meal-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
        .meal-macros-summary { display: flex; gap: 8px; margin-bottom: 4px; }
        .macro-mini { font-size: 0.65rem; color: var(--text-dim); font-weight: 700; text-transform: uppercase; }
        .macro-mini span { color: #fff; }
        .meal-protein-val { font-size:1.4rem; font-weight:900; line-height:1; }
        .meal-protein-lbl { font-size:0.65rem; font-weight:800; color:var(--text-dim); letter-spacing:1px; }

        .meal-food-grid-wrap { background:rgba(255,255,255,0.02); border:1px solid var(--surface-border); border-top:none; border-radius:0 0 20px 20px; padding:24px; }
        .meal-food-grid-title { font-size:0.85rem; font-weight:800; text-transform:uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .meal-food-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }

        .mf-card { background:rgba(255,255,255,0.04); border:1px solid var(--surface-border); border-radius:16px; overflow:hidden; transition:var(--transition-smooth); cursor: pointer; }
        .mf-card:hover { transform:translateY(-4px); border-color:var(--primary-color); }
        .mf-img-wrap { position:relative; height:100px; background:rgba(0,0,0,0.1); overflow: hidden; }
        .mf-img-wrap img { width:100%; height:100%; object-fit:cover; transition: 0.4s; }
        .mf-card:hover .mf-img-wrap img { transform: scale(1.1); }
        .mf-overlay { position: absolute; inset: 0; background: rgba(0, 255, 136, 0.4); color: #000; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; opacity: 0; transition: 0.3s; }
        .mf-card:hover .mf-overlay { opacity: 1; }
        .mf-body { padding:12px; }
        .mf-name { font-size:0.85rem; font-weight:800; text-transform:capitalize; margin-bottom:8px; }
        .mf-macros { display:flex; flex-direction: column; gap:4px; }
        .mf-mac { font-size:0.65rem; font-weight:800; }
        .mf-mac.p-tag { color: var(--primary-color); }
        .mf-mac.k-tag { color: var(--text-dim); }

        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.9); backdrop-filter:blur(20px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
        .food-modal { max-width:550px; width:100%; position:relative; overflow:hidden; border-radius:32px; border-color: rgba(255,255,255,0.1); background: #0a0a0c; }
        .modal-header-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .modal-title-pill { font-size: 0.7rem; font-weight: 900; color: var(--primary-color); letter-spacing: 2px; }
        .close-btn { background: none; border: none; font-size: 2rem; color: #fff; cursor: pointer; opacity: 0.5; transition: 0.3s; }
        .close-btn:hover { opacity: 1; transform: rotate(90deg); }
        
        .modal-content { padding: 30px; }
        .modal-hero { display:flex; gap:24px; align-items:center; margin-bottom: 30px; }
        .modal-img-wrap { position:relative; width:110px; height:110px; flex-shrink:0; border-radius:20px; overflow:hidden; border: 1px solid rgba(255,255,255,0.1); }
        .modal-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .modal-food-name { font-size:1.8rem; font-weight:900; text-transform:capitalize; margin-bottom:4px; }
        .protein-summary-badge { font-size: 0.9rem; color: var(--text-dim); }
        .protein-summary-badge strong { color: var(--primary-color); }

        .modal-guide-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .guide-box { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .guide-label { font-size: 0.65rem; font-weight: 900; color: var(--text-dim); margin-bottom: 8px; letter-spacing: 1px; }
        .guide-box p { font-size: 1rem; color: #fff; font-weight: 700; }

        .modal-beginner-note { background: linear-gradient(to right, rgba(139, 92, 246, 0.1), transparent); padding: 20px; border-radius: 16px; border-left: 4px solid var(--accent-color); margin-bottom: 30px; display: flex; gap: 15px; align-items: center; }
        .note-icon { font-size: 1.5rem; }
        .modal-beginner-note p { font-size: 0.95rem; line-height: 1.5; color: #ddd; }
        .modal-beginner-note strong { color: var(--primary-color); }

        .modal-macros-section { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; }
        .section-title { font-size: 0.7rem; font-weight: 900; color: var(--text-dim); margin-bottom: 20px; letter-spacing: 1px; }
        .modal-macros { display: flex; flex-direction: column; gap: 15px; }
        .calorie-footer { text-align: right; font-size: 0.85rem; color: var(--text-dim); margin-top: 5px; }
        .calorie-footer strong { color: #facc15; }

        @media (max-width:640px) {
          .s4-container { padding:24px 20px; }
          .food-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
          .meal-card { padding:15px; flex-direction: column; align-items: flex-start; }
          .meal-card-right { flex-direction: row; width: 100%; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
          .modal-hero { flex-direction: column; text-align: center; }
          .modal-guide-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Slide4;
