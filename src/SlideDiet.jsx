import { useState } from 'react';

const SlideDiet = ({ next, setData }) => {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="diet-svg-icon veg-icon">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
      desc: 'Plant-based proteins — paneer, tofu, soya chunks, lentils, legumes and dairy products.',
      color: '#22c55e',
      glow: 'rgba(34,197,94,0.15)',
      border: 'rgba(34,197,94,0.5)',
    },
    {
      id: 'non_vegetarian',
      label: 'Non-Vegetarian',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="diet-svg-icon nonveg-icon">
          <path d="m20.536 8.464-9.071 9.071a6.414 6.414 0 0 1-9.072-9.071L11.464 3.929a6.414 6.414 0 0 1 9.072 4.535Z"/>
          <path d="M16 8 8 16"/>
          <path d="M12.5 15.5 11 17"/>
          <path d="M15.5 12.5 17 11"/>
        </svg>
      ),
      desc: 'High-quality animal proteins — chicken, eggs, fish, lean meat, turkey and dairy.',
      color: '#f97316',
      glow: 'rgba(249,115,22,0.15)',
      border: 'rgba(249,115,22,0.5)',
    },
  ];

  const handleContinue = () => {
    if (!selected) return;
    setData(prev => ({ ...prev, diet: selected }));
    next();
  };

  return (
    <div className="diet-container glass-card stagger-in">
      <div className="diet-header">
        <h1 className="text-gradient">Choose Your Diet Type</h1>
        <p className="diet-subtitle">
          We'll personalize your food database and meal recommendations based on your dietary preference.
        </p>
      </div>

      <div className="diet-options stagger-in">
        {options.map(opt => (
          <div
            key={opt.id}
            className={`diet-card glass-card ${selected === opt.id ? 'active' : ''}`}
            style={selected === opt.id ? {
              borderColor: opt.border,
              background: opt.glow,
              boxShadow: `0 0 40px ${opt.glow}`,
            } : {}}
            onClick={() => setSelected(opt.id)}
          >
            {selected === opt.id && (
              <div className="check-mark-badge" style={{ background: opt.color }}>✓</div>
            )}
            <div className="diet-glow-bg" style={{ background: opt.glow }}></div>
            <div className="diet-emoji-box" style={{ borderColor: selected === opt.id ? opt.border : 'transparent' }}>
              <span className="diet-icon-wrapper">{opt.icon}</span>
            </div>
            <h2 className="diet-label" style={selected === opt.id ? { color: opt.color } : {}}>
              {opt.label}
            </h2>
            <p className="diet-desc">{opt.desc}</p>
          </div>
        ))}
      </div>

      <div className="diet-footer">
        <div className="selection-hint">
          {selected ? (
            <span style={{color: options.find(o => o.id === selected).color}}>
              {selected === 'vegetarian' ? 'Plant-based logic enabled' : 'Animal protein logic enabled'}
            </span>
          ) : 'Please select your preference' }
        </div>
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={!selected}
          style={!selected ? { opacity: 0.4 } : { width: '220px' }}
        >
          Continue Selection →
        </button>
      </div>

      <style>{`
        .diet-container {
          max-width: 860px;
          width: 100%;
          padding: 48px 40px;
        }
        .diet-header { text-align: center; margin-bottom: 40px; }
        .diet-header h1 { font-size: 2rem; }
        .diet-subtitle { color: var(--text-dim); font-size: 0.95rem; max-width: 500px; margin: 10px auto 0; line-height: 1.6; }

        .diet-options { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
        .diet-card {
          position: relative;
          padding: 48px 32px;
          border-radius: 28px;
          cursor: pointer;
          text-align: center;
          overflow: hidden;
          transition: var(--transition-smooth);
        }
        .diet-card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.15); }
        .diet-card.active { transform: translateY(-8px); }
        
        .diet-glow-bg {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          filter: blur(40px);
          top: -20px;
          right: -20px;
          opacity: 0.5;
          z-index: 0;
        }

        .check-mark-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 900;
          font-size: 0.85rem;
          z-index: 2;
        }

        .diet-emoji-box {
          width: 90px;
          height: 90px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          transition: var(--transition-smooth);
          z-index: 1;
          position: relative;
        }
        .diet-card:hover .diet-emoji-box { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
        
        .diet-icon-wrapper svg.diet-svg-icon {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .veg-icon { color: #22c55e; filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4)); }
        .nonveg-icon { color: #f97316; filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4)); }
        
        .diet-card:hover .veg-icon { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.8)); }
        .diet-card:hover .nonveg-icon { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.8)); }
        
        .diet-label { font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; transition: color 0.3s; }
        .diet-desc { font-size: 0.9rem; color: var(--text-dim); line-height: 1.6; }

        .diet-footer { display: flex; justify-content: space-between; align-items: center; }
        .selection-hint { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; }

        @media (max-width: 640px) {
          .diet-options { grid-template-columns: 1fr; gap: 16px; }
          .diet-container { padding: 32px 20px; }
          .diet-footer { flex-direction: column; gap: 24px; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default SlideDiet;
