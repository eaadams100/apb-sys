import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bulletin } from '../../types';

interface MapMarkerProps {
  bulletin: Bulletin;
  onBulletinClick: (bulletin: Bulletin) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ bulletin, onBulletinClick }) => {
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
    <Marker
      position={[bulletin.location.lat, bulletin.location.lng]}
      icon={createCustomIcon(bulletin.priority)}
      eventHandlers={{
        click: () => onBulletinClick(bulletin),
      }}
    >
      <Popup>
        <div style={{ minWidth: 200 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
            {bulletin.subject}
          </h3>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Type:</strong> {bulletin.type}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Priority:</strong> {bulletin.priority}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Status:</strong> {bulletin.status}
          </p>
          <button 
            onClick={() => onBulletinClick(bulletin)}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;