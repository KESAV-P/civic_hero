'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { complaints } from '@/utils/mockData';

// Dynamically import the Map component with no SSR to avoid window errors
const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Intelligence Map...</div>
});

export default function AdminDashboard() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    // AI State
    const [aiSummary, setAiSummary] = useState("Initializing AI Analysis...");
    const [isAiLoading, setIsAiLoading] = useState(true);

    const filteredComplaints = complaints.filter(c =>
        (filter === 'All' || c.status === filter) &&
        (c.description.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    );

    const stats = {
        new: complaints.filter(c => c.status === 'Submitted').length,
        working: complaints.filter(c => c.status === 'In Progress').length,
        unresolved: complaints.filter(c => c.status === 'Pending').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    // Avoid double-fetching in React Strict Mode
    const hasFetched = useRef(false);

    // Fetch real AI insights from Gemini API
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        async function fetchGeminiInsights() {
            setIsAiLoading(true);
            try {
                const res = await fetch('/api/ai-insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filter: 'All' }), // Analyze all data context
                });
                const data = await res.json();
                if (data.insight) {
                    setAiSummary(data.insight);
                } else {
                    setAiSummary("AI System available. Pending API connection.");
                }
            } catch (error) {
                console.error("Failed to fetch AI insights:", error);
                setAiSummary("Connection to AI Intelligence Layer interrupted.");
            } finally {
                setIsAiLoading(false);
            }
        }

        fetchGeminiInsights();
    }, []); // Run once on mount

    return (
        <div className="admin-container container animate-fade-in">
            <header className="header">
                <h1>Admin Command Center</h1>
                <div className="user-profile">
                    <span>Officer Sharma (Ward 12)</span>
                    <button className="btn btn-outline btn-sm">Logout</button>
                </div>
            </header>

            {/* New AI Analytics Section */}
            <div className="ai-insights-card card mb-4">
                <div className="ai-header">
                    <h3>🧠 Civic Intelligence Layer (Powered by Gemini 2.5 Flash)</h3>
                    <span className={`ai-badge ${isAiLoading ? 'animate-pulse' : ''}`}>
                        {isAiLoading ? 'Analyzing...' : 'Live Analysis'}
                    </span>
                </div>
                <div className="ai-content">
                    <p>{aiSummary}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <h3>New Complaints</h3>
                    <p className="stat-value text-primary">{stats.new}</p>
                </div>
                <div className="stat-card card">
                    <h3>Under Working</h3>
                    <p className="stat-value text-info">{stats.working}</p>
                </div>
                <div className="stat-card card">
                    <h3>Unresolved</h3>
                    <p className="stat-value text-warning">{stats.unresolved}</p>
                </div>
                <div className="stat-card card">
                    <h3>Resolved</h3>
                    <p className="stat-value text-success">{stats.resolved}</p>
                </div>
            </div>

            <div className="controls-section card">
                <div className="flex justify-between items-center mb-4">
                    <div className="view-toggles">
                        <button
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('list')}
                        >
                            📋 List View
                        </button>
                        <button
                            className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('map')}
                        >
                            🗺️ Map Visualization
                        </button>
                    </div>

                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search ID or Description..."
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-control"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Submitted">New Complaint</option>
                            <option value="In Progress">Under Working</option>
                            <option value="Pending">Unresolved (Pending)</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {viewMode === 'map' && (
                    <div className="map-controls">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={showHeatmap}
                                onChange={(e) => setShowHeatmap(e.target.checked)}
                            />
                            Show Heatmap Density Overlay (Red Zones)
                        </label>
                    </div>
                )}
            </div>

            {viewMode === 'list' ? (
                <div className="complaints-management card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Issue Type</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.userName || 'Anonymous'}</td>
                                    <td>{c.category}</td>
                                    <td>{c.location}</td>
                                    <td>
                                        <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '')}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline btn-sm">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="map-container card" style={{ height: '600px', overflow: 'hidden' }}>
                    {/* Render the Real Map Component Here */}
                    <Map complaints={filteredComplaints} showHeatmap={showHeatmap} />

                    <p className="map-caption">
                        {showHeatmap
                            ? "🔥 Heatmap Mode: Showing high-density clusters across India."
                            : "📍 Marker Mode: Real-time complaint locations via OpenStreetMap."}
                    </p>
                </div>
            )}

            <style jsx>{`
        .admin-container { padding-bottom: 4rem; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
        .user-profile { display: flex; align-items: center; gap: 1rem; }
        .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.875rem; }
        
        .ai-insights-card { 
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
            border: 1px solid #bae6fd;
            border-left: 4px solid #0ea5e9;
        }
        .ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .ai-header h3 { color: #0369a1; font-size: 1.1rem; margin: 0; }
        .ai-badge { background: #0ea5e9; color: white; padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .ai-badge.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .ai-content { font-size: 0.95rem; color: #334155; line-height: 1.6; white-space: pre-wrap; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        .filters { display: flex; gap: 0.5rem; }
        .view-toggles { display: flex; gap: 0.5rem; }
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; cursor: pointer; margin-top: 1rem; }
        
        .map-container { position: relative; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .map-caption { position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.9); padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1000; }
        
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { text-align: left; padding: 1rem; border-bottom: 1px solid #e2e8f0; }
        .table th { font-weight: 600; color: #64748b; background: #f8fafc; }
        .table tr:hover { background: #f8fafc; }
        
        /* Flex Utils */
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .mb-4 { margin-bottom: 1rem; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
      `}</style>
        </div>
    );
}
