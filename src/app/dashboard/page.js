'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { complaints } from '@/utils/mockData';

export default function Dashboard() {
    const [userComplaints, setUserComplaints] = useState([]);

    useEffect(() => {
        // In a real app, fetch from API. Here, use mock.
        setUserComplaints(complaints);
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
                    <h1>My Complaints</h1>
                    <p>Track your submitted civic issues.</p>
                </div>
                <Link href="/dashboard/report" className="btn btn-primary">
                    + New Complaint
                </Link>
            </header>

            <div className="complaint-list animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {userComplaints.length === 0 ? (
                    <div className="empty-state">
                        <p>No complaints reported yet.</p>
                        <Link href="/dashboard/report" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                            Report Your First Issue
                        </Link>
                    </div>
                ) : (
                    userComplaints.map((complaint) => (
                        <div key={complaint.id} className="complaint-card card">
                            <div className="card-header">
                                <div>
                                    <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <span className="complaint-date">{new Date(complaint.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <Link href={`/dashboard/complaint/${complaint.id}`} className="view-details">
                                    View Status →
                                </Link>
                            </div>
                            <h3>{complaint.category}</h3>
                            <p className="complaint-desc">{complaint.description}</p>
                            <div className="complaint-footer">
                                <span className="location-tag">📍 {complaint.location}</span>
                                <span className="id-tag">#{complaint.id}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
        .dashboard-container { padding-top: 2rem; padding-bottom: 4rem; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .complaint-list { display: grid; gap: 1.5rem; }
        .complaint-card { transition: transform 0.2s; border-left: 4px solid transparent; }
        .complaint-card:hover { transform: translateY(-2px); border-left-color: var(--primary); }
        .card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center; }
        .complaint-date { font-size: 0.875rem; color: #94a3b8; margin-left: 0.75rem; }
        .complaint-desc { color: #475569; margin-bottom: 1rem; line-height: 1.6; }
        .complaint-footer { display: flex; justify-content: space-between; font-size: 0.875rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; }
        .view-details { color: var(--primary); font-weight: 600; font-size: 0.875rem; }
        
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 1rem; color: #64748b; }

        @media (max-width: 640px) {
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .btn { width: 100%; }
        }
      `}</style>
        </div>
    );
}
