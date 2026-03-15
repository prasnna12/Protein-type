import React from 'react';

const SlideTips = ({ next }) => {
  const sections = [
    {
      title: "🥩 Protein Guide",
      color: "#ef4444",
      tips: [
        "Aim for 1.6g - 2.2g of protein per kg of body weight for muscle growth.",
        "Distribute protein intake evenly across 4-5 meals throughout the day.",
        "Focus on high-quality sources like Whey, Soy, Eggs, and Chicken."
      ]
    },
    {
      title: "🏋️ Fitness Tips",
      color: "#3b82f6",
      tips: [
        "Consistency is key: stick to your workout plan for at least 12 weeks.",
        "Prioritize 7-8 hours of quality sleep for muscle recovery.",
        "Stay hydrated: drink at least 3-4 liters of water daily."
      ]
    },
    {
      title: "🥗 Healthy Eating",
      color: "#10b981",
      tips: [
        "Include a variety of vegetables to get essential micronutrients.",
        "Avoid processed sugars and favor complex carbohydrates like Oats and Brown Rice.",
        "Don't skip healthy fats: Walnuts, Almonds, and Olive Oil are great sources."
      ]
    }
  ];

  return (
    <div className="slide-tips glass-card">
      <div className="tips-header">
        <h1 className="text-gradient">Fitness & Protein Guide</h1>
        <p className="subtitle">Master your physique with these AI-curated expert insights.</p>
      </div>

      <div className="tips-grid">
        {sections.map((section, idx) => (
          <div key={idx} className="tip-card glass-card">
            <h3 style={{ color: section.color }}>{section.title}</h3>
            <ul>
              {section.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={next} style={{ width: '100%', marginTop: '30px' }}>
        Next: Your Personal Strategy →
      </button>

      <style>{`
        .slide-tips { max-width: 900px; width: 100%; padding: 48px; }
        .tips-header { text-align: center; margin-bottom: 40px; }
        .tips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
        .tip-card { padding: 30px; text-align: left; background: rgba(255,255,255,0.02) !important; }
        .tip-card h3 { font-size: 1.2rem; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .tip-card ul { list-style: none; padding: 0; }
        .tip-card li { 
          font-size: 0.9rem; 
          color: var(--text-dim); 
          margin-bottom: 12px; 
          line-height: 1.5; 
          position: relative; 
          padding-left: 20px;
        }
        .tip-card li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--primary-color);
        }
        @media (max-width: 600px) {
          .slide-tips { padding: 30px 20px; }
          .tips-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default SlideTips;
