'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { complaints } from '@/utils/mockData';

export default function Dashboard() {
    const [userComplaints, setUserComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        // Simulating API fetch
        const data = complaints;
        setUserComplaints(data);

        // Calculate stats
        setStats({
            total: data.length,
            pending: data.filter(c => c.status !== 'Resolved').length,
            resolved: data.filter(c => c.status === 'Resolved').length
        });
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'status-resolved';
            case 'In Progress': return 'status-inprogress';
            default: return 'status-pending';
        }
    };

    return (
        <div className="dashboard-container container">
            <header className="dashboard-header animate-fade-in">
                <div>
                    <h1>Civic Dashboard</h1>
                    <p className="subtitle">Track and manage your community reports effectively.</p>
                </div>
                <Link href="/dashboard/report" className="btn btn-primary animate-pulse-glow">
                    <span className="icon">+</span> New Report
                </Link>
            </header>

            {/* Quick Stats Section */}
            <div className="stats-grid animate-fade-in delay-100">
                <div className="stat-card card">
                    <h3>Total Reports</h3>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card card">
                    <h3>Active Issues</h3>
                    <div className="stat-value text-accent">{stats.pending}</div>
                </div>
                <div className="stat-card card">
                    <h3>Resolved</h3>
                    <div className="stat-value text-success">{stats.resolved}</div>
                </div>
            </div>

            <h2 className="section-title animate-fade-in delay-200">Recent Activity</h2>

            <div className="complaint-list">
                {userComplaints.length === 0 ? (
                    <div className="empty-state card animate-fade-in delay-300">
                        <div className="empty-icon">📝</div>
                        <h3>No complaints yet</h3>
                        <p>Be a civic hero! Report your first issue today.</p>
                        <Link href="/dashboard/report" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                            Report Issue
                        </Link>
                    </div>
                ) : (
                    userComplaints.map((complaint, index) => (
                        <div
                            key={complaint.id}
                            className="complaint-card card animate-slide-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="card-content">
                                <div className="card-main">
                                    <div className="card-top">
                                        <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                        <span className="complaint-date">
                                            {new Date(complaint.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="card-title">{complaint.category}</h3>
                                    <p className="complaint-desc">{complaint.description}</p>

                                    <div className="card-meta">
                                        <span className="meta-item location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {complaint.location}
                                        </span>
                                        <span className="meta-item id">#{complaint.id}</span>
                                    </div>
                                </div>
                                <div className="card-action">
                                    <Link href={`/dashboard/complaint/${complaint.id}`} className="btn btn-outline btn-sm">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .dashboard-container { padding-top: 3rem; padding-bottom: 5rem; }
                
                .dashboard-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-end; 
                    margin-bottom: 3rem; 
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 1.5rem;
                }
                
                .subtitle { color: #64748b; font-size: 1.1rem; margin-top: 0.5rem; }
                .icon { margin-right: 0.5rem; font-size: 1.2rem; }

                .stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 1.5rem; 
                    margin-bottom: 3rem; 
                }
                
                .stat-card { text-align: center; padding: 2rem; border-top: 4px solid var(--primary); }
                .stat-card:nth-child(2) { border-color: var(--accent); }
                .stat-card:nth-child(3) { border-color: var(--success); }
                
                .stat-value { font-size: 3rem; font-weight: 800; margin-top: 0.5rem; line-height: 1; }
                .text-accent { color: var(--accent); }
                .text-success { color: var(--success); }

                .section-title { font-size: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .section-title::before { content: ''; display: block; width: 4px; height: 24px; background: var(--secondary); border-radius: 2px; }

                .complaint-list { display: grid; gap: 1.25rem; }
                
                .complaint-card { 
                    padding: 0; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid var(--border);
                    overflow: hidden;
                }
                .complaint-card:hover { transform: translateY(-3px) scale(1.01); box-shadow: var(--shadow-xl); border-color: var(--primary); }
                
                .card-content { display: flex; padding: 1.5rem; gap: 1.5rem; align-items: center; }
                .card-main { flex: 1; }
                
                .card-top { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
                .complaint-date { font-size: 0.875rem; color: #94a3b8; font-family: monospace; }
                
                .card-title { font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--foreground); }
                .complaint-desc { color: #64748b; margin-bottom: 1rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                
                .card-meta { display: flex; gap: 1.5rem; font-size: 0.875rem; color: #64748b; }
                .meta-item { display: flex; align-items: center; gap: 0.35rem; }
                .meta-item.id { font-family: monospace; background: rgba(0,0,0,0.05); padding: 0.1rem 0.4rem; border-radius: 4px; }

                .empty-state { text-align: center; padding: 5rem 2rem; display: flex; flex-direction: column; align-items: center; }
                .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }

                @media (max-width: 640px) {
                    .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .btn { width: 100%; }
                    .card-content { flex-direction: column; align-items: flex-start; }
                    .card-action { width: 100%; }
                    .card-action .btn { width: 100%; }
                }
            `}</style>
        </div>
    );
}
