'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addComplaint } from '@/utils/mockData';

export default function ReportIssue() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        issueType: '',
        description: '',
        location: null,
        photo: null
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const issueTypes = [
        { value: 'pothole', label: '🕳️ Pothole' },
        { value: 'garbage', label: '🗑️ Garbage Overflow' },
        { value: 'light', label: '💡 Streetlight Not Working' },
        { value: 'water', label: '💧 Water Leakage' },
        { value: 'sewage', label: '🤢 Sewage Blockage' },
        { value: 'footpath', label: '🚶 Damaged Footpath' },
        { value: 'manhole', label: '🕳️ Open Manhole' }, // Distinct emoji if possible, or same
        { value: 'traffic', label: '🚦 Traffic Signal Malfunction' },
        { value: 'dumping', label: '🚯 Illegal Dumping' },
        { value: 'flood', label: '🌊 Road Flooding' },
        { value: 'tree', label: '🌳 Fallen Tree' }
    ];

    const handleLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Fetch address from Nominatim (OpenStreetMap)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    location: {
                        lat: latitude,
                        lng: longitude,
                        address: data.display_name || `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
                    }
                }));
            } catch (error) {
                console.error("Geocoding failed", error);
                setFormData(prev => ({
                    ...prev,
                    location: {
                        lat: latitude,
                        lng: longitude,
                        address: `Detected Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
                    }
                }));
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error('Error fetching location:', error);
            alert('Unable to retrieve your location. Please check your browser permissions.');
            setLoading(false);
        }, { enableHighAccuracy: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.issueType || !formData.location) {
            alert('Please select an issue type and capture your location.');
            return;
        }

        setLoading(true);
        // Simulate submission to backend
        setTimeout(() => {
            const newId = `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
            const getCategoryLabel = (type) => {
                const found = issueTypes.find(t => t.value === type);
                return found ? found.label.split(' ').slice(1).join(' ') : type;
            };

            // Enhanced Auto-Routing Logic
            let dept = 'General Admin';
            const type = formData.issueType;
            if (['pothole', 'footpath', 'manhole', 'dumping'].includes(type)) dept = 'Roads & Transport';
            if (['light', 'traffic'].includes(type)) dept = 'Electrical Dept';
            if (['garbage', 'sewage'].includes(type)) dept = 'Sanitation Dept';
            if (['water', 'flood'].includes(type)) dept = 'Water Supply Dept';
            if (['tree'].includes(type)) dept = 'Horticulture Dept';

            const newComplaint = {
                id: newId,
                description: formData.description || 'No description provided',
                category: getCategoryLabel(formData.issueType),
                location: formData.location.address,
                coordinates: { lat: formData.location.lat, lng: formData.location.lng },
                status: 'Submitted',
                submittedAt: new Date().toISOString(),
                imageUrl: 'https://via.placeholder.com/150',
                department: dept,
                ward: 'Ward 1'
            };

            addComplaint(newComplaint);

            setLoading(false);
            setSuccess(true);
            alert(`Complaint Submitted Successfully!\n\nSystem Auto-Assigned to: ${dept}\nNotification sent.`);
            router.push('/dashboard');
        }, 1500);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
        }
    };

    return (
        <div className="report-container container animate-fade-in">
            <div className="report-card card">
                <h1 className="report-title">Report New Issue</h1>
                <p className="report-subtitle">
                    Select the type of issue, capture location, and submit. Our system will route it automatically.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Issue Type</label>
                        <div className="grid-options">
                            {issueTypes.map((type) => (
                                <div
                                    key={type.value}
                                    className={`option-card ${formData.issueType === type.value ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, issueType: type.value })}
                                >
                                    <span className="emoji">{type.label.split(' ')[0]}</span>
                                    <span className="label">{type.label.split(' ').slice(1).join(' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <button
                            type="button"
                            className={`btn ${formData.location ? 'btn-success' : 'btn-outline'} w-full`}
                            onClick={handleLocation}
                            disabled={loading}
                        >
                            {loading ? 'Fetching GPS...' : formData.location ? `📍 ${formData.location.address}` : '📍 Capture current Location'}
                        </button>
                        {formData.location && <p className="location-hint">Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Photo (Optional)</label>
                        <div className="file-upload">
                            <input type="file" accept="image/*" onChange={handleFileChange} id="file-upload" className="hidden-input" />
                            <label htmlFor="file-upload" className="upload-label">
                                {formData.photo ? `📷 ${formData.photo.name}` : '📷 Upload Photo'}
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Provide more details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary w-full" disabled={loading || !formData.issueType || !formData.location}>
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                        <button type="button" className="btn btn-link" onClick={() => router.back()}>Cancel</button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .report-container { max-width: 600px; padding: 2rem 1rem; margin: 0 auto; }
        .report-title { margin-bottom: 0.5rem; text-align: center; }
        .report-subtitle { text-align: center; color: #64748b; margin-bottom: 2rem; }
        
        .grid-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .option-card {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s;
        }
        .option-card:hover { border-color: var(--primary); background: #eff6ff; }
        .option-card.selected { border-color: var(--primary); background: #dbeafe; color: var(--primary); font-weight: 600; box-shadow: 0 0 0 2px var(--primary); }
        .emoji { font-size: 2rem; margin-bottom: 0.5rem; }
        
        .btn-success { background: #d1fae5; color: #065f46; border: 1px solid #10b981; }
        .location-hint { font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem; text-align: center; }
        
        .file-upload { text-align: center; }
        .hidden-input { display: none; }
        .upload-label {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border: 1px dashed #cbd5e1;
          border-radius: 0.5rem;
          cursor: pointer;
          width: 100%;
          color: #64748b;
          transition: all 0.2s;
        }
        .upload-label:hover { border-color: var(--primary); color: var(--primary); background: #f8fafc; }
        
        .btn { width: 100%; }
        .form-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .btn-link { background: none; border: none; color: #64748b; cursor: pointer; text-decoration: underline; }
      `}</style>
        </div>
    );
}
