'use client';
import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState('citizen');

  const openLogin = (tab) => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  return (
    <main className="min-h-screen">
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">
            Civic Hero
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline" onClick={() => openLogin('citizen')}>Login</button>
            <button className="btn btn-primary" onClick={() => openLogin('citizen')}>Sign Up</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content animate-fade-in">
          <h1>Your Voice, Your City.</h1>
          <p className="hero-subtitle">
            Report civic issues in seconds. From potholes to streetlights,
            we connect you directly to the right department.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large" onClick={() => openLogin('citizen')}>
              Start Reporting Now
            </button>
            <button className="btn btn-outline btn-large" onClick={() => openLogin('admin')}>
              Admin Login
            </button>
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="feature-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="icon">📍</div>
          <h3>Snap & Report</h3>
          <p>Take a photo, select the issue. We capture the location automatically.</p>
        </div>
        <div className="feature-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="icon">⚡</div>
          <h3>Auto-Routing</h3>
          <p>Our intelligent system sends your report to the exact department instanty.</p>
        </div>
        <div className="feature-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="icon">📊</div>
          <h3>Track Status</h3>
          <p>Watch your complaint move from 'Submitted' to 'Resolved' in real-time.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Civic Hero. Transforming Governance.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help & FAQs</a>
          </div>
        </div>
      </footer>

      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} initialTab={loginTab} />}

      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: var(--header-height);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        .logo {
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          padding: 4rem 1rem;
        }
        h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #f1f5f9 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.05em;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 4rem 1rem;
        }
        .feature-card {
          background: white;
          color: #1e293b;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          transition: transform 0.2s;
          border: 1px solid #f1f5f9;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        .icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: #eff6ff;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .footer {
          background: #f8fafc;
          padding: 3rem 0;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #64748b;
        }
        .footer-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem; }
          .hero-cta { flex-direction: column; }
          .nav-actions { 
            display: none; /* In a real mobile app, this would be a hamburger menu */
          } 
          /* For demo purposes, we'll show a simple login button on mobile if needed, 
             but typically you'd have a mobile nav. For now, let's keep the main actions visible on the hero. */
        }
      `}</style>
    </main>
  );
}
