'use client';
import { useParams } from 'next/navigation';
import { complaints } from '@/utils/mockData';
import Link from 'next/link';

export default function ComplaintStatus() {
    const { id } = useParams();
    const complaint = complaints.find(c => c.id === id) || complaints[0]; // Fallback if not found

    const steps = [
        { label: 'Complaint Submitted', date: complaint.submittedAt, status: 'completed' },
        { label: 'Assigned to Dept', date: '2023-10-25T12:00:00Z', status: 'completed' },
        { label: 'Work In Progress', date: '2023-10-26T09:00:00Z', status: complaint.status === 'In Progress' ? 'active' : 'completed' },
        { label: 'Resolved', date: 'Expected: 2023-10-28', status: complaint.status === 'Resolved' ? 'completed' : 'pending' }
    ];

    return (
        <div className="status-container container animate-fade-in">
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>

            <div className="status-header">
                <h1>Complaint #{id}</h1>
                <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '')}`}>
                    {complaint.status}
                </span>
            </div>

            <div className="status-grid">
                <div className="details-card card">
                    <h3>Issue Details</h3>
                    <p><strong>Type:</strong> {complaint.category}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                    <p><strong>Location:</strong> {complaint.location}</p>
                    <div className="map-placeholder">
                        [Map Visualization of {complaint.coordinates.lat}, {complaint.coordinates.lng}]
                    </div>
                </div>

                <div className="timeline-card card">
                    <h3>Timeline</h3>
                    <div className="timeline">
                        {steps.map((step, index) => (
                            <div key={index} className={`timeline-item ${step.status}`}>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h4>{step.label}</h4>
                                    <span className="timeline-date">{new Date(step.date).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .back-link { display: block; margin-bottom: 1rem; color: var(--primary); font-weight: 500; }
        .status-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .status-grid { grid-template-columns: 1fr 1fr; } }
        
        .map-placeholder {
          height: 200px;
          background: #e2e8f0;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          margin-top: 1rem;
        }

        .timeline { position: relative; padding-left: 1rem; margin-top: 1.5rem; }
        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e2e8f0;
        }
        .timeline-item { position: relative; padding-bottom: 2rem; padding-left: 1.5rem; }
        .timeline-marker {
          position: absolute;
          left: -0.4rem;
          top: 0.25rem;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #cbd5e1;
          z-index: 10;
        }
        .timeline-item.completed .timeline-marker { background: var(--success); border-color: var(--success); }
        .timeline-item.active .timeline-marker { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); }
        .timeline-content h4 { font-size: 1rem; margin-bottom: 0.25rem; }
        .timeline-date { font-size: 0.875rem; color: #94a3b8; }
      `}</style>
        </div>
    );
}
