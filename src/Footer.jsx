import React from 'react';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Footer = () => (
  <footer style={{
    width: '100%',
    background: '#020617',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    boxSizing: 'border-box',
  }}>
    {/* Description + Icons Row */}
    <div className="f-main">
      <div className="f-desc-wrap">
        <p className="f-desc-text">
          Protein.in AI is an intelligent fitness and nutrition web application that helps users analyze
          their physique and choose fitness goals like Bulk, Lean Bulk, Cut, Fat Loss, or Maintenance.
          Based on the selected goal, the system calculates daily protein needs and suggests suitable
          meal plans with detailed nutrition information including protein, carbohydrates, and calories.
        </p>
      </div>
      <div className="f-icons">
        <a
          href="https://www.instagram.com/prasnna.fitness"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          className="f-icon f-icon-ig"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://youtube.com/@prasnnamahanta20"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Subscribe on YouTube"
          className="f-icon f-icon-yt"
        >
          <YouTubeIcon />
        </a>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="f-bottom">
      <div className="f-divider" />
      <p className="f-copy">© 2026 Protein.in AI. All Rights Reserved.</p>
    </div>

    <style>{`
      .f-main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 36px 40px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        box-sizing: border-box;
      }
      .f-desc-wrap { flex: 1; }
      .f-desc-text {
        font-size: 0.82rem;
        color: #9ca3af;
        line-height: 1.8;
        max-width: 760px;
        margin: 0 auto;
        text-align: center;
      }
      .f-icons {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }

      /* Base icon — premium look */
      .f-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      /* Instagram — premium pink/purple glow */
      .f-icon-ig {
        color: rgba(225, 48, 108, 0.82);
        border: 1px solid rgba(225, 48, 108, 0.3);
        background: rgba(225, 48, 108, 0.04);
        box-shadow: 
          0 0 12px rgba(225, 48, 108, 0.15),
          inset 0 0 12px rgba(225, 48, 108, 0.05);
        animation: igPulse 3s ease-in-out infinite;
      }
      .f-icon-ig:hover {
        color: #e1306c;
        border-color: rgba(225, 48, 108, 0.8);
        background: rgba(225, 48, 108, 0.15);
        transform: scale(1.1) translateY(-3px);
        box-shadow: 
          0 0 25px rgba(225, 48, 108, 0.6),
          0 0 50px rgba(225, 48, 108, 0.25),
          inset 0 0 15px rgba(225, 48, 108, 0.15);
      }
      .f-icon-ig::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(225, 48, 108, 0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .f-icon-ig:hover::after { opacity: 1; }

      /* YouTube — premium red glow */
      .f-icon-yt {
        color: rgba(255, 32, 32, 0.82);
        border: 1px solid rgba(255, 32, 32, 0.3);
        background: rgba(255, 32, 32, 0.04);
        box-shadow: 
          0 0 12px rgba(255, 32, 32, 0.15),
          inset 0 0 12px rgba(255, 32, 32, 0.05);
        animation: ytPulse 3s ease-in-out infinite 1.5s;
      }
      .f-icon-yt:hover {
        color: #ff2020;
        border-color: rgba(255, 32, 32, 0.8);
        background: rgba(255, 32, 32, 0.15);
        transform: scale(1.1) translateY(-3px);
        box-shadow: 
          0 0 25px rgba(255, 32, 32, 0.6),
          0 0 50px rgba(255, 32, 32, 0.25),
          inset 0 0 15px rgba(255, 32, 32, 0.15);
      }
      .f-icon-yt::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 32, 32, 0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .f-icon-yt:hover::after { opacity: 1; }

      /* premium breathing pulse animations */
      @keyframes igPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(225,48,108,0.15), inset 0 0 8px rgba(225,48,108,0.05); }
        50%       { box-shadow: 0 0 20px rgba(225,48,108,0.35), inset 0 0 12px rgba(225,48,108,0.1); }
      }
      @keyframes ytPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(255,32,32,0.15), inset 0 0 8px rgba(255,32,32,0.05); }
        50%       { box-shadow: 0 0 20px rgba(255,32,32,0.35), inset 0 0 12px rgba(255,32,32,0.1); }
      }

      /* Bottom */
      .f-bottom {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 40px 20px;
        box-sizing: border-box;
      }
      .f-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        margin-bottom: 14px;
      }
      .f-copy {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.25);
        text-align: center;
        letter-spacing: 0.3px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .f-main {
          flex-direction: column;
          align-items: center;
          padding: 28px 24px 20px;
          gap: 20px;
        }
        .f-desc-text { text-align: center; }
        .f-bottom { padding: 0 24px 16px; }
      }
      @media (max-width: 480px) {
        .f-main { padding: 24px 16px 16px; }
        .f-bottom { padding: 0 16px 14px; }
        .f-desc-text { font-size: 0.78rem; }
        .f-icon { width: 44px; height: 44px; }
        .f-icon svg { width: 24px; height: 24px; }
      }
    `}</style>
  </footer>
);

export default Footer;
