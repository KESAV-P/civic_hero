'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'admin'
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Language
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [language, setLanguage] = useState('English');

    // Admin state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    if (!isOpen) return null;

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (phone.length === 10) {
            setStep(2);
        } else {
            alert('Please enter a valid 10-digit mobile number.');
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp === '1234') {
            setStep(3);
        } else {
            alert('Invalid OTP. Use 1234 for demo.');
        }
    };

    // Citizen Login Final Step
    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        localStorage.setItem('user', JSON.stringify({ phone, role: 'citizen', language: lang }));
        onClose();
        router.push('/dashboard');
    };

    // Admin Login Logic
    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@civic.com' && password === 'admin123') {
            localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
            onClose();
            router.push('/admin/dashboard');
        } else {
            alert('Invalid Credentials! Try admin@civic.com / admin123');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in card">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="login-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'citizen' ? 'active' : ''}`}
                        onClick={() => setActiveTab('citizen')}
                    >
                        Citizen
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Admin
                    </button>
                </div>

                {activeTab === 'citizen' ? (
                    <>
                        {step === 1 && (
                            <form onSubmit={handlePhoneSubmit}>
                                <h2>Citizen Login</h2>
                                <p className="subtitle">Enter your mobile number to continue.</p>
                                <div className="form-group">
                                    <label className="form-label">Mobile Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        maxLength="10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="e.g. 9876543210"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Send OTP</button>
                                <p className="spam-notice">We verify numbers to ensure accountability.</p>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleOtpSubmit}>
                                <h2>Verify Mobile Number</h2>
                                <p className="subtitle">Enter the OTP sent to +91 {phone}</p>
                                <div className="form-group">
                                    <label className="form-label">One-Time Password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        maxLength="4"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP (use 1234)"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Verify</button>
                                <button type="button" className="btn-link" onClick={() => setStep(1)}>Go Back</button>
                            </form>
                        )}

                        {step === 3 && (
                            <div>
                                <h2>Select Language</h2>
                                <div className="language-grid">
                                    {['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu'].map((lang) => (
                                        <button
                                            key={lang}
                                            className={`btn btn-outline ${language === lang ? 'active' : ''}`}
                                            onClick={() => handleLanguageSelect(lang)}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleAdminLogin}>
                        <h2>Admin Login</h2>
                        <p className="subtitle">Secure access for government officials.</p>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@civic.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="admin123"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Login to Dashboard</button>
                    </form>
                )}
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(5px);
        }
        .modal-content {
          width: 90%; max-width: 400px; position: relative; padding: 2rem;
          background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .close-btn {
          position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;
        }
        .login-tabs {
          display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 2rem;
        }
        .tab-btn {
          flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 600; color: #64748b; cursor: pointer;
          border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s;
        }
        .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
        
        .w-full { width: 100%; }
        .subtitle { color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .language-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .btn-link { background: none; border: none; color: var(--primary); margin-top: 1rem; cursor: pointer; display: block; width: 100%; }
      `}</style>
        </div>
    );
}
