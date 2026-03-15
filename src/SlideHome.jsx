import React, { useRef } from 'react';

const SlideHome = ({ next, setData, onLoginRequired, user }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // VALIDATION: Type (JPG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, or WEBP).");
      e.target.value = '';
      return;
    }

    // VALIDATION: Size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size allowed is 5MB.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setData(prev => ({ ...prev, photo: event.target.result }));
      next(); // Move to Profile Slide after upload
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    if (!user) {
      onLoginRequired();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="slide-home glass-card">
      <div className="hero-content">
        <div className="badge-featured">AI-POWERED FITNESS</div>
        <h1 className="hero-main-title">
          <span className="text-gradient">Protein.in AI</span>
        </h1>
        <p className="hero-subtitle">
          AI Powered Body Analysis and Nutrition Guide
        </p>

        <div className="upload-cta-wrap">
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            onChange={handleImageUpload} 
            accept="image/*" 
          />
          <button className="btn-primary upload-btn" onClick={handleUploadClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Upload Your Photo
          </button>
        </div>

        <div className="fitness-info-section glass-card">
          <div className="info-item">
            <span className="info-icon">🥩</span>
            <p>Protein is essential for building muscle and repairing body tissues.</p>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <p>Regular workouts improve strength, stamina, and overall health.</p>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <p>A balanced diet with proper protein intake helps you achieve your fitness goals faster.</p>
          </div>
        </div>

        <div className="home-footer-icons">
          <div className="icon-badge">
             <div className="ib-icon">🥗</div>
             <span>Healthy Diet</span>
          </div>
          <div className="icon-badge">
             <div className="ib-icon">💪</div>
             <span>Workout</span>
          </div>
          <div className="icon-badge">
             <div className="ib-icon">📊</div>
             <span>Analysis</span>
          </div>
        </div>
      </div>

      <style>{`
        .slide-home {
          max-width: 900px;
          width: 100%;
          padding: 60px 40px;
          text-align: center;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(6, 182, 212, 0.05) 100%) !important;
          position: relative;
          overflow: hidden;
        }
        
        .slide-home::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop') center/cover;
          opacity: 0.1;
          filter: grayscale(1);
          z-index: -1;
        }

        .badge-featured {
          display: inline-block;
          background: rgba(6, 182, 212, 0.1);
          color: var(--primary-color);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 16px;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .hero-main-title { margin-bottom: 8px; }
        
        .hero-subtitle {
          font-size: 1.5rem;
          color: var(--text-dim);
          font-weight: 600;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }

        .upload-cta-wrap {
          margin-bottom: 48px;
        }

        .upload-btn {
          padding: 20px 50px;
          font-size: 1.2rem;
          box-shadow: 0 10px 40px var(--primary-glow);
        }

        .fitness-info-section {
          background: rgba(255, 255, 255, 0.02) !important;
          padding: 30px;
          text-align: left;
          margin-bottom: 48px;
          border-color: rgba(6, 182, 212, 0.1);
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item:last-child { margin-bottom: 0; }
        
        .info-icon { font-size: 1.4rem; line-height: 1; }
        .info-item p {
          font-size: 0.95rem;
          color: var(--text-dim);
          line-height: 1.5;
        }

        .home-footer-icons {
          display: flex;
          justify-content: center;
          gap: 40px;
          border-top: 1px solid rgba(6, 182, 212, 0.1);
          padding-top: 32px;
        }

        .icon-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .ib-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: 0.3s;
        }
        .icon-badge:hover .ib-icon {
          background: var(--primary-color);
          transform: translateY(-5px);
          color: #000;
        }
        .icon-badge span {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .slide-home { padding: 40px 20px; }
          .hero-subtitle { font-size: 1.2rem; }
          .home-footer-icons { gap: 20px; }
          .icon-badge span { font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
};

export default SlideHome;
