import { useState } from 'react';
import imgVeg from './assets/diet-veg.png';
import imgNonVeg from './assets/diet-nonveg.png';

const SlideDiet = ({ next, setData }) => {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      img: imgVeg,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
      desc: 'Plant-based proteins — paneer, tofu, soya chunks, lentils, legumes and dairy products.',
      theme: 'veg-theme',
      accent: '#00FF9D'
    },
    {
      id: 'non_vegetarian',
      label: 'Non-Vegetarian',
      img: imgNonVeg,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m20.536 8.464-9.071 9.071a6.414 6.414 0 0 1-9.072-9.071L11.464 3.929a6.414 6.414 0 0 1 9.072 4.535Z"/>
          <path d="M16 8 8 16"/>
        </svg>
      ),
      desc: 'High-quality animal proteins — chicken, eggs, fish, lean meat, turkey and dairy.',
      theme: 'nonveg-theme',
      accent: '#FF4D4D'
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
            className={`diet-visual-card glass-card ${opt.theme} ${selected === opt.id ? 'active' : ''}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="diet-card-img-wrap">
              <img src={opt.img} alt={opt.label} className="diet-hero-img" />
              <div className="diet-card-overlay"></div>
              {selected === opt.id && <div className="diet-select-check">✓</div>}
            </div>
            
            <div className="diet-card-content">
              <div className="diet-title-row">
                <div className="diet-mini-icon">{opt.icon}</div>
                <h2>{opt.label}</h2>
              </div>
              <p>{opt.desc}</p>
              <div className="diet-accent-bar" style={{ background: opt.accent }}></div>
            </div>
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
          max-width: 950px;
          width: 100%;
          padding: 48px 40px;
        }
        .diet-header { text-align: center; margin-bottom: 50px; }
        .diet-header h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 12px; }
        .diet-subtitle { color: var(--text-dim); font-size: 1.05rem; max-width: 550px; margin: 0 auto; line-height: 1.6; }

        .diet-options { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        
        .diet-visual-card {
           padding: 0;
           cursor: pointer;
           border-radius: 28px;
           overflow: hidden;
           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
           background: rgba(15, 23, 42, 0.3) !important;
           border: 1px solid rgba(255,255,255,0.05);
           position: relative;
        }
        
        .diet-card-img-wrap {
          height: 220px;
          position: relative;
          overflow: hidden;
        }
        
        .diet-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .diet-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(2, 6, 23, 0.9));
        }

        .diet-visual-card:hover {
          transform: translateY(-10px);
          border-color: rgba(255,255,255,0.2);
        }
        .diet-visual-card:hover .diet-hero-img { transform: scale(1.1); }

        .diet-visual-card.active {
          transform: translateY(-10px);
        }
        
        .veg-theme.active { border-color: #00FF9D; box-shadow: 0 10px 30px rgba(0, 255, 157, 0.2); }
        .nonveg-theme.active { border-color: #FF4D4D; box-shadow: 0 10px 30px rgba(255, 77, 77, 0.2); }

        .diet-select-check {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 28px;
          height: 28px;
          background: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 900;
          z-index: 2;
          box-shadow: 0 0 15px var(--primary-glow);
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .diet-card-content {
           padding: 24px 30px 30px;
           position: relative;
        }
        
        .diet-title-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 12px;
        }
        
        .diet-mini-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .veg-theme .diet-mini-icon { color: #00FF9D; }
        .nonveg-theme .diet-mini-icon { color: #FF4D4D; }
        
        .diet-card-content h2 { font-size: 1.5rem; font-weight: 800; color: #fff; }
        .diet-card-content p { color: var(--text-dim); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; }
        
        .diet-accent-bar {
          height: 3px;
          width: 40px;
          border-radius: 10px;
          transition: width 0.4s ease;
        }
        .diet-visual-card.active .diet-accent-bar { width: 100%; }

        .diet-footer { display: flex; justify-content: space-between; align-items: center; }
        .selection-hint { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-dim); }

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
