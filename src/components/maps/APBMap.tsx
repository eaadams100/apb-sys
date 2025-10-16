import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Bulletin } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface APBMapProps {
  bulletins: Bulletin[];
  onBulletinClick: (bulletin: Bulletin) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  isSelectingLocation?: boolean;
}

const LocationMarker: React.FC<{
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const APBMap: React.FC<APBMapProps> = ({
  bulletins,
  onBulletinClick,
  onLocationSelect,
  isSelectingLocation = false,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#ff4444';
      case 'HIGH': return '#ff8800';
      case 'MEDIUM': return '#ffbb33';
      case 'LOW': return '#33b5e5';
      default: return '#2BBBAD';
    }
  };

  const createCustomIcon = (priority: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${getPriorityColor(priority)};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  };

  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Center of US
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      ref={setMap} // FIXED: Changed whenCreated to ref
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {bulletins.map((bulletin) => (
        <Marker
          key={bulletin.id}
          position={[bulletin.location.lat, bulletin.location.lng]}
          icon={createCustomIcon(bulletin.priority)}
          eventHandlers={{
            click: () => onBulletinClick(bulletin),
          }}
        >
          <Popup>
            <div>
              <h3>{bulletin.subject}</h3>
              <p><strong>Type:</strong> {bulletin.type}</p>
              <p><strong>Priority:</strong> {bulletin.priority}</p>
              <p><strong>Status:</strong> {bulletin.status}</p>
              <button 
                onClick={() => onBulletinClick(bulletin)}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {isSelectingLocation && onLocationSelect && (
        <LocationMarker onLocationSelect={onLocationSelect} />
      )}
    </MapContainer>
  );
};

export default APBMap;