export default function HelpPage() {
    return (
        <div className="help-container container animate-fade-in">
            <h1>Profile & Help</h1>

            <div className="grid-layout">
                <section className="profile-section card">
                    <h2>Your Profile</h2>
                    <div className="profile-details">
                        <div className="avatar">A</div>
                        <div>
                            <h3>Arsheer (Citizen)</h3>
                            <p>📍 Indiranagar, Bangalore</p>
                            <p>📞 +91 98765 43210</p>
                            <button className="btn btn-outline btn-sm">Edit Profile</button>
                        </div>
                    </div>
                    <div className="settings">
                        <div className="setting-item">
                            <label>Language</label>
                            <select className="form-control" defaultValue="English">
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Kannada</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>Notifications</label>
                            <input type="checkbox" defaultChecked /> Enable SMS Alerts
                        </div>
                    </div>
                </section>

                <section className="faq-section card">
                    <h2>Frequently Asked Questions</h2>
                    <details>
                        <summary>How do I report a pothole?</summary>
                        <p>Simply go to the dashboard, click 'New Complaint', select 'Pothole', capture the location, and submit.</p>
                    </details>
                    <details>
                        <summary>How long does it take to resolve?</summary>
                        <p>Most road issues are resolved within 48-72 hours depending on severity.</p>
                    </details>
                    <details>
                        <summary>Can I report anonymously?</summary>
                        <p>We require a mobile number for accountability, but your identity is kept confidential from the public.</p>
                    </details>
                    <details>
                        <summary>What if I don't know the department?</summary>
                        <p>No problem! Our system automatically routes your complaint to the correct department based on the issue type.</p>
                    </details>
                </section>
            </div>

            <style jsx>{`
        .help-container { padding-top: 2rem; padding-bottom: 4rem; }
        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
        @media (min-width: 768px) { .grid-layout { grid-template-columns: 1fr 2fr; } }
        
        .profile-details { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; }
        .avatar { 
          width: 64px; height: 64px; 
          background: var(--primary); color: white; 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
          font-size: 1.5rem; font-weight: bold;
        }
        .setting-item { margin-bottom: 1rem; }
        
        details { padding: 1rem 0; border-bottom: 1px solid #e2e8f0; cursor: pointer; }
        summary { font-weight: 600; color: #1e293b; }
        details p { margin-top: 0.5rem; color: #64748b; }
      `}</style>
        </div>
    );
}
