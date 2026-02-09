'use client';
import { useParams } from 'next/navigation';
import { complaints } from '@/utils/mockData';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});



export default function ComplaintStatus() {
    const { id } = useParams();
    const complaint = complaints.find(c => c.id === id) || complaints[0];

    const getStatusStepStatus = (stepStage) => {
        const statusMap = { 'Submitted': 1, 'In Progress': 2, 'Resolved': 3 };
        const currentStage = statusMap[complaint.status] || 1;
        if (stepStage < currentStage) return 'completed';
        if (stepStage === currentStage) return 'active';
        return 'pending';
    };

    const steps = [
        { label: 'Unchecked', date: complaint.submittedAt, stage: 1 },
        { label: 'In Progress', date: 'Expected: 2 days after submission', stage: 2 },
        { label: 'Resolved', date: 'Expected: 5 days after submission', stage: 3 }
    ];

    return (
        <div className="status-container container">
            <Link href="/dashboard" className="back-link animate-fade-in">
                <span className="arrow">←</span> Back to Dashboard
            </Link>

            <header className="status-header animate-slide-in">
                <div className="header-content">
                    <span className="id-badge">#{id}</span>
                    <h1>{complaint.category} Issue</h1>
                </div>
                <div className={`status-pill ${complaint.status.toLowerCase().replace(' ', '')} animate-pulse-glow`}>
                    <span className="dot"></span>
                    {complaint.status}
                </div>
            </header>

            <div className="status-grid">
                <div className="details-col animate-slide-in delay-100">
                    <div className="details-card card">
                        <div className="card-header-small">
                            <h3>Issue Details</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Description</label>
                                <p>{complaint.description}</p>
                            </div>
                            <div className="info-item">
                                <label>Location</label>
                                <p className="location-text">📍 {complaint.location}</p>
                            </div>
                            <div className="info-item full">
                                <label>Visual Evidence</label>
                                <div className="map-container">
                                    <Map
                                        complaints={[complaint]}
                                        defaultCenter={[complaint.coordinates.lat, complaint.coordinates.lng]}
                                        defaultZoom={15}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="timeline-col animate-slide-in delay-200">
                    <div className="timeline-card card">
                        <h3>Track Status</h3>
                        <div className="timeline">
                            {steps.map((step, index) => {
                                const status = getStatusStepStatus(step.stage);
                                return (
                                    <div key={index} className={`timeline-item ${status}`}>
                                        <div className="timeline-marker">
                                            {status === 'completed' ? '✓' : ''}
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{step.label}</h4>
                                            <span className="timeline-date">{status === 'active' ? 'Current Stage' : new Date(step.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }).replace('Invalid Date', step.date)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .status-container { padding-top: 3rem; padding-bottom: 5rem; }
                
                .back-link { 
                    display: inline-flex; 
                    align-items: center; 
                    margin-bottom: 2rem; 
                    color: var(--primary); 
                    font-weight: 600; 
                    transition: transform 0.2s;
                }
                .back-link:hover { transform: translateX(-5px); }
                .arrow { margin-right: 0.5rem; font-size: 1.2rem; }

                .status-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 3rem; 
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--border);
                }
                
                .id-badge { 
                    display: inline-block; 
                    background: var(--input); 
                    padding: 0.25rem 0.75rem; 
                    border-radius: 6px; 
                    font-family: monospace; 
                    color: #64748b; 
                    margin-bottom: 0.5rem;
                    border: 1px solid var(--border);
                }
                
                .header-content h1 { font-size: 2.5rem; color: var(--foreground); }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .status-pill .dot {
                    width: 10px;
                    height: 10px;
                    background: currentColor;
                    border-radius: 50%;
                    margin-right: 0.75rem;
                }
                .status-pill.submitted { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .status-pill.inprogress { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; } /* Purple for progress */
                .status-pill.resolved { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                .status-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
                @media (max-width: 768px) { .status-grid { grid-template-columns: 1fr; } }

                .info-grid { display: grid; gap: 1.5rem; }
                .info-item label { display: block; font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
                .info-item p { font-size: 1.1rem; line-height: 1.6; color: var(--foreground); }
                .location-text { color: var(--primary); }

                .map-container {
                    height: 350px;
                    border-radius: var(--radius);
                    overflow: hidden;
                    border: 1px solid var(--border);
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
                }

                .timeline { position: relative; padding-left: 2rem; margin-top: 2rem; }
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 7px;
                    top: 10px;
                    bottom: 0;
                    width: 2px;
                    background: #e2e8f0;
                }
                
                .timeline-item { position: relative; padding-bottom: 3rem; }
                .timeline-item:last-child { padding-bottom: 0; }
                
                .timeline-marker {
                    position: absolute;
                    left: -2.05rem;
                    top: 0;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    border: 3px solid #cbd5e1;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .timeline-item.completed .timeline-marker { 
                    background: var(--success); 
                    border-color: var(--success); 
                    transform: scale(1.2);
                }
                
                .timeline-item.active .timeline-marker { 
                    background: var(--primary); 
                    border-color: var(--primary); 
                    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2); 
                    transform: scale(1.3);
                }
                
                .timeline-content h4 { font-size: 1.1rem; margin-bottom: 0.25rem; }
                .timeline-date { font-size: 0.9rem; color: #94a3b8; }
                
                .timeline-item.active h4 { color: var(--primary); }
                .timeline-item.completed h4 { color: var(--success); }
            `}</style>
        </div>
    );
}
