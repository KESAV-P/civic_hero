'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Next.js/Webpack if needed, though we are using custom icons mainly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom colored icons for status
const getStatusIcon = (status) => {
    let color = '#3b82f6'; // Default Blue (Submitted)
    if (status === 'Resolved') color = '#10b981'; // Green
    if (status === 'In Progress') color = '#f59e0b'; // Amber/Orange
    if (status === 'Pending') color = '#ef4444'; // Red

    // SVG Marker Pin
    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.3))">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`;

    return L.divIcon({
        className: 'custom-map-marker',
        html: svgIcon,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

export default function Map({ complaints, showHeatmap, defaultCenter = [20.5937, 78.9629], defaultZoom = 5 }) {

    function MapController({ center, zoom }) {
        const map = useMap();
        useEffect(() => {
            map.flyTo(center, zoom);
        }, [center, zoom, map]);
        return null;
    }

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 1 }}
            scrollWheelZoom={true}
        >
            <MapController center={defaultCenter} zoom={defaultZoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Markers */}
            {complaints.map((c) => (
                <Marker
                    key={c.id}
                    position={[c.coordinates.lat, c.coordinates.lng]}
                    icon={getStatusIcon(c.status)}
                >
                    <Popup className="custom-popup-container">
                        <div className="p-2 min-w-[200px]">
                            <h3 className="text-lg font-bold mb-1 border-b pb-1">{c.category}</h3>
                            <div className="text-sm space-y-1">
                                <p><strong>Status:</strong> <span style={{
                                    fontWeight: 'bold',
                                    color: c.status === 'Resolved' ? '#10b981' : c.status === 'Pending' ? '#ef4444' : c.status === 'In Progress' ? '#f59e0b' : '#3b82f6'
                                }}>{c.status}</span></p>
                                <p><strong>Problem:</strong> {c.description}</p>
                                <p><strong>Reported By:</strong> {c.userName || 'Anonymous'}</p>
                                <p><strong>Location:</strong> {c.location}</p>
                                <p><strong>Ward:</strong> {c.ward}</p>
                                <p className="text-xs text-gray-500 mt-2">ID: {c.id}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Heatmap Overlay (Visualized as Circles) */}
            {showHeatmap && complaints.map((c, i) => (
                <Circle
                    key={`heat-${i}`}
                    center={[c.coordinates.lat, c.coordinates.lng]}
                    pathOptions={{
                        fillColor: '#ef4444',
                        color: 'transparent',
                        fillOpacity: 0.3
                    }}
                    radius={30000} // Radius in meters
                />
            ))}
        </MapContainer>
    );
}
