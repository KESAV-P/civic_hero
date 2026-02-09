'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { complaints } from '@/utils/mockData';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export default function AdminComplaintManage() {
    const { id } = useParams();
    // In a real app, this would be a fetch call
    const complaint = complaints.find(c => c.id === id) || complaints[0];
    const [status, setStatus] = useState(complaint.status);
    const [department, setDepartment] = useState(complaint.department || 'Unassigned');
    const [notes, setNotes] = useState('');

    const handleUpdate = () => {
        alert(`Complaint ${id} updated!\nStatus: ${status}\nDepartment: ${department}\nNotes: ${notes}`);
        // In a real app, you would PATCH this to your API
    };

    return (
        <div className="manage-container container animate-fade-in">
            <Link href="/admin/dashboard" className="back-link">
                ← Back to Command Center
            </Link>

            <header className="manage-header">
                <div>
                    <span className="id-badge">#{id}</span>
                    <h1>Manage Issue</h1>
                </div>
                <div className={`status-pill ${status.toLowerCase().replace(' ', '')}`}>
                    <span className="dot"></span>
                    {status}
                </div>
            </header>

            <div className="manage-grid">
                {/* Left Column: Complaint Details */}
                <div className="details-card card animate-slide-in delay-100">
                    <h2>Issue Information</h2>

                    <div className="info-group">
                        <label>Description</label>
                        <p className="description-text">{complaint.description}</p>
                    </div>

                    <div className="grid-2">
                        <div className="info-group">
                            <label>Category</label>
                            <p>{complaint.category}</p>
                        </div>
                        <div className="info-group">
                            <label>Submitted By</label>
                            <p>{complaint.userName || 'Anonymous'}</p>
                        </div>
                        <div className="info-group">
                            <label>Date & Time</label>
                            <p>{new Date(complaint.submittedAt).toLocaleString()}</p>
                        </div>
                        <div className="info-group">
                            <label>Ward / Zone</label>
                            <p>{complaint.ward || 'Zone 1'}</p>
                        </div>
                    </div>

                    <div className="info-group">
                        <label>Location Details</label>
                        <p className="location-text">📍 {complaint.location}</p>
                        <div className="map-container">
                            <Map
                                complaints={[complaint]}
                                defaultCenter={[complaint.coordinates.lat, complaint.coordinates.lng]}
                                defaultZoom={16}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Admin Actions */}
                <div className="actions-card card animate-slide-in delay-200">
                    <h2>Admin Actions</h2>

                    <div className="form-group">
                        <label>Update Status</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Submitted">Submitted (New)</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Pending">Pending Review</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Assign Department</label>
                        <select
                            className="form-control"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="Unassigned">Select Department</option>
                            <option value="Water Dept">Water Supply</option>
                            <option value="Electrical Dept">Electrical Board</option>
                            <option value="Roads & Transport">Roads & Transport</option>
                            <option value="Sanitation">Sanitation & Waste</option>
                            <option value="Parks">Parks & Horticulture</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Internal Notes / Resolution Remarks</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Add notes for the team or resolution details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>

                    <button className="btn btn-primary w-full" onClick={handleUpdate}>
                        Update Complaint
                    </button>
                </div>
            </div>

            <style jsx>{`
                .manage-container { padding-top: 2rem; padding-bottom: 5rem; }
                
                .back-link { 
                    display: inline-flex; margin-bottom: 2rem; color: var(--primary); 
                    font-weight: 600; text-decoration: none; align-items: center;
                }
                .back-link:hover { text-decoration: underline; }

                .manage-header { 
                    display: flex; justify-content: space-between; align-items: center; 
                    margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);
                }
                .id-badge { 
                    font-family: monospace; background: var(--input); padding: 0.2rem 0.6rem; 
                    border-radius: 6px; color: #64748b; font-size: 0.9rem;
                }
                h1 { margin: 0.5rem 0 0 0; font-size: 2rem; }
                h2 { font-size: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }

                .manage-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
                @media (max-width: 900px) { .manage-grid { grid-template-columns: 1fr; } }

                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }

                .info-group { margin-bottom: 1.5rem; }
                .info-group label { 
                    display: block; font-size: 0.75rem; text-transform: uppercase; 
                    letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 0.5rem;
                }
                .info-group p { font-size: 1rem; color: var(--foreground); font-weight: 500; }
                .description-text { line-height: 1.6; font-size: 1.1rem; }
                .location-text { color: var(--primary); font-weight: 600; }

                .map-container { 
                    height: 300px; width: 100%; border-radius: 0.5rem; overflow: hidden; 
                    margin-top: 1rem; border: 1px solid var(--border); 
                }

                .status-pill { 
                    display: inline-flex; align-items: center; padding: 0.5rem 1rem; 
                    border-radius: 9999px; font-weight: 700; text-transform: uppercase; font-size: 0.875rem;
                }
                .status-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; margin-right: 0.5rem; }
                .status-pill.submitted { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .status-pill.inprogress { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .status-pill.resolved { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                .form-control { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--input); color: var(--foreground); }
                .w-full { width: 100%; margin-top: 1rem; }
            `}</style>
        </div>
    );
}
